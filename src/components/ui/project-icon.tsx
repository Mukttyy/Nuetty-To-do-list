import {
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Dumbbell,
  Folder,
  Heart,
  Home,
  Lightbulb,
  ListChecks,
  Plane,
  ShoppingBag,
  Target,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export const projectIconOptions = [
  { value: "folder", label: "Folder", icon: Folder },
  { value: "briefcase", label: "Work", icon: BriefcaseBusiness },
  { value: "user", label: "Personal", icon: UserRound },
  { value: "home", label: "Home", icon: Home },
  { value: "target", label: "Goal", icon: Target },
  { value: "book", label: "Learning", icon: BookOpen },
  { value: "heart", label: "Wellbeing", icon: Heart },
  { value: "dumbbell", label: "Fitness", icon: Dumbbell },
  { value: "calendar", label: "Planning", icon: CalendarDays },
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
  { value: "idea", label: "Ideas", icon: Lightbulb },
  { value: "travel", label: "Travel", icon: Plane },
  { value: "checklist", label: "Checklist", icon: ListChecks },
] as const;

const iconByName = Object.fromEntries(
  projectIconOptions.map(({ value, icon }) => [value, icon])
) as Record<string, LucideIcon>;

interface ProjectIconProps {
  name?: string;
  className?: string;
  style?: CSSProperties;
}

export function ProjectIcon({ name, className, style }: ProjectIconProps) {
  const Icon = (name && iconByName[name]) || Folder;
  return <Icon aria-hidden="true" className={cn("h-4 w-4", className)} style={style} />;
}
