import { get } from "./api";

export type GpoSearchResponse = Record<string, unknown>;

export async function searchPolicies(query: string): Promise<GpoSearchResponse> {
  const q = encodeURIComponent(query);
  return get(`/api/gpo/search?q=${q}`);
}

