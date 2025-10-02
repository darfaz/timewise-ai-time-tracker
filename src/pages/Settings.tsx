import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { getApiBaseUrl, setApiBaseUrl, apiClient } from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Save, CheckCircle } from "lucide-react";

const Settings = () => {
  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());
  const [trackDesktop, setTrackDesktop] = useState(true);
  const [trackBrowser, setTrackBrowser] = useState(true);
  const [excludedApps, setExcludedApps] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const result = await apiClient.testConnection();
      toast({
        title: "Connection Successful",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to the API",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    setApiBaseUrl(apiUrl);
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully",
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">Configure your TimeWise preferences</p>
      </div>

      <div className="space-y-6 rounded-xl bg-card p-6 shadow-card">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">API Configuration</h2>
        </div>
        <Separator />
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-url">Backend API URL</Label>
            <div className="flex gap-2">
              <Input
                id="api-url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:3000/api"
              />
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTesting}
              >
                {isTesting ? "Testing..." : "Test"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-xl bg-card p-6 shadow-card">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-success" />
          <h2 className="text-xl font-semibold text-foreground">Privacy Controls</h2>
        </div>
        <Separator />
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Track Desktop Activity</Label>
              <p className="text-sm text-muted-foreground">
                Monitor applications and window titles
              </p>
            </div>
            <Switch checked={trackDesktop} onCheckedChange={setTrackDesktop} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Track Browser Activity</Label>
              <p className="text-sm text-muted-foreground">
                Monitor browser tabs and URLs
              </p>
            </div>
            <Switch checked={trackBrowser} onCheckedChange={setTrackBrowser} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excluded-apps">Exclude Apps (comma-separated)</Label>
            <Input
              id="excluded-apps"
              value={excludedApps}
              onChange={(e) => setExcludedApps(e.target.value)}
              placeholder="Spotify, Slack, Discord"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-xl bg-card p-6 shadow-card">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-warning" />
          <h2 className="text-xl font-semibold text-foreground">Working Hours</h2>
        </div>
        <Separator />
        
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
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
