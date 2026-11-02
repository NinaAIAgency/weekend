/** Grouping of workspaces by their free-text `category` for the workspace switcher. */

export interface WorkspaceGroup<W> {
  /** Display label of the category (first spelling seen); null = workspaces without a category. */
  category: string | null;
  workspaces: W[];
}

/**
 * Groups workspaces by category. Categories match case-insensitively and are
 * sorted alphabetically; workspaces without a category come last. Within a
 * group the incoming order (position) is kept.
 */
export function groupWorkspaces<W extends { category?: string | null }>(list: W[]): WorkspaceGroup<W>[] {
  const groups = new Map<string, WorkspaceGroup<W>>();
  const rest: W[] = [];
  for (const w of list) {
    const label = w.category?.trim();
    if (!label) { rest.push(w); continue; }
    const key = label.toLocaleLowerCase("nl");
    const g = groups.get(key);
    if (g) g.workspaces.push(w);
    else groups.set(key, { category: label, workspaces: [w] });
  }
  const sorted = [...groups.values()].sort((a, b) => a.category!.localeCompare(b.category!, "nl", { sensitivity: "base" }));
  return rest.length ? [...sorted, { category: null, workspaces: rest }] : sorted;
}

/** Distinct category labels, sorted, for suggestions in the edit dialog. */
export function workspaceCategories(list: { category?: string | null }[]): string[] {
  return groupWorkspaces(list).flatMap((g) => (g.category ? [g.category] : []));
}
