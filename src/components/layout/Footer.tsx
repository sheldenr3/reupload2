import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-[#0197cf]/5 dark:bg-[#01729b]/10">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} Lumerous. All rights reserved.
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          Made with <Heart className="h-3 w-3 mx-1 text-red-500 fill-red-500" />{" "}
          for South African students
        </div>
      </div>
    </footer>
  );
}
