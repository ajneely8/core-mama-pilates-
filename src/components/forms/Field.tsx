import { cn } from "cn";
import { Label } from "@/components/ui/label";

/** Shared input styling: taller, calmer fields than the shadcn default. */
export const fieldInputClass =
  "h-12 rounded-md border-input bg-ivory px-4 text-base text-espresso placeholder:text-espresso/40 focus-visible:border-espresso focus-visible:ring-espresso/15 md:text-[15px]";

export const fieldTextareaClass =
  "min-h-32 rounded-md border-input bg-ivory px-4 py-3 text-base text-espresso placeholder:text-espresso/40 focus-visible:border-espresso focus-visible:ring-espresso/15 md:text-[15px]";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  optional,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("group/field flex flex-col gap-2", className)}>
      <Label htmlFor={htmlFor} className="justify-between text-[13px] font-medium text-espresso/85">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-espresso/50">Optional</span>}
      </Label>
      {children}
      {error ? (
        <p role="alert" className="font-sans text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="font-sans text-xs text-espresso/55">{hint}</p>
      ) : null}
    </div>
  );
}

/** Honeypot: invisible to people, tempting to bots. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

export function ModeNote({ mode, children }: { mode: "demo" | "live"; children?: React.ReactNode }) {
  return (
    <p className="mt-4 inline-flex max-w-prose items-start gap-2 rounded-md border border-espresso/12 bg-cream px-3 py-2 font-sans text-xs leading-relaxed text-espresso/70">
      <span
        className={cn(
          "mt-[5px] inline-block size-1.5 shrink-0 rounded-full",
          mode === "demo" ? "bg-rose-deep" : "bg-olive",
        )}
      />
      <span>
        <strong className="font-semibold text-espresso/85">{mode === "demo" ? "Demo mode." : "Live."}</strong>{" "}
        {children}
      </span>
    </p>
  );
}
