import { UnionLayout } from "@/components/UnionLayout";
import { UnionHeader } from "@/components/UnionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Calendar, Receipt } from "lucide-react";

interface PaymentsPageProps {
  onLogout?: () => void;
}

const paymentHistory = [
  {
    id: "PAY-001",
    description: "Monthly Union Dues",
    amount: "$25.00",
    date: "2024-01-01",
    status: "Paid",
    method: "Credit Card"
  },
  {
    id: "PAY-002", 
    description: "Emergency Fund Contribution",
    amount: "$10.00",
    date: "2023-12-15",
    status: "Paid",
    method: "Bank Transfer"
  },
  {
    id: "PAY-003",
    description: "Monthly Union Dues",
    amount: "$25.00",
    date: "2023-12-01",
    status: "Paid",
    method: "Credit Card"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Paid": return "bg-green-100 text-green-800";
    case "Pending": return "bg-yellow-100 text-yellow-800";
    case "Failed": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function PaymentsPage({ onLogout }: PaymentsPageProps) {
  const handlePayDues = () => {
    // This will be implemented when Stripe integration is set up
    alert("Payment integration coming soon! Please contact union office for now.");
  };

  return (
    <UnionLayout onLogout={onLogout}>
      <UnionHeader title="Payments & Dues" onLogout={onLogout} />
      
      <div className="p-4 space-y-6">
        {/* Payment Summary */}
        <Card className="bg-gradient-union text-primary-foreground shadow-union">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign size={20} />
              Dues Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-primary-foreground/80">Monthly Dues</p>
                <p className="text-2xl font-bold">$25.00</p>
              </div>
              <div>
                <p className="text-sm text-primary-foreground/80">Next Due Date</p>
                <p className="text-lg font-semibold">Feb 1, 2024</p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              className="w-full mt-4"
              onClick={handlePayDues}
            >
              Pay Now
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="shadow-card hover:shadow-union transition-all duration-300">
            <CardContent className="flex flex-col items-center justify-center p-4 space-y-2">
              <CreditCard size={24} className="text-primary" />
              <span className="font-medium text-sm text-center">Update Payment Method</span>
            </CardContent>
          </Card>
          
          <Card className="shadow-card hover:shadow-union transition-all duration-300">
            <CardContent className="flex flex-col items-center justify-center p-4 space-y-2">
              <Receipt size={24} className="text-primary" />
              <span className="font-medium text-sm text-center">Download Receipts</span>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <section>
          <h2 className="font-heading font-semibold text-lg mb-4">Payment History</h2>
          <div className="space-y-3">
            {paymentHistory.map((payment) => (
              <Card key={payment.id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{payment.description}</h3>
                      <p className="text-xs text-muted-foreground mt-1">ID: {payment.id}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{payment.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard size={12} />
                          <span>{payment.method}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{payment.amount}</p>
                      <Badge className={getStatusColor(payment.status)} variant="secondary">
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Help Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              If you have questions about payments, dues, or billing, please contact our member services team.
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Phone:</strong> (555) UNION-PAY</p>
              <p><strong>Email:</strong> billing@tee1104.org</p>
              <p><strong>Office Hours:</strong> Mon-Fri 9AM-5PM</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </UnionLayout>
  );
}