export const sortData = (data, sortKey, direction) => {
  if (!data) return [];

  return [...data].sort((a, b) => {
    const x = a[sortKey];
    const y = b[sortKey];

    // Numbers
    if (typeof x === "number" && typeof y === "number") {
      return direction === "asc" ? x - y : y - x;
    }

    // Strings
    return direction === "asc" ? x?.localeCompare(y) : y?.localeCompare(x);
  });
};
