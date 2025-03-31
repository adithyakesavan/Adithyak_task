
import { Link } from "react-router-dom";
import { useTasks } from "@/contexts/TaskContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar, Plus } from "lucide-react";

const RecentTasks = () => {
  const { tasks, toggleTaskStatus } = useTasks();
  
  // Get 5 most recent tasks
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  const getPriorityColor = (priority: string) => {
    return {
      low: "bg-priority-low text-white",
      medium: "bg-priority-medium text-white",
      high: "bg-priority-high text-white",
    }[priority] || "bg-gray-500 text-white";
  };
  
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).setHours(0, 0, 0, 0) !== new Date().setHours(0, 0, 0, 0);
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Recent Tasks</CardTitle>
          <CardDescription>Your recently created tasks</CardDescription>
        </div>
        <Button size="sm" asChild>
          <Link to="/tasks/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tasks found.</p>
            <Button className="mt-4" asChild>
              <Link to="/tasks/new">Create Your First Task</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-start space-x-4 rounded-md border p-3",
                  task.status === "completed" && "opacity-75"
                )}
              >
                <Checkbox
                  checked={task.status === "completed"}
                  onCheckedChange={() => toggleTaskStatus(task.id)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "font-medium",
                      task.status === "completed" && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </p>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span className={cn(
                      isOverdue(task.dueDate) && task.status !== "completed" && "text-destructive"
                    )}>
                      {getFormattedDate(task.dueDate)}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto"
                  asChild
                >
                  <Link to={`/tasks/edit/${task.id}`}>Edit</Link>
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link to="/tasks">View All Tasks</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTasks;
