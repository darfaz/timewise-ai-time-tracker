import { useState } from "react";
import { Plus, Search, Pencil, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MatterDialog } from "@/components/MatterDialog";
import { mockMatters, mockClients, Matter } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const Matters = () => {
  const [matters, setMatters] = useState<Matter[]>(mockMatters);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMatter, setEditingMatter] = useState<Matter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const handleAddMatter = () => {
    setEditingMatter(null);
    setIsDialogOpen(true);
  };

  const handleEditMatter = (matter: Matter) => {
    setEditingMatter(matter);
    setIsDialogOpen(true);
  };

  const handleSaveMatter = (matter: Matter) => {
    if (editingMatter) {
      setMatters(matters.map(m => m.id === matter.id ? matter : m));
      toast({
        title: "Matter updated",
        description: "Matter details have been saved successfully.",
      });
    } else {
      setMatters([...matters, { ...matter, id: Date.now().toString() }]);
      toast({
        title: "Matter created",
        description: "New matter has been added successfully.",
      });
    }
    setIsDialogOpen(false);
  };

  const getClientName = (clientId: string) => {
    return mockClients.find(c => c.id === clientId)?.name || "Unknown Client";
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const getStatusColor = (status: Matter["status"]) => {
    switch (status) {
      case "Active":
        return "bg-success text-success-foreground";
      case "Closed":
        return "bg-muted text-muted-foreground";
      case "On Hold":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary";
    }
  };

  const filteredMatters = matters.filter(matter => {
    const matchesSearch = 
      matter.matterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      matter.matterId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getClientName(matter.clientId).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || matter.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Matters</h1>
          <p className="mt-1 text-muted-foreground">
            Manage legal matters and track billable time
          </p>
        </div>
        <Button onClick={handleAddMatter} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Matter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Matters</CardTitle>
              <CardDescription>
                {filteredMatters.length} matter{filteredMatters.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="relative w-[300px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search matters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matter ID</TableHead>
                <TableHead>Matter Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Case Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Time Logged</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMatters.map((matter) => (
                <TableRow key={matter.id}>
                  <TableCell className="font-mono text-sm">{matter.matterId}</TableCell>
                  <TableCell className="font-medium">{matter.matterName}</TableCell>
                  <TableCell>{getClientName(matter.clientId)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{matter.caseType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(matter.status)}>
                      {matter.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatTime(matter.totalTimeLogged)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(matter.lastActivityDate, { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditMatter(matter)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <MatterDialog
        matter={editingMatter}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveMatter}
      />
    </div>
  );
};

export default Matters;
