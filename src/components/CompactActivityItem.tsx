import { Activity, Project } from "@/lib/mockData";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface CompactActivityItemProps {
  activity: Activity;
  project?: Project;
  index: number;
}

export const CompactActivityItem = ({ activity, project, index }: CompactActivityItemProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * index }}
      whileHover={{ scale: 1.02, backgroundColor: "hsl(var(--accent))" }}
      onClick={() => navigate("/timeline")}
      className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:bg-accent"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
        </div>
        <div className="h-1 w-1 rounded-full bg-muted-foreground" />
        <span className="text-sm font-medium text-foreground">
          {project?.name || "No Project"}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">{activity.duration}m</span>
      </div>
    </motion.div>
  );
};
