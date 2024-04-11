export const handleFilter = (filter: object) =>
  Object.fromEntries(
    Object.entries(filter).filter(
      ([, value]) => value !== undefined && value !== null
    )
  )
