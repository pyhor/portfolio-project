// Preserve source precision: a year/month sorts at the end of that period,
// without pretending the source supplied a specific month or day.
function dateSortValue(value) {
  if (typeof value !== 'string') return null
  const match = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = match[2] ? Number(match[2]) : 12
  if (year < 1000 || month < 1 || month > 12) return null
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const day = match[3] ? Number(match[3]) : lastDay
  if (day < 1 || day > lastDay) return null
  return Date.UTC(year, month - 1, day)
}

export function sortTimelineNewestFirst(items) {
  return items
    .map((item, index) => ({
      item,
      index,
      date: item.ongoing && dateSortValue(item.startDate) !== null
        ? Infinity
        : (dateSortValue(item.endDate) ?? -Infinity),
    }))
    .sort((a, b) => a.date === b.date ? a.index - b.index : b.date - a.date)
    .map(({ item }) => item)
}
