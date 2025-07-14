import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary-foreground hover:bg-white/10 p-2"
        >
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-50 bg-background border shadow-lg">
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className="cursor-pointer hover:bg-muted"
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('te')}
          className="cursor-pointer hover:bg-muted"
        >
          తెలుగు
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}