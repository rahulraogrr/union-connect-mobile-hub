import { useState } from "react";
import { UnionLayout } from "@/components/UnionLayout";
import { UnionHeader } from "@/components/UnionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface CreateTicketPageProps {
  onLogout?: () => void;
}

export default function CreateTicketPage({ onLogout }: CreateTicketPageProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category || !priority || !description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate ticket creation
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Ticket Created",
        description: "Your ticket has been submitted successfully!",
      });
      navigate("/tickets");
    }, 1000);
  };

  return (
    <UnionLayout activeTab="tickets" onLogout={onLogout}>
      <UnionHeader title="Create Ticket" onLogout={onLogout} />
      
      <div className="p-4 space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/tickets")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tickets
        </Button>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Submit New Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Ticket Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of your issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="benefits">Benefits</SelectItem>
                      <SelectItem value="schedule">Schedule</SelectItem>
                      <SelectItem value="workplace">Workplace Issues</SelectItem>
                      <SelectItem value="harassment">Harassment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select value={priority} onValueChange={setPriority} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide detailed information about your issue..."
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> All ticket submissions are confidential and will be reviewed by union representatives. 
                  You will receive updates on your ticket status via email.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary text-primary-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </UnionLayout>
  );
}