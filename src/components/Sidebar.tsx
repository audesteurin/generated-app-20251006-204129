import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  Users,
  Truck,
  DollarSign,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthStore } from '@/store/authStore';
const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Box, label: 'Produits' },
  { to: '/sales', icon: ShoppingCart, label: 'Ventes' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/suppliers', icon: Truck, label: 'Fournisseurs' },
  { to: '/financials', icon: DollarSign, label: 'Finances' },
  { to: '/reports', icon: BarChart3, label: 'Rapports' },
  { to: '/settings', icon: Settings, label: 'Paramètres' },
];
const SidebarContent = () => {
  const logout = useAuthStore((state) => state.logout);
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-center border-b border-border px-4">
        <h1 className="text-2xl font-bold font-display text-primary">Nexus</h1>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                isActive && 'bg-primary/10 text-primary font-semibold'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto p-4">
        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
          Déconnexion
        </Button>
      </div>
    </div>
  );
};
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  if (isMobile) {
    return null; // The mobile sidebar is handled in the Header
  }
  return (
    <aside
      className={cn(
        'relative hidden h-screen flex-col border-r bg-muted/40 transition-all duration-300 ease-in-out md:flex',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center border-b px-6">
        <NavLink to="/dashboard" className="flex items-center gap-2 font-semibold">
          <Box className="h-6 w-6 text-primary" />
          <span className={cn('font-display text-xl', isCollapsed && 'hidden')}>Nexus</span>
        </NavLink>
      </div>
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-4 rounded-lg px-4 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground',
                isCollapsed && 'justify-center',
                isActive && 'bg-primary/10 text-primary font-semibold'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className={cn(isCollapsed && 'hidden')}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div
        className={cn(
          'absolute -right-3 top-16 transform transition-transform',
          isCollapsed && 'rotate-180'
        )}
      >
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
};
export const MobileSidebar = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon" className="md:hidden">
        <LayoutDashboard className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-64 p-0">
      <SidebarContent />
    </SheetContent>
  </Sheet>
);
export default Sidebar;