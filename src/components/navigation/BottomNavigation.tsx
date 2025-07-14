import { Home, MessageSquare, Bell, User, TicketIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';

interface NavItem {
  icon: any;
  labelKey: string;
  path: string;
  id: string;
}

const navItems: NavItem[] = [
  { icon: Home, labelKey: "nav.home", path: "/", id: "home" },
  { icon: TicketIcon, labelKey: "nav.tickets", path: "/tickets", id: "tickets" },
  { icon: Bell, labelKey: "nav.announcements", path: "/announcements", id: "announcements" },
  { icon: MessageSquare, labelKey: "nav.connect", path: "/connect", id: "connect" },
  { icon: User, labelKey: "nav.profile", path: "/profile", id: "profile" },
];

interface BottomNavigationProps {
  activeTab?: string;
}

export const BottomNavigation = ({ activeTab }: BottomNavigationProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  
  const getIsActive = (item: NavItem) => {
    if (activeTab) return activeTab === item.id;
    return location.pathname === item.path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = getIsActive(item);
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon size={20} className={cn(
                "transition-all duration-200",
                isActive && "scale-110"
              )} />
              <span className="text-xs font-medium">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};