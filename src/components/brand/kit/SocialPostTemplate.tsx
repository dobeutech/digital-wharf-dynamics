import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialPostTemplateProps {
  platform: string;
  dimensions: string;
  preview: React.ReactNode;
}

export function SocialPostTemplate({ platform, dimensions, preview }: SocialPostTemplateProps) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-muted p-8 flex items-center justify-center min-h-[300px]">
        {preview}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold">{platform}</h4>
            <p className="text-sm text-muted-foreground">{dimensions}</p>
          </div>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </Card>
  );
}
