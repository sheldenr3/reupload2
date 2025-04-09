import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "@/components/profile/ProfileSettings";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  CreditCard,
  Settings,
  BookOpen,
  Award,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "profile");

  useEffect(() => {
    // Set active tab based on URL parameter if present
    if (
      tabParam &&
      ["profile", "subscription", "settings"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      console.log("ProfilePage: User not authenticated, redirecting to auth");
      navigate("/auth");
    } else {
      console.log("ProfilePage: User authenticated", { user, profile });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0197cf]"></div>
      </div>
    );
  }

  // Calculate progress for demo purposes
  const calculateProgress = () => {
    return Math.floor(Math.random() * 100);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#0197cf] dark:text-[#01d2ff]">
        Your Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Profile Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-[#0197cf]/10 flex items-center justify-center mb-4 border-2 border-[#0197cf]">
                <span className="text-2xl font-bold text-[#0197cf]">
                  {profile?.name
                    ? profile.name.substring(0, 2).toUpperCase()
                    : user?.email?.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <h3 className="font-bold text-lg">{profile?.name || "User"}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {user?.email}
              </p>
              <div className="flex items-center space-x-1 text-sm bg-[#0197cf]/10 text-[#0197cf] px-2 py-1 rounded-full">
                <BookOpen className="h-3 w-3" />
                <span>Grade {profile?.grade || "10"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Progress Card */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Learning Progress</CardTitle>
            <CardDescription>Track your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Mathematics</span>
                  <span className="text-sm text-muted-foreground">
                    {calculateProgress()}%
                  </span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Physical Sciences</span>
                  <span className="text-sm text-muted-foreground">
                    {calculateProgress()}%
                  </span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Life Sciences</span>
                  <span className="text-sm text-muted-foreground">
                    {calculateProgress()}%
                  </span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </div>
              <div className="flex justify-between pt-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Award className="h-4 w-4 mr-1 text-[#ffcc00]" />
                  <span>1,250 points earned</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1 text-[#ff6600]" />
                  <span>15 day streak</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" /> Subscription
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="subscription">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-md">
            <h2 className="text-xl font-bold mb-4">Your Subscription</h2>
            <div className="p-4 bg-[#f5fcff] dark:bg-gray-900 rounded-md mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Current Plan</p>
                  <p className="text-sm text-muted-foreground">
                    Monthly Subscription
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">$9.99/month</p>
                  <p className="text-xs text-muted-foreground">
                    Next billing date: July 15, 2023
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button className="bg-[#0197cf] hover:bg-[#01729b]">
                Upgrade Plan
              </Button>
              <Button variant="outline">Cancel Subscription</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-md">
            <h2 className="text-xl font-bold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Email Notifications</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="email-notifications"
                    className="rounded border-gray-300 text-[#0197cf] focus:ring-[#0197cf]"
                    defaultChecked
                  />
                  <label htmlFor="email-notifications">
                    Receive email notifications
                  </label>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Dark Mode</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="dark-mode"
                    className="rounded border-gray-300 text-[#0197cf] focus:ring-[#0197cf]"
                  />
                  <label htmlFor="dark-mode">Enable dark mode</label>
                </div>
              </div>
              <div className="pt-4 border-t mt-4">
                <Button variant="destructive">Delete Account</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
