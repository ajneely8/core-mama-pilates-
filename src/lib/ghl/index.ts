import "server-only";
import type { SchedulingAdapter } from "./adapter";
import { MockAdapter } from "./mock-adapter";
import { GhlAdapter } from "./ghl-adapter";

let cached: SchedulingAdapter | null = null;

/**
 * Chooses the backend. `GHL_MODE=live` (with credentials present) uses real
 * GoHighLevel calendars; anything else uses the demo adapter.
 */
export function getAdapter(): SchedulingAdapter {
  if (cached) return cached;
  const live = process.env.GHL_MODE === "live" && !!process.env.GHL_API_KEY && !!process.env.GHL_LOCATION_ID;
  cached = live ? new GhlAdapter() : new MockAdapter();
  return cached;
}

export { AdapterError } from "./types";
export type * from "./types";
