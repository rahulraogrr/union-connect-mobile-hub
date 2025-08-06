import { ReactNode } from "react";
import { BottomNavigation } from "./navigation/BottomNavigation";
import { UnionFooter } from "./UnionFooter";

interface UnionLayoutProps {
  children: ReactNode;
  activeTab?: string;
  onLogout?: () => void;
}

export const UnionLayout = ({ children, activeTab, onLogout }: UnionLayoutProps) => {
  return (
    <div className="min-h-screen bg-background font-body flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>
      
      {/* Footer */}
      <UnionFooter />
      
      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} />
      
      {/* Print Header for documents */}
      <div className="print-header hidden">
        <img 
          src="/lovable-uploads/09196c45-5ecd-44e8-8d21-50dc215f80dd.png" 
          alt="TEE 1104 Union Logo" 
        />
        <div className="print-header-text">
          <h1>Telangana Electricity Employees Union</h1>
          <p>REGD NO. 1104, (RECOGNISED) H.O. HYDERABAD</p>
          <p>ESTD - 1950/14</p>
        </div>
      </div>
      
      {/* Print Footer */}
      <div className="print-footer hidden">
        © 2024 TEE 1104 Union • REGD NO. 1104, (RECOGNISED) H.O. HYDERABAD
      </div>
    </div>
  );
};