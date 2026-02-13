export interface Vehicle {
  id: number
  name: string
  model: string
  year: number
  color: string
  price: number
  latitude?: number
  longitude?: number
}

export type CreateVehicleInput = Omit<Vehicle, 'id'>

export type UpdateVehicleInput = Pick<Vehicle, 'name' | 'price'>

export type SortField = 'year' | 'price'
export type SortDirection = 'asc' | 'desc'

export interface SortState {
  field: SortField
  direction: SortDirection
}

export interface FilterState {
  q: string
  minYear?: number
  maxYear?: number
  minPrice?: number
  maxPrice?: number
}