import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Globe, Clock } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface CalendarEvent {
  subject: string;
  time: string;
}

interface EmailItem {
  subject: string;
  sender: string;
}

interface ActivityGroup {
  title: string;
  host: string;
  duration: number;
}

interface ExplanationData {
  calendar?: CalendarEvent[];
  emails?: EmailItem[];
  activities?: ActivityGroup[];
  totalDuration: number;
}

interface EntryExplainDrawerProps {
  entryId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EntryExplainDrawer = ({
  entryId,
  isOpen,
  onClose,
}: EntryExplainDrawerProps) => {
  const [data, setData] = useState<ExplanationData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && entryId) {
      setLoading(true);
      apiClient
        .get(`/entry/${entryId}/explain`)
        .then((response) => {
          setData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load explanation:", error);
          toast({
            title: "Error",
            description: "Failed to load entry explanation",
            variant: "destructive",
          });
          setLoading(false);
        });
    }
  }, [isOpen, entryId, toast]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Entry Sources</SheetTitle>
          <SheetDescription>
            Why this time entry was captured
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : data ? (
            <>
              {/* Duration Summary */}
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span>Total Duration</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">
                  {formatDuration(data.totalDuration)}
                </p>
              </div>

              {/* Calendar Events */}
              {data.calendar && data.calendar.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-foreground">
                        Calendar Events
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {data.calendar.length}
                      </Badge>
                    </div>
                    {data.calendar.slice(0, 2).map((event, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-border bg-card p-3 space-y-1"
                      >
                        <p className="font-medium text-sm text-foreground">
                          {event.subject}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Emails */}
              {data.emails && data.emails.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-foreground">Emails</h3>
                      <Badge variant="secondary" className="text-xs">
                        {data.emails.length}
                      </Badge>
                    </div>
                    {data.emails.slice(0, 2).map((email, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-border bg-card p-3 space-y-1"
                      >
                        <p className="font-medium text-sm text-foreground">
                          {email.subject}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          From: {email.sender}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Web Activities */}
              {data.activities && data.activities.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-foreground">
                        Web Activities
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {data.activities.length}
                      </Badge>
                    </div>
                    {data.activities.slice(0, 2).map((activity, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-border bg-card p-3 space-y-1"
                      >
                        <p className="font-medium text-sm text-foreground">
                          {activity.title}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {activity.host}
                          </p>
                          <span className="text-xs font-medium text-primary">
                            {formatDuration(activity.duration)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No explanation data available
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
