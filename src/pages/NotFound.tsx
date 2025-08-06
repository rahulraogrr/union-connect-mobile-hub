import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
      <div className="text-center space-y-6">
        <img 
          src="/lovable-uploads/09196c45-5ecd-44e8-8d21-50dc215f80dd.png" 
          alt="TEE 1104 Union Logo" 
          className="h-24 w-24 mx-auto rounded-full bg-white/10 p-3"
        />
        <div>
          <h1 className="text-6xl font-bold mb-4 text-primary-foreground">404</h1>
          <p className="text-xl text-primary-foreground/80 mb-6">Oops! Page not found</p>
          <p className="text-sm text-primary-foreground/60 mb-8">The page you're looking for doesn't exist in the Union Connect Hub</p>
          <a 
            href="/" 
            className="inline-block bg-white/20 hover:bg-white/30 text-primary-foreground px-6 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm"
          >
            Return to Union Hub
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
