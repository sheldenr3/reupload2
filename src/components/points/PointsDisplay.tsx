import { usePoints } from "@/contexts/PointsContext";
import { Award, Flame } from "lucide-react";

export default function PointsDisplay() {
  const { points, streak } = usePoints();

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center bg-[#ffcc00] text-[#333] px-3 py-1 rounded-full">
        <Award className="w-4 h-4 mr-2" />
        <span className="font-semibold text-sm">{points}</span>
      </div>
      <div className="flex items-center bg-[#ff6600] text-white px-3 py-1 rounded-full">
        <Flame className="w-4 h-4 mr-2" />
        <span className="font-semibold text-sm">{streak.current}d</span>
      </div>
    </div>
  );
}
