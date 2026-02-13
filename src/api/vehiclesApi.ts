import type { Vehicle, CreateVehicleInput, UpdateVehicleInput } from "../types/vehicle";
import { apiClient } from "./client";

export async function fetchVehicles(signal?: AbortSignal): Promise<Vehicle[]> {
  const res = await apiClient.get<Vehicle[]>("/vehicles", { signal });
  return res.data;
}

export async function createVehicle(body: CreateVehicleInput): Promise<Vehicle> {
  const res = await apiClient.post<Vehicle>("/vehicles", body);
  return res.data;
}

export async function updateVehicle(id: number, body: UpdateVehicleInput): Promise<Vehicle> {
  const res = await apiClient.put<Vehicle>(`/vehicles/${id}`, body);
  return res.data;
}

export async function deleteVehicle(id: number): Promise<void> {
  await apiClient.delete(`/vehicles/${id}`);
}
