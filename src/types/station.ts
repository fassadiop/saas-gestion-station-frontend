export interface StationFilters {
  page: number;
  pageSize: number;
  ordering?: string;
  region?: string;
  active?: boolean | "";
}
