import type { FileRouteTypes } from "@/router/routeTree.gen";

export type TanStackPath = FileRouteTypes["fullPaths"];

/** Known document paths (sync when adding routes under `src/router/_routes`). */
export const tanstackDocumentPaths = ["/", "/about"] as const satisfies readonly TanStackPath[];

export function isTanStackDocumentPath(
  pathname: string,
): pathname is TanStackPath {
  return (tanstackDocumentPaths as readonly string[]).includes(pathname);
}