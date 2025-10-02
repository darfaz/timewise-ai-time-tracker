import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { mockTimeEntries, mockProjects } from "@/lib/mockData";
import { Clock, Edit2, Trash2, CheckCircle, Sparkles, ThumbsUp } from "lucide-react";
import { SmartSuggestions } from "@/components/SmartSuggestions";
import { NarrativeQualityChecker } from "@/components/NarrativeQualityChecker";
import { BatchProcessingModal } from "@/components/BatchProcessingModal";
import { apiClient } from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const Timesheet = () => {
  const [entries, setEntries] = useState(mockTimeEntries);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [editedEntries, setEditedEntries] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useState(() => {
    apiClient.getSmartSuggestions().then(setSuggestions);
  });

  const totalHours = entries.reduce((sum, entry) => sum + entry.duration, 0) / 60;
  const billableTotal = entries
    .filter((e) => e.billable)
    .reduce((sum, entry) => sum + entry.duration, 0) / 60;

  const handleAcceptSuggestion = (activityId: string, projectId: string) => {
    toast({
      title: "Suggestion Applied",
      description: `Activity tagged to ${projectId}`,
    });
    setSuggestions(suggestions.filter((s) => s.activityId !== activityId));
  };

  const handleRejectSuggestion = (activityId: string) => {
    setSuggestions(suggestions.filter((s) => s.activityId !== activityId));
  };

  const handleAcceptAllSuggestions = () => {
    toast({
      title: "All Suggestions Applied",
      description: `${suggestions.length} activities have been tagged`,
    });
    setSuggestions([]);
  };

  const handleBatchProcess = async () => {
    setIsBatchProcessing(true);
  };

  const processBatch = async () => {
    const entryIds = entries.map((e) => e.id);
    return await apiClient.batchProcessNarratives(entryIds);
  };

  const handleNarrativeEdit = (entryId: string, newDescription: string) => {
    setEntries(
      entries.map((e) =>
        e.id === entryId ? { ...e, description: newDescription } : e
      )
    );
    
    if (!editedEntries.has(entryId)) {
      setEditedEntries(new Set([...editedEntries, entryId]));
      setTimeout(() => {
        toast({
          title: "👍 Thanks for improving!",
          description: "Your edits help us learn and improve AI suggestions",
        });
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Timesheet</h1>
          <p className="mt-1 text-muted-foreground">Review and approve your time entries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBatchProcess}>
            <Sparkles className="mr-2 h-4 w-4" />
            Process All Today
          </Button>
          <Button>
            <CheckCircle className="mr-2 h-4 w-4" />
            Bulk Approve
          </Button>
        </div>
      </div>

      <SmartSuggestions
        suggestions={suggestions}
        onAccept={handleAcceptSuggestion}
        onReject={handleRejectSuggestion}
        onAcceptAll={handleAcceptAllSuggestions}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-card p-6 shadow-card">
          <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{totalHours.toFixed(1)}</p>
        </div>
        <div className="rounded-xl bg-card p-6 shadow-card">
          <p className="text-sm font-medium text-muted-foreground">Billable Hours</p>
          <p className="mt-2 text-3xl font-bold text-success">{billableTotal.toFixed(1)}</p>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {entries.map((entry) => {
            const project = mockProjects.find((p) => p.id === entry.projectId);
            const isEdited = editedEntries.has(entry.id);
            
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="rounded-xl bg-card p-6 shadow-card"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{project?.name}</h3>
                      {isEdited && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1 text-success text-sm"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </motion.div>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="secondary">{entry.category}</Badge>
                      {entry.billable && <Badge className="bg-success">Billable</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{(entry.duration / 60).toFixed(1)}h</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(entry.id === editingId ? null : entry.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Textarea
                  value={entry.description}
                  readOnly={editingId !== entry.id}
                  onChange={(e) => handleNarrativeEdit(entry.id, e.target.value)}
                  className="min-h-[80px] resize-none mb-3"
                />
                
                <NarrativeQualityChecker narrative={entry.description} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <BatchProcessingModal
        isOpen={isBatchProcessing}
        onClose={() => setIsBatchProcessing(false)}
        totalItems={entries.length}
        onProcess={processBatch}
      />
    </div>
  );
};

export default Timesheet;
