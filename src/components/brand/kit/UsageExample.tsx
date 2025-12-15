import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface UsageExampleProps {
  title: string;
  dos: string[];
  donts: string[];
}

export function UsageExample({ title, dos, donts }: UsageExampleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
            <Check className="h-5 w-5" />
            Do
          </h4>
          <ul className="space-y-2">
            {dos.map((item, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
            <X className="h-5 w-5" />
            Don't
          </h4>
          <ul className="space-y-2">
            {donts.map((item, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
