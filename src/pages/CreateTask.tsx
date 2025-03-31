
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import TaskForm from "@/components/tasks/TaskForm";
import { useEffect } from "react";

const CreateTask = () => {
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
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Task</h1>
          <p className="text-muted-foreground">
            Add a new task to your list
          </p>
        </div>
        
        <TaskForm />
      </div>
    </MainLayout>
  );
};

export default CreateTask;
