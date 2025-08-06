import { useTranslation } from 'react-i18next';

export const UnionFooter = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Logo and Union Info */}
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/09196c45-5ecd-44e8-8d21-50dc215f80dd.png" 
              alt="TEE 1104 Union Logo" 
              className="h-8 w-8 rounded-full"
            />
            <div className="text-sm">
              <p className="font-medium text-foreground">Telangana Electricity Employees Union</p>
              <p className="text-muted-foreground">REGD NO. 1104, (RECOGNISED) H.O. HYDERABAD</p>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="text-sm text-muted-foreground text-center md:text-right">
            <p>© 2024 TEE 1104 Union. All rights reserved.</p>
            <p>Established 1950/14 • Serving electricity employees</p>
          </div>
        </div>
      </div>
    </footer>
  );
};