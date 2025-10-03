import { Link, useLocation } from "react-router-dom";
import { Clock, LayoutDashboard, List, FileText, FolderKanban, Settings, Briefcase, Tags, FileSpreadsheet, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { MobileNav } from "@/components/MobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useConfig } from "@/contexts/ConfigContext";
import { motion } from "framer-motion";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { LEGAL_MODE, PRODUCT_NAME } = useConfig();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Timeline", path: "/timeline", icon: Clock },
    { name: "Timesheet", path: "/timesheet", icon: FileText },
    ...(LEGAL_MODE 
      ? [
          { name: "Matters", path: "/matters", icon: Briefcase },
          { name: "LEDES Export", path: "/ledes-export", icon: FileSpreadsheet },
        ] 
      : [
          { name: "Projects", path: "/projects", icon: FolderKanban },
          { name: "Categories", path: "/categories", icon: Tags },
        ]
    ),
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <motion.div 
                  className="rounded-lg bg-gradient-primary p-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {LEGAL_MODE ? (
                    <Briefcase className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <List className="h-5 w-5 text-primary-foreground" />
                  )}
                </motion.div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-foreground">{PRODUCT_NAME}</span>
                  <Badge 
                    variant={LEGAL_MODE ? "default" : "secondary"} 
                    className={LEGAL_MODE ? "bg-purple-500 hover:bg-purple-600" : "bg-blue-500 hover:bg-blue-600"}
                  >
                    {LEGAL_MODE ? "Legal" : "Standard"}
                  </Badge>
                </div>
              </Link>

              <div className="hidden md:flex md:gap-1">
                {navItems.map((item) => (
                  <Tooltip key={item.path}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:scale-105 active:scale-95",
                          isActive(item.path)
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="hidden md:flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    onClick={() => {
                      const event = new KeyboardEvent('keydown', {
                        key: 'k',
                        metaKey: true,
                        bubbles: true
                      });
                      document.dispatchEvent(event);
                    }}
                  >
                    <Search className="h-4 w-4" />
                    <span className="hidden lg:inline">Search</span>
                    <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                      ⌘K
                    </kbd>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Command Palette (⌘K)</p>
                </TooltipContent>
              </Tooltip>
              
              <ConnectionStatus />
              
              <ThemeToggle />
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/settings"
                    className={cn(
                      "rounded-lg p-2 transition-all hover:scale-105 active:scale-95",
                      isActive("/settings")
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </nav>

      <motion.main 
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>

      <MobileNav />
    </div>
  );
};
