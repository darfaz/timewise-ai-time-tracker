import { useState, useEffect } from "react";
import { Activity, Project } from "@/lib/mockData";
import * as LucideIcons from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useConfig } from "@/contexts/ConfigContext";
import { useToast } from "@/hooks/use-toast";
import { format, addMinutes, parse } from "date-fns";
import { AlertCircle, Save, X, ArrowRight, Trash2, Split } from "lucide-react";

interface ActivityEditModalProps {
  activity: Activity | null;
  project?: Project;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedActivity: Activity) => void;
  onNext?: () => void;
  onDelete?: () => void;
}

export const ActivityEditModal = ({
  activity,
  project,
  isOpen,
  onClose,
  onSave,
  onNext,
  onDelete,
}: ActivityEditModalProps) => {
  const { LEGAL_MODE } = useConfig();
  const { toast } = useToast();

  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [category, setCategory] = useState("");
  const [matter, setMatter] = useState("");
  const [taskCode, setTaskCode] = useState("");
  const [activityCode, setActivityCode] = useState("");
  const [narrative, setNarrative] = useState("");
  const [isBillable, setIsBillable] = useState(false);
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (activity) {
      setDuration(activity.duration);
      setStartTime(format(activity.timestamp, "HH:mm"));
      setCategory("");
      setMatter("");
      setTaskCode("");
      setActivityCode("");
      setNarrative("");
      setIsBillable(project?.billableRate ? project.billableRate > 0 : false);
      setTags("");
      setNotes("");
      setErrors({});
    }
  }, [activity, project]);

  if (!activity) return null;

  const IconComponent = (LucideIcons as any)[activity.appIcon] || LucideIcons.Circle;

  const calculateEndTime = () => {
    try {
      const startDate = parse(startTime, "HH:mm", activity.timestamp);
      const endDate = addMinutes(startDate, duration);
      return format(endDate, "h:mm a");
    } catch {
      return "Invalid time";
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (duration <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }

    if (!startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (LEGAL_MODE) {
      if (!matter) {
        newErrors.matter = "Matter is required in legal mode";
      }
      if (!taskCode) {
        newErrors.taskCode = "UTBMS task code is required";
      }
      if (!activityCode) {
        newErrors.activityCode = "UTBMS activity code is required";
      }
    } else {
      if (!category) {
        newErrors.category = "Category is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving",
        variant: "destructive",
      });
      return;
    }

    const updatedActivity = {
      ...activity,
      duration,
      timestamp: parse(startTime, "HH:mm", activity.timestamp),
    };

    onSave(updatedActivity);
    toast({
      title: "Entry Saved",
      description: "Time entry has been updated successfully",
    });
    onClose();
  };

  const handleSaveAndNext = () => {
    if (!validate()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving",
        variant: "destructive",
      });
      return;
    }

    handleSave();
    if (onNext) onNext();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      toast({
        title: "Entry Deleted",
        description: "Time entry has been removed",
      });
      onClose();
    }
  };

  const hasComplianceWarnings = LEGAL_MODE && (!narrative || narrative.length < 20);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            Edit Time Entry
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          {/* Left Section - Activity Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Activity Details</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Application</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <IconComponent className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">{activity.appName}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Window Title</Label>
                  <p className="text-sm mt-1 text-foreground">{activity.windowTitle}</p>
                </div>

                <div>
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                    className={errors.duration ? "border-destructive" : ""}
                  />
                  {errors.duration && (
                    <p className="text-xs text-destructive mt-1">{errors.duration}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={errors.startTime ? "border-destructive" : ""}
                  />
                  {errors.startTime && (
                    <p className="text-xs text-destructive mt-1">{errors.startTime}</p>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground">End Time</Label>
                  <p className="text-sm font-medium mt-1 text-foreground">{calculateEndTime()}</p>
                </div>

                {!LEGAL_MODE && (
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="communication">Communication</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="admin">Administrative</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-xs text-destructive mt-1">{errors.category}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Legal Fields or Common Fields */}
          <div className="space-y-4">
            {LEGAL_MODE ? (
              <>
                <h3 className="font-semibold mb-4 text-foreground">Legal Details</h3>
                
                <div>
                  <Label htmlFor="matter">Client/Matter *</Label>
                  <Select value={matter} onValueChange={setMatter}>
                    <SelectTrigger className={errors.matter ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select matter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matter-001">Acme Corp v. Beta Inc - Litigation</SelectItem>
                      <SelectItem value="matter-002">Delta LLC - Contract Review</SelectItem>
                      <SelectItem value="matter-003">Epsilon Inc - M&A Transaction</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.matter && (
                    <p className="text-xs text-destructive mt-1">{errors.matter}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="taskCode">UTBMS Task Code *</Label>
                  <Select value={taskCode} onValueChange={setTaskCode}>
                    <SelectTrigger className={errors.taskCode ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select task code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L110">L110 - Case Assessment</SelectItem>
                      <SelectItem value="L120">L120 - Pre-Trial Pleadings</SelectItem>
                      <SelectItem value="L210">L210 - Discovery</SelectItem>
                      <SelectItem value="L310">L310 - Trial Preparation</SelectItem>
                      <SelectItem value="A101">A101 - Legal Research</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.taskCode && (
                    <p className="text-xs text-destructive mt-1">{errors.taskCode}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="activityCode">UTBMS Activity Code *</Label>
                  <Select value={activityCode} onValueChange={setActivityCode}>
                    <SelectTrigger className={errors.activityCode ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select activity code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L110-001">Review documents</SelectItem>
                      <SelectItem value="L110-002">Draft memorandum</SelectItem>
                      <SelectItem value="L110-003">Client conference</SelectItem>
                      <SelectItem value="L210-001">Document review</SelectItem>
                      <SelectItem value="A101-001">Legal research</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.activityCode && (
                    <p className="text-xs text-destructive mt-1">{errors.activityCode}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="narrative">Narrative</Label>
                  <Textarea
                    id="narrative"
                    value={narrative}
                    onChange={(e) => setNarrative(e.target.value)}
                    placeholder="Describe the work performed..."
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {narrative.length} characters
                  </p>
                </div>

                {hasComplianceWarnings && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Narrative should be at least 20 characters for billing compliance
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <h3 className="font-semibold mb-4 text-foreground">Additional Details</h3>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes..."
                    rows={6}
                    className="resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Common Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Settings</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="billable">Billable</Label>
              <p className="text-xs text-muted-foreground">
                Mark this entry as billable time
              </p>
            </div>
            <Switch
              id="billable"
              checked={isBillable}
              onCheckedChange={setIsBillable}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags separated by commas"
            />
          </div>

          {!LEGAL_MODE && (
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes..."
                rows={3}
                className="resize-none"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Split className="mr-2 h-4 w-4" />
              Split Entry
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Entry
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Discard Changes
          </Button>
          {onNext && (
            <Button variant="outline" onClick={handleSaveAndNext}>
              <Save className="mr-2 h-4 w-4" />
              Save & Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save & Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
