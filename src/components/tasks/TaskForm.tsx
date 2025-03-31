
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks, Task, TaskPriority } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TaskFormProps {
  taskId?: string;
  onComplete?: () => void;
}

const TaskForm = ({ taskId, onComplete }: TaskFormProps) => {
  const navigate = useNavigate();
  const { tasks, addTask, updateTask } = useTasks();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [error, setError] = useState("");
  
  // If editing, load the task data
  useEffect(() => {
    if (taskId) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(task.dueDate);
        setPriority(task.priority);
        setAssignedTo(task.assignedTo || "");
      } else {
        setError("Task not found");
      }
    } else {
      // Set default due date to tomorrow for new tasks
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split("T")[0]);
    }
  }, [taskId, tasks]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    
    try {
      if (taskId) {
        // Update existing task
        updateTask(taskId, {
          title,
          description,
          dueDate,
          priority,
          assignedTo: assignedTo || undefined,
        });
      } else {
        // Add new task
        addTask({
          title,
          description,
          dueDate,
          priority,
          assignedTo: assignedTo || undefined,
        });
      }
      
      if (onComplete) {
        onComplete();
      } else {
        navigate("/tasks");
      }
    } catch (err) {
      setError((err as Error).message || "An error occurred");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the task"
          rows={4}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={priority}
            onValueChange={(value) => setPriority(value as TaskPriority)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="assignedTo">Assigned To</Label>
        <Input
          id="assignedTo"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          placeholder="Enter assignee name (optional)"
        />
      </div>
      
      <div className="flex gap-4 pt-4">
        <Button type="submit">
          {taskId ? "Save Changes" : "Create Task"}
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate("/tasks")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
