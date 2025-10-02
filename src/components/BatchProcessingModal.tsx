import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface BatchProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalItems: number;
  onProcess: () => Promise<{ processed: number; failed: number }>;
}

export const BatchProcessingModal = ({
  isOpen,
  onClose,
  totalItems,
  onProcess,
}: BatchProcessingModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processed, setProcessed] = useState(0);
  const [failed, setFailed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isOpen && !isProcessing && !isComplete) {
      startProcessing();
    }
  }, [isOpen]);

  const startProcessing = async () => {
    setIsProcessing(true);
    setProgress(0);
    setProcessed(0);
    setFailed(0);

    // Simulate progressive updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const result = await onProcess();
      clearInterval(interval);
      setProgress(100);
      setProcessed(result.processed);
      setFailed(result.failed);
      setIsComplete(true);
    } catch (error) {
      clearInterval(interval);
      setFailed(totalItems);
      setIsComplete(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setIsComplete(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Batch AI Processing</DialogTitle>
          <DialogDescription>
            {isProcessing
              ? "Generating narratives for all entries..."
              : isComplete
              ? "Processing complete!"
              : "Starting batch processing..."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing {totalItems} entries...
            </motion.div>
          )}

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="font-medium">Successfully Processed</span>
                </div>
                <Badge variant="default" className="bg-success">
                  {processed}
                </Badge>
              </div>

              {failed > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                    <span className="font-medium">Failed</span>
                  </div>
                  <Badge variant="destructive">{failed}</Badge>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
