import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";

interface StudyTimerProps {
  onComplete?: () => void;
  onEarnPoints?: (points: number) => void;
}

export default function StudyTimer({
  onComplete,
  onEarnPoints,
}: StudyTimerProps) {
  const [studyDuration, setStudyDuration] = useState(25); // minutes
  const [breakDuration, setBreakDuration] = useState(5); // minutes
  const [timeLeft, setTimeLeft] = useState(studyDuration * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3",
    );
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            if (audioRef.current) audioRef.current.play();

            if (isBreak) {
              // Break finished, start study session
              toast({
                title: "Break time over!",
                description: "Time to get back to studying.",
                variant: "default",
              });
              setIsBreak(false);
              setTimeLeft(studyDuration * 60);
            } else {
              // Study session finished, start break
              const earnedPoints = 10 + completedSessions * 2; // More points for consecutive sessions
              setCompletedSessions((prev) => prev + 1);
              if (onEarnPoints) onEarnPoints(earnedPoints);

              toast({
                title: "Study session complete!",
                description: `You earned ${earnedPoints} points. Take a break now.`,
                variant: "default",
              });
              setIsBreak(true);
              setTimeLeft(breakDuration * 60);
              if (onComplete) onComplete();
            }
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [
    isRunning,
    isBreak,
    studyDuration,
    breakDuration,
    onComplete,
    completedSessions,
    onEarnPoints,
    toast,
  ]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(studyDuration * 60);
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalSeconds = isBreak ? breakDuration * 60 : studyDuration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border shadow-md">
      <h3 className="text-xl font-bold text-[#0197cf] mb-4 flex items-center">
        {isBreak ? (
          <>
            <Coffee className="mr-2 h-5 w-5" /> Break Time
          </>
        ) : (
          <>
            <Brain className="mr-2 h-5 w-5" /> Study Timer
          </>
        )}
      </h3>

      <div className="mb-6">
        <div className="text-center mb-2">
          <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
        </div>
        <Progress value={calculateProgress()} className="h-2 mb-2" />
        <div className="text-xs text-center text-muted-foreground">
          {isBreak ? "Break" : "Study"} session{" "}
          {completedSessions > 0 ? `#${completedSessions + 1}` : "#1"}
        </div>
      </div>

      <div className="flex justify-center space-x-2 mb-6">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className={
            isRunning
              ? "bg-amber-500 hover:bg-amber-600"
              : "bg-[#0197cf] hover:bg-[#01729b]"
          }
        >
          {isRunning ? (
            <>
              <Pause className="mr-2 h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />{" "}
              {timeLeft === (isBreak ? breakDuration : studyDuration) * 60
                ? "Start"
                : "Resume"}
            </>
          )}
        </Button>
        <Button variant="outline" onClick={resetTimer} disabled={isRunning}>
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">
              Study Duration: {studyDuration} min
            </label>
          </div>
          <Slider
            value={[studyDuration]}
            min={5}
            max={60}
            step={5}
            onValueChange={(value) => {
              setStudyDuration(value[0]);
              if (!isRunning && !isBreak) setTimeLeft(value[0] * 60);
            }}
            disabled={isRunning}
            className="mb-6"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">
              Break Duration: {breakDuration} min
            </label>
          </div>
          <Slider
            value={[breakDuration]}
            min={1}
            max={30}
            step={1}
            onValueChange={(value) => {
              setBreakDuration(value[0]);
              if (!isRunning && isBreak) setTimeLeft(value[0] * 60);
            }}
            disabled={isRunning}
            className="mb-2"
          />
        </div>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        <p className="mb-1">Completed sessions: {completedSessions}</p>
        <p>
          Total study time:{" "}
          {Math.floor((completedSessions * studyDuration) / 60)} hr{" "}
          {(completedSessions * studyDuration) % 60} min
        </p>
      </div>
    </div>
  );
}
