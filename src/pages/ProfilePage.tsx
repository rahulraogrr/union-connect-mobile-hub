import { UnionLayout } from "@/components/UnionLayout";
import { UnionHeader } from "@/components/UnionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Settings, 
  LogOut, 
  Shield,
  FileText,
  CreditCard,
  Bell
} from "lucide-react";

const userProfile = {
  name: "John Smith",
  memberId: "TEE-1104-5678",
  email: "john.smith@company.com",
  phone: "+1 (555) 987-6543",
  department: "Manufacturing",
  position: "Senior Technician",
  joinDate: "March 15, 2019",
  membershipStatus: "Active",
  location: "Building C, Floor 2"
};

const membershipStats = [
  { label: "Years of Service", value: "5", icon: Calendar },
  { label: "Tickets Raised", value: "12", icon: FileText },
  { label: "Dues Paid", value: "Current", icon: CreditCard },
  { label: "Member Level", value: "Senior", icon: Shield }
];

interface ProfilePageProps {
  onLogout?: () => void;
}

export default function ProfilePage({ onLogout }: ProfilePageProps) {
  return (
    <UnionLayout activeTab="profile" onLogout={onLogout}>
      <UnionHeader title="My Profile" onLogout={onLogout} />
      
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                  JS
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="font-heading font-bold text-xl">{userProfile.name}</h2>
                <p className="text-muted-foreground">{userProfile.position}</p>
                <p className="text-sm text-muted-foreground">{userProfile.department}</p>
                
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-green-100 text-green-800">
                    {userProfile.membershipStatus}
                  </Badge>
                  <Badge variant="outline">
                    ID: {userProfile.memberId}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User size={20} />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-muted-foreground" />
              <span className="text-sm">{userProfile.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-muted-foreground" />
              <span className="text-sm">{userProfile.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-muted-foreground" />
              <span className="text-sm">{userProfile.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-muted-foreground" />
              <span className="text-sm">Member since {userProfile.joinDate}</span>
            </div>
          </CardContent>
        </Card>

        {/* Membership Stats */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Membership Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {membershipStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center p-3 bg-muted/30 rounded-lg">
                    <Icon className="mx-auto mb-2 text-primary" size={20} />
                    <p className="font-bold text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Settings size={16} className="mr-3" />
              Edit Profile
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Bell size={16} className="mr-3" />
              Notification Settings
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Shield size={16} className="mr-3" />
              Privacy & Security
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <FileText size={16} className="mr-3" />
              Download Membership Card
            </Button>
          </CardContent>
        </Card>

        {/* Union Benefits */}
        <Card className="bg-gradient-union text-primary-foreground shadow-union">
          <CardHeader>
            <CardTitle className="text-lg">Your Union Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Healthcare Coverage</span>
                <Badge className="bg-white/20 text-primary-foreground">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Dental Insurance</span>
                <Badge className="bg-white/20 text-primary-foreground">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Legal Protection</span>
                <Badge className="bg-white/20 text-primary-foreground">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Retirement Plan</span>
                <Badge className="bg-white/20 text-primary-foreground">Active</Badge>
              </div>
            </div>
            
            <Button variant="secondary" className="w-full mt-4">
              View Full Benefits Package
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button variant="destructive" className="w-full" size="lg" onClick={onLogout}>
          <LogOut size={16} className="mr-3" />
          Sign Out
        </Button>
      </div>
    </UnionLayout>
  );
}