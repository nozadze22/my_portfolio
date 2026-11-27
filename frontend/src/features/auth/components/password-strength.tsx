"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { AuthFormPasswordField } from "./auth-form-field";

export function PasswordStrength({ password }: { password: string }) {
  const hasLength = password.length >= 8;
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);
  const hasUpper = /[A-Z]/.test(password);

  let score = 0;
  if (password.length > 0) score += 10;
  if (password.length >= 8) score += 35;
  if (hasSpecial) score += 25;
  if (hasUpper) score += 20;
  score = Math.min(100, score);

  const label =
    score === 0
      ? "Strength: pending"
      : score < 45
        ? "Strength: weak (min 8 chars)"
        : score < 80
          ? "Strength: moderate"
          : "Strength: strong";

  return (
    <div className="space-y-1.5 pt-1">
      <StrengthMeta score={score} label={label} width={score} />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-label-code text-label-code text-outline">
        <Rule met={hasLength} text="8+ characters" />
        <Rule met={hasSpecial} text="Special char" />
        <Rule met={hasUpper} text="Uppercase" />
      </div>
    </div>
  );
}

function Rule({ met, text }: { met: boolean; text: string }) {
  return (
    <span className={`flex items-center gap-1 ${met ? "font-semibold text-primary" : ""}`}>
      <MaterialSymbol name={met ? "check_circle" : "radio_button_unchecked"} className="text-xs" />
      {text}
    </span>
  );
}

function StrengthMeta({ score, label, width }: { score: number; label: string; width: number }) {
  const barColor =
    score === 0
      ? "bg-outline"
      : score < 45
        ? "bg-error"
        : score < 80
          ? "bg-amber-500"
          : "bg-primary";

  const labelClass =
    score === 0
      ? "text-outline"
      : score < 45
        ? "text-error"
        : score < 80
          ? "text-amber-600"
          : "text-primary font-semibold";

  return (
    <>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
        <div className={`h-full transition-all duration-300 ${barColor}`} style={{ width: `${width}%` }} />
      </div>
      <span className={`font-label-code text-label-code ${labelClass}`}>{label}</span>
    </>
  );
}

/** @deprecated Use AuthFormPasswordField with useForm */
export function PasswordStrengthInput<T extends FieldValues>({
  control,
  name = "password" as FieldPath<T>,
}: {
  control: Control<T>;
  name?: FieldPath<T>;
}) {
  return <AuthFormPasswordField control={control} name={name} labelAside="Min. 8 characters" />;
}