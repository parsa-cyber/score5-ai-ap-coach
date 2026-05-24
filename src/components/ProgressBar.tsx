export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div>
      {label ? <div className="mb-2 flex justify-between text-sm font-medium"><span>{label}</span><span>{clamped}%</span></div> : null}
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
