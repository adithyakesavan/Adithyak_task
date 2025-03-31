
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTasks, Task, TaskStatus, TaskPriority } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Edit, Trash2, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskListProps {
  defaultStatus?: TaskStatus;
}

const TaskList = ({ defaultStatus }: TaskListProps) => {
  const { tasks, deleteTask, toggleTaskStatus, getFilteredTasks, getSortedTasks } = useTasks();
  
  const [status, setStatus] = useState<TaskStatus | undefined>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'status'>('dueDate');
  
  // Get filtered and sorted tasks
  const filteredTasks = getFilteredTasks(status, priority, searchTerm);
  const sortedTasks = getSortedTasks(filteredTasks, sortBy);
  
  const getPriorityColor = (priority: TaskPriority) => {
    return {
      low: "bg-priority-low text-white",
      medium: "bg-priority-medium text-white",
      high: "bg-priority-high text-white",
    }[priority];
  };
  
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).setHours(0, 0, 0, 0) !== new Date().setHours(0, 0, 0, 0);
  };
  
  const resetFilters = () => {
    setStatus(defaultStatus);
    setPriority(undefined);
    setSearchTerm("");
  };
  
  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) {
      return "Today";
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (date.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.getTime() === yesterday.getTime()) {
      return "Yesterday";
    }
    
    return format(date, "MMM d, yyyy");
  };
  
  return (
    <div className="space-y-6">
      {/* Filters and search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative grow">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as 'dueDate' | 'priority' | 'status')}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={resetFilters} aria-label="Clear filters">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={status === "pending" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setStatus(status === "pending" ? undefined : "pending")}
          >
            Pending
          </Badge>
          <Badge
            variant={status === "completed" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setStatus(status === "completed" ? undefined : "completed")}
          >
            Completed
          </Badge>
          <Badge
            variant={priority === "low" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setPriority(priority === "low" ? undefined : "low")}
          >
            Low
          </Badge>
          <Badge
            variant={priority === "medium" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setPriority(priority === "medium" ? undefined : "medium")}
          >
            Medium
          </Badge>
          <Badge
            variant={priority === "high" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setPriority(priority === "high" ? undefined : "high")}
          >
            High
          </Badge>
        </div>
      </div>
      
      {/* Tasks */}
      {sortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tasks found. Create a new task to get started.</p>
          <Button className="mt-4" asChild>
            <Link to="/tasks/new">Create Task</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "bg-card border rounded-lg p-4 shadow-sm transition-all",
                task.status === "completed" && "opacity-75"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.status === "completed"}
                    onCheckedChange={() => toggleTaskStatus(task.id)}
                    className="mt-1"
                  />
                  
                  <div>
                    <h3 className={cn(
                      "font-medium text-lg",
                      task.status === "completed" && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                      {task.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className={cn(
                          isOverdue(task.dueDate) && task.status !== "completed" && "text-destructive"
                        )}>
                          {getFormattedDate(task.dueDate)}
                        </span>
                      </Badge>
                      
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      
                      {task.assignedTo && (
                        <Badge variant="outline">
                          {task.assignedTo}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline" asChild>
                    <Link to={`/tasks/edit/${task.id}`} aria-label="Edit task">
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="outline" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this task? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteTask(task.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
