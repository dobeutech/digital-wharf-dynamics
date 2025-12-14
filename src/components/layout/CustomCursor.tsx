import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useSettings } from "@/contexts/SettingsContext";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings.customCursorEnabled) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      setIsPointer(
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") !== null ||
        target.closest("button") !== null
      );
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, [settings.customCursorEnabled]);

  if (!settings.customCursorEnabled) {
    return null;
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-primary rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 border-primary rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
      />
    </>
  );
}
