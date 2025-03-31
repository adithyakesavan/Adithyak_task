
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const About = () => {
  return (
    <MainLayout showSidebar={false}>
      <div className="container max-w-4xl mx-auto py-12 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">About TaskTracker</h1>
          <p className="text-xl text-muted-foreground">
            A modern task management solution designed to boost your productivity
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
            <CardDescription>
              Why we built TaskTracker
            </CardDescription>
          </CardHeader>
          <CardContent className="prose">
            <p>
              TaskTracker was born out of a simple observation: managing tasks
              shouldn't be more work than the tasks themselves. We wanted to
              create a tool that helps people stay organized without adding
              complexity to their lives.
            </p>
            <p>
              Our mission is to help individuals and teams focus on what matters
              most by providing a simple, yet powerful task management platform
              that adapts to your workflow, not the other way around.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Key Features</CardTitle>
            <CardDescription>
              What makes TaskTracker special
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                "Intuitive task creation and management",
                "Priority-based organization",
                "Visual progress tracking with charts and statistics",
                "Deadline monitoring and reminders",
                "Team collaboration tools",
                "Customizable workflows",
                "Dark and light mode support"
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Get Started Today</CardTitle>
            <CardDescription>
              Boost your productivity with TaskTracker
            </CardDescription>
          </CardHeader>
          <CardContent className="prose">
            <p>
              TaskTracker is designed to be easy to use from day one. Create an
              account, add your first task, and start experiencing the benefits
              of organized task management right away.
            </p>
            <p>
              Whether you're managing personal projects, studying, or
              coordinating team efforts, TaskTracker scales to meet your needs
              with powerful features that never get in your way.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default About;
