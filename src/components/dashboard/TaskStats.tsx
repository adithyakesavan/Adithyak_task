
import { useTasks, TaskPriority } from "@/contexts/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCheck, Clock, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const TaskStats = () => {
  const { tasks } = useTasks();
  
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calculate priority distribution
  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length;
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "medium").length;
  const lowPriorityTasks = tasks.filter((task) => task.priority === "low").length;
  
  // Calculate overdue tasks
  const overdueTasks = tasks.filter(
    (task) => 
      task.status === "pending" && 
      new Date(task.dueDate) < new Date() &&
      new Date(task.dueDate).setHours(0, 0, 0, 0) !== new Date().setHours(0, 0, 0, 0)
  ).length;
  
  // Data for the pie chart
  const chartData = [
    { name: "Completed", value: completedTasks, color: "#10B981" },
    { name: "Pending", value: pendingTasks, color: "#6366F1" },
  ];
  
  // Data for the priority chart
  const priorityData = [
    { name: "High", value: highPriorityTasks, color: "#EF4444" },
    { name: "Medium", value: mediumPriorityTasks, color: "#F97316" },
    { name: "Low", value: lowPriorityTasks, color: "#10B981" },
  ];
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Total Tasks Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          <CheckCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTasks}</div>
          <p className="text-xs text-muted-foreground">
            {completedTasks} completed, {pendingTasks} pending
          </p>
          <Progress
            value={completionRate}
            className="mt-4 h-2"
            aria-label="Task completion rate"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {completionRate}% completion rate
          </p>
        </CardContent>
      </Card>
      
      {/* Priority Distribution Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Priority Distribution</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} tasks`, name]}
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Overdue Tasks Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overdueTasks}</div>
          <p className="text-xs text-muted-foreground">
            {pendingTasks > 0
              ? `${Math.round((overdueTasks / pendingTasks) * 100)}% of pending tasks`
              : "No pending tasks"}
          </p>
          <Progress
            value={pendingTasks > 0 ? (overdueTasks / pendingTasks) * 100 : 0}
            className="mt-4 h-2"
            indicatorColor="bg-destructive"
            aria-label="Overdue tasks"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {pendingTasks - overdueTasks} tasks on track
          </p>
        </CardContent>
      </Card>
      
      {/* Task Status Card */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Task Completion Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            {totalTasks === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">No tasks to display</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip 
                    formatter={(value, name) => [`${value} tasks`, name]}
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskStats;
