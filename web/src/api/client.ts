import { ApiClient } from "@/lib/httpClient/client";

export const apiClient = new ApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL || window.location.origin,
  globalHeaders: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
});
