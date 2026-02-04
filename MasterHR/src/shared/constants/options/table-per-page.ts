export const TABLE_PER_PAGE_OPTIONS = Array.from({ length: 5 }, (_, i) => i + 1).map((option) => {
  const count = (option * 10).toString();

  return { id: option, label: count, value: count };
});
