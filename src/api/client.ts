import axios from "axios";
import { config } from "../config";

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  headers: { "Content-Type": "application/json" }
});

export function getErrorMessage(err: unknown): string {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const statusText = err.response?.statusText;
    const data = err.response?.data as any;
    const hint =
      (typeof data === "string" && data.slice(0, 160)) ||
      (data && typeof data === "object" && ("message" in data) ? String((data as any).message) : "");
    return [status ? `HTTP ${status}` : "", statusText ?? "", hint || err.message].filter(Boolean).join(" — ");
  }
  if (err && typeof err === "object" && "message" in err) return String((err as any).message);
  return "Unknown error";
}
