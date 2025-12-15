import { useEffect, useState, useCallback } from "react";
import { useApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Shield, Clock, AlertTriangle, CheckCircle, Eye } from "lucide-react";
import { format, differenceInDays, isPast } from "date-fns";

interface CCPARequest {
  id: string;
  reference_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  request_types: string[];
  additional_info: string | null;
  status: string;
  notes: string | null;
  submitted_at: string | null;
  response_deadline: string | null;
  processed_at: string | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
};

const requestTypeLabels: Record<string, string> = {
  "opt-out": "Do Not Sell",
  delete: "Delete Data",
  access: "Access Data",
  correction: "Correct Data",
};

function getDeadlineStatus(deadline: string | null) {
  if (!deadline)
    return { color: "text-muted-foreground", label: "No deadline" };
  const daysRemaining = differenceInDays(new Date(deadline), new Date());
  if (isPast(new Date(deadline)))
    return {
      color: "text-red-500",
      label: `${Math.abs(daysRemaining)} days overdue`,
      icon: AlertTriangle,
    };
  if (daysRemaining <= 7)
    return {
      color: "text-red-500",
      label: `${daysRemaining} days left`,
      icon: AlertTriangle,
    };
  if (daysRemaining <= 14)
    return {
      color: "text-yellow-500",
      label: `${daysRemaining} days left`,
      icon: Clock,
    };
  return {
    color: "text-green-500",
    label: `${daysRemaining} days left`,
    icon: CheckCircle,
  };
}

export default function AdminCCPA() {
  const api = useApi();
  const [requests, setRequests] = useState<CCPARequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<CCPARequest | null>(
    null,
  );
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Create admin endpoint for CCPA requests management
      // For now, this will fail - endpoint needs to be created
      const endpoint =
        statusFilter === "all"
          ? "/ccpa-request"
          : `/ccpa-request?status=${statusFilter}`;
      const data = await api.get<CCPARequest[]>(endpoint);
      setRequests(data || []);
      setLoading(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch CCPA requests",
      });
      setLoading(false);
    }
  }, [api, statusFilter, toast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(true);
    const updates: Record<string, unknown> = { status: newStatus };
    if (newStatus === "completed") {
      updates.processed_at = new Date().toISOString();
    }

    try {
      // TODO: Create admin endpoint for updating CCPA requests
      await api.patch(`/ccpa-request?id=${id}`, updates);
      toast({ title: "Updated", description: "Status updated successfully" });
      fetchRequests();
      if (selectedRequest?.id === id) {
        setSelectedRequest({
          ...selectedRequest,
          status: newStatus,
          processed_at:
            (updates.processed_at as string) || selectedRequest.processed_at,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status",
      });
    } finally {
      setUpdating(false);
    }
  };

  const saveNotes = async () => {
    if (!selectedRequest) return;
    setUpdating(true);

    try {
      await api.patch(`/ccpa-request?id=${selectedRequest.id}`, { notes });
      toast({ title: "Saved", description: "Notes saved successfully" });
      setSelectedRequest({ ...selectedRequest, notes });
      fetchRequests();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save notes",
      });
    } finally {
      setUpdating(false);
    }
  };

  const openDetails = (request: CCPARequest) => {
    setSelectedRequest(request);
    setNotes(request.notes || "");
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            CCPA Requests
          </h1>
          <p className="text-muted-foreground">
            Manage California Consumer Privacy Act requests
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>All Requests</CardTitle>
                <CardDescription>
                  {requests.length} total requests
                </CardDescription>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading...
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No CCPA requests found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Request Types</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => {
                      const deadline = getDeadlineStatus(
                        request.response_deadline,
                      );
                      const DeadlineIcon = deadline.icon;
                      return (
                        <TableRow key={request.id}>
                          <TableCell className="font-mono text-sm">
                            {request.reference_id}
                          </TableCell>
                          <TableCell>{request.full_name}</TableCell>
                          <TableCell>{request.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {request.request_types.map((type) => (
                                <Badge
                                  key={type}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {requestTypeLabels[type] || type}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={statusColors[request.status] || ""}
                            >
                              {request.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div
                              className={`flex items-center gap-1 ${deadline.color}`}
                            >
                              {DeadlineIcon && (
                                <DeadlineIcon className="h-4 w-4" />
                              )}
                              <span className="text-sm">{deadline.label}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDetails(request)}
                            >
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Sheet
          open={!!selectedRequest}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
        >
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            {selectedRequest && (
              <>
                <SheetHeader>
                  <SheetTitle>Request Details</SheetTitle>
                  <SheetDescription>
                    {selectedRequest.reference_id}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{selectedRequest.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedRequest.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">
                        {selectedRequest.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p className="font-medium">
                        {selectedRequest.submitted_at
                          ? format(
                              new Date(selectedRequest.submitted_at),
                              "MMM d, yyyy h:mm a",
                            )
                          : "Unknown"}
                      </p>
                    </div>
                  </div>

                  {selectedRequest.address && (
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{selectedRequest.address}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Request Types
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.request_types.map((type) => (
                        <Badge key={type} variant="secondary">
                          {requestTypeLabels[type] || type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedRequest.additional_info && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Additional Information
                      </p>
                      <p className="font-medium whitespace-pre-wrap">
                        {selectedRequest.additional_info}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Status</p>
                    <Select
                      value={selectedRequest.status}
                      onValueChange={(value) =>
                        updateStatus(selectedRequest.id, value)
                      }
                      disabled={updating}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedRequest.response_deadline && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Response Deadline
                      </p>
                      <p
                        className={`font-medium ${getDeadlineStatus(selectedRequest.response_deadline).color}`}
                      >
                        {format(
                          new Date(selectedRequest.response_deadline),
                          "MMMM d, yyyy",
                        )}
                        {" - "}
                        {
                          getDeadlineStatus(selectedRequest.response_deadline)
                            .label
                        }
                      </p>
                    </div>
                  )}

                  {selectedRequest.processed_at && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Processed At
                      </p>
                      <p className="font-medium text-green-500">
                        {format(
                          new Date(selectedRequest.processed_at),
                          "MMM d, yyyy h:mm a",
                        )}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Internal Notes
                    </p>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add internal notes about this request..."
                      rows={4}
                    />
                    <Button
                      onClick={saveNotes}
                      disabled={updating}
                      className="mt-2"
                    >
                      Save Notes
                    </Button>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
