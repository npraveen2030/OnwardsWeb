export interface SavedSearchRequest {
  id?: number;
  userId: number;
  searchName: string;
  search: string;
  loginId: number;
}

export interface SavedSearchResponse {
  id: number;
  userId: number;
  searchName: string;
  search: string;
  keyword: string;
  reqId: number;
  location: Array<{ id: number; name: string }>;
}
