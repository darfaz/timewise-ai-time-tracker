import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Matter, mockClients } from "@/lib/mockData";

interface MatterDialogProps {
  matter: Matter | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (matter: Matter) => void;
}

const caseTypes: Matter["caseType"][] = [
  "Litigation",
  "Transactional",
  "Corporate",
  "Real Estate",
  "IP",
  "Employment",
  "Other",
];

const statusOptions: Matter["status"][] = ["Active", "On Hold", "Closed"];

const billingRulesOptions = [
  "Standard hourly",
  "ABA Model - Technology",
  "ABA Model - Healthcare",
  "Carrier specific - UTBMS required",
  "Carrier specific - detailed billing",
  "Flat fee arrangement",
  "Contingency + hourly",
  "Blended rate",
];

export const MatterDialog = ({ matter, isOpen, onClose, onSave }: MatterDialogProps) => {
  const [matterId, setMatterId] = useState("");
  const [matterName, setMatterName] = useState("");
  const [clientId, setClientId] = useState("");
  const [caseType, setCaseType] = useState<Matter["caseType"]>("Litigation");
  const [status, setStatus] = useState<Matter["status"]>("Active");
  const [billingRules, setBillingRules] = useState("");
  const [assignedAttorneys, setAssignedAttorneys] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (matter) {
      setMatterId(matter.matterId);
      setMatterName(matter.matterName);
      setClientId(matter.clientId);
      setCaseType(matter.caseType);
      setStatus(matter.status);
      setBillingRules(matter.billingRules);
      setAssignedAttorneys(matter.assignedAttorneys.join(", "));
      setNotes(matter.notes);
    } else {
      setMatterId("");
      setMatterName("");
      setClientId(mockClients[0]?.id || "");
      setCaseType("Litigation");
      setStatus("Active");
      setBillingRules("Standard hourly");
      setAssignedAttorneys("");
      setNotes("");
    }
  }, [matter, isOpen]);

  const handleSave = () => {
    const matterData: Matter = {
      id: matter?.id || "",
      matterId,
      matterName,
      clientId,
      caseType,
      status,
      billingRules,
      assignedAttorneys: assignedAttorneys.split(",").map(a => a.trim()).filter(a => a),
      notes,
      totalTimeLogged: matter?.totalTimeLogged || 0,
      lastActivityDate: matter?.lastActivityDate || new Date(),
      createdAt: matter?.createdAt || new Date(),
    };
    onSave(matterData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{matter ? "Edit Matter" : "Add Matter"}</DialogTitle>
          <DialogDescription>
            {matter
              ? "Update matter details and billing configuration"
              : "Create a new matter for time tracking and billing"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="matterId">Matter ID *</Label>
              <Input
                id="matterId"
                value={matterId}
                onChange={(e) => setMatterId(e.target.value)}
                placeholder="e.g., 2024-TC-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId">Client *</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="clientId">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="matterName">Matter Name *</Label>
            <Input
              id="matterName"
              value={matterName}
              onChange={(e) => setMatterName(e.target.value)}
              placeholder="e.g., Patent Infringement Defense"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="caseType">Case Type *</Label>
              <Select value={caseType} onValueChange={(value) => setCaseType(value as Matter["caseType"])}>
                <SelectTrigger id="caseType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {caseTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as Matter["status"])}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingRules">Billing Rules *</Label>
            <Select value={billingRules} onValueChange={setBillingRules}>
              <SelectTrigger id="billingRules">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {billingRulesOptions.map((rule) => (
                  <SelectItem key={rule} value={rule}>
                    {rule}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedAttorneys">Assigned Attorneys</Label>
            <Input
              id="assignedAttorneys"
              value={assignedAttorneys}
              onChange={(e) => setAssignedAttorneys(e.target.value)}
              placeholder="e.g., John Smith, Lisa Wong"
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated list of attorney names
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes or comments about this matter..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!matterId.trim() || !matterName.trim() || !clientId}
          >
            {matter ? "Update" : "Create"} Matter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
