import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Bell,
  X,
  CheckCircle,
  Calendar,
  Book,
  MessageSquare,
  Info,
  AlertCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { format, isToday, isYesterday, addDays } from "date-fns";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "calendar" | "syllabus" | "message" | "system" | "exam" | "assignment";
  read: boolean;
  timestamp: Date;
  link?: string; // Optional link to navigate to when clicked
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);

  // Load notifications from localStorage on component mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("userNotifications");
    if (savedNotifications) {
      try {
        // Parse the JSON string and convert date strings back to Date objects
        const parsedNotifications = JSON.parse(savedNotifications).map(
          (notification: any) => ({
            ...notification,
            timestamp: new Date(notification.timestamp),
          }),
        );
        setNotifications(parsedNotifications);
      } catch (error) {
        console.error("Error parsing saved notifications:", error);
        setDefaultNotifications();
      }
    } else {
      setDefaultNotifications();
    }

    // Check for calendar events and create notifications
    checkCalendarEvents();
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("userNotifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  // Set default notifications if none exist
  const setDefaultNotifications = () => {
    const defaultNotifications: Notification[] = [
      {
        id: "1",
        title: "Welcome to Lumerous",
        message: "Get started with your personalized learning journey.",
        type: "system",
        read: false,
        timestamp: new Date(),
      },
      {
        id: "2",
        title: "Syllabus Updated",
        message: `The Grade ${profile?.grade || "10"} curriculum has been updated with new content.`,
        type: "syllabus",
        read: false,
        timestamp: addDays(new Date(), -1),
      },
      {
        id: "3",
        title: "Study Reminder",
        message: "Don't forget to complete your daily learning goals.",
        type: "message",
        read: false,
        timestamp: addDays(new Date(), -2),
      },
    ];
    setNotifications(defaultNotifications);
    localStorage.setItem(
      "userNotifications",
      JSON.stringify(defaultNotifications),
    );
  };

  // Check calendar events and create notifications for upcoming events
  const checkCalendarEvents = () => {
    const savedEvents = localStorage.getItem("calendarEvents");
    if (!savedEvents) return;

    try {
      const events = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        date: new Date(event.date),
      }));

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check for events happening today or tomorrow
      events.forEach((event: any) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);

        // Check if event is today or tomorrow and we haven't already notified
        if (
          isToday(eventDate) ||
          eventDate.getTime() === addDays(today, 1).getTime()
        ) {
          // Check if we already have a notification for this event
          const existingNotification = notifications.find(
            (n) =>
              n.title.includes(event.title) &&
              n.type ===
                (event.type === "exam"
                  ? "exam"
                  : event.type === "assignment"
                    ? "assignment"
                    : "calendar"),
          );

          if (!existingNotification) {
            const dayText = isToday(eventDate) ? "today" : "tomorrow";
            addNotification({
              id: `event-${event.id}`,
              title: `Upcoming ${event.type}: ${event.title}`,
              message: `You have a ${event.type} scheduled for ${dayText} (${format(eventDate, "MMMM d")}).`,
              type:
                event.type === "exam"
                  ? "exam"
                  : event.type === "assignment"
                    ? "assignment"
                    : "calendar",
              read: false,
              timestamp: new Date(),
            });
          }
        }
      });
    } catch (error) {
      console.error("Error checking calendar events:", error);
    }
  };

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true })),
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id),
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "calendar":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "syllabus":
        return <Book className="h-4 w-4 text-green-500" />;
      case "message":
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case "exam":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "assignment":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "system":
        return <Info className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatNotificationTime = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return `Today at ${format(timestamp, "h:mm a")}`;
    } else if (isYesterday(timestamp)) {
      return `Yesterday at ${format(timestamp, "h:mm a")}`;
    } else {
      return format(timestamp, "MMM d, yyyy");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white hover:bg-[#01729b] rounded-full"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="bg-[#0197cf] text-white p-3 flex justify-between items-center rounded-t-md">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-white hover:bg-[#01729b] text-xs"
              onClick={markAllAsRead}
            >
              <CheckCircle className="h-3 w-3 mr-1" /> Mark all as read
            </Button>
          )}
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 border-b last:border-b-0 flex items-start",
                    !notification.read && "bg-[#f5fcff] dark:bg-gray-900",
                    notification.link &&
                      "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800",
                  )}
                  onClick={() => {
                    if (notification.link) {
                      window.location.href = notification.link;
                      markAsRead(notification.id);
                    }
                  }}
                >
                  <div className="mr-3 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium">
                        {notification.title}
                      </h4>
                      <div className="flex items-center">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatNotificationTime(notification.timestamp)}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No notifications</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
