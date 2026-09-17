export function forInvitation<T extends { civilOnly?: boolean }>(items: readonly T[], civil = false): T[] {
  return items.filter((item) => !item.civilOnly || civil);
}
