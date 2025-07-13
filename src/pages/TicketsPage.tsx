import { UnionLayout } from "@/components/UnionLayout";
import { UnionHeader } from "@/components/UnionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

const mockTickets = [
  {
    id: "1234",
    title: "Workplace Safety Concern",
    category: "Safety",
    status: "Under Review",
    priority: "High",
    date: "2024-01-15",
    description: "Unsafe working conditions in the factory floor"
  },
  {
    id: "1235", 
    title: "Schedule Change Request",
    category: "Schedule",
    status: "Approved",
    priority: "Medium",
    date: "2024-01-10",
    description: "Request for shift change due to family circumstances"
  },
  {
    id: "1236",
    title: "Benefits Inquiry",
    category: "Benefits",
    status: "Pending",
    priority: "Low", 
    date: "2024-01-08",
    description: "Questions about healthcare coverage options"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved": return "bg-green-100 text-green-800";
    case "Under Review": return "bg-yellow-100 text-yellow-800";
    case "Pending": return "bg-blue-100 text-blue-800";
    case "Rejected": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "bg-red-100 text-red-800";
    case "Medium": return "bg-yellow-100 text-yellow-800";
    case "Low": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function TicketsPage() {
  return (
    <UnionLayout activeTab="tickets">
      <UnionHeader title="My Tickets" />
      
      <div className="p-4 space-y-4">
        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              placeholder="Search tickets..." 
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter size={16} />
          </Button>
        </div>

        {/* New Ticket Button */}
        <Button className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-union">
          <Plus size={16} className="mr-2" />
          Raise New Ticket
        </Button>

        {/* Tickets List */}
        <div className="space-y-3">
          {mockTickets.map((ticket) => (
            <Card key={ticket.id} className="shadow-card hover:shadow-union transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium">{ticket.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">#{ticket.id}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={getStatusColor(ticket.status)} variant="secondary">
                      {ticket.status}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Category: {ticket.category}</span>
                  <span>{ticket.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </UnionLayout>
  );
}