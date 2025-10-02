import { useState } from "react";
import { Plus, Pencil, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClientDialog } from "@/components/ClientDialog";
import { mockClients, mockMatters, Client } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const handleAddClient = () => {
    setEditingClient(null);
    setIsDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  };

  const handleSaveClient = (client: Client) => {
    if (editingClient) {
      setClients(clients.map(c => c.id === client.id ? client : c));
      toast({
        title: "Client updated",
        description: "Client details have been saved successfully.",
      });
    } else {
      setClients([...clients, { ...client, id: Date.now().toString() }]);
      toast({
        title: "Client created",
        description: "New client has been added successfully.",
      });
    }
    setIsDialogOpen(false);
  };

  const getClientMatters = (clientId: string) => {
    return mockMatters.filter(m => m.clientId === clientId);
  };

  const getActiveMattersCount = (clientId: string) => {
    return getClientMatters(clientId).filter(m => m.status === "Active").length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="mt-1 text-muted-foreground">
            Manage client information and billing details
          </p>
        </div>
        <Button onClick={handleAddClient} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => {
          const matters = getClientMatters(client.id);
          const activeMatters = getActiveMattersCount(client.id);
          
          return (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <CardDescription className="font-mono text-xs">
                        {client.clientId}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClient(client)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Industry:</span>
                    <span className="font-medium">{client.industry}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contact:</span>
                    <span className="font-medium">{client.billingContact}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium text-xs">{client.email}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="text-2xl font-bold">{matters.length}</p>
                    <p className="text-xs text-muted-foreground">Total Matters</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">{activeMatters}</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                </div>

                {client.billingGuidelines && (
                  <Badge variant="secondary" className="w-full justify-center text-xs">
                    {client.billingGuidelines}
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ClientDialog
        client={editingClient}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveClient}
      />
    </div>
  );
};

export default Clients;
