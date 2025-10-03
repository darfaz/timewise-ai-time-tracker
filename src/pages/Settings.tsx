import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Save, 
  Briefcase, 
  Clock, 
  Palette,
  Link2,
  Shield,
  Code,
  CheckCircle,
  XCircle,
  Loader2,
  Trash2,
  Download,
  RefreshCw,
  Moon,
  Sun,
  Monitor
} from "lucide-react";
import { useConfig } from "@/contexts/ConfigContext";
import { apiClient } from "@/lib/api";
import { useTheme } from "next-themes";

const Settings = () => {
  const { LEGAL_MODE, API_BASE_URL, setLegalMode, setApiBaseUrl, isConnected } = useConfig();
  const [localLegalMode, setLocalLegalMode] = useState(LEGAL_MODE);
  const [localApiUrl, setLocalApiUrl] = useState(API_BASE_URL);
  const [trackDesktop, setTrackDesktop] = useState(true);
  const [trackBrowser, setTrackBrowser] = useState(true);
  const [excludedApps, setExcludedApps] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState("5");
  const [defaultView, setDefaultView] = useState("dashboard");
  const [viewDensity, setViewDensity] = useState("comfortable");
  const [debugMode, setDebugMode] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<"idle" | "success" | "error">("idle");
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setLocalLegalMode(LEGAL_MODE);
    setLocalApiUrl(API_BASE_URL);
  }, [LEGAL_MODE, API_BASE_URL]);

  const handleSave = () => {
    setLegalMode(localLegalMode);
    setApiBaseUrl(localApiUrl);
    
    // Save other settings to localStorage
    localStorage.setItem("settings", JSON.stringify({
      trackDesktop,
      trackBrowser,
      excludedApps,
      startTime,
      endTime,
      autoSync,
      syncInterval,
      defaultView,
      viewDensity,
      debugMode,
    }));

    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully",
    });
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionTestResult("idle");
    
    try {
      await apiClient.checkHealth();
      const awStatus = await apiClient.checkActivityWatchStatus();
      setConnectionTestResult("success");
      toast({
        title: "Connection successful! ✓",
        description: `API reachable, ActivityWatch: ${awStatus.connected ? "Connected" : "Not Connected"}`,
      });
    } catch (error) {
      setConnectionTestResult("error");
      toast({
        title: "Connection failed",
        description: "Could not connect to the backend. Check if it's running.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleExportData = () => {
    const data = {
      settings: { LEGAL_MODE, API_BASE_URL },
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `settings-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Data exported",
      description: "Your settings have been exported successfully",
    });
  };

  const handleResetToDefaults = () => {
    setLocalLegalMode(false);
    setLocalApiUrl("http://localhost:3000/api");
    setTrackDesktop(true);
    setTrackBrowser(true);
    setExcludedApps("");
    setStartTime("09:00");
    setEndTime("17:00");
    setAutoSync(true);
    setSyncInterval("5");
    setDefaultView("dashboard");
    setViewDensity("comfortable");
    setDebugMode(false);
    toast({
      title: "Settings reset",
      description: "All settings have been reset to defaults",
    });
  };

  const handleDeleteAllData = () => {
    if (window.confirm("Are you sure you want to delete all local data? This cannot be undone.")) {
      localStorage.clear();
      toast({
        title: "Data deleted",
        description: "All local data has been cleared",
        variant: "destructive",
      });
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const hasChanges = localLegalMode !== LEGAL_MODE || localApiUrl !== API_BASE_URL;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your application preferences and configuration</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-primary" />
                <CardTitle>Application Mode</CardTitle>
              </div>
              <CardDescription>
                Switch between general time tracking and legal billing mode
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="legal-mode">Legal Billing Mode</Label>
                    <Badge variant={localLegalMode ? "default" : "secondary"} className={localLegalMode ? "bg-purple-500" : "bg-blue-500"}>
                      {localLegalMode ? <><Briefcase className="mr-1 h-3 w-3" />BillExact</> : <><Clock className="mr-1 h-3 w-3" />TimeWise</>}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {localLegalMode 
                      ? "Enable advanced legal billing features and client matter tracking" 
                      : "General time tracking for productivity and project management"}
                  </p>
                </div>
                <Switch 
                  id="legal-mode"
                  checked={localLegalMode} 
                  onCheckedChange={setLocalLegalMode} 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-primary" />
                <CardTitle>Sync & Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync activities in the background
                  </p>
                </div>
                <Switch checked={autoSync} onCheckedChange={setAutoSync} />
              </div>

              <div className="space-y-2">
                <Label>Sync Interval (minutes)</Label>
                <Select value={syncInterval} onValueChange={setSyncInterval}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 minute</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Default View</Label>
                <Select value={defaultView} onValueChange={setDefaultView}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="timeline">Timeline</SelectItem>
                    <SelectItem value="timesheet">Timesheet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle>Working Hours</CardTitle>
              </div>
              <CardDescription>
                Set your default working hours for idle detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <CardTitle>Theme</CardTitle>
              </div>
              <CardDescription>
                Choose your preferred color theme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="h-20 flex-col gap-2"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-5 w-5" />
                  <span className="text-sm">Light</span>
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="h-20 flex-col gap-2"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="h-5 w-5" />
                  <span className="text-sm">Dark</span>
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  className="h-20 flex-col gap-2"
                  onClick={() => setTheme("system")}
                >
                  <Monitor className="h-5 w-5" />
                  <span className="text-sm">System</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>View Density</CardTitle>
              <CardDescription>
                Adjust the spacing and density of UI elements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={viewDensity} onValueChange={setViewDensity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                  <SelectItem value="spacious">Spacious</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                <CardTitle>Backend API</CardTitle>
              </div>
              <CardDescription>
                Configure connection to your time tracking backend
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-url">Backend API URL</Label>
                <Input
                  id="api-url"
                  value={localApiUrl}
                  onChange={(e) => setLocalApiUrl(e.target.value)}
                  placeholder="http://localhost:3000/api"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleTestConnection} 
                  disabled={isTestingConnection}
                  variant="outline"
                >
                  {isTestingConnection ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Test Connection
                    </>
                  )}
                </Button>

                {connectionTestResult === "success" && (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                )}
                {connectionTestResult === "error" && (
                  <Badge variant="destructive">
                    <XCircle className="mr-1 h-3 w-3" />
                    Failed
                  </Badge>
                )}
                {isConnected && connectionTestResult === "idle" && (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                )}
              </div>

              <Alert>
                <AlertDescription>
                  Make sure your backend server is running and accessible at the URL above.
                  If you don't have a backend, the app will use mock data for demonstration.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ActivityWatch</CardTitle>
              <CardDescription>
                Automatic activity tracking integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={isConnected ? "default" : "secondary"}>
                    {isConnected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  ActivityWatch automatically tracks your computer usage and provides detailed insights.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Activity Tracking</CardTitle>
              </div>
              <CardDescription>
                Control what activities are tracked
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Track Desktop Activity</Label>
                  <p className="text-sm text-muted-foreground">
                    Monitor applications and window titles
                  </p>
                </div>
                <Switch checked={trackDesktop} onCheckedChange={setTrackDesktop} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Track Browser Activity</Label>
                  <p className="text-sm text-muted-foreground">
                    Monitor browser tabs and URLs
                  </p>
                </div>
                <Switch checked={trackBrowser} onCheckedChange={setTrackBrowser} />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="excluded-apps">Excluded Apps (comma-separated)</Label>
                <Input
                  id="excluded-apps"
                  value={excludedApps}
                  onChange={(e) => setExcludedApps(e.target.value)}
                  placeholder="Spotify, Slack, Discord"
                />
                <p className="text-sm text-muted-foreground">
                  Activities from these apps won't be tracked
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export or delete your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Export All Data</p>
                  <p className="text-sm text-muted-foreground">Download your settings and configuration</p>
                </div>
                <Button onClick={handleExportData} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-destructive">Delete All Data</p>
                  <p className="text-sm text-muted-foreground">Permanently remove all local data</p>
                </div>
                <Button onClick={handleDeleteAllData} variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <CardTitle>Developer Options</CardTitle>
              </div>
              <CardDescription>
                Advanced settings for debugging and development
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Show detailed logs in browser console
                  </p>
                </div>
                <Switch checked={debugMode} onCheckedChange={setDebugMode} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mock Data Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Currently: {apiClient.isMockMode() ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <Badge variant={apiClient.isMockMode() ? "secondary" : "default"}>
                  {apiClient.isMockMode() ? "Mock" : "Live"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reset Settings</CardTitle>
              <CardDescription>
                Restore all settings to their default values
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleResetToDefaults} variant="outline" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save/Cancel Buttons */}
      <div className="flex justify-end gap-3 sticky bottom-6 bg-background/95 backdrop-blur p-4 rounded-lg border shadow-lg">
        <Button 
          onClick={() => {
            setLocalLegalMode(LEGAL_MODE);
            setLocalApiUrl(API_BASE_URL);
          }} 
          variant="outline" 
          size="lg"
          disabled={!hasChanges}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          size="lg"
          disabled={!hasChanges}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
