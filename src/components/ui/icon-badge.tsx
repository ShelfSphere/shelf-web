import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface IconBadgeProps {
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
  size?: number;
}

export function IconBadge({ icon: Icon, className, iconClassName, size = 20 }: IconBadgeProps) {
  return (
    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", className)}>
      <Icon size={size} className={iconClassName} />
    </div>
  );
}
