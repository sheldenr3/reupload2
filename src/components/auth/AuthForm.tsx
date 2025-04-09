import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, LogIn, UserPlus } from "lucide-react";

// Sample data - in a real app, this would come from an API
const grades = [
  { id: "1", name: "Grade 1" },
  { id: "2", name: "Grade 2" },
  { id: "3", name: "Grade 3" },
  { id: "4", name: "Grade 4" },
  { id: "5", name: "Grade 5" },
  { id: "6", name: "Grade 6" },
  { id: "7", name: "Grade 7" },
  { id: "8", name: "Grade 8" },
  { id: "9", name: "Grade 9" },
  { id: "10", name: "Grade 10" },
  { id: "11", name: "Grade 11" },
  { id: "12", name: "Grade 12" },
];

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Attempting login with:", { email });

      // Simple direct login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Login response:", { data, error });

      if (error) throw error;

      console.log("Login successful, user:", data?.user);

      toast({
        title: "Login successful",
        description: "Welcome back to Lumerous!",
      });

      // Manually redirect to home page after successful login
      // Use navigate instead of window.location for better React Router integration
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });

      // Show more detailed error in console
      if (error.message) {
        console.error("Error message:", error.message);
      }
      if (error.details) {
        console.error("Error details:", error.details);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!grade) {
      toast({
        title: "Signup failed",
        description: "Please select your grade",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      // Create the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            country: "za", // Default to South Africa
            grade,
          },
        },
      });

      if (error) throw error;

      // Create a profile in the public.profiles table
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: data.user?.id,
          name,
          country: "za", // Default to South Africa
          grade,
          email,
        },
      ]);

      if (profileError) throw profileError;

      toast({
        title: "Signup successful",
        description:
          "Welcome to Lumerous! Please check your email to verify your account.",
      });

      // Redirect to payment page
      navigate("/payment");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-16rem)] py-8">
      <Card className="w-full max-w-md border-[#e6f7fc] dark:border-gray-700 shadow-lg">
        <CardHeader className="bg-[#f5fcff] dark:bg-gray-900 border-b">
          <CardTitle className="text-[#0197cf] dark:text-[#01d2ff] text-center">
            {activeTab === "login" ? "Login to Lumerous" : "Join Lumerous"}
          </CardTitle>
          <CardDescription className="text-center">
            {activeTab === "login"
              ? "Access your personalized learning journey"
              : "Create an account to start learning"}
          </CardDescription>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="rounded-none">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="rounded-none">
              <UserPlus className="mr-2 h-4 w-4" /> Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="text-xs text-[#0197cf] hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-[#0197cf] hover:bg-[#01729b]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
                {loading && (
                  <p className="text-xs text-center mt-2 text-muted-foreground">
                    This may take a moment...
                  </p>
                )}
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Select value={grade} onValueChange={setGrade} required>
                    <SelectTrigger id="grade">
                      <SelectValue placeholder="Select your grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id}>
                          {grade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-[#0197cf] hover:bg-[#01729b]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
