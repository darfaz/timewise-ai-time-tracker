import { Activity, Project } from "@/lib/mockData";
import * as LucideIcons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useConfig } from "@/contexts/ConfigContext";

interface EnhancedActivityItemProps {
  activity: Activity;
  project?: Project;
  showTimeline?: boolean;
  onClick?: () => void;
}

export const EnhancedActivityItem = ({
  activity,
  project,
  showTimeline = true,
  onClick,
}: EnhancedActivityItemProps) => {
  const { LEGAL_MODE } = useConfig();
  const IconComponent = (LucideIcons as any)[activity.appIcon] || LucideIcons.Circle;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const startTime = new Date(activity.timestamp);
  const endTime = new Date(startTime.getTime() + activity.duration * 60000);
  const timeRange = `${format(startTime, "h:mm a")} - ${format(endTime, "h:mm a")}`;

  const isBillable = project?.billableRate && project.billableRate > 0;

  return (
    <div className="flex gap-4 group">
      {showTimeline && (
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-primary p-2 shadow-card">
            <IconComponent className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="w-0.5 h-full bg-border mt-2"></div>
        </div>
      )}
      
      <div className="flex-1 pb-6">
        <div 
          className="rounded-lg bg-card p-5 shadow-card hover:shadow-hover transition-all duration-200 border border-border cursor-pointer"
          onClick={onClick}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{activity.appName}</h3>
                {project && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                    style={{ backgroundColor: `${project.color}15`, color: project.color }}
                  >
                    {project.name}
                  </Badge>
                )}
                {LEGAL_MODE && (
                  <Badge 
                    variant={isBillable ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {isBillable ? "Billable" : "Non-billable"}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{activity.windowTitle}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <LucideIcons.Clock className="h-3 w-3" />
              {timeRange}
            </span>
            <span className="font-medium text-primary">
              {formatDuration(activity.duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
