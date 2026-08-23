/**
 * `@svg-maps/vietnam` ships its own `index.d.ts` that references an
 * unpublished type-only package (`svg-maps__common`), which breaks module
 * resolution. This local shim declares the module ourselves so TypeScript
 * can resolve it — the shape below matches the package's actual runtime
 * export (a plain object with `label`, `viewBox`, and `locations`).
 */
declare module "@svg-maps/vietnam" {
  interface VietnamLocation {
    id: string;
    name: string;
    path: string;
  }

  interface VietnamMap {
    label: string;
    viewBox: string;
    locations: VietnamLocation[];
  }

  const map: VietnamMap;
  export default map;
}
