
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const MainLayout = ({ children, showSidebar = true }: MainLayoutProps) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b py-4 px-6 bg-card">
        <div className="container flex justify-between items-center">
          <div 
            className="font-bold text-xl text-primary cursor-pointer flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <span className="h-6 w-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-sm">
              TT
            </span>
            TaskTracker
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
            
            {!user ? (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Register
                </Button>
              </div>
            ) : (
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                <span className="text-sm font-medium">
                  {user.name}
                </span>
                
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <img 
                    src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}`}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex">
        {showSidebar && user && <Sidebar />}
        
        <main className="flex-1 p-6">
          <div className="container mx-auto animate-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
