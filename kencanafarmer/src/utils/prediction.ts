export function predictHarvestDate(plantingDateISO: string, expectedDays?: number) {
  const date = new Date(plantingDateISO);
  const days = Number.isFinite(expectedDays ? expectedDays : NaN) ? expectedDays! : 60;
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function daysBetween(isoA: string, isoB: string) {
  const a = new Date(isoA);
  const b = new Date(isoB);
  const ms = Math.abs(b.getTime() - a.getTime());
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}
