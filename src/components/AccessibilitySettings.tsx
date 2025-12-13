import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Accessibility, Eye, Type, Volume2, MousePointer } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  textSize: number;
  focusIndicator: boolean;
  screenReaderOptimized: boolean;
}

const defaultPreferences: AccessibilityPreferences = {
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  textSize: 100,
  focusIndicator: true,
  screenReaderOptimized: false,
};

export function AccessibilitySettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(defaultPreferences);
  const { t } = useLanguage();

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("accessibility-preferences");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (e) {
        console.error("Failed to parse accessibility preferences", e);
      }
    }

    // Check system preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPreferences(prev => ({ ...prev, reducedMotion: true }));
    }
    if (window.matchMedia("(prefers-contrast: more)").matches) {
      setPreferences(prev => ({ ...prev, highContrast: true }));
    }
  }, []);

  // Apply preferences to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Reduced motion
    if (preferences.reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    // High contrast
    if (preferences.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Large text / text size
    if (preferences.largeText) {
      root.style.fontSize = "120%";
    } else {
      root.style.fontSize = `${preferences.textSize}%`;
    }

    // Enhanced focus indicator
    if (preferences.focusIndicator) {
      root.classList.add("enhanced-focus");
    } else {
      root.classList.remove("enhanced-focus");
    }

    // Save to localStorage
    localStorage.setItem("accessibility-preferences", JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem("accessibility-preferences");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="min-h-[44px] min-w-[44px] rounded-full hover:bg-primary/10"
          aria-label={t("a11y.settings")}
          title={t("a11y.settings")}
        >
          <Accessibility className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            {t("a11y.settings")}
          </DialogTitle>
          <DialogDescription>
            Customize your viewing experience. These settings are saved to your device.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduced-motion" className="flex items-center gap-2">
                <MousePointer className="h-4 w-4" />
                Reduce Motion
              </Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
            <Switch
              id="reduced-motion"
              checked={preferences.reducedMotion}
              onCheckedChange={(checked) => updatePreference("reducedMotion", checked)}
            />
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="high-contrast" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                High Contrast
              </Label>
              <p className="text-sm text-muted-foreground">
                Increase color contrast for better visibility
              </p>
            </div>
            <Switch
              id="high-contrast"
              checked={preferences.highContrast}
              onCheckedChange={(checked) => updatePreference("highContrast", checked)}
            />
          </div>

          {/* Large Text */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="large-text" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Large Text
              </Label>
              <p className="text-sm text-muted-foreground">
                Increase base font size to 120%
              </p>
            </div>
            <Switch
              id="large-text"
              checked={preferences.largeText}
              onCheckedChange={(checked) => updatePreference("largeText", checked)}
            />
          </div>

          {/* Text Size Slider */}
          {!preferences.largeText && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Custom Text Size: {preferences.textSize}%
              </Label>
              <Slider
                value={[preferences.textSize]}
                onValueChange={(value) => updatePreference("textSize", value[0])}
                min={80}
                max={150}
                step={5}
                className="w-full"
                aria-label="Text size percentage"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Smaller</span>
                <span>Default</span>
                <span>Larger</span>
              </div>
            </div>
          )}

          {/* Enhanced Focus Indicator */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="focus-indicator" className="flex items-center gap-2">
                <MousePointer className="h-4 w-4" />
                Enhanced Focus Ring
              </Label>
              <p className="text-sm text-muted-foreground">
                Show more visible focus indicators
              </p>
            </div>
            <Switch
              id="focus-indicator"
              checked={preferences.focusIndicator}
              onCheckedChange={(checked) => updatePreference("focusIndicator", checked)}
            />
          </div>

          {/* Screen Reader Optimized */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sr-optimized" className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Screen Reader Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Optimize for screen reader navigation
              </p>
            </div>
            <Switch
              id="sr-optimized"
              checked={preferences.screenReaderOptimized}
              onCheckedChange={(checked) => updatePreference("screenReaderOptimized", checked)}
            />
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={resetPreferences}>
            Reset to Defaults
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
