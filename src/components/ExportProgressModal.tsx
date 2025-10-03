import { useState, useEffect } from "react";
import { FileDown, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BillingEntry } from "@/lib/billingData";
import { format as formatDate } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useUiConfig } from "@/contexts/ConfigContext";

interface ExportProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: BillingEntry[];
  startDate?: Date;
  endDate?: Date;
  hasLedesRequired?: boolean;
}

export const ExportProgressModal = ({
  isOpen,
  onClose,
  entries,
  startDate,
  endDate,
  hasLedesRequired = false,
}: ExportProgressModalProps) => {
  const uiConfig = useUiConfig();
  const [format, setFormat] = useState<"LEDES" | "CSV">("CSV");
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [filename, setFilename] = useState("");
  const { toast } = useToast();

  // Show format selector only if legal mode AND any entries require LEDES
  const showFormatSelector = uiConfig.legalMode && hasLedesRequired;

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      setIsComplete(false);
      
      // Reset format to CSV if not in legal mode or no LEDES required
      if (!showFormatSelector) {
        setFormat("CSV");
      }
      
      const timestamp = formatDate(new Date(), "yyyy-MM-dd-HHmm");
      const extension = format === "LEDES" ? "txt" : "csv";
      setFilename(`${format}_Export_${timestamp}.${extension}`);

      // Simulate export progress (replace with actual API call)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsComplete(true);
            return 100;
          }
          return prev + 20;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isOpen, format, showFormatSelector]);

  const handleExport = async () => {
    try {
      setProgress(0);
      setIsComplete(false);

      // Prepare request payload
      const payload = {
        start: startDate ? formatDate(startDate, "yyyy-MM-dd") : undefined,
        end: endDate ? formatDate(endDate, "yyyy-MM-dd") : undefined,
        approved_only: true,
      };

      let response;
      if (format === "LEDES") {
        // Call LEDES export endpoint
        response = await fetch("/api/export/ledes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Call CSV export endpoint
        response = await fetch("/api/invoices/csv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error("Export failed");
      }

      // Simulate progress for UX
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsComplete(true);
            return 100;
          }
          return prev + 20;
        });
      }, 300);

    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to generate export. Please try again.",
        variant: "destructive",
      });
      console.error("Export error:", error);
    }
  };

  const handleDownload = () => {
    let content = "";
    
    if (format === "LEDES") {
      // LEDES 1998B pipe-delimited format
      const header = "INVOICE_DATE|INVOICE_NUMBER|CLIENT_ID|LAW_FIRM_MATTER_ID|LINE_ITEM_NUMBER|EXP/FEE/INV_ADJ_TYPE|LINE_ITEM_NUMBER_OF_UNITS|LINE_ITEM_ADJUSTMENT_AMOUNT|LINE_ITEM_TOTAL|LINE_ITEM_DATE|LINE_ITEM_TASK_CODE|LINE_ITEM_EXPENSE_CODE|LINE_ITEM_ACTIVITY_CODE|TIMEKEEPER_ID|LINE_ITEM_DESCRIPTION|LAW_FIRM_ID|LINE_ITEM_UNIT_COST|CLIENT_MATTER_ID";
      const rows = entries.map((entry, idx) => {
        const invoiceDate = formatDate(new Date(), "yyyyMMdd");
        const lineDate = formatDate(entry.date, "yyyyMMdd");
        const lineNum = idx + 1;
        const hours = entry.hours.toFixed(2);
        const amt = entry.amount.toFixed(2);
        const rate = entry.rate.toFixed(2);
        return `${invoiceDate}|INV001|CLIENT001|MATTER001|${lineNum}|F|${hours}||${amt}|${lineDate}|${entry.taskCode}||${entry.activityCode}|TK001|${entry.narrative}|FIRM001|${rate}|CLIENTMATTER001`;
      }).join("\n");
      content = `${header}\n${rows}`;
    } else {
      // CSV format
      const header = "Date,Timekeeper,Matter,Task Code,Activity Code,Hours,Rate,Amount,Narrative";
      const rows = entries.map(entry => {
        const dateStr = formatDate(entry.date, "MM/dd/yyyy");
        const narrative = `"${entry.narrative.replace(/"/g, '""')}"`;
        const hours = entry.hours.toFixed(2);
        const rate = entry.rate.toFixed(2);
        const amt = entry.amount.toFixed(2);
        return `${dateStr},${entry.timekeeper},MATTER001,${entry.taskCode},${entry.activityCode},${hours},${rate},${amt},${narrative}`;
      }).join("\n");
      content = `${header}\n${rows}`;
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export complete",
      description: `${filename} has been downloaded successfully.`,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isComplete ? "Export Complete" : "Export Invoice"}
          </DialogTitle>
          <DialogDescription>
            {isComplete
              ? "Your export is ready to download"
              : "Select format and export billing entries"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Format Selector - only show if legal mode and LEDES required */}
          {!isComplete && showFormatSelector && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <Tabs value={format} onValueChange={(v) => setFormat(v as "LEDES" | "CSV")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="LEDES">LEDES 1998B</TabsTrigger>
                  <TabsTrigger value="CSV">CSV</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Info Alert */}
          {!isComplete && (
            <Alert>
              <AlertDescription>
                Only approved entries will be exported.
              </AlertDescription>
            </Alert>
          )}
          {!isComplete && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Processing entries...</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {isComplete && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="rounded-full bg-success/10 p-4">
                  <CheckCircle2 className="h-12 w-12 text-success" />
                </div>
              </div>

              <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Format:</span>
                  <span className="font-medium">{format}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Entries:</span>
                  <span className="font-medium">{entries.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-medium">
                    ${entries.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Filename:</span>
                  <span className="font-mono text-xs">{filename}</span>
                </div>
              </div>

              <Button onClick={handleDownload} className="w-full gap-2">
                <FileDown className="h-4 w-4" />
                Download {format} File
              </Button>
            </div>
          )}

          {/* Start Export Button */}
          {!isComplete && progress === 0 && (
            <Button onClick={handleExport} className="w-full gap-2">
              <FileDown className="h-4 w-4" />
              Export {entries.length} {entries.length === 1 ? "Entry" : "Entries"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
