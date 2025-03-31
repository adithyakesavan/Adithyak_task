
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, UserCircle } from "lucide-react";

interface ProfileDropdownProps {
  user: {
    name: string;
    profilePicture?: string;
  };
}

const ProfileDropdown = ({ user }: ProfileDropdownProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleProfileClick = () => {
    navigate("/profile");
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer outline-none">
        <span className="text-sm font-medium hidden sm:block">
          {user.name}
        </span>
        
        <div className="h-8 w-8 rounded-full overflow-hidden">
          <img 
            src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}`}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Personal Information</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
