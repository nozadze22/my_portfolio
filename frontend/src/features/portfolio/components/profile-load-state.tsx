export function ProfileLoading({ label = "Loading profile…" }: { label?: string }) {
  return (
    <p className="animate-pulse text-center text-sm text-on-surface-variant" role="status">
      {label}
    </p>
  );
}

export function ProfileError() {
  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
  return (
    <div className="rounded-2xl border border-destructive/30 bg-surface-container-low p-space-lg text-sm text-destructive" role="alert">
      <p className="font-semibold">Could not load profile</p>
      <ul className="mt-space-sm list-inside list-disc text-on-surface-variant">
        <li>
          Run the API: <code className="font-label-code text-xs">pnpm dev:backend</code> or root{" "}
          <code className="font-label-code text-xs">pnpm dev</code>
        </li>
        <li>
          API URL: <code className="font-label-code text-xs">{api}</code> (see{" "}
          <code className="font-label-code text-xs">frontend/.env.local</code>)
        </li>
        <li>
          First time: <code className="font-label-code text-xs">pnpm db:push</code> and{" "}
          <code className="font-label-code text-xs">pnpm db:seed</code> in <code className="font-label-code text-xs">backend/</code>
        </li>
      </ul>
    </div>
  );
}