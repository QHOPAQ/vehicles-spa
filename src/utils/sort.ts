import type { Vehicle, SortState } from "../types/vehicle";

export function sortVehicles(list: Vehicle[], sort: SortState): Vehicle[] {
  const copy = [...list];
  const dir = sort.direction === "asc" ? 1 : -1;
  copy.sort((a, b) => {
    const av = a[sort.field];
    const bv = b[sort.field];
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
  return copy;
}
