import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Save, Briefcase, Clock } from "lucide-react";
import { useConfig } from "@/contexts/ConfigContext";

const Settings = () => {
  const { LEGAL_MODE, API_BASE_URL, setLegalMode, setApiBaseUrl } = useConfig();
  const [localLegalMode, setLocalLegalMode] = useState(LEGAL_MODE);
  const [localApiUrl, setLocalApiUrl] = useState(API_BASE_URL);
  const [trackDesktop, setTrackDesktop] = useState(true);
  const [trackBrowser, setTrackBrowser] = useState(true);
  const [excludedApps, setExcludedApps] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const { toast } = useToast();

  useEffect(() => {
    setLocalLegalMode(LEGAL_MODE);
    setLocalApiUrl(API_BASE_URL);
  }, [LEGAL_MODE, API_BASE_URL]);

  const handleSave = () => {
    setLegalMode(localLegalMode);
    setApiBaseUrl(localApiUrl);
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully",
    });
  };

  const handleCancel = () => {
    setLocalLegalMode(LEGAL_MODE);
    setLocalApiUrl(API_BASE_URL);
    toast({
      title: "Changes Cancelled",
      description: "Settings have been reverted to last saved values",
    });
  };

  const hasChanges = localLegalMode !== LEGAL_MODE || localApiUrl !== API_BASE_URL;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">Configure your application preferences</p>
      </div>

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
            <CardTitle>API Configuration</CardTitle>
          </div>
          <CardDescription>
            Configure the backend API endpoint for data synchronization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="api-url">Backend API URL</Label>
            <Input
              id="api-url"
              value={localApiUrl}
              onChange={(e) => setLocalApiUrl(e.target.value)}
              placeholder="http://localhost:3000/api"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <CardTitle>Privacy Controls</CardTitle>
          </div>
          <CardDescription>
            Manage what activities are tracked and monitored
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Working Hours</CardTitle>
          </div>
          <CardDescription>
            Set your default working hours for time tracking
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

      <div className="flex justify-end gap-3">
        <Button 
          onClick={handleCancel} 
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
