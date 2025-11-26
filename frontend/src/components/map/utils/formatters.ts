const nf = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

// --- DISTANCE ---
// Returns "123 m" or "1.23 km"
export function formatMeters(meters: number): string {
  if (!Number.isFinite(meters)) return '-'

  if (meters >= 1000) {
    return `${nf.format(meters / 1000)} km`
  }
  return `${nf.format(meters)} m`
}

// --- AREA ---
// Returns "500 m²", or "1.1 km²"
export function formatAreaSqM(m2: number): string {
  if (!Number.isFinite(m2)) return '-'

  if (m2 >= 1_000_000) {
    return `${nf.format(m2 / 1_000_000)} km²`
  }

  return `${nf.format(m2)} m²`
}
