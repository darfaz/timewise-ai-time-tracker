import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  LayoutDashboard, 
  Clock, 
  FileText, 
  FolderKanban, 
  Tags, 
  Settings, 
  Briefcase, 
  FileSpreadsheet,
  Users,
  Search
} from "lucide-react";
import { useConfig } from "@/contexts/ConfigContext";

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { LEGAL_MODE } = useConfig();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "d" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        navigate("/");
      }
      if (e.key === "t" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        navigate("/timeline");
      }
      if (e.key === "/" && !open) {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [navigate, open]);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
            <kbd className="ml-auto text-xs text-muted-foreground">⌘D</kbd>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/timeline"))}>
            <Clock className="mr-2 h-4 w-4" />
            <span>Timeline</span>
            <kbd className="ml-auto text-xs text-muted-foreground">⌘T</kbd>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/timesheet"))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Timesheet</span>
          </CommandItem>
          {LEGAL_MODE ? (
            <>
              <CommandItem onSelect={() => runCommand(() => navigate("/matters"))}>
                <Briefcase className="mr-2 h-4 w-4" />
                <span>Matters</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/clients"))}>
                <Users className="mr-2 h-4 w-4" />
                <span>Clients</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/ledes-export"))}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                <span>LEDES Export</span>
              </CommandItem>
            </>
          ) : (
            <>
              <CommandItem onSelect={() => runCommand(() => navigate("/projects"))}>
                <FolderKanban className="mr-2 h-4 w-4" />
                <span>Projects</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/categories"))}>
                <Tags className="mr-2 h-4 w-4" />
                <span>Categories</span>
              </CommandItem>
            </>
          )}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => navigate("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
