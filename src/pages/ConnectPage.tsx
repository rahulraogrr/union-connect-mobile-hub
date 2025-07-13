import { UnionLayout } from "@/components/UnionLayout";
import { UnionHeader } from "@/components/UnionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Users, MessageCircle, Phone, Mail, MapPin } from "lucide-react";

const unionContacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Union President",
    department: "Administration", 
    email: "sarah.johnson@tee1104.org",
    phone: "+1 (555) 123-4567",
    location: "Building A, Room 101",
    avatar: "SJ",
    status: "online"
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    role: "Safety Representative",
    department: "Safety Committee",
    email: "mike.rodriguez@tee1104.org", 
    phone: "+1 (555) 234-5678",
    location: "Building B, Room 205",
    avatar: "MR",
    status: "away"
  },
  {
    id: 3,
    name: "Emily Chen",
    role: "Benefits Coordinator",
    department: "Member Services",
    email: "emily.chen@tee1104.org",
    phone: "+1 (555) 345-6789",
    location: "Building A, Room 150", 
    avatar: "EC",
    status: "online"
  }
];

const memberGroups = [
  {
    id: 1,
    name: "Safety Committee",
    members: 24,
    description: "Workplace safety discussions and initiatives",
    category: "Committee"
  },
  {
    id: 2,
    name: "New Member Welcome",
    members: 156,
    description: "Support and guidance for new union members",
    category: "Support"
  },
  {
    id: 3,
    name: "Benefits & Healthcare",
    members: 89,
    description: "Discussions about member benefits and healthcare",
    category: "Benefits"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "online": return "bg-green-500";
    case "away": return "bg-yellow-500";
    case "offline": return "bg-gray-400";
    default: return "bg-gray-400";
  }
};

export default function ConnectPage() {
  return (
    <UnionLayout activeTab="connect">
      <UnionHeader title="Connect" />
      
      <div className="p-4 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input 
            placeholder="Search members and groups..." 
            className="pl-10"
          />
        </div>

        {/* Union Leadership */}
        <section>
          <h2 className="font-heading font-semibold text-lg mb-4">Union Leadership</h2>
          <div className="space-y-3">
            {unionContacts.map((contact) => (
              <Card key={contact.id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                          {contact.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(contact.status)}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">{contact.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {contact.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{contact.department}</p>
                      
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail size={12} />
                          <span>{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone size={12} />
                          <span>{contact.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin size={12} />
                          <span>{contact.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                        <MessageCircle size={14} />
                      </Button>
                      <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                        <Phone size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Member Groups */}
        <section>
          <h2 className="font-heading font-semibold text-lg mb-4">Member Groups</h2>
          <div className="space-y-3">
            {memberGroups.map((group) => (
              <Card key={group.id} className="shadow-card hover:shadow-union transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm">{group.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {group.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{group.description}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users size={12} />
                        <span>{group.members} members</span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Contact */}
        <Card className="bg-gradient-union text-primary-foreground shadow-union">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone size={20} />
              Emergency Union Hotline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-primary-foreground/90 mb-3">
              For urgent union matters outside office hours
            </p>
            <Button variant="secondary" className="w-full">
              Call (555) UNION-1104
            </Button>
          </CardContent>
        </Card>
      </div>
    </UnionLayout>
  );
}