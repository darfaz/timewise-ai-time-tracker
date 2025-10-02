import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, FileText, CheckSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const QuickActions = () => {
  const { toast } = useToast();

  const handleStartTimer = () => {
    toast({
      title: "Timer Started",
      description: "Manual time tracking has begun",
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Today's report is ready for review",
    });
  };

  const handleReviewEntries = () => {
    toast({
      title: "Review Pending",
      description: "Navigating to pending entries...",
    });
  };

  const actions = [
    {
      label: "Start Timer",
      icon: Play,
      onClick: handleStartTimer,
      variant: "default" as const,
    },
    {
      label: "Generate Today's Report",
      icon: FileText,
      onClick: handleGenerateReport,
      variant: "secondary" as const,
    },
    {
      label: "Review Pending Entries",
      icon: CheckSquare,
      onClick: handleReviewEntries,
      variant: "outline" as const,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-xl bg-card p-6 shadow-card"
    >
      <h2 className="mb-6 text-xl font-bold text-foreground">Quick Actions</h2>
      
      <div className="grid gap-3 md:grid-cols-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={action.variant}
              onClick={action.onClick}
              className="h-auto w-full flex-col gap-2 py-4"
            >
              <action.icon className="h-5 w-5" />
              <span className="text-xs">{action.label}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
