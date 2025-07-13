import { ReactNode } from "react";
import { BottomNavigation } from "./navigation/BottomNavigation";

interface UnionLayoutProps {
  children: ReactNode;
  activeTab?: string;
}

export const UnionLayout = ({ children, activeTab }: UnionLayoutProps) => {
  return (
    <div className="min-h-screen bg-background font-body">
      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} />
    </div>
  );
};