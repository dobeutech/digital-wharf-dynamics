import {
  Home,
  Briefcase,
  DollarSign,
  Info,
  Mail,
  Newspaper,
  LayoutDashboard,
  FolderOpen,
  ShoppingBag,
  FileText,
  Package,
  Users,
  Shield,
  MessageSquare,
  ClipboardList,
  BarChart3,
  Settings,
  LucideIcon
} from "lucide-react";

export interface NavigationItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
  badge?: string | number;
  children?: NavigationItem[];
  requiredAuth?: boolean;
  requiredAdmin?: boolean;
  showInMobile?: boolean;
}

export interface NavigationCategory {
  label: string;
  items: NavigationItem[];
}

export const publicNavigation: NavigationItem[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    showInMobile: true,
  },
  {
    label: "Services",
    href: "/services",
    icon: Briefcase,
    description: "Explore our digital solutions",
    showInMobile: true,
  },
  {
    label: "Pricing",
    href: "/pricing",
    icon: DollarSign,
    description: "Transparent pricing plans",
    showInMobile: true,
  },
  {
    label: "About",
    href: "/about",
    icon: Info,
    description: "Learn about our team",
    showInMobile: true,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: Mail,
    description: "Get in touch with us",
    showInMobile: true,
  },
  {
    label: "News",
    href: "/news",
    icon: Newspaper,
    description: "Latest updates and articles",
    showInMobile: true,
  },
];

export const authenticatedNavigationCategories: NavigationCategory[] = [
  {
    label: "Dashboard",
    items: [
      {
        label: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Your dashboard home",
        showInMobile: true,
      },
      {
        label: "Projects",
        href: "/dashboard/projects",
        icon: FolderOpen,
        description: "Manage your projects",
        showInMobile: true,
      },
      {
        label: "Shop",
        href: "/dashboard/shop",
        icon: ShoppingBag,
        description: "Browse available services",
        showInMobile: true,
      },
      {
        label: "Files",
        href: "/dashboard/files",
        icon: FileText,
        description: "Access your files",
        showInMobile: true,
      },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        label: "Newsletter",
        href: "/newsletter",
        icon: Newspaper,
        description: "Read our newsletter",
        showInMobile: true,
      },
      {
        label: "Brand Kit",
        href: "/brand",
        icon: Package,
        description: "Brand assets and guidelines",
        showInMobile: true,
      },
    ],
  },
];

export const adminNavigationCategories: NavigationCategory[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        description: "Admin overview",
        showInMobile: true,
      },
      {
        label: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
        description: "View analytics",
        showInMobile: true,
      },
    ],
  },
  {
    label: "Content Management",
    items: [
      {
        label: "Services",
        href: "/admin/services",
        icon: Briefcase,
        description: "Manage services",
        showInMobile: true,
      },
      {
        label: "Projects",
        href: "/admin/projects",
        icon: FolderOpen,
        description: "Manage projects",
        showInMobile: true,
      },
      {
        label: "Newsletter",
        href: "/admin/newsletter",
        icon: Newspaper,
        description: "Manage newsletter posts",
        showInMobile: true,
      },
    ],
  },
  {
    label: "User Management",
    items: [
      {
        label: "Users",
        href: "/admin/users",
        icon: Users,
        description: "Manage users",
        showInMobile: true,
      },
      {
        label: "Contacts",
        href: "/admin/contacts",
        icon: MessageSquare,
        description: "View contact submissions",
        showInMobile: true,
      },
    ],
  },
  {
    label: "Compliance & Security",
    items: [
      {
        label: "CCPA Requests",
        href: "/admin/ccpa",
        icon: Shield,
        description: "Manage CCPA requests",
        showInMobile: true,
      },
      {
        label: "Audit Logs",
        href: "/admin/audit-logs",
        icon: ClipboardList,
        description: "View audit logs",
        showInMobile: true,
      },
    ],
  },
];

export const footerNavigation = {
  services: [
    { label: "Website Development", href: "/services#website" },
    { label: "Software Solutions", href: "/services#software" },
    { label: "Consulting", href: "/services#consulting" },
    { label: "Learning & Training", href: "/services#learning" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
    { label: "Brand Kit", href: "/brand" },
  ],
  connect: [
    {
      label: "Hire on Contra",
      href: "https://contra.com/jeremy_williams_fx413nca?referralExperimentNid=DEFAULT_REFERRAL_PROGRAM&referrerUsername=jeremy_williams_fx413nca",
      external: true,
    },
    {
      label: "View on Behance",
      href: "https://www.behance.net/jeremywilliams62",
      external: true,
    },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Do Not Sell My Data", href: "/ccpa-optout" },
  ],
};

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ label: "Home", href: "/" }];
  }

  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    projects: "Projects",
    shop: "Shop",
    files: "Files",
    admin: "Admin",
    services: "Services",
    users: "Users",
    newsletter: "Newsletter",
    ccpa: "CCPA Requests",
    "audit-logs": "Audit Logs",
    contacts: "Contacts",
    analytics: "Analytics",
    about: "About",
    contact: "Contact",
    pricing: "Pricing",
    news: "News",
    brand: "Brand Kit",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    "ccpa-optout": "CCPA Opt-Out",
    auth: "Sign In",
    "reset-password": "Reset Password",
    "verify-email": "Verify Email",
  };

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    breadcrumbs.push({
      label: labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href: isLast ? undefined : currentPath,
    });
  });

  return breadcrumbs;
};
