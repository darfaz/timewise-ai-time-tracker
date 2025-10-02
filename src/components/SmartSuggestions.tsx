import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface Suggestion {
  activityId: string;
  suggestedProject: string;
  confidence: number;
  activityName: string;
}

interface SmartSuggestionsProps {
  suggestions: Suggestion[];
  onAccept: (activityId: string, projectId: string) => void;
  onReject: (activityId: string) => void;
  onAcceptAll: () => void;
}

export const SmartSuggestions = ({
  suggestions,
  onAccept,
  onReject,
  onAcceptAll,
}: SmartSuggestionsProps) => {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const visibleSuggestions = suggestions.filter(
    (s) => !dismissedIds.includes(s.activityId)
  );

  if (visibleSuggestions.length === 0) return null;

  const handleReject = (activityId: string) => {
    setDismissedIds([...dismissedIds, activityId]);
    onReject(activityId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-6 shadow-card border border-primary/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Smart Suggestions</h3>
          <Badge variant="secondary">{visibleSuggestions.length} untagged</Badge>
        </div>
        {visibleSuggestions.length > 1 && (
          <Button onClick={onAcceptAll} size="sm">
            Accept All Suggestions
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {visibleSuggestions.map((suggestion) => (
          <motion.div
            key={suggestion.activityId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center justify-between bg-card p-4 rounded-lg border border-border"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {suggestion.activityName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">
                  Suggested: <span className="font-medium text-primary">{suggestion.suggestedProject}</span>
                </span>
                <Badge
                  variant={suggestion.confidence > 80 ? "default" : "secondary"}
                  className="text-xs"
                >
                  {suggestion.confidence}% confident
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAccept(suggestion.activityId, suggestion.suggestedProject)}
              >
                <Check className="h-4 w-4 text-success" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleReject(suggestion.activityId)}
              >
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
