import { Link, useLocation } from "react-router-dom";
import { Clock, LayoutDashboard, FileText, FolderKanban, Tags, Briefcase, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfig } from "@/contexts/ConfigContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const MobileNav = () => {
  const location = useLocation();
  const { LEGAL_MODE } = useConfig();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Timeline", path: "/timeline", icon: Clock },
    { name: "Timesheet", path: "/timesheet", icon: FileText },
    ...(LEGAL_MODE 
      ? [
          { name: "Matters", path: "/matters", icon: Briefcase },
          { name: "LEDES", path: "/ledes-export", icon: FileSpreadsheet },
        ] 
      : [
          { name: "Projects", path: "/projects", icon: FolderKanban },
          { name: "Categories", path: "/categories", icon: Tags },
        ]
    ),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card shadow-lg md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.slice(0, 5).map((item) => (
          <Tooltip key={item.path}>
            <TooltipTrigger asChild>
              <Link
                to={item.path}
                className={cn(
                  "flex min-w-[44px] min-h-[44px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-all",
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{item.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </nav>
  );
};
