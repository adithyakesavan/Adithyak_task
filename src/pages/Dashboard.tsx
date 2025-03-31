
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import TaskStats from "@/components/dashboard/TaskStats";
import RecentTasks from "@/components/dashboard/RecentTasks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect } from "react";

const Dashboard = () => {
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
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name}! Here's an overview of your tasks.
            </p>
          </div>
          
          <Button onClick={() => navigate("/tasks/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
        
        <div className="grid gap-6">
          <TaskStats />
          <RecentTasks />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
