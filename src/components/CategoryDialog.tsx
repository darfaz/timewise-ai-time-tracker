import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import * as LucideIcons from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category, colorPalette } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface CategoryDialogProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
}

const iconOptions = [
  "Briefcase", "BookOpen", "User", "Coffee", "Target", "Code2", "Palette",
  "Lightbulb", "Heart", "Star", "Zap", "TrendingUp", "Award", "Calendar",
  "Clock", "Mail", "MessageSquare", "Phone", "Music", "Camera", "Gamepad",
  "Dumbbell", "ShoppingCart", "Home", "Plane", "Car", "Bike"
];

export const CategoryDialog = ({ category, isOpen, onClose, onSave }: CategoryDialogProps) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState(colorPalette[0].value);
  const [icon, setIcon] = useState("Briefcase");
  const [keywords, setKeywords] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color);
      setIcon(category.icon);
      setKeywords(category.keywords.join(", "));
    } else {
      setName("");
      setColor(colorPalette[0].value);
      setIcon("Briefcase");
      setKeywords("");
    }
  }, [category, isOpen]);

  const handleSave = () => {
    const categoryData: Category = {
      id: category?.id || "",
      name,
      color,
      icon,
      keywords: keywords.split(",").map(k => k.trim()).filter(k => k),
      totalTimeThisWeek: category?.totalTimeThisWeek || 0,
      entryCount: category?.entryCount || 0,
    };
    onSave(categoryData);
  };

  const getCategoryIcon = (iconName: string, className?: string) => {
    const Icon = (LucideIcons as any)[iconName] as React.ComponentType<{ className?: string }>;
    return Icon ? <Icon className={className} /> : <LucideIcons.Tag className={className} />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
          <DialogDescription>
            {category 
              ? "Update category details and auto-categorization rules"
              : "Create a new category to organize your time tracking"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Work, Learning, Personal"
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-6 gap-2">
              {colorPalette.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={cn(
                    "h-10 w-full rounded-lg transition-all hover:scale-105",
                    color === c.value && "ring-2 ring-ring ring-offset-2"
                  )}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                >
                  {color === c.value && (
                    <Check className="mx-auto h-5 w-5 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="grid grid-cols-7 gap-2">
                {iconOptions.map((iconName) => (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setIcon(iconName)}
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-lg transition-all hover:scale-105",
                      icon === iconName
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                    title={iconName}
                  >
                    {getCategoryIcon(iconName, "h-5 w-5")}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (for auto-categorization)</Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., github, vscode, terminal"
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated keywords to automatically assign activities to this category
            </p>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="mb-2 text-sm font-medium">Preview</p>
            <div className="flex items-center gap-3">
              <div 
                className="rounded-lg p-2 text-white"
                style={{ backgroundColor: color }}
              >
                {getCategoryIcon(icon, "h-5 w-5")}
              </div>
              <span className="font-medium">{name || "Category Name"}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {category ? "Update" : "Create"} Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
