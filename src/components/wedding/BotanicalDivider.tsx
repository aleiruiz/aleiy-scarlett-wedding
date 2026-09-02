export function BotanicalDivider({ light = false }: { light?: boolean }) {
  return (
    <svg
      className={`botanical-divider${light ? " light" : ""}`}
      viewBox="0 0 180 30"
      aria-hidden="true"
    >
      <path d="M7 15h53c12 0 19-5 26-11" />
      <path d="M173 15h-53c-12 0-19-5-26-11" />
      <path d="M70 11c-7-7-13-6-16-3 5 1 10 3 16 3Z" />
      <path d="M110 11c7-7 13-6 16-3-5 1-10 3-16 3Z" />
      <path d="M78 7c-5-6-9-5-12-3 4 1 7 2 12 3Z" />
      <path d="M102 7c5-6 9-5 12-3-4 1-7 2-12 3Z" />
      <path d="m90 8 6 7-6 7-6-7 6-7Z" />
    </svg>
  );
}
