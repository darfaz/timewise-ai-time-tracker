import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/StatCard";
import { TodaysOverview } from "@/components/TodaysOverview";
import { TopProjectsWidget } from "@/components/TopProjectsWidget";
import { QuickActions } from "@/components/QuickActions";
import { CompactActivityItem } from "@/components/CompactActivityItem";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { TimeByCategoryChart } from "@/components/TimeByCategoryChart";
import { DailyTrendChart } from "@/components/DailyTrendChart";
import { TimeByMatterChart } from "@/components/TimeByMatterChart";
import { AlertCard } from "@/components/AlertCard";
import { ProductivityInsights } from "@/components/ProductivityInsights";
import { Clock, DollarSign, FolderKanban, TrendingUp, AlertCircle, AlertTriangle, CheckCircle, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActivities } from "@/hooks/useApi";
import { useProjects } from "@/hooks/useProjects";
import { useMatters, useClients } from "@/hooks/useApi";
import { useConfig } from "@/contexts/ConfigContext";
import { mockWeeklyData } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DateRange } from "react-day-picker";
import { startOfToday, startOfYesterday, startOfWeek, endOfWeek, subWeeks, format, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { LEGAL_MODE } = useConfig();
  const navigate = useNavigate();
  const { data: activities = [], isLoading: activitiesLoading } = useActivities();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: matters = [] } = useMatters();
  const { data: clients = [] } = useClients();

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfToday(),
    to: startOfToday(),
  });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Quick range handlers
  const quickRanges = [
    {
      label: "Today",
      onClick: () => setDateRange({ from: startOfToday(), to: startOfToday() }),
    },
    {
      label: "Yesterday",
      onClick: () => setDateRange({ from: startOfYesterday(), to: startOfYesterday() }),
    },
    {
      label: "This Week",
      onClick: () => setDateRange({ from: startOfWeek(new Date()), to: endOfWeek(new Date()) }),
    },
    {
      label: "Last Week",
      onClick: () => {
        const lastWeek = subWeeks(new Date(), 1);
        setDateRange({ from: startOfWeek(lastWeek), to: endOfWeek(lastWeek) });
      },
    },
  ];

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

  // Calculate category distribution for general mode
  const categoryData = activities.reduce((acc, activity) => {
    const category = activity.category || "Uncategorized";
    const existing = acc.find((c) => c.name === category);
    if (existing) {
      existing.value += activity.duration;
    } else {
      acc.push({ name: category, value: activity.duration, color: `hsl(${Math.random() * 360}, 70%, 50%)` });
    }
    return acc;
  }, [] as { name: string; value: number; color: string }[]);

  // Calculate daily trend (last 7 days)
  const dailyTrend = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date: format(date, "EEE"),
      hours: Math.random() * 8 + 2, // Mock data
    };
  });

  // Legal mode: Calculate matter distribution
  const matterData = matters.slice(0, 5).map((matter) => ({
    matter: matter.name,
    hours: Math.random() * 15 + 5, // Mock data
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
  }));

  // Legal mode: Compliance metrics
  const totalEntries = activities.length;
  const compliantEntries = Math.floor(totalEntries * 0.85);
  const warningEntries = Math.floor(totalEntries * 0.10);
  const errorEntries = totalEntries - compliantEntries - warningEntries;
  const complianceRate = totalEntries > 0 ? (compliantEntries / totalEntries) * 100 : 100;
  const unbilledEntries = activities.filter((a) => !a.projectId).length;

  // Productivity insights
  const mostProductiveHour = "9:00 AM - 11:00 AM";
  const topApps = [
    { name: "VS Code", minutes: 240 },
    { name: "Chrome", minutes: 180 },
    { name: "Slack", minutes: 90 },
  ];
  const distractions = Math.floor(Math.random() * 15) + 5;

  const handleExportReport = () => {
    // Mock export functionality
    const blob = new Blob(["Dashboard Report"], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (LEGAL_MODE) {
    // Legal Mode Dashboard
    return (
      <div className="space-y-6">
        {/* Header with Date Range and Actions */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Last updated: {Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000)}s ago
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DateRangeSelector
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              quickRanges={quickRanges}
            />
            <Button variant="outline" size="sm" onClick={() => setLastUpdated(new Date())}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Billable Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            title="Today's Billable Hours"
            value={billableHours.toFixed(1)}
            subtitle="Logged today"
            icon={Clock}
            variant="default"
          />
          <StatCard
            title="This Week's Hours"
            value={weeklyTotal.toFixed(1)}
            subtitle="vs 40h target"
            icon={TrendingUp}
            variant={weeklyTotal >= 40 ? "success" : "warning"}
          />
          <StatCard
            title="Compliance Rate"
            value={`${complianceRate.toFixed(0)}%`}
            subtitle="Clean entries"
            icon={CheckCircle}
            variant={complianceRate >= 90 ? "success" : "warning"}
          />
          <StatCard
            title="Unbilled Entries"
            value={unbilledEntries.toString()}
            subtitle="Needs matter assignment"
            icon={AlertCircle}
            variant={unbilledEntries > 0 ? "warning" : "success"}
          />
        </motion.div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TimeByMatterChart data={matterData} />
          <DailyTrendChart data={dailyTrend} />
        </div>

        {/* Alerts & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="mb-4 text-xl font-bold text-foreground">Alerts & Actions</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <AlertCard
              title="Entries Needing Review"
              count={errorEntries}
              variant="error"
              icon={AlertCircle}
              onView={() => navigate("/ledes-export")}
            />
            <AlertCard
              title="Compliance Warnings"
              count={warningEntries}
              variant="warning"
              icon={AlertTriangle}
              onView={() => navigate("/ledes-export")}
            />
            <AlertCard
              title="Ready to Export"
              count={compliantEntries}
              variant="success"
              icon={CheckCircle}
              onView={() => navigate("/ledes-export")}
            />
          </div>
        </motion.div>

        {/* Recent Matters and Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-xl bg-card p-6 shadow-card"
          >
            <h2 className="mb-4 text-xl font-bold text-foreground">Recent Matters</h2>
            <div className="space-y-3">
              {matters.slice(0, 5).map((matter) => (
                <div
                  key={matter.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted"
                  onClick={() => navigate("/matters")}
                >
                  <div>
                    <p className="font-medium text-foreground">{matter.name}</p>
                    <p className="text-sm text-muted-foreground">{matter.clientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{matter.status}</p>
                    <p className="text-xs text-muted-foreground">#{matter.matterId}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="rounded-xl bg-card p-6 shadow-card"
          >
            <h2 className="mb-4 text-xl font-bold text-foreground">Recent Activity</h2>
            {activitiesLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {activities.slice(0, 5).map((activity, index) => {
                  const project = projects.find((p) => p.id === activity.projectId);
                  return <CompactActivityItem key={activity.id} activity={activity} project={project} index={index} />;
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // General Mode Dashboard
  return (
    <div className="space-y-6">
      {/* Header with Date Range and Actions */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000)}s ago
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DateRangeSelector
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            quickRanges={quickRanges}
          />
          <Button variant="outline" size="sm" onClick={() => setLastUpdated(new Date())}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

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

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TimeByCategoryChart data={categoryData} />
        <DailyTrendChart data={dailyTrend} />
      </div>

      {/* Today's Overview and Top Projects */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TodaysOverview hoursToday={todayHours} goalHours={8} />
        <TopProjectsWidget projects={projects} weeklyHours={projectWeeklyHours} />
      </div>

      {/* Productivity Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h2 className="mb-4 text-xl font-bold text-foreground">Productivity Insights</h2>
        <ProductivityInsights
          mostProductiveHour={mostProductiveHour}
          topApps={topApps}
          distractions={distractions}
        />
      </motion.div>

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
