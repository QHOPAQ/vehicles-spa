import { create } from 'zustand'
import {
  fetchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from '../api/vehiclesApi'
import type {
  Vehicle,
  CreateVehicleInput,
  UpdateVehicleInput,
  SortState,
  FilterState
} from '../types/vehicle'
import { uid } from '../utils/toasts'
import { getErrorMessage } from '../api/client'

type Status = 'idle' | 'loading' | 'error'

export type ToastSeverity = 'success' | 'warning' | 'error' | 'info'

export interface Toast {
  id: string
  severity: ToastSeverity
  message: string
}

interface Patches {
  created: Vehicle[]
  updated: Record<number, Partial<Vehicle>>
  deleted: number[]
}

export interface VehiclesStoreState {
  vehicles: Vehicle[]
  status: Status
  error: string | null

  sort: SortState
  filter: FilterState
  paging: { page: number; rowsPerPage: number }

  toasts: Toast[]
  pushToast: (severity: ToastSeverity, message: string) => void
  popToast: (id: string) => void

  patches: Patches
  lastId: number

  load: () => Promise<void>
  setSort: (sort: SortState) => void
  setFilter: (patch: Partial<FilterState>) => void
  setPaging: (patch: Partial<{ page: number; rowsPerPage: number }>) => void

  create: (input: CreateVehicleInput) => Promise<void>
  edit: (id: number, input: UpdateVehicleInput) => Promise<void>
  remove: (id: number) => Promise<void>
}

const PATCHES_KEY = 'vehicles_patches_v1'

const emptyPatches = (): Patches => ({ created: [], updated: {}, deleted: [] })

// читаем локальные патчи из storage
const readPatches = (): Patches => {
  try {
    const raw = localStorage.getItem(PATCHES_KEY)
    if (!raw) return emptyPatches()
    const parsed: unknown = JSON.parse(raw)

    // максимально безопасная валидация формы
    if (!parsed || typeof parsed !== 'object') return emptyPatches()
    const p = parsed as Partial<Patches>

    return {
      created: Array.isArray(p.created) ? (p.created as Vehicle[]) : [],
      updated:
        p.updated && typeof p.updated === 'object'
          ? (p.updated as Record<number, Partial<Vehicle>>)
          : {},
      deleted: Array.isArray(p.deleted) ? (p.deleted as number[]) : []
    }
  } catch {
    return emptyPatches()
  }
}

// сохраняем патчи обратно
const savePatches = (patches: Patches): void => {
  try {
    localStorage.setItem(PATCHES_KEY, JSON.stringify(patches))
  } catch {}
}

// нормализация чисел (API иногда присылает строки)
const toNumber = (v: unknown): number => {
  if (typeof v === 'number') return v
  if (typeof v === 'string') return Number(v)
  return NaN
}

const normalizeVehicle = (v: Vehicle): Vehicle => ({
  ...v,
  id: Number(v.id),
  year: Number(v.year) || 0,
  price: toNumber(v.price),
  latitude: v.latitude === undefined ? undefined : toNumber(v.latitude),
  longitude: v.longitude === undefined ? undefined : toNumber(v.longitude)
})

const normalizeVehicles = (list: unknown): Vehicle[] =>
  Array.isArray(list) ? (list as Vehicle[]).map(normalizeVehicle) : []

// применяем локальные изменения поверх серверных данных
const applyLocalPatches = (serverList: Vehicle[], patches: Patches): Vehicle[] => {
  const deleted = new Set<number>(patches.deleted)

  let result = serverList
    .filter((v) => !deleted.has(v.id))
    .map((v) => {
      const upd = patches.updated[v.id]
      return upd ? { ...v, ...upd } : v
    })

  const localCreated = patches.created.filter((v) => !deleted.has(v.id))
  result = [...localCreated, ...result]

  // убираем возможные дубли по id
  const seen = new Set<number>()
  return result.filter((v) => {
    if (seen.has(v.id)) return false
    seen.add(v.id)
    return true
  })
}

export const useVehiclesStore = create<VehiclesStoreState>((set, get) => ({
  vehicles: [],
  status: 'idle',
  error: null,

  sort: { field: 'year', direction: 'asc' },
  filter: { q: '' },
  paging: { page: 0, rowsPerPage: 10 },

  toasts: [],
  pushToast: (severity, message) =>
    set((state) => ({
      toasts: [...state.toasts, { id: uid(), severity, message }]
    })),
  popToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    })),

  patches: readPatches(),
  lastId: 1000,

  // загрузка списка + применение патчей
  load: async () => {
    const controller = new AbortController()
    set({ status: 'loading', error: null })

    try {
      const data = await fetchVehicles(controller.signal)
      const normalized = normalizeVehicles(data)

      const maxServerId = normalized.reduce((m, v) => Math.max(m, v.id), 0)

      const patched = applyLocalPatches(normalized, get().patches)
      const maxId = patched.reduce((m, v) => Math.max(m, v.id), 0)

      set({
        vehicles: patched,
        status: 'idle',
        lastId: Math.max(maxId, maxServerId)
      })
    } catch (err) {
      if (controller.signal.aborted) return

      const msg = getErrorMessage(err)

      // моковые данные на случай, если API совсем мертв
      const fallback: Vehicle[] = [
        { id: 1, name: 'Toyota', model: 'Camry', year: 2021, color: 'red', price: 21000, latitude: 55.75, longitude: 37.62 },
        { id: 2, name: 'BMW', model: 'X5', year: 2019, color: 'black', price: 38000, latitude: 55.76, longitude: 37.61 },
        { id: 3, name: 'Tesla', model: 'Model 3', year: 2022, color: 'white', price: 45000, latitude: 55.75, longitude: 37.618 }
      ]

      const patched = applyLocalPatches(normalizeVehicles(fallback), get().patches)
      const maxId = patched.reduce((m, v) => Math.max(m, v.id), 0)

      set({
        vehicles: patched,
        status: 'error',
        error: msg,
        lastId: Math.max(maxId, 1000)
      })
    }
  },

  setSort: (sort) => set({ sort }),

  setFilter: (patch) =>
    set((s) => ({
      filter: { ...s.filter, ...patch },
      paging: { ...s.paging, page: 0 }
    })),

  setPaging: (patch) => set((s) => ({ paging: { ...s.paging, ...patch } })),

  // создание машины
  create: async (input) => {
    try {
      const created = await createVehicle(input)
      set((s) => ({
        vehicles: [normalizeVehicle(created), ...s.vehicles],
        lastId: Math.max(s.lastId, created.id)
      }))
      get().pushToast('success', 'Машина добавлена')
    } catch (err) {
      const id = get().lastId + 1
      const localVehicle: Vehicle = { id, ...(input as CreateVehicleInput) }

      const patches = get().patches
      const nextPatches: Patches = {
        ...patches,
        created: [localVehicle, ...patches.created]
      }

      savePatches(nextPatches)

      set({
        patches: nextPatches,
        vehicles: applyLocalPatches(get().vehicles, nextPatches),
        lastId: id
      })

      get().pushToast('warning', 'Сохранено локально (API недоступен)')
    }
  },

  // редактирование
  edit: async (id, input) => {
    try {
      await updateVehicle(id, input)
      set((s) => ({
        vehicles: s.vehicles.map((v) =>
          v.id === id ? { ...v, ...input } : v
        )
      }))
      get().pushToast('success', 'Изменения сохранены')
    } catch {
      const patches = get().patches
      const prev = patches.updated[id] || {}
      const nextPatches: Patches = {
        ...patches,
        updated: { ...patches.updated, [id]: { ...prev, ...input } }
      }

      savePatches(nextPatches)

      set({
        patches: nextPatches,
        vehicles: applyLocalPatches(get().vehicles, nextPatches)
      })

      get().pushToast('warning', 'Изменения сохранены локально')
    }
  },

  // удаление
  remove: async (id) => {
    try {
      await deleteVehicle(id)
      set((s) => ({
        vehicles: s.vehicles.filter((v) => v.id !== id)
      }))
      get().pushToast('success', 'Машина удалена')
    } catch {
      const patches = get().patches
      const nextPatches: Patches = {
        ...patches,
        deleted: [...patches.deleted, id]
      }

      savePatches(nextPatches)

      set({
        patches: nextPatches,
        vehicles: applyLocalPatches(get().vehicles, nextPatches)
      })

      get().pushToast('warning', 'Удалено локально')
    }
  }
}))
