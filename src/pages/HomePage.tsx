import { UnionLayout } from "@/components/UnionLayout";
import { UnionHeader } from "@/components/UnionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketIcon, Bell, Users, Calendar, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface HomePageProps {
  onLogout?: () => void;
}

export default function HomePage({ onLogout }: HomePageProps) {
  return (
    <UnionLayout activeTab="home" onLogout={onLogout}>
      <UnionHeader title="Welcome Back" onLogout={onLogout} />
      
      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <section>
          <h2 className="font-heading font-semibold text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/tickets/new">
              <Card className="bg-gradient-primary text-primary-foreground shadow-card hover:shadow-union transition-all duration-300">
                <CardContent className="flex flex-col items-center justify-center p-4 space-y-2">
                  <TicketIcon size={24} />
                  <span className="font-medium">Create Ticket</span>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/payments">
              <Card className="bg-gradient-union text-primary-foreground shadow-card hover:shadow-union transition-all duration-300">
                <CardContent className="flex flex-col items-center justify-center p-4 space-y-2">
                  <TrendingUp size={24} />
                  <span className="font-medium">Payments</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-lg">Recent Activity</h2>
            <Link to="/tickets">
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
                    <h3 className="font-medium text-sm">Ticket #1234 - Workplace Safety</h3>
                    <p className="text-muted-foreground text-xs mt-1">Status: Under Review</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2 days ago</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">New Union Agreement Update</h3>
                    <p className="text-muted-foreground text-xs mt-1">Important changes to benefits</p>
                  </div>
                  <span className="text-xs text-muted-foreground">1 week ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Union Stats */}
        <section>
          <h2 className="font-heading font-semibold text-lg mb-4">Union Overview</h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="shadow-card">
              <CardContent className="p-3 text-center">
                <Users className="mx-auto mb-2 text-primary" size={20} />
                <p className="text-2xl font-bold text-primary">1,247</p>
                <p className="text-xs text-muted-foreground">Members</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-3 text-center">
                <TicketIcon className="mx-auto mb-2 text-accent" size={20} />
                <p className="text-2xl font-bold text-accent">43</p>
                <p className="text-xs text-muted-foreground">Open Tickets</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-3 text-center">
                <TrendingUp className="mx-auto mb-2 text-secondary" size={20} />
                <p className="text-2xl font-bold text-secondary">92%</p>
                <p className="text-xs text-muted-foreground">Resolution Rate</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </UnionLayout>
  );
}