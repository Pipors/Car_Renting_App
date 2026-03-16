export function usePagination(page: number, limit: number) {
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}
