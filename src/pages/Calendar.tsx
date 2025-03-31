
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface TasksByDate {
  [date: string]: Array<{
    id: string;
    title: string;
    priority: string;
    status: string;
  }>;
}

const Calendar = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tasksByDate, setTasksByDate] = useState<TasksByDate>({});
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  // Group tasks by date
  useEffect(() => {
    const grouped: TasksByDate = {};
    
    tasks.forEach((task) => {
      const dateStr = task.dueDate;
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      
      grouped[dateStr].push({
        id: task.id,
        title: task.title,
        priority: task.priority,
        status: task.status,
      });
    });
    
    setTasksByDate(grouped);
  }, [tasks]);
  
  const getPriorityColor = (priority: string) => {
    return {
      low: "bg-priority-low text-white",
      medium: "bg-priority-medium text-white",
      high: "bg-priority-high text-white",
    }[priority] || "bg-gray-500 text-white";
  };
  
  if (!user) return null;
  
  const selectedDateStr = date ? format(date, "yyyy-MM-dd") : "";
  const tasksForSelectedDate = tasksByDate[selectedDateStr] || [];
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View your tasks organized by date
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-[350px_1fr]">
          <Card>
            <CardContent className="p-4">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="border rounded-md p-3"
                modifiersStyles={{
                  selected: {
                    backgroundColor: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                  },
                }}
                modifiers={{
                  hasTasks: Object.keys(tasksByDate).map((date) => new Date(date)),
                }}
                modifiersClassNames={{
                  hasTasks: "font-bold",
                }}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold">
                    {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                  </h2>
                  <p className="text-muted-foreground">
                    {tasksForSelectedDate.length === 0
                      ? "No tasks scheduled for this day"
                      : `${tasksForSelectedDate.length} task${tasksForSelectedDate.length === 1 ? "" : "s"}`}
                  </p>
                </div>
                
                {tasksForSelectedDate.length > 0 ? (
                  <div className="space-y-4">
                    {tasksForSelectedDate.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 rounded-md border"
                        onClick={() => navigate(`/tasks/edit/${task.id}`)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              task.status === "completed" ? "bg-green-500" : "bg-blue-500"
                            }`}
                          />
                          <span
                            className={
                              task.status === "completed"
                                ? "line-through text-muted-foreground"
                                : ""
                            }
                          >
                            {task.title}
                          </span>
                        </div>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground">No tasks for this date</p>
                    <button
                      onClick={() => navigate("/tasks/new")}
                      className="mt-4 text-primary hover:underline"
                    >
                      Add a new task
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Calendar;
