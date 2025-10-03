import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  title: string;
  count: number;
  variant: "error" | "warning" | "success";
  icon: LucideIcon;
  onView?: () => void;
}

export const AlertCard = ({ title, count, variant, icon: Icon, onView }: AlertCardProps) => {
  const variantStyles = {
    error: "border-destructive/50 bg-destructive/5",
    warning: "border-warning/50 bg-warning/5",
    success: "border-green-500/50 bg-green-500/5",
  };

  const iconStyles = {
    error: "text-destructive",
    warning: "text-warning",
    success: "text-green-500",
  };

  return (
    <Card className={cn("border-2", variantStyles[variant])}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <Icon className={cn("h-5 w-5", iconStyles[variant])} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold">{count}</div>
          {onView && (
            <Button variant="outline" size="sm" onClick={onView}>
              View
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
