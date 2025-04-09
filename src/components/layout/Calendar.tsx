import { useState, useEffect } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Plus,
  Bell,
  Trash2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { format, addDays, isBefore, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: "exam" | "assignment" | "reminder";
  notifyBefore?: number; // days before to notify
}

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventType, setNewEventType] = useState<
    "exam" | "assignment" | "reminder"
  >("reminder");
  const [newEventNotify, setNewEventNotify] = useState<number>(1); // Default 1 day before
  const { toast } = useToast();
  const { profile } = useAuth();

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("calendarEvents");
    if (savedEvents) {
      try {
        // Parse the JSON string and convert date strings back to Date objects
        const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
          ...event,
          date: new Date(event.date),
        }));
        setEvents(parsedEvents);

        // Check for events that need notifications
        checkForNotifications(parsedEvents);
      } catch (error) {
        console.error("Error parsing saved events:", error);
      }
    } else {
      // Set default events if none exist
      const defaultEvents = [
        {
          id: "1",
          title: "Mathematics Test",
          description: "Chapter 5-7 on Algebra",
          date: addDays(new Date(), 3),
          type: "exam",
          notifyBefore: 1,
        },
        {
          id: "2",
          title: "Science Project Due",
          description: "Complete the ecosystem model",
          date: addDays(new Date(), 7),
          type: "assignment",
          notifyBefore: 2,
        },
        {
          id: "3",
          title: "Study Group",
          description: "Meet with classmates to review for exam",
          date: addDays(new Date(), 1),
          type: "reminder",
          notifyBefore: 1,
        },
      ];
      setEvents(defaultEvents);
      saveEvents(defaultEvents);
    }
  }, []);

  // Check for events that need notifications
  const checkForNotifications = (eventsList: CalendarEvent[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    eventsList.forEach((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);

      const notifyDate = new Date(eventDate);
      notifyDate.setDate(notifyDate.getDate() - (event.notifyBefore || 0));

      // If today is the notification date, show a notification
      if (notifyDate.getTime() === today.getTime()) {
        const daysUntil =
          event.notifyBefore === 1
            ? "tomorrow"
            : `in ${event.notifyBefore} days`;
        toast({
          title: `Upcoming ${event.type}: ${event.title}`,
          description: `This is happening ${daysUntil} on ${format(event.date, "MMMM d")}.`,
          variant: "default",
        });
      }
    });
  };

  // Save events to localStorage
  const saveEvents = (eventsList: CalendarEvent[]) => {
    localStorage.setItem("calendarEvents", JSON.stringify(eventsList));
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
  };

  const addEvent = () => {
    if (!date || !newEventTitle.trim()) return;

    const newEvent: CalendarEvent = {
      id: Math.random().toString(36).substring(2, 9),
      title: newEventTitle,
      description: newEventDescription,
      date: date,
      type: newEventType,
      notifyBefore: newEventNotify,
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    setNewEventTitle("");
    setNewEventDescription("");
    setShowAddEvent(false);

    toast({
      title: "Event Added",
      description: `${newEventTitle} has been added to your calendar`,
      variant: "default",
    });
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    setSelectedEvent(null);
    setShowEventDetails(false);

    toast({
      title: "Event Deleted",
      description: "The event has been removed from your calendar",
      variant: "default",
    });
  };

  const viewEventDetails = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return [];
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    );
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "exam":
        return "bg-red-500";
      case "assignment":
        return "bg-blue-500";
      case "reminder":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "exam":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "assignment":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "reminder":
        return <Bell className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const selectedDateEvents = getEventsForDate(date);

  return (
    <div className="border rounded-md bg-white dark:bg-gray-800 shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#0197cf] dark:text-[#01d2ff] flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5" />
          Calendar
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="border-[#0197cf] text-[#0197cf]"
          onClick={() => setShowAddEvent(!showAddEvent)}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Event
        </Button>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title</Label>
              <Input
                id="event-title"
                placeholder="Enter event title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-description">Description (Optional)</Label>
              <Textarea
                id="event-description"
                placeholder="Enter event details"
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-type">Event Type</Label>
                <select
                  id="event-type"
                  className="w-full p-2 text-sm border rounded-md"
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value as any)}
                >
                  <option value="reminder">Reminder</option>
                  <option value="exam">Exam</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-notify">Notify Before</Label>
                <select
                  id="event-notify"
                  className="w-full p-2 text-sm border rounded-md"
                  value={newEventNotify}
                  onChange={(e) => setNewEventNotify(parseInt(e.target.value))}
                >
                  <option value="0">On the day</option>
                  <option value="1">1 day before</option>
                  <option value="2">2 days before</option>
                  <option value="3">3 days before</option>
                  <option value="7">1 week before</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Event Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEvent(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#0197cf] hover:bg-[#01729b]"
              onClick={addEvent}
              disabled={!newEventTitle.trim() || !date}
            >
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        {selectedEvent && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full mr-2",
                    getEventTypeColor(selectedEvent.type),
                  )}
                />
                {selectedEvent.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {format(selectedEvent.date, "PPPP")}
              </div>

              <div className="flex items-center text-sm">
                {getEventTypeIcon(selectedEvent.type)}
                <span className="ml-2">
                  {selectedEvent.type.charAt(0).toUpperCase() +
                    selectedEvent.type.slice(1)}
                </span>
              </div>

              {selectedEvent.description && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-1">Description:</h4>
                  <p className="text-sm">{selectedEvent.description}</p>
                </div>
              )}

              {selectedEvent.notifyBefore !== undefined &&
                selectedEvent.notifyBefore > 0 && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Bell className="h-4 w-4 mr-2" />
                    Notification: {selectedEvent.notifyBefore} day
                    {selectedEvent.notifyBefore !== 1 ? "s" : ""} before
                  </div>
                )}
            </div>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => deleteEvent(selectedEvent.id)}
                className="mr-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
              <Button onClick={() => setShowEventDetails(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
            components={{
              DayContent: ({ day }) => {
                const dayEvents = events.filter(
                  (event) =>
                    event.date.getDate() === day.date.getDate() &&
                    event.date.getMonth() === day.date.getMonth() &&
                    event.date.getFullYear() === day.date.getFullYear(),
                );

                return (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {day.date.getDate()}
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                        {dayEvents.slice(0, 3).map((event, index) => (
                          <div
                            key={index}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              getEventTypeColor(event.type),
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />
        </div>

        <div className="border rounded-md p-3">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Bell className="h-4 w-4 mr-1 text-[#0197cf]" />
            {date ? (
              <span>Events for {format(date, "MMMM d, yyyy")}</span>
            ) : (
              "Select a date"
            )}
          </h3>

          {selectedDateEvents.length > 0 ? (
            <div className="space-y-2">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-2 rounded-md border flex items-start cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => viewEventDetails(event)}
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full mt-1 mr-2",
                      getEventTypeColor(event.type),
                    )}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{event.title}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {event.type.charAt(0).toUpperCase() +
                          event.type.slice(1)}
                      </p>
                      {event.description && (
                        <p className="text-xs text-gray-400 italic truncate max-w-[150px]">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm">
              No events scheduled for this day
            </div>
          )}

          {/* Upcoming events section */}
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Upcoming Events</h3>
            {events
              .filter(
                (event) =>
                  isBefore(new Date(), event.date) && !isToday(event.date),
              )
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 3)
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center p-2 text-xs border-b last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => viewEventDetails(event)}
                >
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mr-2",
                      getEventTypeColor(event.type),
                    )}
                  />
                  <span className="flex-1 truncate">{event.title}</span>
                  <span className="text-gray-500 ml-2">
                    {format(event.date, "MMM d")}
                  </span>
                </div>
              ))}
            {events.filter((event) => isBefore(new Date(), event.date))
              .length === 0 && (
              <div className="text-center py-2 text-gray-500 text-xs">
                No upcoming events
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
