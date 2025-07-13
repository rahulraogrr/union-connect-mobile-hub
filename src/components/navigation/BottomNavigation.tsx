import { Home, MessageSquare, Bell, User, TicketIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  icon: any;
  label: string;
  path: string;
  id: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/", id: "home" },
  { icon: TicketIcon, label: "Tickets", path: "/tickets", id: "tickets" },
  { icon: Bell, label: "News", path: "/announcements", id: "announcements" },
  { icon: MessageSquare, label: "Connect", path: "/connect", id: "connect" },
  { icon: User, label: "Profile", path: "/profile", id: "profile" },
];

interface BottomNavigationProps {
  activeTab?: string;
}

export const BottomNavigation = ({ activeTab }: BottomNavigationProps) => {
  const location = useLocation();
  
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
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};