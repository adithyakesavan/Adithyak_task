
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import TaskList from "@/components/tasks/TaskList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect } from "react";

const Tasks = () => {
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
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">
              Manage and organize all your tasks
            </p>
          </div>
          
          <Button onClick={() => navigate("/tasks/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
        
        <TaskList />
      </div>
    </MainLayout>
  );
};

export default Tasks;
