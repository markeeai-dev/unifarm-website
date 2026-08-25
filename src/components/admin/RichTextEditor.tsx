/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Node, mergeAttributes, CommandProps } from "@tiptap/core";
import { useEditor, EditorContent, Editor, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import CharacterCount from "@tiptap/extension-character-count";
import FontFamily from "@tiptap/extension-font-family";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { useEffect, useCallback, useState, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { TextStyle } from "@tiptap/extension-text-style";
import { Table } from "@tiptap/extension-table";
import Youtube from "@tiptap/extension-youtube";

// Giới hạn dung lượng video, khớp với giới hạn ở /api/admin/upload
const MAX_VIDEO_SIZE_MB = 20;

// ── FontSize Extension ─────────────────────────────────────────
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run();
        },
    };
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
      toggleFirstLineIndent: () => ReturnType;
    };
  }
}

interface IndentOptions {
  types: string[];
  minIndent: number;
  maxIndent: number;
  indentSize: number;
}

const Indent = Extension.create<IndentOptions>({
  name: "indent",
  addOptions() {
    return { types: ["paragraph", "heading"], minIndent: 0, maxIndent: 8, indentSize: 24 };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => {
              const margin = element.style.marginLeft;
              if (!margin) return 0;
              const level = Math.round(parseInt(margin, 10) / this.options.indentSize);
              return level > 0 ? level : 0;
            },
            renderHTML: (attributes) => {
              if (!attributes.indent) return {};
              return { style: `margin-left: ${attributes.indent * this.options.indentSize}px` };
            },
          },
          firstLineIndent: {
            default: false,
            parseHTML: (element) =>
              !!element.style.textIndent && parseInt(element.style.textIndent, 10) > 0,
            renderHTML: (attributes) => {
              if (!attributes.firstLineIndent) return {};
              return { style: `text-indent: 32px` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch }: CommandProps) => {
          const { from, to } = state.selection;
          let applied = false;
          state.doc.nodesBetween(from, to, (node: any, pos: number) => {
            if (this.options.types.includes(node.type.name)) {
              const current = node.attrs.indent || 0;
              if (current < this.options.maxIndent) {
                tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: current + 1 });
                applied = true;
              }
            }
          });
          if (applied && dispatch) dispatch(tr);
          return applied;
        },
      outdent:
        () =>
        ({ tr, state, dispatch }: CommandProps) => {
          const { from, to } = state.selection;
          let applied = false;
          state.doc.nodesBetween(from, to, (node: any, pos: number) => {
            if (this.options.types.includes(node.type.name)) {
              const current = node.attrs.indent || 0;
              if (current > this.options.minIndent) {
                tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: current - 1 });
                applied = true;
              }
            }
          });
          if (applied && dispatch) dispatch(tr);
          return applied;
        },
      toggleFirstLineIndent:
        () =>
        ({ tr, state, dispatch }: CommandProps) => {
          const { from, to } = state.selection;
          let applied = false;
          state.doc.nodesBetween(from, to, (node: any, pos: number) => {
            if (this.options.types.includes(node.type.name)) {
              const current = !!node.attrs.firstLineIndent;
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, firstLineIndent: !current });
              applied = true;
            }
          });
          if (applied && dispatch) dispatch(tr);
          return applied;
        },
    } as any;
  },
});

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 500,
        parseHTML: (element) => Number(element.getAttribute("width") || 500),
        renderHTML: (attributes) => ({ width: attributes.width }),
      },
      height: {
        default: 300,
        parseHTML: (element) => Number(element.getAttribute("height") || 300),
        renderHTML: (attributes) => ({ height: attributes.height }),
      },
      style: {
        default: "",
        parseHTML: (element) => element.getAttribute("style") || "",
        renderHTML: (attributes) => ({
          style: `width:${attributes.width}px;height:auto;${attributes.style || ""}`,
        }),
      },
    };
  },
  addCommands() {
    return {
      ...this.parent?.(),
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: options });
        },
    };
  },
});

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  label?: string;
  hint?: string;
  required?: boolean;
}

const COLORS = ["#0f172a", "#006400", "#2563eb", "#16a34a", "#d97706", "#7c3aed", "#db2777", "#0891b2", "#ea580c", "#65a30d", "#6b7280", "#ffffff"];
const HIGHLIGHT_COLORS = ["#fef08a", "#bbf7d0", "#bfdbfe", "#fecaca", "#e9d5ff", "#fed7aa", "#99f6e4"];
const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48];
const FONTS = [
  { name: "Mặc định", value: "" },
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Times New Roman", value: "'Times New Roman', serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Courier New", value: "'Courier New', monospace" },
  { name: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Tahoma", value: "Tahoma, sans-serif" },
  { name: "Comic Sans MS", value: "'Comic Sans MS', cursive" },
  { name: "Palatino", value: "'Palatino Linotype', serif" },
  { name: "Garamond", value: "Garamond, serif" },
];

// ── Special Characters ────────────────────────────────────────
const SPECIAL_CHAR_GROUPS = [
  { label: "Mũi tên", chars: ["→","←","↑","↓","↔","↕","⇒","⇐","⇑","⇓","⇔","⟹","⟺","↗","↘","↙","↖","↩","↪","↻","↺","⇄","⇅","➜","➡","⬅","⬆","⬇","➤","▶","◀","▲","▼","⤴","⤵"] },
  { label: "Toán học", chars: ["±","×","÷","≠","≤","≥","≈","≡","∞","√","∑","∏","∫","∂","∆","∇","∈","∉","⊂","⊃","∪","∩","∧","∨","¬","∀","∃","⊕","⊗","°","‰","¼","½","¾","⅓","⅔"] },
  { label: "Bullet / Dấu chấm", chars: ["•","·","‣","⁃","◦","▪","▫","■","□","▸","▹","◆","◇","●","○","◉","✓","✔","✗","✘","✦","✧","★","☆","✩","❖"] },
  { label: "Tiền tệ", chars: ["$","€","£","¥","₫","₩","₹","₽","₺","¢"] },
  { label: "Pháp lý / TM", chars: ["©","®","™","§","¶","†","‡","※","℃","℉","№","°","µ","Ω"] },
  { label: "Dấu câu / Ngoặc", chars: ["…","—","–","‐","‑","·","′","″","‹","›","«","»","„","‟","❝","❞","'","'",'"','"',"⌈","⌉","⌊","⌋","〈","〉","《","》","【","】"] },
  { label: "Chữ đặc biệt", chars: ["À","Á","Â","Ã","Ä","Å","Æ","Ç","È","É","Ê","Ë","Ì","Í","Î","Ï","Ð","Ñ","Ò","Ó","Ô","Õ","Ö","Ø","Ù","Ú","Û","Ü","Ý","ß","à","á","â","ã","ä","å","æ","ç","è","é","ê","ë","ì","í","î","ï","ñ","ò","ó","ô","õ","ö","ø","ù"] },
  { label: "Emoji cơ bản", chars: ["😀","😊","😂","🥰","😎","🤔","😢","👍","👎","👏","🙏","👋","✌️","💪","🎉","🔥","💡","⭐","❤️","💯","✅","❌","⚠️","📌","📎","🔗","📧","📞","💬","🔍","📝","📊","📈","🏆","🎯","🚀","🌟","🎁"] },
];

// ── Portal wrapper — thoát khỏi mọi stacking context ─────────
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function Portal({ children }: { children: React.ReactNode }) {
  const mounted = useIsMounted();
  if (!mounted) return null;
  return createPortal(children, document.body);
}

// ── Tooltip ───────────────────────────────────────────────────
function Tooltip({ children, tip }: { children: React.ReactNode; tip: string }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const hide = () => setShow(false);
    document.addEventListener("mousedown", hide);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      document.removeEventListener("mousedown", hide);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, []);
  return (
    <div
      ref={ref}
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => {
        if (ref.current) {
          const r = ref.current.getBoundingClientRect();
          setPos({ top: r.top - 34, left: r.left + r.width / 2 });
        }
        setShow(true);
      }}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <Portal>
          <div
            onMouseEnter={() => setShow(false)}
            style={{ position: "fixed", top: pos.top, left: pos.left, transform: "translateX(-50%)", background: "#0f172a", color: "#fff", fontSize: 11, fontWeight: 600, padding: "4px 8px", borderRadius: 6, whiteSpace: "nowrap", pointerEvents: "none", zIndex: 2147483647, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
          >
            {tip}
          </div>
        </Portal>
      )}
    </div>
  );
}

function TB({ onClick, active, disabled, children, tip }: { onClick: () => void; active?: boolean; disabled?: boolean; children: React.ReactNode; tip: string }) {
  return (
    <Tooltip tip={tip}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 7, border: "none", background: active ? "#006400" : "transparent", color: active ? "#fff" : disabled ? "#cbd5e1" : "#334155", cursor: disabled ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 700, transition: "background .15s, color .15s", flexShrink: 0 }}
        onMouseEnter={(e) => { if (!active && !disabled) (e.currentTarget as HTMLElement).style.background = "#f1f5f9"; }}
        onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        {children}
      </button>
    </Tooltip>
  );
}

const Div = () => <div style={{ width: 1, height: 22, background: "#e2e8f0", margin: "0 4px", flexShrink: 0 }} />;

function DropBtn({ label, tip, children, width = 140 }: { label: React.ReactNode; tip: string; children: React.ReactNode; width?: number }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const calcPos = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left });
    }
  };

  useEffect(() => {
    if (!open) return;
    const update = () => calcPos();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    const close = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as globalThis.Node) && btnRef.current && !btnRef.current.contains(e.target as globalThis.Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      document.removeEventListener("mousedown", close);
    };
  }, [open]);

  return (
    <Tooltip tip={tip}>
      <div style={{ position: "relative", display: "inline-flex" }}>
        <button
          ref={btnRef}
          type="button"
          onMouseDown={() => setOpen(false)}
          onClick={() => { calcPos(); setOpen((o) => !o); }}
          style={{ display: "flex", alignItems: "center", gap: 4, height: 30, padding: "0 8px", borderRadius: 7, border: "none", background: open ? "#f1f5f9" : "transparent", color: "#334155", fontSize: 12.5, fontWeight: 700, cursor: "pointer", transition: "background .15s", flexShrink: 0, maxWidth: 140 }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}><polyline points="6 9 12 15 18 9" /></svg>
        </button>
        {open && (
          <Portal>
            <div ref={panelRef} style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 2147483646, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", padding: 6, minWidth: width, maxHeight: 320, overflowY: "auto" }} onClick={() => setOpen(false)}>
              {children}
            </div>
          </Portal>
        )}
      </div>
    </Tooltip>
  );
}

function DropItem({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 10px", borderRadius: 7, border: "none", background: active ? "#f2f9ee" : "transparent", color: active ? "#006400" : "#334155", fontSize: 13, fontWeight: active ? 700 : 500, cursor: "pointer", textAlign: "left", transition: "background .15s" }}
      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "#f8fafc"; }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      {children}
    </button>
  );
}

function ColorPicker({ editor, type }: { editor: Editor; type: "color" | "highlight" }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const colors = type === "color" ? COLORS : HIGHLIGHT_COLORS;

  const calcPos = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left });
    }
  };

  useEffect(() => {
    if (!open) return;
    const update = () => calcPos();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    const close = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as globalThis.Node) && btnRef.current && !btnRef.current.contains(e.target as globalThis.Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      document.removeEventListener("mousedown", close);
    };
  }, [open]);

  return (
    <Tooltip tip={type === "color" ? "Màu chữ" : "Highlight"}>
      <div style={{ position: "relative", display: "inline-flex" }}>
        <button
          ref={btnRef}
          type="button"
          onClick={() => { calcPos(); setOpen((o) => !o); }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 7, border: "none", background: "transparent", color: "#334155", cursor: "pointer", transition: "background .15s", flexShrink: 0 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f1f5f9"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          {type === "color" ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><text x="2" y="18" fontSize="18" fontWeight="900" fontFamily="serif">A</text></svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
          )}
        </button>
        {open && (
          <Portal>
            <div ref={panelRef} style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 2147483646, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", padding: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 24px)", gap: 5 }}>
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      if (type === "color") editor.chain().focus().setColor(c).run();
                      else editor.chain().focus().toggleHighlight({ color: c }).run();
                      setOpen(false);
                    }}
                    style={{ width: 24, height: 24, borderRadius: 6, border: "2px solid #e2e8f0", background: c, cursor: "pointer", padding: 0, boxShadow: c === "#ffffff" ? "inset 0 0 0 1px #e2e8f0" : "none", transition: "transform .15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.2)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                  />
                ))}
              </div>
              {type === "color" && (
                <button
                  type="button"
                  onClick={() => { editor.chain().focus().unsetColor().run(); setOpen(false); }}
                  style={{ marginTop: 8, width: "100%", padding: "5px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}
                >
                  Xóa màu
                </button>
              )}
            </div>
          </Portal>
        )}
      </div>
    </Tooltip>
  );
}

// ── LinkModal ─────────────────────────────────────────────────
function LinkModal({ editor, onClose, accentColor = "#006400" }: { editor: Editor; onClose: () => void; accentColor?: string }) {
  const [url, setUrl] = useState(editor.getAttributes("link").href || "");
  const [newTab, setNewTab] = useState(true);
  const apply = () => {
    if (!url.trim()) editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: newTab ? "_blank" : "_self" }).run();
    onClose();
  };
  return (
    <Portal>
      <div style={{ position: "fixed", inset: 0, zIndex: 2147483647, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }} onClick={onClose}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px 28px", minWidth: 380, boxShadow: "0 32px 80px rgba(0,0,0,0.25)", border: "1px solid #f1f5f9" }} onClick={(e) => e.stopPropagation()}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>Chèn đường dẫn</div>
          <input
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") apply(); if (e.key === "Escape") onClose(); }}
            placeholder="https://..."
            style={{ width: "100%", padding: "10px 13px", borderRadius: 9, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }}
            onFocus={(e) => { e.target.style.borderColor = accentColor; e.target.style.boxShadow = `0 0 0 3px ${accentColor}22`; }}
            onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#64748b", cursor: "pointer", marginBottom: 20 }}>
            <input type="checkbox" checked={newTab} onChange={(e) => setNewTab(e.target.checked)} style={{ width: 15, height: 15, accentColor }} />
            Mở trong tab mới
          </label>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            {editor.getAttributes("link").href && (
              <button type="button" onClick={() => { editor.chain().focus().unsetLink().run(); onClose(); }} style={{ padding: "9px 16px", borderRadius: 9, border: "1.5px solid #fecaca", background: "#fff0f0", color: accentColor, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>Xóa link</button>
            )}
            <button type="button" onClick={onClose} style={{ padding: "9px 16px", borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>Hủy</button>
            <button type="button" onClick={apply} style={{ padding: "9px 20px", borderRadius: 9, border: "none", background: accentColor, color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>Áp dụng</button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ── ImageModal ────────────────────────────────────────────────
function ImageModal({ editor, onClose, uploadUrl = "/api/admin/upload", accentColor = "#006400" }: { editor: Editor; onClose: () => void; uploadUrl?: string; accentColor?: string }) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [width, setWidth] = useState(500);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const height = natural ? Math.round((width * natural.h) / natural.w) : 300;
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(uploadUrl, { method: "POST", body: fd });
      const data = await res.json();
      if (data.ok) {
        setNatural(null);
        setUrl(data.url || data.filename);
      } else alert("Upload thất bại: " + (data.message || ""));
    } catch {
      alert("Lỗi upload");
    } finally {
      setUploading(false);
    }
  };
  const apply = () => {
    if (url.trim()) {
      editor.chain().focus().setImage({ src: url, alt, width, height }).run();
    }
    onClose();
  };
  return (
    <Portal>
      <div style={{ position: "fixed", inset: 0, zIndex: 2147483647, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }} onClick={onClose}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px 28px", minWidth: 400, boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }} onClick={(e) => e.stopPropagation()}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>Chèn hình ảnh</div>
          <div
            onClick={() => fileRef.current?.click()}
            style={{ border: "2px dashed #e2e8f0", borderRadius: 10, padding: "20px", textAlign: "center", cursor: "pointer", marginBottom: 12, background: "#fafbff", transition: "all .2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = accentColor; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0"; }}
          >
            {uploading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#94a3b8", fontSize: 13.5 }}>
                <div style={{ width: 18, height: 18, border: "2.5px solid #f1f5f9", borderTopColor: accentColor, borderRadius: "50%", animation: "rte-spin .8s linear infinite" }} />
                Đang upload...
              </div>
            ) : (
              <div style={{ fontSize: 13.5, color: "#64748b", fontWeight: 600 }}>📁 Click để chọn file ảnh từ máy tính</div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
          <div style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", margin: "8px 0" }}>— hoặc nhập URL —</div>
          <input
            value={url}
            onChange={(e) => { setNatural(null); setUrl(e.target.value); }}
            placeholder="https://example.com/image.jpg"
            style={{ width: "100%", padding: "10px 13px", borderRadius: 9, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }}
            onFocus={(e) => { e.target.style.borderColor = accentColor; }}
            onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; }}
          />
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Alt text (mô tả ảnh)..."
            style={{ width: "100%", padding: "10px 13px", borderRadius: 9, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 14 }}
            onFocus={(e) => { e.target.style.borderColor = accentColor; }}
            onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; }}
          />
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} placeholder="Chiều rộng (px)" style={{ flex: 1, padding: "10px 13px", borderRadius: 9, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            <div style={{ flex: 1, padding: "10px 13px", borderRadius: 9, border: "1.5px solid #e2e8f0", fontSize: 14, boxSizing: "border-box", color: "#94a3b8", background: "#f8fafc" }} title="Chiều cao tự tính theo đúng tỉ lệ ảnh gốc, tránh bị méo ảnh">
              Cao: {height}px (tự động)
            </div>
          </div>
          {url && !uploading && (
            <div style={{ marginBottom: 14, borderRadius: 9, overflow: "hidden", border: "1px solid #f1f5f9", maxHeight: 180, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={alt}
                style={{ maxWidth: "100%", maxHeight: 180, objectFit: "contain" }}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (img.naturalWidth && img.naturalHeight) {
                    setNatural({ w: img.naturalWidth, h: img.naturalHeight });
                    setWidth(Math.min(img.naturalWidth, 700));
                  }
                }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={{ padding: "9px 16px", borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>Hủy</button>
            <button
              type="button"
              onClick={apply}
              disabled={!url.trim() || uploading}
              style={{ padding: "9px 20px", borderRadius: 9, border: "none", background: url.trim() && !uploading ? accentColor : "#f1f5f9", color: url.trim() && !uploading ? "#fff" : "#94a3b8", fontSize: 13.5, fontWeight: 700, cursor: url.trim() && !uploading ? "pointer" : "not-allowed" }}
            >
              Chèn ảnh
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ── SpecialCharsModal ─────────────────────────────────────────
function SpecialCharsModal({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = search.trim()
    ? SPECIAL_CHAR_GROUPS.map((g) => ({ ...g, chars: g.chars.filter((c) => c.includes(search)) })).filter((g) => g.chars.length > 0)
    : SPECIAL_CHAR_GROUPS;

  const insert = (char: string) => {
    editor.chain().focus().insertContent(char).run();
  };

  return (
    <Portal>
      <div style={{ position: "fixed", inset: 0, zIndex: 2147483647, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }} onClick={onClose}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", width: 560, maxWidth: "95vw", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 32px 80px rgba(0,0,0,0.28)", border: "1px solid #f1f5f9" }} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexShrink: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Ký hiệu đặc biệt</div>
            <button type="button" onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: "none", background: "#f1f5f9", color: "#64748b", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>×</button>
          </div>
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm ký hiệu... (VD: →, ©, ★)"
            style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1.5px solid #e2e8f0", fontSize: 13.5, outline: "none", boxSizing: "border-box", marginBottom: 12, flexShrink: 0 }}
            onFocus={(e) => { e.target.style.borderColor = "#006400"; e.target.style.boxShadow = "0 0 0 3px #00640022"; }}
            onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
          />
          {!search.trim() && (
            <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap", flexShrink: 0 }}>
              {SPECIAL_CHAR_GROUPS.map((g, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  style={{ padding: "4px 10px", borderRadius: 20, border: "1.5px solid", borderColor: activeTab === i ? "#006400" : "#e2e8f0", background: activeTab === i ? "#006400" : "#f8fafc", color: activeTab === i ? "#fff" : "#64748b", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all .15s", fontFamily: "inherit" }}
                >
                  {g.label}
                </button>
              ))}
            </div>
          )}
          <div style={{ flex: 1, overflowY: "auto", paddingRight: 2, minHeight: 0 }}>
            {(search.trim() ? filtered : [filtered[activeTab]].filter(Boolean)).map((group, gi) => (
              <div key={gi}>
                {search.trim() && (
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#94a3b8", marginBottom: 6, marginTop: gi > 0 ? 14 : 0, textTransform: "uppercase", letterSpacing: 0.5 }}>{group.label}</div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))", gap: 5 }}>
                  {group.chars.map((char, ci) => (
                    <button
                      key={ci}
                      type="button"
                      title={`Chèn: ${char}`}
                      onClick={() => insert(char)}
                      style={{ width: 40, height: 40, borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#f8fafc", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .12s", lineHeight: 1, position: "relative" }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = "#006400";
                        el.style.color = "#fff";
                        el.style.borderColor = "#006400";
                        el.style.transform = "scale(1.2)";
                        el.style.zIndex = "1";
                        el.style.boxShadow = "0 4px 12px rgba(0,100,0,0.35)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = "#f8fafc";
                        el.style.color = "";
                        el.style.borderColor = "#e2e8f0";
                        el.style.transform = "scale(1)";
                        el.style.zIndex = "";
                        el.style.boxShadow = "none";
                      }}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {search.trim() && filtered.length === 0 && (
              <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 13.5, padding: "32px 0" }}>Không tìm thấy ký hiệu nào</div>
            )}
          </div>
          <div style={{ marginTop: 12, fontSize: 11.5, color: "#94a3b8", textAlign: "center", flexShrink: 0 }}>
            Click ký hiệu để chèn · Có thể chèn nhiều liên tiếp · Nhấn <kbd style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: 4, fontFamily: "monospace", fontSize: 11 }}>Esc</kbd> để đóng
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ── LocalVideo Extension ──────────────────────────────────────
const LocalVideo = Node.create({
  name: "localVideo",
  group: "block",
  selectable: true,
  draggable: true,
  addAttributes() {
    return { src: { default: null }, controls: { default: true } };
  },
  parseHTML() {
    return [{ tag: "video" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["video", mergeAttributes(HTMLAttributes)];
  },
  addCommands() {
    return {
      setLocalVideo:
        (options: any) =>
        ({ commands }: any) =>
          commands.insertContent({ type: this.name, attrs: options }),
    } as any;
  },
});

// ── VideoModal ───────────────────────────────────────────────
function VideoModal({ editor, onClose, uploadUrl, accentColor = "#006400" }: { editor: any; onClose: () => void; uploadUrl: string; accentColor?: string }) {
  const [tab, setTab] = useState<"upload" | "youtube">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(480);
  const fileRef = useRef<HTMLInputElement>(null);

  const applyYoutube = () => {
    let finalUrl = url.trim();
    if (finalUrl) {
      const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|live|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = finalUrl.match(ytRegex);
      if (match && match[1]) finalUrl = `https://www.youtube.com/watch?v=${match[1]}`;
      editor.chain().focus().setYoutubeVideo({ src: finalUrl, width: Math.max(320, parseInt(String(width)) || 640), height: Math.max(180, parseInt(String(height)) || 480) }).run();
    }
    onClose();
  };

  const applyUpload = async () => {
    if (!file) return;
    if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      alert(`Video vượt quá ${MAX_VIDEO_SIZE_MB}MB (giới hạn hiện tại của hệ thống). Vui lòng nén video nhỏ hơn rồi thử lại.`);
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(uploadUrl, { method: "POST", body: fd });
      const data = await res.json();
      if (!data.ok) throw new Error(data.message || "Upload thất bại");
      editor.chain().focus().setLocalVideo({ src: data.url }).run();
      onClose();
    } catch (e) {
      alert("Tải video thất bại: " + (e instanceof Error ? e.message : "Lỗi mạng"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Portal>
      <div style={{ position: "fixed", inset: 0, zIndex: 2147483647, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)" }} onClick={onClose}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "28px", minWidth: 460, maxWidth: "90vw", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", border: "1px solid #f1f5f9" }} onClick={(e) => e.stopPropagation()}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 20, textAlign: "center" }}>Chèn Video</div>
          <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 12, padding: 4, marginBottom: 24 }}>
            <div onClick={() => setTab("upload")} style={{ flex: 1, textAlign: "center", padding: "10px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", color: tab === "upload" ? "#fff" : "#64748b", background: tab === "upload" ? accentColor : "transparent", borderRadius: 10, transition: "all 0.2s" }}>Tải từ máy</div>
            <div onClick={() => setTab("youtube")} style={{ flex: 1, textAlign: "center", padding: "10px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", color: tab === "youtube" ? "#fff" : "#64748b", background: tab === "youtube" ? accentColor : "transparent", borderRadius: 10, transition: "all 0.2s" }}>Link Youtube</div>
          </div>

          {tab === "upload" ? (
            <div>
              <div
                onClick={() => !uploading && fileRef.current?.click()}
                style={{ border: file ? `2px solid ${accentColor}` : "2px dashed #cbd5e1", borderRadius: 16, padding: "32px 20px", textAlign: "center", cursor: uploading ? "not-allowed" : "pointer", marginBottom: 16, background: file ? "#fff" : "#f8fafc", transition: "all .2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
              >
                {uploading ? (
                  <div style={{ width: 20, height: 20, border: "2.5px solid #f1f5f9", borderTopColor: accentColor, borderRadius: "50%", animation: "rte-spin .8s linear infinite" }} />
                ) : (
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: file ? `${accentColor}15` : "#e2e8f0", color: file ? accentColor : "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  </div>
                )}
                <div style={{ fontSize: 15, color: file ? "#0f172a" : "#64748b", fontWeight: 700 }}>
                  {uploading ? "Đang tải lên..." : file ? file.name : "Click để chọn file video"}
                </div>
                {!file && !uploading && <div style={{ fontSize: 13, color: "#94a3b8" }}>Hỗ trợ: MP4, WebM, QuickTime · Tối đa {MAX_VIDEO_SIZE_MB}MB</div>}
              </div>
              <input ref={fileRef} type="file" accept="video/mp4,video/webm,video/quicktime" style={{ display: "none" }} onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button type="button" onClick={onClose} style={{ padding: "11px 20px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Hủy</button>
                <button type="button" onClick={applyUpload} disabled={!file || uploading} style={{ padding: "11px 24px", borderRadius: 10, border: "none", background: accentColor, color: "#fff", fontSize: 14, fontWeight: 700, cursor: !file || uploading ? "not-allowed" : "pointer", opacity: !file || uploading ? 0.5 : 1 }}>
                  {uploading ? "Đang tải..." : "Tải lên"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Đường dẫn Youtube</div>
              <input
                autoFocus
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") applyYoutube(); if (e.key === "Escape") onClose(); }}
                placeholder="https://www.youtube.com/watch?v=..."
                style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "2px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 20 }}
              />
              <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Chiều rộng (px)</div>
                  <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Chiều cao (px)</div>
                  <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button type="button" onClick={onClose} style={{ padding: "11px 20px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Hủy</button>
                <button type="button" onClick={applyYoutube} disabled={!url.trim()} style={{ padding: "11px 24px", borderRadius: 10, border: "none", background: accentColor, color: "#fff", fontSize: 14, fontWeight: 700, cursor: !url.trim() ? "not-allowed" : "pointer", opacity: !url.trim() ? 0.5 : 1 }}>Chèn link</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}

// ── Toolbar ───────────────────────────────────────────────────
function Toolbar({ editor, uploadUrl, accentColor }: { editor: Editor; uploadUrl: string; accentColor: string }) {
  const [showLink, setShowLink] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showSpecialChars, setShowSpecialChars] = useState(false);

  const activeFontName = FONTS.find((f) => f.value && editor.isActive("textStyle", { fontFamily: f.value }))?.name || "Font chữ";
  const activeFontValue = FONTS.find((f) => f.value && editor.isActive("textStyle", { fontFamily: f.value }))?.value || "";
  const activeFontSize = FONT_SIZES.find((s) => editor.isActive("textStyle", { fontSize: `${s}px` }));

  return (
    <>
      {showLink && <LinkModal editor={editor} onClose={() => setShowLink(false)} accentColor={accentColor} />}
      {showImage && <ImageModal editor={editor} onClose={() => setShowImage(false)} uploadUrl={uploadUrl} accentColor={accentColor} />}
      {showVideo && <VideoModal editor={editor} onClose={() => setShowVideo(false)} uploadUrl={uploadUrl} accentColor={accentColor} />}
      {showSpecialChars && <SpecialCharsModal editor={editor} onClose={() => setShowSpecialChars(false)} />}

      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2, padding: "8px 10px", borderBottom: "1.5px solid #e2e8f0", background: "#f8fafc", borderRadius: "12px 12px 0 0", minHeight: 50, position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <TB onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} tip="Hoàn tác (Ctrl+Z)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.95" /></svg>
        </TB>
        <TB onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} tip="Làm lại (Ctrl+Y)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-.49-4.95" /></svg>
        </TB>
        <Div />

        <DropBtn label="Kiểu chữ" tip="Heading / Paragraph">
          <DropItem onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph")}>
            <span style={{ fontSize: 14 }}>Đoạn văn</span>
          </DropItem>
          {([1, 2, 3, 4] as const).map((n) => (
            <DropItem key={n} onClick={() => editor.chain().focus().toggleHeading({ level: n }).run()} active={editor.isActive("heading", { level: n })}>
              <span style={{ fontSize: 18 - n * 2, fontWeight: 800 }}>Tiêu đề {n}</span>
            </DropItem>
          ))}
        </DropBtn>
        <Div />

        <DropBtn label={<span style={{ fontFamily: activeFontValue || "inherit" }}>{activeFontName}</span>} tip="Phông chữ" width={200}>
          {FONTS.map((f) => (
            <DropItem
              key={f.value || "default"}
              onClick={() => { if (!f.value) editor.chain().focus().unsetFontFamily().run(); else editor.chain().focus().setFontFamily(f.value).run(); }}
              active={f.value ? editor.isActive("textStyle", { fontFamily: f.value }) : !activeFontValue}
            >
              <span style={{ fontFamily: f.value || "inherit", fontSize: 14 }}>{f.name}</span>
            </DropItem>
          ))}
        </DropBtn>
        <Div />

        <DropBtn label={activeFontSize ? `${activeFontSize}px` : "Cỡ chữ"} tip="Kích thước chữ" width={110}>
          <DropItem onClick={() => editor.chain().focus().unsetFontSize().run()} active={!activeFontSize}>
            <span style={{ fontSize: 13 }}>Mặc định</span>
          </DropItem>
          {FONT_SIZES.map((s) => (
            <DropItem key={s} onClick={() => editor.chain().focus().setFontSize(`${s}px`).run()} active={activeFontSize === s}>
              <span style={{ fontSize: Math.min(s, 18) }}>{s}px</span>
            </DropItem>
          ))}
        </DropBtn>
        <Div />

        <TB onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} tip="Đậm (Ctrl+B)"><b>B</b></TB>
        <TB onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} tip="Nghiêng (Ctrl+I)"><i>I</i></TB>
        <TB onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} tip="Gạch dưới (Ctrl+U)"><span style={{ textDecoration: "underline" }}>U</span></TB>
        <TB onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} tip="Gạch ngang"><span style={{ textDecoration: "line-through" }}>S</span></TB>
        <TB onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive("subscript")} tip="Chỉ số dưới"><span>X<sub style={{ fontSize: 8 }}>2</sub></span></TB>
        <TB onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive("superscript")} tip="Chỉ số trên"><span>X<sup style={{ fontSize: 8 }}>2</sup></span></TB>
        <Div />

        <ColorPicker editor={editor} type="color" />
        <ColorPicker editor={editor} type="highlight" />
        <Div />

        <TB onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} tip="Căn trái">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" /></svg>
        </TB>
        <TB onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} tip="Căn giữa">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="10" x2="6" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="18" y1="18" x2="6" y2="18" /></svg>
        </TB>
        <TB onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} tip="Căn phải">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="21" y1="10" x2="7" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="7" y2="18" /></svg>
        </TB>
        <TB onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} tip="Căn đều">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="21" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="3" y2="18" /></svg>
        </TB>
        <Div />

        <TB onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} tip="Danh sách bullet">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" /><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" /><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" /></svg>
        </TB>
        <TB onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} tip="Danh sách số">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><text x="1" y="8" fontSize="7" fill="currentColor" stroke="none" fontWeight="700">1.</text><text x="1" y="14" fontSize="7" fill="currentColor" stroke="none" fontWeight="700">2.</text><text x="1" y="20" fontSize="7" fill="currentColor" stroke="none" fontWeight="700">3.</text></svg>
        </TB>
        <TB onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} tip="Trích dẫn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></svg>
        </TB>
        <TB onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} tip="Code block">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
        </TB>
        <TB onClick={() => editor.chain().focus().setHorizontalRule().run()} tip="Đường kẻ ngang">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12" /></svg>
        </TB>
        <Div />

        <TB
          onClick={() => { if (editor.can().sinkListItem("listItem")) editor.chain().focus().sinkListItem("listItem").run(); else editor.chain().focus().indent().run(); }}
          tip="Tăng thụt lề"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="8" x2="21" y2="8" /><line x1="3" y1="16" x2="21" y2="16" /><polyline points="9 12 12 15 15 12" /></svg>
        </TB>
        <TB
          onClick={() => { if (editor.can().liftListItem("listItem")) editor.chain().focus().liftListItem("listItem").run(); else editor.chain().focus().outdent().run(); }}
          tip="Giảm thụt lề"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="8" x2="21" y2="8" /><line x1="3" y1="16" x2="21" y2="16" /><polyline points="15 12 12 9 9 12" /></svg>
        </TB>
        <TB onClick={() => editor.chain().focus().toggleFirstLineIndent().run()} active={editor.isActive("paragraph", { firstLineIndent: true }) || editor.isActive("heading", { firstLineIndent: true })} tip="Thụt đầu dòng (dòng đầu tiên)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="9" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </TB>
        <Div />

        <TB onClick={() => setShowLink(true)} active={editor.isActive("link")} tip="Chèn link">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
        </TB>
        <TB onClick={() => setShowImage(true)} tip="Chèn ảnh">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
        </TB>
        <TB onClick={() => setShowVideo(true)} tip="Video (Tải lên / Youtube)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
        </TB>
        <TB onClick={() => (editor.chain().focus() as any).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} tip="Chèn bảng">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="1" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></svg>
        </TB>

        <TB onClick={() => setShowSpecialChars(true)} tip="Ký hiệu đặc biệt (Ω)">
          <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "serif" }}>Ω</span>
        </TB>
        <Div />

        <TB onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} tip="Xóa định dạng">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14.5 4h-5L7 7H4v2h3l4.5 4.5" /><path d="M14 10l6 6" /><line x1="3" y1="21" x2="21" y2="3" /></svg>
        </TB>
      </div>
    </>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function RichTextEditor({ value, onChange, placeholder = "Nhập nội dung...", minHeight = 200, label, hint, required }: RichTextEditorProps) {
  const [charCount, setCharCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });
  const ACCENT = "#006400";

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] }, link: false, underline: false }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Indent.configure({ types: ["paragraph", "heading"] }),
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      CustomImage.configure({ HTMLAttributes: { style: "max-width:100%;border-radius:8px;display:block;margin:8px auto;object-fit:contain;" } }),
      Subscript,
      Superscript,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder }),
      CharacterCount,
      Youtube.configure({ inline: false, controls: true }),
      LocalVideo,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChangeRef.current(html === "<p></p>" ? "" : html);
      setCharCount(editor.storage.characterCount?.characters?.() ?? 0);
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    editorProps: {
      attributes: {
        spellcheck: "false",
        autocorrect: "off",
        autocomplete: "off",
        autocapitalize: "off",
        style: `min-height:${minHeight}px;max-height:calc(100vh - 200px);overflow-y:auto;padding:16px 18px;outline:none;font-size:14.5px;line-height:1.75;color:#0f172a;`,
      },
    },
  });

  useEffect(() => {
    if (!editor || !value) return;
    const current = editor.getHTML();
    if (current === value || (!value && current === "<p></p>")) return;
    const timer = setTimeout(() => {
      editor.commands.setContent(value, { emitUpdate: false });
    }, 150);
    return () => clearTimeout(timer);
  }, [editor, value]);

  const wordCount = useCallback(() => {
    if (!editor) return 0;
    const text = editor.getText();
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }, [editor]);

  if (!editor) return null;

  return (
    <>
      <style>{`
        @keyframes rte-spin { to { transform: rotate(360deg); } }
        .tiptap-editor .tiptap h1{font-size:28px;font-weight:900;color:#0f172a;margin:16px 0 10px;line-height:1.3}
        .tiptap-editor .tiptap h2{font-size:22px;font-weight:800;color:#0f172a;margin:14px 0 8px;line-height:1.35}
        .tiptap-editor .tiptap h3{font-size:18px;font-weight:700;color:#0f172a;margin:12px 0 6px}
        .tiptap-editor .tiptap h4{font-size:15px;font-weight:700;color:#0f172a;margin:10px 0 5px}
        .tiptap-editor .tiptap p{margin:0 0 10px}
        .tiptap-editor .tiptap ul{padding-left:22px;margin:8px 0;list-style:disc}
        .tiptap-editor .tiptap ol{padding-left:22px;margin:8px 0;list-style:decimal}
        .tiptap-editor .tiptap li{margin:4px 0}
        .tiptap-editor .tiptap blockquote{border-left:4px solid #006400;margin:12px 0;padding:10px 16px;background:linear-gradient(90deg,rgba(0,100,0,0.05),transparent);border-radius:0 8px 8px 0;color:#475569;font-style:italic}
        .tiptap-editor .tiptap code{background:#f1f5f9;color:#006400;padding:2px 6px;border-radius:5px;font-family:monospace;font-size:13px}
        .tiptap-editor .tiptap pre{background:#0f172a;color:#e2e8f0;padding:16px 18px;border-radius:10px;overflow:auto;margin:10px 0}
        .tiptap-editor .tiptap pre code{background:none;color:inherit;padding:0}
        .tiptap-editor .tiptap a{color:#006400;text-decoration:underline}
        .tiptap-editor .tiptap img{max-width:100%;border-radius:10px;margin:8px auto;display:block}
        .tiptap-editor .tiptap iframe, video {max-width:100%;border-radius:10px;margin:16px auto;display:block}
        .tiptap-editor .tiptap div[data-youtube-video]{display:flex;justify-content:center;margin:16px 0}
        .tiptap-editor .tiptap hr{border:none;border-top:2px solid #e2e8f0;margin:16px 0}
        .tiptap-editor .tiptap table{width:100%;border-collapse:collapse;margin:10px 0;border:1px solid #e2e8f0}
        .tiptap-editor .tiptap td,.tiptap-editor .tiptap th{border:1px solid #e2e8f0;padding:9px 12px;font-size:13.5px;position:relative;min-width:60px}
        .tiptap-editor .tiptap th{background:#f8fafc;font-weight:700;color:#334155}
        .tiptap-editor .tiptap td.selectedCell,.tiptap-editor .tiptap th.selectedCell{background:rgba(0,100,0,0.06)}
        .tiptap-editor .tiptap .tableWrapper{overflow-x:auto}
        .tiptap-editor .tiptap mark{border-radius:3px;padding:0 2px}
        .tiptap-editor .tiptap p.is-editor-empty:first-child::before{content:attr(data-placeholder);float:left;color:#94a3b8;pointer-events:none;height:0;font-style:italic}
        .tiptap-editor .tiptap ::selection{background:rgba(0,100,0,0.15)}
        .tiptap-editor .ProseMirror-focused{outline:none}
      `}</style>
      <div>
        {label && (
          <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#475569", marginBottom: 7, letterSpacing: 0.3 }}>
            {label} {required && <span style={{ color: ACCENT }}>*</span>}
          </label>
        )}
        <div
          className="tiptap-editor"
          style={{ border: `1.5px solid ${isFocused ? ACCENT : "#e2e8f0"}`, borderRadius: 12, background: "#fff", boxShadow: isFocused ? `0 0 0 3px ${ACCENT}22` : "none", transition: "border-color .2s, box-shadow .2s", display: "flex", flexDirection: "column" }}
        >
          <Toolbar editor={editor} uploadUrl="/api/admin/upload" accentColor={ACCENT} />
          <EditorContent editor={editor} spellCheck={false} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 14px", borderTop: "1px solid #f1f5f9", background: "#fafbfc" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ fontSize: 11.5, color: "#94a3b8" }}>{charCount} ký tự</span>
              <span style={{ fontSize: 11.5, color: "#94a3b8" }}>{wordCount()} từ</span>
            </div>
            <div style={{ fontSize: 11.5, color: "#94a3b8", display: "flex", gap: 10 }}>
              <span>Ctrl+B đậm</span><span>·</span><span>Ctrl+I nghiêng</span><span>·</span><span>Ctrl+Z hoàn tác</span>
            </div>
          </div>
        </div>
        {hint && <p style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 5, marginBottom: 0 }}>{hint}</p>}
      </div>
    </>
  );
}
