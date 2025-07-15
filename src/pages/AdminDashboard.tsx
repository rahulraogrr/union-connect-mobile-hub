import { UnionLayout } from "@/components/UnionLayout";
import { UnionHeader } from "@/components/UnionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TicketIcon, 
  Bell, 
  Users, 
  Calendar, 
  TrendingUp, 
  CheckSquare, 
  UserCheck, 
  FileText, 
  Settings,
  PlusCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useUser } from '@/contexts/UserContext';

interface AdminDashboardProps {
  onLogout?: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { t } = useTranslation();
  const { user, getHighestRole, hasAnyRole } = useUser();
  
  const getRoleDisplayName = () => {
    const highestRole = getHighestRole();
    switch (highestRole) {
      case 'manager': return 'Manager';
      case 'director': return 'Director';
      case 'managing_director': return 'Managing Director';
      case 'super': return 'Super Admin';
      default: return 'Admin';
    }
  };

  const canApproveTickets = hasAnyRole(['manager', 'director', 'managing_director', 'super']);
  const canCreateNews = hasAnyRole(['director', 'managing_director', 'super']);
  const canManageUsers = hasAnyRole(['managing_director', 'super']);
  const canAccessSettings = hasAnyRole(['super']);
  
  return (
    <UnionLayout activeTab="home" onLogout={onLogout}>
      <UnionHeader 
        title={`${getRoleDisplayName()} Dashboard`} 
        onLogout={onLogout} 
        showNotifications={true}
      />
      
      <div className="p-4 space-y-6">
        {/* Role Badge */}
        <div className="flex justify-center">
          <div className="flex flex-wrap gap-2 justify-center">
            {user?.roles.map((role) => (
              <Badge key={role} variant="secondary" className="px-3 py-1">
                {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            ))}
          </div>
        </div>

        {/* Admin Quick Actions */}
        <section>
          <h2 className="font-heading font-semibold text-lg mb-4">Admin Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {canApproveTickets && (
              <Link to="/admin/ticket-approvals">
                <Card className="bg-gradient-primary text-primary-foreground shadow-card hover:shadow-union transition-all duration-300">
                  <CardContent className="flex flex-col items-center justify-center p-4 space-y-2">
                    <CheckSquare size={24} />
                    <span className="font-medium">Approve Tickets</span>
                    <p className="text-xs text-center opacity-90">Review and approve pending tickets</p>
                  </CardContent>
                </Card>
              </Link>
            )}
            
            {canCreateNews && (
              <Link to="/admin/create-news">
                <Card className="bg-gradient-union text-primary-foreground shadow-card hover:shadow-union transition-all duration-300">
                  <CardContent className="flex flex-col items-center justify-center p-4 space-y-2">
                    <PlusCircle size={24} />
                    <span className="font-medium">Create News</span>
                    <p className="text-xs text-center opacity-90">Post news and events</p>
                  </CardContent>
                </Card>
              </Link>
            )}

            {canManageUsers && (
              <Link to="/admin/user-management">
                <Card className="bg-gradient-secondary text-primary-foreground shadow-card hover:shadow-union transition-all duration-300">
                  <CardContent className="flex flex-col items-center justify-center p-4 space-y-2">
                    <UserCheck size={24} />
                    <span className="font-medium">Manage Users</span>
                    <p className="text-xs text-center opacity-90">User roles and permissions</p>
                  </CardContent>
                </Card>
              </Link>
            )}

            {canAccessSettings && (
              <Link to="/admin/settings">
                <Card className="bg-gradient-accent text-primary-foreground shadow-card hover:shadow-union transition-all duration-300">
                  <CardContent className="flex flex-col items-center justify-center p-4 space-y-2">
                    <Settings size={24} />
                    <span className="font-medium">Settings</span>
                    <p className="text-xs text-center opacity-90">System configuration</p>
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>
        </section>

        {/* Regular Quick Actions */}
        <section>
          <h2 className="font-heading font-semibold text-lg mb-4">{t('home.quickActions')}</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/tickets/new">
              <Card className="shadow-card hover:shadow-union transition-all duration-300">
                <CardContent className="flex flex-col items-center justify-center p-4 space-y-2">
                  <TicketIcon size={24} className="text-primary" />
                  <span className="font-medium">{t('home.createTicket')}</span>
                  <p className="text-xs text-center text-muted-foreground">{t('home.createTicketDesc')}</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/payments">
              <Card className="shadow-card hover:shadow-union transition-all duration-300">
                <CardContent className="flex flex-col items-center justify-center p-4 space-y-2">
                  <TrendingUp size={24} className="text-primary" />
                  <span className="font-medium">{t('home.viewPayments')}</span>
                  <p className="text-xs text-center text-muted-foreground">{t('home.viewPaymentsDesc')}</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Pending Approvals (for managers and above) */}
        {canApproveTickets && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg">Pending Approvals</h2>
              <Link to="/admin/ticket-approvals">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              <Card className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">Ticket #1256 - Overtime Pay Request</h3>
                      <p className="text-muted-foreground text-xs mt-1">From: John Doe • Priority: High</p>
                    </div>
                    <Badge variant="outline" className="text-xs">Pending</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">Ticket #1257 - Schedule Change</h3>
                      <p className="text-muted-foreground text-xs mt-1">From: Jane Smith • Priority: Medium</p>
                    </div>
                    <Badge variant="outline" className="text-xs">Pending</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Union Stats */}
        <section>
          <h2 className="font-heading font-semibold text-lg mb-4">{t('home.unionOverview')}</h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="shadow-card">
              <CardContent className="p-3 text-center">
                <Users className="mx-auto mb-2 text-primary" size={20} />
                <p className="text-2xl font-bold text-primary">1,247</p>
                <p className="text-xs text-muted-foreground">{t('home.activeMembers')}</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-3 text-center">
                <TicketIcon className="mx-auto mb-2 text-accent" size={20} />
                <p className="text-2xl font-bold text-accent">43</p>
                <p className="text-xs text-muted-foreground">{t('home.pendingTickets')}</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-3 text-center">
                <CheckSquare className="mx-auto mb-2 text-secondary" size={20} />
                <p className="text-2xl font-bold text-secondary">12</p>
                <p className="text-xs text-muted-foreground">Awaiting Approval</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </UnionLayout>
  );
}