import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  FolderTree,
  LayoutDashboard,
  Package,
  ScrollText,
  Settings,
  ShoppingCart,
  Users,
} from 'lucide-react';

export type AdminNavItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  /** Shown in sidebar when route is not yet ported */
  phase?: 1 | 2;
};

/** All core admin routes are live on this app (phase 1). */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard', phase: 1 },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/orders', phase: 1 },
  { icon: Package, label: 'Products', href: '/admin/products', phase: 1 },
  { icon: FolderTree, label: 'Categories', href: '/admin/categories', phase: 1 },
  { icon: Users, label: 'Customers', href: '/admin/customers', phase: 1 },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics', phase: 1 },
  { icon: ScrollText, label: 'Audit log', href: '/admin/audit-logs', phase: 1 },
  { icon: Settings, label: 'Settings', href: '/admin/settings', phase: 1 },
];

export function isAdminNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
