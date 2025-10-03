import { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Wand2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BillingEntry } from "@/lib/billingData";

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: BillingEntry[];
  onFixIssues: (fixedEntries: BillingEntry[]) => void;
}

export const ComplianceModal = ({ isOpen, onClose, entries, onFixIssues }: ComplianceModalProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsChecking(true);
      setProgress(0);
      setCheckComplete(false);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsChecking(false);
            setCheckComplete(true);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const entriesWithIssues = entries.filter(e => e.complianceIssues.length > 0);
  const errorEntries = entries.filter(e => e.complianceStatus === "error");
  const warningEntries = entries.filter(e => e.complianceStatus === "warning");

  const handleFixAll = () => {
    const fixedEntries = entries.map(entry => {
      if (entry.complianceIssues.length === 0) return entry;

      let fixedNarrative = entry.narrative;
      let fixedHours = entry.hours;

      // Auto-fix vague narratives
      if (entry.complianceIssues.some(i => i.includes("Vague narrative"))) {
        if (fixedNarrative.toLowerCase().includes("review")) {
          fixedNarrative = fixedNarrative.replace(/review/i, "Reviewed and analyzed specific");
        }
        if (fixedNarrative.toLowerCase().includes("research")) {
          fixedNarrative = fixedNarrative.replace(/research/i, "Conducted detailed research regarding");
        }
      }

      // Auto-fix block time issues
      if (entry.complianceIssues.some(i => i.includes("max block time"))) {
        fixedHours = 0.3;
      }

      return {
        ...entry,
        narrative: fixedNarrative,
        hours: fixedHours,
        complianceStatus: "warning" as const,
        complianceIssues: entry.complianceIssues.filter(i => 
          !i.includes("Vague narrative") && !i.includes("max block time")
        ),
      };
    });

    onFixIssues(fixedEntries);
    onClose();
  };

  const issueCategories = [
    {
      name: "Block Time Violations",
      count: entriesWithIssues.filter(e => 
        e.complianceIssues.some(i => i.includes("block time"))
      ).length,
      icon: XCircle,
      color: "text-destructive",
    },
    {
      name: "Vague Narratives",
      count: entriesWithIssues.filter(e => 
        e.complianceIssues.some(i => i.includes("Vague"))
      ).length,
      icon: AlertTriangle,
      color: "text-warning",
    },
    {
      name: "Missing Information",
      count: entriesWithIssues.filter(e => 
        e.complianceIssues.some(i => i.includes("Missing"))
      ).length,
      icon: AlertTriangle,
      color: "text-warning",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Compliance Check Results</DialogTitle>
          <DialogDescription>
            Analyzing {entries.length} billing entries for carrier compliance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isChecking && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Checking compliance rules...</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {checkComplete && (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Alert className="border-success">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <AlertDescription>
                    <div className="font-medium">Compliant</div>
                    <div className="text-2xl font-bold">{entries.length - entriesWithIssues.length}</div>
                  </AlertDescription>
                </Alert>
                <Alert className="border-warning">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <AlertDescription>
                    <div className="font-medium">Warnings</div>
                    <div className="text-2xl font-bold">{warningEntries.length}</div>
                  </AlertDescription>
                </Alert>
                <Alert className="border-destructive">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription>
                    <div className="font-medium">Errors</div>
                    <div className="text-2xl font-bold">{errorEntries.length}</div>
                  </AlertDescription>
                </Alert>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Issues by Category</h4>
                <div className="space-y-2">
                  {issueCategories.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <category.icon className={`h-5 w-5 ${category.color}`} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {category.count} {category.count === 1 ? "entry" : "entries"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {entriesWithIssues.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Detailed Issues</h4>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-4">
                      {entriesWithIssues.map((entry) => (
                        <div key={entry.id} className="space-y-2">
                          <div className="flex items-start gap-2">
                            {entry.complianceStatus === "error" ? (
                              <XCircle className="h-4 w-4 text-destructive mt-0.5" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                            )}
                            <div className="flex-1 space-y-1">
                              <div className="text-sm font-medium">
                                {entry.timekeeper} - {entry.taskCode} ({entry.hours}h)
                              </div>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                {entry.complianceIssues.map((issue, idx) => (
                                  <li key={idx}>• {issue}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {checkComplete && entriesWithIssues.length > 0 && (
            <Button onClick={handleFixAll} className="gap-2">
              <Wand2 className="h-4 w-4" />
              Fix All Auto-Correctable Issues
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
