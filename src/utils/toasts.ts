export type ToastSeverity = "success" | "info" | "warning" | "error";

export interface ToastMessage {
  id: string;
  severity: ToastSeverity;
  message: string;
}

export function uid(prefix = "t"): string {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}
