import { MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSettings } from "@/contexts/SettingsContext";
import { cn } from "@/lib/utils";

export function CursorToggle() {
  const { settings, toggleCustomCursor } = useSettings();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "min-h-[44px] min-w-[44px] rounded-full hover:bg-primary/10",
            !settings.customCursorEnabled && "text-muted-foreground"
          )}
          onClick={toggleCustomCursor}
          aria-label={settings.customCursorEnabled ? "Disable custom cursor" : "Enable custom cursor"}
        >
          <MousePointer2 className={cn(
            "h-4 w-4 transition-opacity",
            !settings.customCursorEnabled && "opacity-50"
          )} />
          <span className="sr-only">
            {settings.customCursorEnabled ? "Disable custom cursor" : "Enable custom cursor"}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{settings.customCursorEnabled ? "Disable custom cursor" : "Enable custom cursor"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
