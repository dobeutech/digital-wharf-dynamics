import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";

interface ColorSwatchProps {
  name: string;
  hex: string;
  color: string;
}

export function ColorSwatch({ name, hex, color }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden">
      <div className={`h-32 w-full ${color}`} />
      <div className="p-4 space-y-2">
        <h4 className="font-semibold">{name}</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(hex)}
          className="w-full"
        >
          {copied ? <Check className="h-4 w-4 mr-2" /> : null}
          {hex}
        </Button>
      </div>
    </Card>
  );
}
