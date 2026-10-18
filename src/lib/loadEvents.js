import { fromDay, isValidDay } from '@/lib/enochCalendar'

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function problemWith(entry) {
  if (typeof entry !== 'object' || entry === null) return 'not an object'
  const e = entry
  if (!isValidDay(e.date)) return '"date" must be a whole number of days, 1 or more'
  if (!isNonEmptyString(e.title)) return '"title" must be a non-empty string'
  if (!isNonEmptyString(e.summary)) return '"summary" must be a non-empty string'
  if (!isNonEmptyString(e.source)) return '"source" must be a non-empty string'
  return null
}

// Validate the parsed JSON, drop bad entries, sort by date and decode each date.
export function parseEvents(raw) {
  if (!Array.isArray(raw)) {
    throw new Error('events.json must contain a list of events.')
  }

  const valid = []
  let skipped = 0
  raw.forEach((entry, index) => {
    const problem = problemWith(entry)
    if (problem) {
      skipped++
      console.warn(`events.json entry ${index} was skipped: ${problem}.`)
      return
    }
    const { date, title, summary, source } = entry
    valid.push({ date, title, summary, source })
  })

  // Array.prototype.sort is stable, so events on the same day keep their file order.
  valid.sort((a, b) => a.date - b.date)

  const events = valid.map((event, i) => {
    const previous = valid[i - 1]
    const gap = previous && event.date > previous.date ? event.date - previous.date : null
    return { ...event, cal: fromDay(event.date), gap }
  })

  return { events, skipped }
}

export async function loadEvents(url, fetchImpl = fetch) {
  const response = await fetchImpl(url)
  if (!response.ok) {
    throw new Error(`The server answered ${response.status} ${response.statusText}.`.trim())
  }
  let json
  try {
    json = await response.json()
  } catch {
    throw new Error('The file is not valid JSON.')
  }
  return parseEvents(json)
}
