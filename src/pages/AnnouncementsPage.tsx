import { UnionLayout } from "@/components/UnionLayout";
import { UnionHeader } from "@/components/UnionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";

const mockAnnouncements = [
  {
    id: 1,
    title: "New Union Agreement Signed",
    content: "We're pleased to announce that a new collective bargaining agreement has been reached, providing improved benefits and working conditions for all members.",
    category: "Agreement",
    date: "2024-01-15",
    time: "09:00 AM",
    priority: "High",
    author: "Union Leadership"
  },
  {
    id: 2,
    title: "Monthly Union Meeting",
    content: "Join us for our monthly union meeting this Thursday at 6 PM in the main hall. We'll discuss recent developments and upcoming initiatives.",
    category: "Meeting",
    date: "2024-01-12",
    time: "06:00 PM",
    priority: "Medium",
    author: "Events Committee"
  },
  {
    id: 3,
    title: "Health & Safety Training",
    content: "Mandatory health and safety training sessions will be conducted next week. Please check your schedule and attend your assigned session.",
    category: "Training",
    date: "2024-01-10",
    time: "10:00 AM",
    priority: "High",
    author: "Safety Committee"
  },
  {
    id: 4,
    title: "Holiday Schedule Update",
    content: "Please note the updated holiday schedule for the upcoming quarter. Check the member portal for detailed information.",
    category: "Schedule",
    date: "2024-01-08",
    time: "02:30 PM", 
    priority: "Low",
    author: "HR Department"
  }
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Agreement": return "bg-primary text-primary-foreground";
    case "Meeting": return "bg-secondary text-secondary-foreground";
    case "Training": return "bg-accent text-accent-foreground";
    case "Schedule": return "bg-muted text-muted-foreground";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "border-l-4 border-l-red-500";
    case "Medium": return "border-l-4 border-l-yellow-500";
    case "Low": return "border-l-4 border-l-green-500";
    default: return "";
  }
};

export default function AnnouncementsPage() {
  return (
    <UnionLayout activeTab="announcements">
      <UnionHeader title="Union News" />
      
      <div className="p-4 space-y-4">
        {/* Featured Announcement */}
        <Card className="bg-gradient-union text-primary-foreground shadow-union">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-primary-foreground">
                Featured
              </Badge>
              <Badge className="bg-white/20 text-primary-foreground">
                High Priority
              </Badge>
            </div>
            <CardTitle className="text-lg">New Union Agreement Signed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-primary-foreground/90 mb-3">
              We're pleased to announce that a new collective bargaining agreement has been reached, providing improved benefits and working conditions for all members.
            </p>
            <div className="flex items-center gap-4 text-xs text-primary-foreground/80">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>Jan 15, 2024</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>09:00 AM</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>Union Leadership</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Announcements */}
        <div className="space-y-3">
          <h2 className="font-heading font-semibold text-lg">All Announcements</h2>
          
          {mockAnnouncements.map((announcement) => (
            <Card 
              key={announcement.id} 
              className={`shadow-card hover:shadow-union transition-all duration-300 ${getPriorityColor(announcement.priority)}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium">{announcement.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getCategoryColor(announcement.category)} variant="secondary">
                        {announcement.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">{announcement.content}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{announcement.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{announcement.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span>{announcement.author}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </UnionLayout>
  );
}