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
import { Client } from "@/lib/mockData";

interface ClientDialogProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
}

const industryOptions = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Real Estate",
  "Retail",
  "Energy",
  "Legal Services",
  "Education",
  "Other",
];

export const ClientDialog = ({ client, isOpen, onClose, onSave }: ClientDialogProps) => {
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [industry, setIndustry] = useState("");
  const [billingContact, setBillingContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [billingGuidelines, setBillingGuidelines] = useState("");

  useEffect(() => {
    if (client) {
      setName(client.name);
      setClientId(client.clientId);
      setIndustry(client.industry);
      setBillingContact(client.billingContact);
      setEmail(client.email);
      setPhone(client.phone);
      setBillingGuidelines(client.billingGuidelines || "");
    } else {
      setName("");
      setClientId("");
      setIndustry("Technology");
      setBillingContact("");
      setEmail("");
      setPhone("");
      setBillingGuidelines("");
    }
  }, [client, isOpen]);

  const handleSave = () => {
    const clientData: Client = {
      id: client?.id || "",
      name,
      clientId,
      industry,
      billingContact,
      email,
      phone,
      billingGuidelines: billingGuidelines || undefined,
      createdAt: client?.createdAt || new Date(),
    };
    onSave(clientData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{client ? "Edit Client" : "Add Client"}</DialogTitle>
          <DialogDescription>
            {client
              ? "Update client information and billing details"
              : "Add a new client to your firm"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Client Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., TechCorp Industries"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID *</Label>
              <Input
                id="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="e.g., TC-2024-001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Input
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., Technology"
              list="industry-options"
            />
            <datalist id="industry-options">
              {industryOptions.map((opt) => (
                <option key={opt} value={opt} />
              ))}
            </datalist>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingContact">Billing Contact *</Label>
            <Input
              id="billingContact"
              value={billingContact}
              onChange={(e) => setBillingContact(e.target.value)}
              placeholder="e.g., John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@client.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingGuidelines">Billing Guidelines</Label>
            <Textarea
              id="billingGuidelines"
              value={billingGuidelines}
              onChange={(e) => setBillingGuidelines(e.target.value)}
              placeholder="e.g., UTBMS codes required, detailed task descriptions..."
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
            disabled={
              !name.trim() ||
              !clientId.trim() ||
              !industry.trim() ||
              !billingContact.trim() ||
              !email.trim() ||
              !phone.trim()
            }
          >
            {client ? "Update" : "Create"} Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
