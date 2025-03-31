
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, CheckSquare, Home, Mail, Info, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "About",
    href: "/about",
    icon: Info,
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Mail,
  },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setOpen(!open);
  };
  
  if (isMobile) {
    return (
      <>
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 right-4 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow-lg"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Mobile sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 transform bg-sidebar transition-transform duration-200 ease-in-out",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-center border-b border-sidebar-border">
              <span className="text-xl font-bold text-primary">TaskTracker</span>
            </div>
            
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <div className="w-64 border-r border-border bg-sidebar">
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border">
        <span className="text-xl font-bold text-primary">TaskTracker</span>
      </div>
      
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.title}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
