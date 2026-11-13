// UUID natif du navigateur (marche sur localhost et en https)
export function generateId(): string {
  return crypto.randomUUID();
}
