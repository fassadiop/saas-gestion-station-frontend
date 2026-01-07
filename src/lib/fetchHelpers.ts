// src/lib/fetchHelpers.ts
export function extractResults<T = any>(res: any): T[] {
  if (!res) return [];
  // axios response shape: res.data
  const payload = res.data ?? res;
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  // DRF pagination shape
  if (payload.results && Array.isArray(payload.results)) return payload.results;
  // fallback if server returns an object with items in a key
  // try common keys
  if (Array.isArray(payload.items)) return payload.items;
  return [];
}

export function extractCount(res: any): number | undefined {
  const payload = res.data ?? res;
  if (!payload) return undefined;
  if (typeof payload.count === "number") return payload.count;
  return undefined;
}
