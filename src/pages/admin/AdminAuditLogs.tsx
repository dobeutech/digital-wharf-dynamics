import { useState, useEffect, useCallback } from "react";
import { useApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, Search, Eye, Download, FileText } from "lucide-react";

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: unknown | null;
  new_values: unknown | null;
  user_agent: string | null;
  created_at: string;
}

const actionColors: Record<string, string> = {
  CREATE: "bg-green-500/10 text-green-500",
  UPDATE: "bg-blue-500/10 text-blue-500",
  DELETE: "bg-red-500/10 text-red-500",
  VIEW: "bg-gray-500/10 text-gray-500",
  STATUS_CHANGE: "bg-yellow-500/10 text-yellow-500",
  ROLE_CHANGE: "bg-purple-500/10 text-purple-500",
  LOGIN: "bg-cyan-500/10 text-cyan-500",
  LOGOUT: "bg-orange-500/10 text-orange-500",
};

export default function AdminAuditLogs() {
  const api = useApi();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = "/audit-logs?limit=100";
      if (actionFilter !== "all") endpoint += `&action=${actionFilter}`;
      if (entityFilter !== "all") endpoint += `&entity_type=${entityFilter}`;
      const data = await api.get<AuditLog[]>(endpoint);
      setLogs(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      setLoading(false);
    }
  }, [api, actionFilter, entityFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const exportToCSV = () => {
    const headers = [
      "Timestamp",
      "Action",
      "Entity Type",
      "Entity ID",
      "User ID",
    ];
    const csvContent = [
      headers.join(","),
      ...logs.map((log) =>
        [
          format(new Date(log.created_at), "yyyy-MM-dd HH:mm:ss"),
          log.action,
          log.entity_type,
          log.entity_id || "",
          log.user_id,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(query) ||
      log.entity_type.toLowerCase().includes(query) ||
      log.entity_id?.toLowerCase().includes(query) ||
      log.user_id.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
            <p className="text-muted-foreground">
              Track admin actions for compliance and security
            </p>
          </div>
          <Button onClick={exportToCSV} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="CREATE">Create</SelectItem>
                  <SelectItem value="UPDATE">Update</SelectItem>
                  <SelectItem value="DELETE">Delete</SelectItem>
                  <SelectItem value="STATUS_CHANGE">Status Change</SelectItem>
                  <SelectItem value="ROLE_CHANGE">Role Change</SelectItem>
                </SelectContent>
              </Select>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  <SelectItem value="user_role">User Roles</SelectItem>
                  <SelectItem value="service">Services</SelectItem>
                  <SelectItem value="project">Projects</SelectItem>
                  <SelectItem value="ccpa_request">CCPA Requests</SelectItem>
                  <SelectItem value="contact_submission">
                    Contact Submissions
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Entity ID</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No audit logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {format(
                            new Date(log.created_at),
                            "MMM d, yyyy HH:mm:ss",
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={actionColors[log.action] || ""}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">
                          {log.entity_type.replace(/_/g, " ")}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.entity_id
                            ? `${log.entity_id.slice(0, 8)}...`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Details Sheet */}
        <Sheet open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Audit Log Details</SheetTitle>
            </SheetHeader>
            {selectedLog && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Timestamp
                  </label>
                  <p className="font-mono">
                    {format(new Date(selectedLog.created_at), "PPpp")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Action
                  </label>
                  <p>
                    <Badge className={actionColors[selectedLog.action] || ""}>
                      {selectedLog.action}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Entity Type
                  </label>
                  <p className="capitalize">
                    {selectedLog.entity_type.replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Entity ID
                  </label>
                  <p className="font-mono text-sm">
                    {selectedLog.entity_id || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    User ID
                  </label>
                  <p className="font-mono text-sm">{selectedLog.user_id}</p>
                </div>
                {selectedLog.old_values && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Previous Values
                    </label>
                    <pre className="mt-1 p-3 bg-muted rounded-md text-sm overflow-x-auto">
                      {JSON.stringify(selectedLog.old_values, null, 2)}
                    </pre>
                  </div>
                )}
                {selectedLog.new_values && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      New Values
                    </label>
                    <pre className="mt-1 p-3 bg-muted rounded-md text-sm overflow-x-auto">
                      {JSON.stringify(selectedLog.new_values, null, 2)}
                    </pre>
                  </div>
                )}
                {selectedLog.user_agent && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      User Agent
                    </label>
                    <p className="text-sm text-muted-foreground break-all">
                      {selectedLog.user_agent}
                    </p>
                  </div>
                )}
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
