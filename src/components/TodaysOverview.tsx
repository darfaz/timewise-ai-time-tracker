import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface TodaysOverviewProps {
  hoursToday: number;
  goalHours?: number;
}

export const TodaysOverview = ({ hoursToday, goalHours = 8 }: TodaysOverviewProps) => {
  const percentage = Math.min((hoursToday / goalHours) * 100, 100);
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl bg-card p-8 shadow-card"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Today's Progress</h2>
        <Clock className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg className="h-48 w-48 -rotate-90 transform">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r="70"
              className="stroke-muted"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <motion.circle
              cx="96"
              cy="96"
              r="70"
              className="stroke-primary"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="text-5xl font-bold text-foreground"
            >
              {hoursToday.toFixed(1)}
            </motion.span>
            <span className="text-sm text-muted-foreground">of {goalHours}h goal</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {hoursToday >= goalHours 
            ? "🎉 Goal achieved! Great work!" 
            : `${(goalHours - hoursToday).toFixed(1)}h to reach your goal`}
        </p>
      </div>
    </motion.div>
  );
};
