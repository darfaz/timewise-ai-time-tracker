import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EnhancedActivityItem } from "@/components/EnhancedActivityItem";
import { TimelineStats } from "@/components/TimelineStats";
import { TimelineFilters } from "@/components/TimelineFilters";
import { EmptyTimeline } from "@/components/EmptyTimeline";
import { mockActivities, mockProjects } from "@/lib/mockData";

const Timeline = () => {
  const [dateFilter, setDateFilter] = useState("today");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [appFilter, setAppFilter] = useState("all");

  // Using mock data for development
  const activities = mockActivities;
  const projects = mockProjects;

  // Sort activities by timestamp (most recent first)
  const sortedActivities = [...activities].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Activity Timeline</h1>
        <p className="mt-1 text-muted-foreground">
          Your time tracking timeline for today
        </p>
      </div>

      <TimelineStats activities={activities} projects={projects} />

      <TimelineFilters
        onDateFilter={setDateFilter}
        onCategoryFilter={setCategoryFilter}
        onAppFilter={setAppFilter}
      />

      {sortedActivities.length === 0 ? (
        <EmptyTimeline />
      ) : (
        <ScrollArea className="h-[calc(100vh-28rem)]">
          <div className="pr-4">
            {sortedActivities.map((activity, index) => {
              const project = projects.find((p) => p.id === activity.projectId);
              return (
                <EnhancedActivityItem
                  key={activity.id}
                  activity={activity}
                  project={project}
                  showTimeline={index < sortedActivities.length - 1}
                />
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default Timeline;
