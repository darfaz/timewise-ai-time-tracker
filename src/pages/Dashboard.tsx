import { StatCard } from "@/components/StatCard";
import { ActivityItem } from "@/components/ActivityItem";
import { Clock, DollarSign, FolderKanban, TrendingUp } from "lucide-react";
import { useActivities } from "@/hooks/useActivities";
import { useProjects } from "@/hooks/useProjects";
import { mockWeeklyData } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { data: activities = [], isLoading: activitiesLoading } = useActivities();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  const todayHours = activities.reduce((sum, activity) => sum + activity.duration, 0) / 60;
  const billableHours = activities
    .filter((a) => a.projectId && projects.find((p) => p.id === a.projectId)?.billableRate)
    .reduce((sum, activity) => sum + activity.duration, 0) / 60;
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const weeklyTotal = mockWeeklyData.reduce((sum, day) => sum + day.hours, 0);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-white shadow-hover">
        <div className="relative z-10">
          <h1 className="mb-2 text-4xl font-bold">Welcome back!</h1>
          <p className="mb-4 text-lg opacity-90">You've tracked {todayHours.toFixed(1)} hours today</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium">
              {weeklyTotal.toFixed(1)} hours this week
            </span>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
          <Clock className="absolute right-8 top-8 h-64 w-64" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Hours"
          value={todayHours.toFixed(1)}
          subtitle="Keep up the great work!"
          icon={Clock}
          variant="default"
        />
        <StatCard
          title="Billable Hours"
          value={billableHours.toFixed(1)}
          subtitle="Ready to invoice"
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          title="Active Projects"
          value={activeProjects.toString()}
          subtitle="In progress"
          icon={FolderKanban}
          variant="warning"
        />
        <StatCard
          title="Weekly Total"
          value={weeklyTotal.toFixed(1)}
          subtitle="This week"
          icon={TrendingUp}
          variant="default"
        />
      </div>

      {/* Weekly Chart */}
      <div className="rounded-xl bg-card p-6 shadow-card">
        <h2 className="mb-6 text-xl font-bold text-foreground">Weekly Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockWeeklyData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="day" className="text-muted-foreground" />
            <YAxis className="text-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl bg-card p-6 shadow-card">
        <h2 className="mb-6 text-xl font-bold text-foreground">Recent Activity</h2>
        {activitiesLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 10).map((activity) => {
              const project = projects.find((p) => p.id === activity.projectId);
              return <ActivityItem key={activity.id} activity={activity} project={project} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
