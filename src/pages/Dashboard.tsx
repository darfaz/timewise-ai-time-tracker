import { motion } from "framer-motion";
import { StatCard } from "@/components/StatCard";
import { TodaysOverview } from "@/components/TodaysOverview";
import { TopProjectsWidget } from "@/components/TopProjectsWidget";
import { QuickActions } from "@/components/QuickActions";
import { CompactActivityItem } from "@/components/CompactActivityItem";
import { Clock, DollarSign, FolderKanban, TrendingUp } from "lucide-react";
import { useActivities } from "@/hooks/useActivities";
import { useProjects } from "@/hooks/useProjects";
import { mockWeeklyData } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const Dashboard = () => {
  const { data: activities = [], isLoading: activitiesLoading } = useActivities();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  const todayHours = activities.reduce((sum, activity) => sum + activity.duration, 0) / 60;
  const billableHours = activities
    .filter((a) => a.projectId && projects.find((p) => p.id === a.projectId)?.billableRate)
    .reduce((sum, activity) => sum + activity.duration, 0) / 60;
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const weeklyTotal = mockWeeklyData.reduce((sum, day) => sum + day.hours, 0);

  // Calculate weekly hours per project
  const projectWeeklyHours = projects.map((project) => ({
    projectId: project.id,
    hours: Math.random() * 20 + 5, // Mock data - replace with real calculation
  })).sort((a, b) => b.hours - a.hours);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-white shadow-hover"
      >
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
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
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
      </motion.div>

      {/* Today's Overview and Top Projects */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TodaysOverview hoursToday={todayHours} goalHours={8} />
        <TopProjectsWidget projects={projects} weeklyHours={projectWeeklyHours} />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Weekly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-xl bg-card p-6 shadow-card"
      >
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
            <Legend />
            <Bar dataKey="billable" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 0, 0]} name="Billable" />
            <Bar dataKey="nonBillable" stackId="a" fill="hsl(var(--muted-foreground))" radius={[8, 8, 0, 0]} name="Non-Billable" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="rounded-xl bg-card p-6 shadow-card"
      >
        <h2 className="mb-6 text-xl font-bold text-foreground">Recent Activity</h2>
        {activitiesLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {activities.slice(0, 10).map((activity, index) => {
              const project = projects.find((p) => p.id === activity.projectId);
              return <CompactActivityItem key={activity.id} activity={activity} project={project} index={index} />;
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
