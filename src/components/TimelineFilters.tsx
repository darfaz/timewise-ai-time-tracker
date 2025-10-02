import { Button } from "@/components/ui/button";
import { Calendar, Filter, FolderOpen, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TimelineFiltersProps {
  onDateFilter: (filter: string) => void;
  onCategoryFilter: (category: string) => void;
  onAppFilter: (app: string) => void;
}

export const TimelineFilters = ({
  onDateFilter,
  onCategoryFilter,
  onAppFilter,
}: TimelineFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Select Period</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onDateFilter("today")}>
            Today
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDateFilter("yesterday")}>
            Yesterday
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDateFilter("week")}>
            This Week
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDateFilter("custom")}>
            Custom Range
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <FolderOpen className="mr-2 h-4 w-4" />
            Category
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onCategoryFilter("all")}>
            All Categories
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCategoryFilter("development")}>
            Development
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCategoryFilter("design")}>
            Design
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCategoryFilter("communication")}>
            Communication
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Monitor className="mr-2 h-4 w-4" />
            Application
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Filter by App</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onAppFilter("all")}>
            All Applications
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAppFilter("vscode")}>
            VS Code
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAppFilter("chrome")}>
            Chrome
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAppFilter("figma")}>
            Figma
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="sm">
        <Filter className="mr-2 h-4 w-4" />
        Clear Filters
      </Button>
    </div>
  );
};
