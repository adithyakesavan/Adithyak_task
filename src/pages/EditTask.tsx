
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import MainLayout from "@/components/layout/MainLayout";
import TaskForm from "@/components/tasks/TaskForm";
import { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const EditTask = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const task = tasks.find((t) => t.id === id);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  if (!user) return null;
  
  if (!task) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Alert variant="destructive">
            <AlertDescription>
              Task not found. The task may have been deleted.
            </AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <a
              href="/tasks"
              className="text-primary hover:underline"
            >
              Return to Tasks
            </a>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Task</h1>
          <p className="text-muted-foreground">
            Update the details of your task
          </p>
        </div>
        
        <TaskForm taskId={id} />
      </div>
    </MainLayout>
  );
};

export default EditTask;
