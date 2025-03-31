
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  user_id: string;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Omit<Task, "id" | "createdAt" | "status" | "user_id">) => Promise<string | undefined>;
  updateTask: (id: string, task: Partial<Omit<Task, "id" | "user_id">>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  getFilteredTasks: (status?: TaskStatus, priority?: TaskPriority, searchTerm?: string) => Task[];
  getSortedTasks: (tasks: Task[], sortBy: 'dueDate' | 'priority' | 'status') => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTasks();
      setupRealtimeSubscription();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedTasks = data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        dueDate: task.due_date,
        priority: task.priority as TaskPriority,
        status: task.status as TaskStatus,
        assignedTo: task.assigned_to,
        createdAt: task.created_at,
        user_id: task.user_id
      }));
      
      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Failed to load tasks",
        description: (error as Error).message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('public:tasks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Realtime update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newTask = payload.new;
            setTasks(prev => [{
              id: newTask.id,
              title: newTask.title,
              description: newTask.description || '',
              dueDate: newTask.due_date,
              priority: newTask.priority as TaskPriority,
              status: newTask.status as TaskStatus,
              assignedTo: newTask.assigned_to,
              createdAt: newTask.created_at,
              user_id: newTask.user_id
            }, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedTask = payload.new;
            setTasks(prev => prev.map(task => 
              task.id === updatedTask.id 
                ? {
                    id: updatedTask.id,
                    title: updatedTask.title,
                    description: updatedTask.description || '',
                    dueDate: updatedTask.due_date,
                    priority: updatedTask.priority as TaskPriority,
                    status: updatedTask.status as TaskStatus,
                    assignedTo: updatedTask.assigned_to,
                    createdAt: updatedTask.created_at,
                    user_id: updatedTask.user_id
                  }
                : task
            ));
          } else if (payload.eventType === 'DELETE') {
            const deletedTaskId = payload.old.id;
            setTasks(prev => prev.filter(task => task.id !== deletedTaskId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const addTask = async (taskData: Omit<Task, "id" | "createdAt" | "status" | "user_id">) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title: taskData.title,
            description: taskData.description,
            due_date: taskData.dueDate,
            priority: taskData.priority,
            status: 'pending',
            assigned_to: taskData.assignedTo,
            user_id: user.id
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Task added",
        description: "Your task has been added successfully",
      });
      
      // Create a notification for the new task
      await createNotification(data.id, data.title);
      
      return data.id;
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Failed to add task",
        description: (error as Error).message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async (taskId: string, taskTitle: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: user.id,
            task_id: taskId,
            message: `You have a new task: ${taskTitle}`,
            status: 'unread'
          }
        ]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const updateTask = async (id: string, taskData: Partial<Omit<Task, "id" | "user_id">>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('tasks')
        .update({
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.dueDate,
          priority: taskData.priority,
          status: taskData.status,
          assigned_to: taskData.assignedTo,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Failed to update task",
        description: (error as Error).message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Task deleted",
        description: "Your task has been deleted",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Failed to delete task",
        description: (error as Error).message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (id: string) => {
    if (!user) return;
    
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const newStatus: TaskStatus = task.status === "completed" ? "pending" : "completed";
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('tasks')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: `Task ${newStatus}`,
        description: `Task has been marked as ${newStatus}`,
      });
    } catch (error) {
      console.error('Error toggling task status:', error);
      toast({
        title: "Failed to update task",
        description: (error as Error).message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
