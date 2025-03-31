
import MainLayout from "@/components/layout/MainLayout";
import AuthForm from "@/components/auth/AuthForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ForgotPassword = () => {
  return (
    <MainLayout showSidebar={false}>
      <div className="w-full max-w-md mx-auto py-12">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm type="forgot-password" />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;
