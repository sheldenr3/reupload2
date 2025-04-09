import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, Settings, User, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function UserMenu() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Log profile information for debugging
  useEffect(() => {
    if (profile) {
      console.log("UserMenu - Profile loaded:", {
        id: profile.id,
        name: profile.name,
        grade: profile.grade,
      });
    }
  }, [profile]);

  const handleSignOut = async () => {
    try {
      console.log("UserMenu - Signing out");
      setIsSigningOut(true);
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });

      // Use navigate instead of window.location for better routing
      navigate("/auth");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: error.message || "An error occurred while signing out",
        variant: "destructive",
      });
      setIsSigningOut(false);
    }
  };

  const handleProfileClick = () => {
    console.log("Navigating to profile page");
    // Use navigate instead of window.location for better routing
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    console.log("Navigating to profile settings");
    navigate("/profile?tab=settings");
  };

  const handleSubscriptionClick = () => {
    console.log("Navigating to subscription page");
    navigate("/profile?tab=subscription");
  };

  if (authLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <User className="h-5 w-5" />
      </Button>
    );
  }

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-[#01729b]"
        onClick={() => navigate("/auth")}
      >
        Sign In
      </Button>
    );
  }

  // Get initials from name or email
  const getInitials = () => {
    if (profile?.name) {
      return profile.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  // Get avatar URL from profile
  const getAvatarUrl = () => {
    if (profile?.avatar_url) {
      return profile.avatar_url;
    }
    return `https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-[#01729b] rounded-full"
        >
          <Avatar className="h-8 w-8 border-2 border-white">
            <AvatarImage
              src={getAvatarUrl()}
              alt={profile?.name || user.email}
            />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            {profile?.grade && (
              <p className="text-xs leading-none text-muted-foreground mt-1">
                Grade {profile.grade}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileClick}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettingsClick}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSubscriptionClick}>
          <Award className="mr-2 h-4 w-4" />
          Subscription
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isSigningOut}
          className={isSigningOut ? "opacity-50 cursor-not-allowed" : ""}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isSigningOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
