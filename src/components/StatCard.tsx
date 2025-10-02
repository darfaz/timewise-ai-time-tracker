import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning";
}

export const StatCard = ({ title, value, subtitle, icon: Icon, variant = "default" }: StatCardProps) => {
  const variantStyles = {
    default: "bg-gradient-primary",
    success: "bg-gradient-success",
    warning: "bg-gradient-to-br from-warning to-warning/80",
  };

  return (
    <div className="group rounded-xl bg-card p-6 shadow-card transition-all hover:shadow-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className={cn("rounded-lg p-3", variantStyles[variant])}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};
