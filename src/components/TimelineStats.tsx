import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign, PieChart, TrendingUp } from "lucide-react";
import { Activity, Project } from "@/lib/mockData";
import { useConfig } from "@/contexts/ConfigContext";

interface TimelineStatsProps {
  activities: Activity[];
  projects: Project[];
}

export const TimelineStats = ({ activities, projects }: TimelineStatsProps) => {
  const { LEGAL_MODE } = useConfig();

  const totalMinutes = activities.reduce((acc, act) => acc + act.duration, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;

  const billableMinutes = activities.reduce((acc, act) => {
    const project = projects.find(p => p.id === act.projectId);
    return project?.billableRate ? acc + act.duration : acc;
  }, 0);
  const billableHours = Math.floor(billableMinutes / 60);
  const billableMins = billableMinutes % 60;

  const nonBillableMinutes = totalMinutes - billableMinutes;
  const nonBillableHours = Math.floor(nonBillableMinutes / 60);
  const nonBillableMins = nonBillableMinutes % 60;

  const billablePercentage = totalMinutes > 0 ? Math.round((billableMinutes / totalMinutes) * 100) : 0;
  const captureRate = 75; // Mock capture rate

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card className="shadow-card hover:shadow-hover transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Time Today</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {totalHours}h {totalMins}m
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Across {activities.length} activities
          </p>
        </CardContent>
      </Card>

      {LEGAL_MODE && (
        <>
          <Card className="shadow-card hover:shadow-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Billable Time</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {billableHours}h {billableMins}m
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {billablePercentage}% of total time
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Non-Billable</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {nonBillableHours}h {nonBillableMins}m
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {100 - billablePercentage}% of total time
              </p>
            </CardContent>
          </Card>
        </>
      )}

      <Card className="shadow-card hover:shadow-hover transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Capture Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{captureRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Tracked vs total time
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
