
import { useTasks, TaskStatus, TaskPriority } from "@/contexts/TaskContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { ClipboardCheck, ClipboardList, AlertCircle } from "lucide-react";

const TaskStats = () => {
  const { tasks } = useTasks();
  
  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const pendingTasks = tasks.filter(task => task.status === "pending").length;
  
  const highPriorityTasks = tasks.filter(task => task.priority === "high").length;
  const mediumPriorityTasks = tasks.filter(task => task.priority === "medium").length;
  const lowPriorityTasks = tasks.filter(task => task.priority === "low").length;
  
  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  // Prepare data for pie chart
  const statusData = [
    { name: "Completed", value: completedTasks, color: "#10b981" },
    { name: "Pending", value: pendingTasks, color: "#f59e0b" },
  ];
  
  const priorityData = [
    { name: "High", value: highPriorityTasks, color: "#ef4444" },
    { name: "Medium", value: mediumPriorityTasks, color: "#f59e0b" },
    { name: "Low", value: lowPriorityTasks, color: "#10b981" },
  ];
  
  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded shadow-sm">
          <p className="font-medium text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Task Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Task Status</CardTitle>
          <CardDescription>Overview of your tasks progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1 items-center p-3 bg-card rounded-md border">
              <div className="flex gap-2 items-center">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                <span className="font-medium">Completed</span>
              </div>
              <span className="text-2xl font-bold">{completedTasks}</span>
            </div>
            
            <div className="flex flex-col gap-1 items-center p-3 bg-card rounded-md border">
              <div className="flex gap-2 items-center">
                <ClipboardList className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Pending</span>
              </div>
              <span className="text-2xl font-bold">{pendingTasks}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion Rate</span>
              <span className="font-medium">{completionPercentage}%</span>
            </div>
            <Progress 
              value={completionPercentage} 
              className="h-2" 
              aria-label="Task completion progress"
            />
          </div>
          
          {totalTasks > 0 && (
            <div className="mt-4 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Task Priority */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Priority Breakdown</CardTitle>
          <CardDescription>Tasks grouped by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex flex-col gap-1 items-center p-2 bg-card rounded-md border">
              <div className="flex gap-1 items-center">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="font-medium text-sm">High</span>
              </div>
              <span className="text-xl font-bold">{highPriorityTasks}</span>
            </div>
            
            <div className="flex flex-col gap-1 items-center p-2 bg-card rounded-md border">
              <div className="flex gap-1 items-center">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="font-medium text-sm">Medium</span>
              </div>
              <span className="text-xl font-bold">{mediumPriorityTasks}</span>
            </div>
            
            <div className="flex flex-col gap-1 items-center p-2 bg-card rounded-md border">
              <div className="flex gap-1 items-center">
                <AlertCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium text-sm">Low</span>
              </div>
              <span className="text-xl font-bold">{lowPriorityTasks}</span>
            </div>
          </div>
          
          {totalTasks > 0 && (
            <div className="mt-4 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Task Summary</CardTitle>
          <CardDescription>Overall task statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-2 p-4 bg-card rounded-md border">
              <span className="text-sm text-muted-foreground">Total Tasks</span>
              <span className="text-3xl font-bold">{totalTasks}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 p-3 bg-card rounded-md border">
                <span className="text-sm text-muted-foreground">Due Today</span>
                <span className="text-xl font-bold">
                  {tasks.filter(task => 
                    task.dueDate === new Date().toISOString().split('T')[0] && 
                    task.status === "pending"
                  ).length}
                </span>
              </div>
              
              <div className="flex flex-col gap-1 p-3 bg-card rounded-md border">
                <span className="text-sm text-muted-foreground">Overdue</span>
                <span className="text-xl font-bold">
                  {tasks.filter(task => 
                    task.dueDate < new Date().toISOString().split('T')[0] && 
                    task.status === "pending"
                  ).length}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>High Priority Progress</span>
                <span className="font-medium">
                  {highPriorityTasks > 0 
                    ? Math.round((tasks.filter(t => t.priority === "high" && t.status === "completed").length / highPriorityTasks) * 100) 
                    : 0}%
                </span>
              </div>
              <Progress 
                value={highPriorityTasks > 0 
                  ? (tasks.filter(t => t.priority === "high" && t.status === "completed").length / highPriorityTasks) * 100 
                  : 0} 
                className="h-2"
                aria-label="High priority task completion progress"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskStats;
