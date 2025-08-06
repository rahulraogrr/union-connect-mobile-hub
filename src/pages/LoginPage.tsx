import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import { useUser, UserRole } from '@/contexts/UserContext';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { setUser } = useUser();

  // Predefined user accounts with roles
  const predefinedUsers = {
    user: { password: "user", role: "user" as UserRole, name: "Regular User" },
    manager: { password: "manager", role: "manager" as UserRole, name: "Department Manager" },
    director: { password: "director", role: "director" as UserRole, name: "Company Director" },
    managing_director: { password: "managing_director", role: "managing_director" as UserRole, name: "Managing Director" },
    super: { password: "super", role: "super" as UserRole, name: "Super Administrator" },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: t('common.error'),
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    // Check if user exists and password matches
    const userAccount = predefinedUsers[username as keyof typeof predefinedUsers];
    if (!userAccount || userAccount.password !== password) {
      toast({
        title: t('common.error'),
        description: "Invalid username or password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Create user with assigned role
      const user = {
        id: Date.now().toString(),
        username,
        roles: [userAccount.role], // Single role based on username
        name: userAccount.name,
      };
      
      setUser(user);
      
      toast({
        title: t('common.success'),
        description: `Welcome to TEE 1104 Union, ${user.name}!`,
      });
      onLogin();
    }, 1000);
  };


  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-heading text-primary">{t('login.title')}</CardTitle>
          <CardDescription>{t('login.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t('login.username')}</Label>
              <Input
                id="username"
                type="text"
                placeholder={t('login.username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('login.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('login.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? t('common.loading') : t('login.loginButton')}
            </Button>
          </form>
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground text-center mb-2">
              <strong>Demo Accounts:</strong>
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• user / user (Regular User)</div>
              <div>• manager / manager (Manager)</div>
              <div>• director / director (Director)</div>
              <div>• managing_director / managing_director (MD)</div>
              <div>• super / super (Super Admin)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}