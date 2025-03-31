
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowRight, CheckCircle, Clock, BarChart3 } from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  
  return (
    <MainLayout showSidebar={false}>
      <div className="py-12 md:py-24 lg:py-32 space-y-12">
        {/* Hero Section */}
        <section className="container px-4 md:px-6 space-y-10 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
              Boost Your Productivity with TaskTracker
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              A simple yet powerful task management tool to keep you organized
              and focused on what matters most.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to={user ? "/dashboard" : "/login"}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="container px-4 md:px-6 py-12 bg-muted/50 rounded-xl">
          <div className="text-center space-y-4 mb-10">
            <h2 className="text-3xl font-bold">Powerful Features</h2>
            <p className="text-muted-foreground mx-auto max-w-[600px]">
              Everything you need to manage tasks efficiently and stay productive
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Task Management</h3>
              <p className="text-muted-foreground">
                Create, edit, and organize tasks with ease. Set priorities and deadlines to stay on track.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Insightful Dashboard</h3>
              <p className="text-muted-foreground">
                Get a clear overview of your tasks with visual charts and progress indicators.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Deadline Tracking</h3>
              <p className="text-muted-foreground">
                Never miss a deadline with intuitive due date tracking and reminders.
              </p>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="container px-4 md:px-6 py-12 bg-primary text-primary-foreground rounded-xl">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Get Organized?</h2>
            <p className="mx-auto max-w-[600px]">
              Start managing your tasks effectively today with TaskTracker.
            </p>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to={user ? "/dashboard" : "/register"}>
                {user ? "Go to Dashboard" : "Sign Up for Free"}
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
