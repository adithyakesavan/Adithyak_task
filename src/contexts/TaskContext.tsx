
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: string;
  createdAt: string;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
  updateTask: (id: string, task: Partial<Omit<Task, "id">>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  getFilteredTasks: (status?: TaskStatus, priority?: TaskPriority, searchTerm?: string) => Task[];
  getSortedTasks: (tasks: Task[], sortBy: 'dueDate' | 'priority' | 'status') => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Sample tasks for demo
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Draft the initial project proposal document for client review",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: "high",
    status: "pending",
    assignedTo: "Demo User",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Review team updates",
    description: "Check and provide feedback on the weekly team updates",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: "medium",
    status: "pending",
    assignedTo: "Demo User",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Setup development environment",
    description: "Install and configure required tools and libraries",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: "low",
    status: "completed",
    assignedTo: "Demo User",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Client meeting preparation",
    description: "Prepare slides and talking points for upcoming client meeting",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: "high",
    status: "pending",
    assignedTo: "Demo User",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Weekly team sync",
    description: "Regular team meeting to discuss progress and roadblocks",
    dueDate: new Date(Date.now()).toISOString().split('T')[0],
    priority: "medium",
    status: "pending",
    assignedTo: "Demo User",
    createdAt: new Date().toISOString(),
  },
];

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load tasks from localStorage or use initial demo tasks
    const storedTasks = localStorage.getItem("tasks");
    
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error("Failed to parse stored tasks:", error);
        setTasks(initialTasks);
      }
    } else {
      setTasks(initialTasks);
    }
    
    setLoading(false);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, loading]);

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "status">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    
    setTasks((prevTasks) => [...prevTasks, newTask]);
    
    toast({
      title: "Task added",
      description: "Your task has been added successfully",
    });
  };

  const updateTask = (id: string, taskData: Partial<Omit<Task, "id">>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...taskData } : task
      )
    );
    
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully",
    });
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    
    toast({
      title: "Task deleted",
      description: "Your task has been deleted",
    });
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "completed" ? "pending" : "completed",
            }
          : task
      )
    );
    
    const task = tasks.find((t) => t.id === id);
    const newStatus = task?.status === "completed" ? "pending" : "completed";
    
    toast({
      title: `Task ${newStatus}`,
      description: `Task has been marked as ${newStatus}`,
    });
  };

  const getFilteredTasks = (status?: TaskStatus, priority?: TaskPriority, searchTerm?: string) => {
    return tasks.filter((task) => {
      // Filter by status if provided
      if (status && task.status !== status) {
        return false;
      }
      
      // Filter by priority if provided
      if (priority && task.priority !== priority) {
        return false;
      }
      
      // Filter by search term if provided
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          task.title.toLowerCase().includes(term) ||
          task.description.toLowerCase().includes(term)
        );
      }
      
      return true;
    });
  };

  const getSortedTasks = (tasksToSort: Task[], sortBy: 'dueDate' | 'priority' | 'status') => {
    return [...tasksToSort].sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      
      if (sortBy === 'priority') {
        const priorityValue = { low: 0, medium: 1, high: 2 };
        return priorityValue[b.priority] - priorityValue[a.priority];
      }
      
      if (sortBy === 'status') {
        return a.status === 'completed' ? 1 : -1;
      }
      
      return 0;
    });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        getFilteredTasks,
        getSortedTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
