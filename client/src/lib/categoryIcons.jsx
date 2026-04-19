import {
  BookOpen,
  Briefcase,
  CalendarDays,
  Car,
  CircleDollarSign,
  Gift,
  Dumbbell,
  HeartPulse,
  Home,
  Inbox,
  PawPrint,
  Plane,
  ShoppingCart,
  Tag,
  Utensils,
  Wrench,
} from "lucide-react";

export const DEFAULT_CATEGORY_ICONS = {
  General: "inbox",
  Work: "briefcase",
  Home: "home",
  Gym: "dumbbell",
};

export const CATEGORY_ICON_OPTIONS = [
  { id: "tag", label: "Tag", Icon: Tag },
  { id: "briefcase", label: "Work", Icon: Briefcase },
  { id: "home", label: "Home", Icon: Home },
  { id: "dumbbell", label: "Gym", Icon: Dumbbell },
  { id: "groceries", label: "Groceries", Icon: ShoppingCart },
  { id: "pets", label: "Pets", Icon: PawPrint },
  { id: "errands", label: "Errands", Icon: Car },
  { id: "meals", label: "Meals", Icon: Utensils },
  { id: "bills", label: "Bills", Icon: CircleDollarSign },
  { id: "health", label: "Health", Icon: HeartPulse },
  { id: "travel", label: "Travel", Icon: Plane },
  { id: "appointments", label: "Appointments", Icon: CalendarDays },
  { id: "study", label: "Study", Icon: BookOpen },
  { id: "chores", label: "Chores", Icon: Wrench },
  { id: "gifts", label: "Gifts", Icon: Gift },
];

const CATEGORY_ICON_MAP = {
  inbox: Inbox,
  tag: Tag,
  briefcase: Briefcase,
  home: Home,
  dumbbell: Dumbbell,
  groceries: ShoppingCart,
  pets: PawPrint,
  errands: Car,
  meals: Utensils,
  bills: CircleDollarSign,
  health: HeartPulse,
  travel: Plane,
  appointments: CalendarDays,
  study: BookOpen,
  chores: Wrench,
  gifts: Gift,
};

export function getCategoryIcon(category, categoryIcons = {}) {
  const iconId =
    categoryIcons[category] || DEFAULT_CATEGORY_ICONS[category] || "tag";

  return CATEGORY_ICON_MAP[iconId] || Tag;
}
