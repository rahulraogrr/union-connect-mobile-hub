import { Bell, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnionHeaderProps {
  title: string;
  showMenu?: boolean;
  showNotifications?: boolean;
  onMenuClick?: () => void;
  onLogout?: () => void;
}

export const UnionHeader = ({ 
  title, 
  showMenu = true, 
  showNotifications = true,
  onMenuClick,
  onLogout 
}: UnionHeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-primary to-secondary text-primary-foreground sticky top-0 z-50 shadow-union">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left side */}
        <div className="flex items-center space-x-3">
          {showMenu && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="text-primary-foreground hover:bg-white/10"
            >
              <Menu size={20} />
            </Button>
          )}
          <div>
            <h1 className="font-heading font-semibold text-lg">{title}</h1>
            <p className="text-xs text-primary-foreground/80">TEE 1104 Union</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {showNotifications && (
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-white/10 relative"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
          )}
          {onLogout && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-primary-foreground hover:bg-white/10"
            >
              <LogOut size={20} />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};