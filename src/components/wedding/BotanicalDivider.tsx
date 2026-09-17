export function BotanicalDivider({ light = false, motif = 0 }: { light?: boolean; motif?: 0 | 1 | 2 | 3 | 4 }) {
  return (
    <span
      className={`botanical-divider motif-${motif}${light ? " light" : ""}`}
      aria-hidden="true"
    />
  );
}
