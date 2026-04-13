import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import type { HabitColor } from "@/lib/habitStore";

const COLORS: { value: HabitColor; label: string }[] = [
  { value: "pink", label: "🩷" },
  { value: "blue", label: "💙" },
  { value: "green", label: "💚" },
  { value: "purple", label: "💜" },
  { value: "orange", label: "🧡" },
  { value: "yellow", label: "💛" },
  { value: "teal", label: "🩵" },
];

const EMOJIS = ["💧", "🏋️", "📚", "🧘", "🚶", "📓", "😴", "🍎", "🎯", "🎨", "🎵", "🧹", "💊", "🌱", "🏃"];

interface Props {
  onAdd: (habit: { name: string; emoji: string; color: HabitColor; goal: string; frequency: string }) => void;
}

export default function AddHabitDialog({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [color, setColor] = useState<HabitColor>("green");
  const [goal, setGoal] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), emoji, color, goal: goal.trim(), frequency: "daily" });
    setName("");
    setGoal("");
    setEmoji("🎯");
    setColor("green");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-14 w-14 rounded-2xl shadow-xl fixed bottom-8 right-8 z-50 gradient-hero text-primary-foreground hover:scale-110 transition-transform">
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">New Habit ✨</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <Input placeholder="Habit name (e.g., Drink water)" value={name} onChange={e => setName(e.target.value)} className="h-12 rounded-xl" />
          <Input placeholder="Goal (optional, e.g., 8 glasses)" value={goal} onChange={e => setGoal(e.target.value)} className="h-12 rounded-xl" />

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Choose an icon</p>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`text-2xl p-2 rounded-xl transition-all duration-200 ${
                    emoji === e ? "bg-primary/15 scale-110 ring-2 ring-primary shadow-md" : "hover:bg-muted hover:scale-105"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Color theme</p>
            <div className="flex gap-3">
              {COLORS.map(c => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`text-xl p-2 rounded-xl transition-all duration-200 ${
                    color === c.value ? "bg-primary/15 scale-110 ring-2 ring-primary shadow-md" : "hover:bg-muted hover:scale-105"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full h-12 rounded-xl gradient-hero text-primary-foreground font-semibold text-base" disabled={!name.trim()}>
            Add Habit 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
