import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const requirements = useMemo<PasswordRequirement[]>(() => {
    return [
      {
        label: "At least 8 characters",
        met: password.length >= 8,
      },
      {
        label: "One uppercase letter",
        met: /[A-Z]/.test(password),
      },
      {
        label: "One lowercase letter",
        met: /[a-z]/.test(password),
      },
      {
        label: "One number",
        met: /[0-9]/.test(password),
      },
    ];
  }, [password]);

  const strength = useMemo(() => {
    const metCount = requirements.filter((r) => r.met).length;
    return (metCount / requirements.length) * 100;
  }, [requirements]);

  const strengthLabel = useMemo(() => {
    if (strength === 0) return "";
    if (strength < 50) return "Weak";
    if (strength < 75) return "Fair";
    if (strength < 100) return "Good";
    return "Strong";
  }, [strength]);

  const strengthColor = useMemo(() => {
    if (strength < 50) return "bg-destructive";
    if (strength < 75) return "bg-yellow-500";
    if (strength < 100) return "bg-blue-500";
    return "bg-green-500";
  }, [strength]);

  const strengthTextColor = useMemo(() => {
    if (strength < 50) return "text-destructive";
    if (strength < 75) return "text-yellow-500";
    if (strength < 100) return "text-blue-500";
    return "text-green-500";
  }, [strength]);

  if (!password) return null;

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password strength</span>
          {strengthLabel && (
            <span className={`font-medium ${strengthTextColor}`}>
              {strengthLabel}
            </span>
          )}
        </div>
        <Progress value={strength} className="h-1.5" indicatorClassName={strengthColor} />
      </div>

      <div className="space-y-1.5">
        {requirements.map((req, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-xs"
          >
            {req.met ? (
              <Check className="h-3.5 w-3.5 text-green-500 shrink-0" aria-hidden="true" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
            )}
            <span className={req.met ? "text-foreground" : "text-muted-foreground"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
