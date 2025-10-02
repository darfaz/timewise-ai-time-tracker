import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ActivityItem } from "@/components/ActivityItem";
import { useActivities } from "@/hooks/useActivities";
import { useProjects } from "@/hooks/useProjects";
import { useAI } from "@/hooks/useAI";
import { Sparkles, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Timeline = () => {
  const { data: activities = [] } = useActivities();
  const { data: projects = [] } = useProjects();
  const { mutate: generateNarrative, isPending } = useAI();
  const { toast } = useToast();
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  const handleGenerateDescription = (activityId: string) => {
    setSelectedActivityId(activityId);
    generateNarrative(activityId, {
      onSuccess: (data) => {
        toast({
          title: "AI Description Generated",
          description: data,
        });
        setSelectedActivityId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Timeline</h1>
          <p className="mt-1 text-muted-foreground">Track all your activities chronologically</p>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const project = projects.find((p) => p.id === activity.projectId);
          return (
            <div key={activity.id} className="space-y-2">
              <ActivityItem activity={activity} project={project} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleGenerateDescription(activity.id)}
                disabled={isPending && selectedActivityId === activity.id}
                className="ml-14"
              >
                <Sparkles className="mr-2 h-3 w-3" />
                {isPending && selectedActivityId === activity.id
                  ? "Generating..."
                  : "Generate AI Description"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
