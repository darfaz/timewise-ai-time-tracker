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
import { BillingEntry } from "@/lib/billingData";
import { format as formatDate } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ExportProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  format: "LEDES" | "CSV";
  entries: BillingEntry[];
}

export const ExportProgressModal = ({
  isOpen,
  onClose,
  format,
  entries,
}: ExportProgressModalProps) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [filename, setFilename] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      setIsComplete(false);
      const timestamp = formatDate(new Date(), "yyyy-MM-dd-HHmm");
      const extension = format === "LEDES" ? "txt" : "csv";
      setFilename(`${format}_Export_${timestamp}.${extension}`);

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
  }, [isOpen, format]);

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
            {isComplete ? "Export Complete" : `Exporting to ${format}`}
          </DialogTitle>
          <DialogDescription>
            {isComplete
              ? `Your billing export is ready to download`
              : `Generating ${format} file for ${entries.length} entries...`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
