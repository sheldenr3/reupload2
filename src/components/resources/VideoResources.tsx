import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Video, Play } from "lucide-react";

interface VideoResource {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
}

interface VideoResourcesProps {
  topic: {
    id: string;
    name: string;
  } | null;
}

export default function VideoResources({ topic }: VideoResourcesProps) {
  // This would typically come from an API based on the selected topic
  const videos: VideoResource[] = topic
    ? [
        {
          id: "v1",
          title: `Introduction to ${topic.name}`,
          description: `A comprehensive introduction to ${topic.name} for South African students.`,
          thumbnailUrl:
            "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&q=80",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        },
        {
          id: "v2",
          title: `Advanced ${topic.name} Concepts`,
          description: `Dive deeper into ${topic.name} with this advanced lesson.`,
          thumbnailUrl:
            "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&q=80",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        },
      ]
    : [];

  return (
    <div className="border rounded-md bg-white dark:bg-gray-800 p-4 shadow-md">
      <h2 className="text-xl font-bold mb-4 text-[#0197cf] dark:text-[#01d2ff] flex items-center">
        <Video className="mr-2 h-5 w-5" />
        {topic
          ? `Video Resources: ${topic.name}`
          : "Select a topic to view video resources"}
      </h2>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="overflow-hidden border-[#e6f7fc] dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-[#0197cf] rounded-full p-3">
                    <Play className="h-8 w-8 text-white" fill="white" />
                  </div>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#0197cf] dark:text-[#01d2ff]">
                  {video.title}
                </CardTitle>
                <CardDescription>{video.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <iframe
                  src={video.videoUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-0 invisible absolute"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-[#0197cf] p-12 bg-[#f5fcff] dark:bg-gray-900 rounded-md">
          {topic
            ? "No video resources available for this topic yet"
            : "Select a topic to view available video resources"}
        </div>
      )}
    </div>
  );
}
