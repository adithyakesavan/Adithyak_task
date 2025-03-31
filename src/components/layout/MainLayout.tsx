
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Bell, Lightbulb, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ProfileDropdown from "@/components/layout/ProfileDropdown";
import NotificationsPopover from "@/components/layout/NotificationsPopover";

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const MainLayout = ({ children, showSidebar = true }: MainLayoutProps) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b py-4 px-6 bg-card">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-3">
            {user && showSidebar && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div 
              className="font-bold text-xl text-primary cursor-pointer flex items-center gap-2"
              onClick={() => navigate("/")}
            >
              <span className="h-6 w-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-sm">
                TT
              </span>
              TaskTracker
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <Lightbulb className={cn("h-5 w-5", theme === 'dark' ? "text-yellow-400" : "text-gray-400")} />
            </Button>
            
            {!user ? (
              <div className="flex gap-2 items-center">
                <NotificationsPopover />
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Register
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NotificationsPopover />
                <ProfileDropdown user={user} />
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex">
        {showSidebar && user && sidebarOpen && <Sidebar />}
        
        <main className={cn("flex-1 p-6 transition-all duration-200", 
          showSidebar && user && sidebarOpen ? "" : "w-full")}>
          <div className="container mx-auto animate-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
