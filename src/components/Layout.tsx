import { Link, useLocation } from "react-router-dom";
import { Clock, LayoutDashboard, List, FileText, FolderKanban, Settings, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useConfig } from "@/contexts/ConfigContext";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { LEGAL_MODE, PRODUCT_NAME } = useConfig();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Timeline", path: "/timeline", icon: Clock },
    { name: "Timesheet", path: "/timesheet", icon: FileText },
    { name: "Projects", path: "/projects", icon: FolderKanban },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b bg-card shadow-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-primary p-2">
                  {LEGAL_MODE ? (
                    <Briefcase className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <List className="h-5 w-5 text-primary-foreground" />
                  )}
                </div>
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
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/settings"
              className={cn(
                "rounded-lg p-2 transition-colors",
                isActive("/settings")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};
