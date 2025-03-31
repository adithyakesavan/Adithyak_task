
import { useState, useEffect } from "react";
import { useAuth, User } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/contexts/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

const ProfileForm = () => {
  const { user, updateProfile, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setProfilePicture(user.profilePicture || "");
    }
  }, [user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required");
      return;
    }
    
    try {
      await updateProfile({
        name,
        email,
        profilePicture,
      });
    } catch (err) {
      setError((err as Error).message || "An error occurred");
    }
  };
  
  if (!user) {
    return (
      <Alert>
        <AlertDescription>
          You need to be logged in to access this page.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profilePicture} alt={name} />
            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="space-y-2 w-full">
            <Label htmlFor="profilePicture">Profile Picture URL</Label>
            <Input
              id="profilePicture"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
              placeholder="https://example.com/profile.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Enter a URL to your profile picture
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Theme</Label>
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
              aria-label="Toggle theme"
            />
            <Moon className="h-4 w-4" />
            <span className="text-sm text-muted-foreground ml-2">
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
          </div>
        </div>
      </div>
      
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default ProfileForm;
