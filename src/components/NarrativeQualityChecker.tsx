import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Star, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QualityAnalysis {
  score: number;
  issues: string[];
  suggestions: string[];
}

interface NarrativeQualityCheckerProps {
  narrative: string;
  onAnalyze?: (narrative: string) => Promise<QualityAnalysis>;
}

export const NarrativeQualityChecker = ({
  narrative,
  onAnalyze,
}: NarrativeQualityCheckerProps) => {
  const [analysis, setAnalysis] = useState<QualityAnalysis | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const analyzeNarrative = async () => {
      if (onAnalyze) {
        const result = await onAnalyze(narrative);
        setAnalysis(result);
      } else {
        // Default analysis logic
        const issues: string[] = [];
        const suggestions: string[] = [];
        let score = 100;

        const vagueTerms = ["worked on", "various tasks", "stuff", "things", "did some"];
        vagueTerms.forEach((term) => {
          if (narrative.toLowerCase().includes(term)) {
            issues.push(`Vague term: "${term}"`);
            suggestions.push(`Replace "${term}" with specific actions or outcomes`);
            score -= 15;
          }
        });

        if (narrative.length < 50) {
          issues.push("Narrative is too short");
          suggestions.push("Add more detail about what was accomplished");
          score -= 20;
        }

        if (!narrative.match(/\b(developed|created|implemented|fixed|optimized|designed|reviewed)\b/i)) {
          issues.push("Missing action verbs");
          suggestions.push("Use strong action verbs like developed, implemented, optimized");
          score -= 10;
        }

        setAnalysis({ score: Math.max(0, score), issues, suggestions });
      }
    };

    if (narrative) {
      analyzeNarrative();
    }
  }, [narrative, onAnalyze]);

  if (!analysis) return null;

  const stars = Math.round((analysis.score / 100) * 5);
  const hasIssues = analysis.issues.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i <= stars ? "fill-warning text-warning" : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
        <Badge variant={analysis.score >= 80 ? "default" : analysis.score >= 60 ? "secondary" : "destructive"}>
          {analysis.score}/100
        </Badge>
        {hasIssues && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSuggestions(!showSuggestions)}
          >
            <Lightbulb className="h-4 w-4 mr-1" />
            {showSuggestions ? "Hide" : "Show"} Suggestions
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && hasIssues && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 mt-2"
          >
            {analysis.issues.map((issue, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-muted-foreground">{issue}</p>
                  {analysis.suggestions[i] && (
                    <p className="text-primary text-xs mt-1">💡 {analysis.suggestions[i]}</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
