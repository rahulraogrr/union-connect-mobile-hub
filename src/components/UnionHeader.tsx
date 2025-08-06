import { Bell, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

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
  const { t } = useTranslation();
  return (
    <header className="bg-gradient-to-r from-primary to-secondary text-primary-foreground sticky top-0 z-50 shadow-union">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left side */}
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/09196c45-5ecd-44e8-8d21-50dc215f80dd.png" 
            alt="TEE 1104 Union Logo" 
            className="h-10 w-10 rounded-full bg-white/10 p-1"
          />
          <div>
            <h1 className="font-heading font-semibold text-lg">TEE 1104 Union</h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {onLogout && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-primary-foreground hover:bg-white/10"
              title={t('nav.logout')}
            >
              <LogOut size={20} />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};