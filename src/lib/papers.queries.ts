import { queryOptions } from "@tanstack/react-query";
import { getCatalogStats, listPapers } from "./papers.functions";

export const allPapersQueryOptions = queryOptions({
  queryKey: ["papers", "all"],
  queryFn: () => listPapers(),
  staleTime: 60_000,
  gcTime: 10 * 60_000,
});

export const catalogStatsQueryOptions = queryOptions({
  queryKey: ["papers", "stats"],
  queryFn: () => getCatalogStats(),
  staleTime: 60_000,
  gcTime: 10 * 60_000,
});