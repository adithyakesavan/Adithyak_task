
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import AuthForm from "@/components/auth/AuthForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  return (
    <MainLayout showSidebar={false}>
      <div className="w-full max-w-md mx-auto py-12">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm type="login" />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Login;
