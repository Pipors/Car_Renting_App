export const getPagination = (pageRaw?: string | number, limitRaw?: string | number) => {
  const page = Math.max(Number(pageRaw ?? 1) || 1, 1);
  const limit = Math.min(Math.max(Number(limitRaw ?? 20) || 20, 1), 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const makeMeta = (total: number, page: number, limit: number) => ({
  total,
  page,
  limit,
  totalPages: Math.max(Math.ceil(total / limit), 1)
});
