import { ReactNode } from "react";
import { AdminSidebar } from "@/components/navigation/AdminSidebar";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AdminLayout({ children, className }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen pt-16">
      <AdminSidebar className="hidden lg:block fixed left-0 top-16 bottom-0 overflow-y-auto" />
      <div className="flex-1 lg:ml-64">
        <div className={cn("min-h-screen pt-8 pb-20 px-4", className)}>
          <div className="container mx-auto max-w-7xl">
            <div className="mb-6">
              <Breadcrumbs />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
