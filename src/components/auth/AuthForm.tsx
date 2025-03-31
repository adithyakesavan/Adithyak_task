
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AuthFormProps = {
  type: "login" | "register" | "forgot-password";
};

const AuthForm = ({ type }: AuthFormProps) => {
  const navigate = useNavigate();
  const { login, register, forgotPassword, loading } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      if (type === "login") {
        await login(email, password);
        navigate("/dashboard");
      } else if (type === "register") {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        await register(name, email, password);
        navigate("/dashboard");
      } else if (type === "forgot-password") {
        await forgotPassword(email);
        navigate("/login");
      }
    } catch (err) {
      setError((err as Error).message || "An error occurred");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {type === "register" && (
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>
      
      {type !== "forgot-password" && (
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
      )}
      
      {type === "register" && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
      )}
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading
          ? "Loading..."
          : type === "login"
          ? "Login"
          : type === "register"
          ? "Register"
          : "Send Reset Link"}
      </Button>
      
      <div className="text-center text-sm">
        {type === "login" ? (
          <>
            <Button
              variant="link"
              onClick={() => navigate("/forgot-password")}
              className="p-0 text-xs"
            >
              Forgot password?
            </Button>
            <div className="mt-2">
              Don't have an account?{" "}
              <Button
                variant="link"
                onClick={() => navigate("/register")}
                className="p-0"
              >
                Register now
              </Button>
            </div>
          </>
        ) : type === "register" ? (
          <>
            Already have an account?{" "}
            <Button
              variant="link"
              onClick={() => navigate("/login")}
              className="p-0"
            >
              Login
            </Button>
          </>
        ) : (
          <>
            Remember your password?{" "}
            <Button
              variant="link"
              onClick={() => navigate("/login")}
              className="p-0"
            >
              Login
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default AuthForm;
