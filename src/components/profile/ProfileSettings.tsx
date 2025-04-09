import { useState, useEffect, useRef } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loader2,
  Save,
  GraduationCap,
  MapPin,
  Upload,
  Camera,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";

export default function ProfileSettings() {
  const { profile, updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile]);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${profile?.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const avatarUrl = data.publicUrl;

      // Update the user's profile with the avatar URL
      await updateProfile({ avatar_url: avatarUrl });
      setAvatarUrl(avatarUrl);

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading avatar",
        description:
          error.message || "An error occurred while uploading your avatar.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        name,
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      // Error is already handled in the updateProfile function
    } finally {
      setLoading(false);
    }
  };

  // Get initials from name or email for avatar fallback
  const getInitials = () => {
    if (name) {
      return name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-[#e6f7fc] dark:border-gray-700 shadow-md">
      <CardHeader className="bg-[#f5fcff] dark:bg-gray-900 border-b">
        <CardTitle className="text-[#0197cf] dark:text-[#01d2ff]">
          Profile Settings
        </CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center space-y-3 mb-4">
            <Avatar className="h-24 w-24 border-2 border-[#0197cf]">
              <AvatarImage src={avatarUrl || undefined} alt={name} />
              <AvatarFallback className="bg-[#0197cf] text-white text-xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              onChange={uploadAvatar}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={triggerFileInput}
              disabled={uploading}
              className="text-xs"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-3 w-3" />
                  Change Profile Picture
                </>
              )}
            </Button>
          </div>
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
              value={email}
              disabled
              className="bg-gray-100 dark:bg-gray-800"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed. Contact support if you need to update
              your email.
            </p>
          </div>

          {/* Display grade as read-only information */}
          <div className="space-y-2">
            <Label>Grade</Label>
            <div className="flex items-center p-2 rounded-md bg-gray-100 dark:bg-gray-800">
              <GraduationCap className="h-4 w-4 mr-2 text-[#0197cf]" />
              <span>
                {profile?.grade ? `Grade ${profile.grade}` : "Not specified"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your grade is set during registration and cannot be changed.
              Contact support if you need to update your grade.
            </p>
          </div>

          {/* Display country as read-only information */}
          <div className="space-y-2">
            <Label>Country</Label>
            <div className="flex items-center p-2 rounded-md bg-gray-100 dark:bg-gray-800">
              <MapPin className="h-4 w-4 mr-2 text-[#0197cf]" />
              <span>South Africa</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This platform is designed for South African curriculum.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#0197cf] hover:bg-[#01729b]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
