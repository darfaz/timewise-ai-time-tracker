import { Activity, Project } from "@/lib/mockData";
import { Clock } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface ActivityItemProps {
  activity: Activity;
  project?: Project;
}

export const ActivityItem = ({ activity, project }: ActivityItemProps) => {
  const IconComponent = (LucideIcons as any)[activity.appIcon] || LucideIcons.Circle;
  
  return (
    <div className="flex items-start gap-3 rounded-lg bg-card p-4 shadow-card transition-all hover:shadow-hover">
      <div className="rounded-lg bg-muted p-2">
        <IconComponent className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="font-medium text-foreground">{activity.appName}</p>
          {project && (
            <Badge variant="secondary" className="text-xs">
              {project.name}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{activity.windowTitle}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {activity.duration}m
          </span>
          <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
};
