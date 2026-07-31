import { queryOptions } from "@tanstack/react-query";
import { getCatalogStats, listPapers } from "./papers.functions";

export const allPapersQueryOptions = queryOptions({
  queryKey: ["papers", "all"],
  queryFn: () => listPapers(),
  staleTime: 10 * 60_000,
  gcTime: 60 * 60_000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});

export const catalogStatsQueryOptions = queryOptions({
  queryKey: ["papers", "stats"],
  queryFn: () => getCatalogStats(),
  staleTime: 10 * 60_000,
  gcTime: 60 * 60_000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});
