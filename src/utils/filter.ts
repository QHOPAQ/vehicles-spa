import type { Vehicle, FilterState } from "../types/vehicle";

export function filterVehicles(list: Vehicle[], f: FilterState): Vehicle[] {
  const q = f.q.trim().toLowerCase();
  return list.filter((v) => {
    if (q) {
      const hay = `${v.name} ${v.model}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (typeof f.minYear === "number" && v.year < f.minYear) return false;
    if (typeof f.maxYear === "number" && v.year > f.maxYear) return false;
    if (typeof f.minPrice === "number" && v.price < f.minPrice) return false;
    if (typeof f.maxPrice === "number" && v.price > f.maxPrice) return false;
    return true;
  });
}
