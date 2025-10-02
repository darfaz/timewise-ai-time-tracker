import { motion } from "framer-motion";
import { Project } from "@/lib/mockData";
import { TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TopProjectsWidgetProps {
  projects: Project[];
  weeklyHours: { projectId: string; hours: number }[];
}

export const TopProjectsWidget = ({ projects, weeklyHours }: TopProjectsWidgetProps) => {
  // Get top 5 projects by hours this week
  const topProjects = weeklyHours
    .slice(0, 5)
    .map(({ projectId, hours }) => {
      const project = projects.find((p) => p.id === projectId);
      return project ? { ...project, weeklyHours: hours } : null;
    })
    .filter(Boolean) as (Project & { weeklyHours: number })[];

  const maxHours = Math.max(...topProjects.map((p) => p.weeklyHours), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-xl bg-card p-6 shadow-card"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Top Projects This Week</h2>
        <TrendingUp className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {topProjects.map((project, index) => {
          const percentage = (project.weeklyHours / maxHours) * 100;
          
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="font-medium text-foreground">{project.name}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {project.weeklyHours.toFixed(1)}h
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
