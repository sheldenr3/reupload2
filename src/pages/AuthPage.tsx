import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log("AuthPage - Auth state:", { user, loading });

  // Redirect to home if already logged in
  useEffect(() => {
    if (!loading && user) {
      console.log("AuthPage - User is logged in, redirecting to home");
      navigate("/home");
    }
  }, [user, loading, navigate]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-center font-['League_Spartan']">
        Welcome to <span className="text-black dark:text-white">Lumerous</span>
        <span className="text-[#0197cf] dark:text-[#01d2ff]">.</span>
        <span className="text-black dark:text-white">com</span>
      </h1>
      <p className="text-center text-muted-foreground mb-8 max-w-md mx-auto">
        The global learning platform tailored to your country's curriculum
      </p>
      <AuthForm />
    </div>
  );
}
