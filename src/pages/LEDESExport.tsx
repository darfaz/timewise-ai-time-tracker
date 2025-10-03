import { useState } from "react";
import { Calendar, FileDown, PlayCircle, CheckCircle2, AlertTriangle, XCircle, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComplianceModal } from "@/components/ComplianceModal";
import { ExportProgressModal } from "@/components/ExportProgressModal";
import { mockBillingEntries, mockMatters, mockExportHistory, BillingEntry } from "@/lib/billingData";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const LEDESExport = () => {
  const [entries, setEntries] = useState<BillingEntry[]>(mockBillingEntries);
  const [selectedMatters, setSelectedMatters] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"LEDES" | "CSV">("LEDES");
  const { toast } = useToast();

  const handleRunComplianceCheck = () => {
    setIsComplianceModalOpen(true);
  };

  const handleFixIssues = (fixedEntries: BillingEntry[]) => {
    setEntries(entries.map(e => {
      const fixed = fixedEntries.find(f => f.id === e.id);
      return fixed || e;
    }));
    toast({
      title: "Issues fixed",
      description: "Compliance issues have been automatically corrected.",
    });
  };

  const handleExport = (format: "LEDES" | "CSV") => {
    setExportFormat(format);
    setIsExportModalOpen(true);
  };

  const filteredEntries = entries.filter(entry => {
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
    const matchesMatter = selectedMatters.length === 0 || selectedMatters.includes(entry.matterId);
    return matchesStatus && matchesMatter;
  });

  const totalHours = filteredEntries.reduce((sum, e) => sum + e.hours, 0);
  const totalAmount = filteredEntries.reduce((sum, e) => sum + e.amount, 0);
  const compliantCount = filteredEntries.filter(e => e.complianceStatus === "compliant").length;
  const warningCount = filteredEntries.filter(e => e.complianceStatus === "warning").length;
  const errorCount = filteredEntries.filter(e => e.complianceStatus === "error").length;

  const getMatterName = (matterId: string) => {
    return mockMatters.find(m => m.id === matterId)?.matterName || "Unknown";
  };

  const getStatusIcon = (status: BillingEntry["complianceStatus"]) => {
    switch (status) {
      case "compliant":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">LEDES Export</h1>
        <p className="mt-1 text-muted-foreground">
          Generate compliant billing exports for insurance carriers
        </p>
      </div>

      <Tabs defaultValue="export" className="space-y-6">
        <TabsList>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="history">Export History</TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-6">
          {/* Filters Section */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Select entries to export</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Calendar className="h-4 w-4" />
                    Last 30 days
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Ready">Ready</SelectItem>
                      <SelectItem value="Exported">Exported</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Timekeeper</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Timekeepers</SelectItem>
                      <SelectItem value="john">John Smith</SelectItem>
                      <SelectItem value="lisa">Lisa Wong</SelectItem>
                      <SelectItem value="sarah">Sarah Davis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Entries</CardDescription>
                <CardTitle className="text-3xl">{filteredEntries.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Compliant
                </CardDescription>
                <CardTitle className="text-3xl text-success">{compliantCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Warnings
                </CardDescription>
                <CardTitle className="text-3xl text-warning">{warningCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  Errors
                </CardDescription>
                <CardTitle className="text-3xl text-destructive">{errorCount}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Preview Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Export Preview</CardTitle>
                  <CardDescription>
                    {filteredEntries.length} entries • {totalHours.toFixed(1)}h • ${totalAmount.toLocaleString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Timekeeper</TableHead>
                    <TableHead>Matter</TableHead>
                    <TableHead>Task Code</TableHead>
                    <TableHead className="text-right">Hours</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Narrative</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{getStatusIcon(entry.complianceStatus)}</TableCell>
                      <TableCell className="text-sm">
                        {format(entry.date, "MM/dd/yyyy")}
                      </TableCell>
                      <TableCell className="font-medium">{entry.timekeeper}</TableCell>
                      <TableCell className="text-sm">{getMatterName(entry.matterId)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.taskCode}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{entry.hours.toFixed(1)}h</TableCell>
                      <TableCell className="text-right font-medium">
                        ${entry.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="max-w-md truncate text-sm">
                        {entry.narrative}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleRunComplianceCheck} className="gap-2">
                <PlayCircle className="h-4 w-4" />
                Run Compliance Check
              </Button>
              {(warningCount > 0 || errorCount > 0) && (
                <Button variant="outline" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Fix All Issues
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Save as Draft</Button>
              <Button variant="outline" onClick={() => handleExport("CSV")} className="gap-2">
                <FileDown className="h-4 w-4" />
                Export to CSV
              </Button>
              <Button onClick={() => handleExport("LEDES")} className="gap-2">
                <FileDown className="h-4 w-4" />
                Export to LEDES 1998B
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export History</CardTitle>
              <CardDescription>Previous LEDES exports and downloads</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Export Date</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Matters</TableHead>
                    <TableHead className="text-right">Total Hours</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead>Filename</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockExportHistory.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell>{format(history.exportDate, "MM/dd/yyyy HH:mm")}</TableCell>
                      <TableCell>
                        <Badge variant={history.format === "LEDES" ? "default" : "secondary"}>
                          {history.format}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{history.matterIds.length} matters</TableCell>
                      <TableCell className="text-right">{history.totalHours.toFixed(1)}h</TableCell>
                      <TableCell className="text-right">
                        ${history.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{history.filename}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ComplianceModal
        isOpen={isComplianceModalOpen}
        onClose={() => setIsComplianceModalOpen(false)}
        entries={filteredEntries}
        onFixIssues={handleFixIssues}
      />

      <ExportProgressModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        entries={filteredEntries}
        hasLedesRequired={true}
      />
    </div>
  );
};

export default LEDESExport;
