import { ReactNode } from "react";
import { useDeviceType } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResponsiveTableProps {
  children: ReactNode;
  mobileView?: ReactNode;
  breakpoint?: "md" | "lg";
}

/**
 * Wrapper component that shows table on desktop and cards on mobile
 */
export function ResponsiveTable({
  children,
  mobileView,
  breakpoint = "md",
}: ResponsiveTableProps) {
  const deviceType = useDeviceType();
  const isMobile = deviceType === "mobile";

  if (isMobile && mobileView) {
    return <div className="space-y-4">{mobileView}</div>;
  }

  return (
    <div
      className={`${breakpoint === "md" ? "hidden md:block" : "hidden lg:block"}`}
    >
      {children}
    </div>
  );
}

interface MobileCardViewProps<T> {
  items: T[];
  renderCard: (item: T, index: number) => ReactNode;
  emptyMessage?: string;
}

/**
 * Mobile card view for table data
 */
export function MobileCardView<T>({
  items,
  renderCard,
  emptyMessage = "No items found",
}: MobileCardViewProps<T>) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:hidden">
      {items.map((item, index) => (
        <div key={index}>{renderCard(item, index)}</div>
      ))}
    </div>
  );
}
