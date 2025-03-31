
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, Mail } from "lucide-react";

// Mock team members data
const teamMembers = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    role: "Project Manager",
    avatar: "https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Developer",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=8B5CF6&color=fff",
  },
  {
    id: "3",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Designer",
    avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=10B981&color=fff",
  },
  {
    id: "4",
    name: "Sam Wilson",
    email: "sam@example.com",
    role: "Marketing",
    avatar: "https://ui-avatars.com/api/?name=Sam+Wilson&background=F97316&color=fff",
  },
];

const Team = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  if (!user) return null;
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team</h1>
            <p className="text-muted-foreground">
              Manage your team members and their access
            </p>
          </div>
          
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <Card key={member.id}>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Mail className="mr-2 h-4 w-4" />
                  {member.email}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                  <Button size="sm" variant="outline">
                    Assign Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Team Activity</CardTitle>
            <CardDescription>Recent activity from your team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage 
                      src={teamMembers[index % teamMembers.length].avatar} 
                      alt={teamMembers[index % teamMembers.length].name} 
                    />
                    <AvatarFallback>
                      {teamMembers[index % teamMembers.length].name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {teamMembers[index % teamMembers.length].name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {index === 0
                        ? "Created a new task: 'Update marketing materials'"
                        : index === 1
                        ? "Completed task: 'Fix navigation bug'"
                        : index === 2
                        ? "Added a comment on 'Homepage redesign'"
                        : index === 3
                        ? "Updated due date for 'Client presentation'"
                        : "Changed priority on 'Product roadmap'"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {index === 0
                        ? "Just now"
                        : index === 1
                        ? "10 minutes ago"
                        : index === 2
                        ? "1 hour ago"
                        : index === 3
                        ? "3 hours ago"
                        : "Yesterday"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Team;
