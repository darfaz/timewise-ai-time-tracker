import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { mockTimeEntries, mockProjects } from "@/lib/mockData";
import { Clock, Edit2, Trash2, CheckCircle } from "lucide-react";

const Timesheet = () => {
  const [entries, setEntries] = useState(mockTimeEntries);
  const [editingId, setEditingId] = useState<string | null>(null);

  const totalHours = entries.reduce((sum, entry) => sum + entry.duration, 0) / 60;
  const billableTotal = entries
    .filter((e) => e.billable)
    .reduce((sum, entry) => sum + entry.duration, 0) / 60;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Timesheet</h1>
          <p className="mt-1 text-muted-foreground">Review and approve your time entries</p>
        </div>
        <Button>
          <CheckCircle className="mr-2 h-4 w-4" />
          Bulk Approve
        </Button>
      </div>

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
        {entries.map((entry) => {
          const project = mockProjects.find((p) => p.id === entry.projectId);
          return (
            <div key={entry.id} className="rounded-xl bg-card p-6 shadow-card">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{project?.name}</h3>
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
                      onClick={() => setEditingId(entry.id)}
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
                className="min-h-[80px] resize-none"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timesheet;
