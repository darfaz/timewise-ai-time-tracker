import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle, Download, Search, Mail, Calendar, Globe, FileText, Check, Edit, Split, Copy, Trash2, HelpCircle, Plus, Filter, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ExportModal } from "@/components/ExportModal";
import { useActivities } from "@/hooks/useApi";
import { useProjects } from "@/hooks/useProjects";
import { useMatters, useClients } from "@/hooks/useApi";
import { useUiConfig } from "@/contexts/ConfigContext";
import { format, addDays, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const uiConfig = useUiConfig();
  const { tier } = uiConfig;
  const { data: activities = [], isLoading: activitiesLoading } = useActivities();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: matters = [] } = useMatters();
  const { data: clients = [] } = useClients();

  // Feature flags based on tier
  const showUTBMS = tier === 'LEGAL_BASIC' || tier === 'INS_DEF';
  const showLEDES = tier === 'LEGAL_BASIC' || tier === 'INS_DEF';

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [filterView, setFilterView] = useState<"all" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Wait for config to load
  if (!uiConfig.loaded) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="space-y-3 text-center">
          <Skeleton className="mx-auto h-12 w-12 rounded-full" />
          <Skeleton className="mx-auto h-4 w-32" />
        </div>
      </div>
    );
  }

  // Mock data for timesheet entries
  const timeEntries = activities.map((activity, index) => ({
    id: activity.id,
    time: format(activity.timestamp, "h:mm a"),
    source: ["Mail", "Calendar", "Web", "Note"][index % 4] as "Mail" | "Calendar" | "Web" | "Note",
    client: uiConfig.mode === 'legal'
      ? (clients[index % clients.length]?.name || "Client " + (index + 1))
      : "N/A",
    matter: uiConfig.mode === 'legal'
      ? (matters[index % matters.length]?.name || "Matter " + (index + 1))
      : (projects[index % projects.length]?.name || "Project " + (index + 1)),
    narrative: activity.windowTitle || "AI-generated narrative describing the work performed...",
    hours: (activity.duration / 60).toFixed(2),
    status: index % 3 === 0 ? "pending" : "approved" as "pending" | "approved",
    // Legal mode specific fields
    complianceStatus: uiConfig.mode === 'legal' ? (index % 5 === 0 ? "warning" : index % 7 === 0 ? "error" : "ok") as "ok" | "warning" | "error" : "ok",
    requiresLedes: showLEDES && index % 4 === 0,
    utbmsCode: showUTBMS && index % 4 === 0 ? "L210" : undefined,
  }));

  // Filter entries
  const filteredEntries = timeEntries.filter((entry) => {
    const matchesFilter = filterView === "all" || entry.status === filterView;
    const matchesSearch = entry.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.matter.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.narrative.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate stats
  const totalHours = filteredEntries.reduce((sum, entry) => sum + parseFloat(entry.hours), 0);
  const approvedEntries = filteredEntries.filter((e) => e.status === "approved");
  const approvedHours = approvedEntries.reduce((sum, entry) => sum + parseFloat(entry.hours), 0);
  const pendingCount = filteredEntries.filter((e) => e.status === "pending").length;

  const sourceIcons = {
    Mail: Mail,
    Calendar: Calendar,
    Web: Globe,
    Note: FileText,
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Date Navigation */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(subDays(currentDate, 1))}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              {format(currentDate, "EEEE, MMMM d, yyyy")}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(addDays(currentDate, 1))}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Complete
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsExportModalOpen(true)}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-bold text-foreground">{totalHours.toFixed(2)}h</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Approved:</span>
            <span className="font-bold text-foreground">{approvedHours.toFixed(2)}h</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Approved Count:</span>
            <span className="font-bold text-foreground">{approvedEntries.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Pending:</span>
            <span className="font-bold text-foreground">{pendingCount}</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-border bg-card px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Filter Chips */}
          <div className="flex items-center gap-2">
            <Badge
              variant={filterView === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterView("all")}
            >
              View All
            </Badge>
            <Badge
              variant={filterView === "pending" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterView("pending")}
            >
              Pending Only
            </Badge>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Timesheet List */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-4">
          {activitiesLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-center">
              <div>
                <p className="text-lg font-medium text-muted-foreground">No entries found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredEntries.map((entry, index) => {
                const SourceIcon = sourceIcons[entry.source];
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className="group grid grid-cols-[80px_40px_200px_1fr_80px] items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    {/* Time */}
                    <div className="text-sm text-muted-foreground">
                      {entry.time}
                    </div>

                    {/* Source Icon */}
                    <div className="flex items-center justify-center">
                      <SourceIcon className="h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* Action Icons */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Split"
                      >
                        <Split className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Why?"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Main Text */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {uiConfig.mode === 'legal' ? (
                          <>
                            <span className="font-bold text-foreground">{entry.client}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="font-bold text-foreground">{entry.matter}</span>
                          </>
                        ) : (
                          <span className="font-bold text-foreground">{entry.matter}</span>
                        )}
                        {entry.status === "pending" && (
                          <Badge variant="outline" className="ml-2">
                            Pending
                          </Badge>
                        )}
                        {/* Legal mode: Compliance badges */}
                        {uiConfig.mode === 'legal' && entry.complianceStatus === "warning" && (
                          <Badge variant="outline" className="ml-2 border-yellow-500 text-yellow-600">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Compliance Warning
                          </Badge>
                        )}
                        {uiConfig.mode === 'legal' && entry.complianceStatus === "error" && (
                          <Badge variant="outline" className="ml-2 border-red-500 text-red-600">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Needs Review
                          </Badge>
                        )}
                        {/* Legal mode: UTBMS/LEDES indicators */}
                        {showUTBMS && entry.requiresLedes && entry.utbmsCode && (
                          <Badge variant="secondary" className="ml-2">
                            {entry.utbmsCode}
                          </Badge>
                        )}
                      </div>
                      <p className="truncate text-sm text-muted-foreground">{entry.narrative}</p>
                    </div>

                    {/* Hours */}
                    <div className="text-right font-bold text-foreground">
                      {entry.hours}h
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
