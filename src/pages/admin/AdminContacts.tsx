import { useEffect, useState, useCallback } from "react";
import { useApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Mail, Archive } from "lucide-react";
import { format } from "date-fns";
import { AccessibleContactsTable } from "@/components/admin/AccessibleContactsTable";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  notes: string | null;
  sms_consent: boolean | null;
  marketing_consent: boolean | null;
  submitted_at: string | null;
  responded_at: string | null;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  read: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  responded: "bg-green-500/10 text-green-500 border-green-500/20",
  archived: "bg-muted text-muted-foreground border-muted",
};

export default function AdminContacts() {
  const api = useApi();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = statusFilter === "all" ? "/contact-submissions" : `/contact-submissions?status=${statusFilter}`;
      const data = await api.get<ContactSubmission[]>(endpoint);

      setSubmissions(data || []);
      setLoading(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch contact submissions" });
      setLoading(false);
    }
  }, [api, statusFilter, toast]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(true);
    const updates: Record<string, unknown> = { status: newStatus };
    if (newStatus === "responded") {
      updates.responded_at = new Date().toISOString();
    }

    try {
      await api.patch(`/contact-submissions?id=${id}`, updates);
      toast({ title: "Updated", description: "Status updated successfully" });
      fetchSubmissions();
      if (selectedSubmission?.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status: newStatus, responded_at: updates.responded_at as string || selectedSubmission.responded_at });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update status" });
    } finally {
      setUpdating(false);
    }
  };

  const saveNotes = async () => {
    if (!selectedSubmission) return;
    setUpdating(true);

    try {
      await api.patch(`/contact-submissions?id=${selectedSubmission.id}`, { notes });
      toast({ title: "Saved", description: "Notes saved successfully" });
      setSelectedSubmission({ ...selectedSubmission, notes });
      fetchSubmissions();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save notes" });
    } finally {
      setUpdating(false);
    }
  };

  const openDetails = async (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setNotes(submission.notes || "");
    
    // Mark as read if new
    if (submission.status === "new") {
      await updateStatus(submission.id, "read");
    }
  };


  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-primary" />
            Contact Submissions
          </h1>
          <p className="text-muted-foreground">View and respond to contact form submissions</p>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>All Submissions</CardTitle>
                <CardDescription>{submissions.length} total submissions</CardDescription>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <AccessibleContactsTable
              submissions={submissions}
              onViewDetails={openDetails}
              loading={loading}
            />
          </CardContent>
        </Card>

        <Sheet open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            {selectedSubmission && (
              <>
                <SheetHeader>
                  <SheetTitle>Contact Details</SheetTitle>
                  <SheetDescription>From {selectedSubmission.name}</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedSubmission.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a href={`mailto:${selectedSubmission.email}`} className="font-medium text-primary hover:underline">
                        {selectedSubmission.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedSubmission.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p className="font-medium">
                        {selectedSubmission.submitted_at 
                          ? format(new Date(selectedSubmission.submitted_at), "MMM d, yyyy h:mm a")
                          : "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {selectedSubmission.sms_consent && (
                      <Badge variant="outline" className="text-green-500 border-green-500/30">
                        SMS Consent
                      </Badge>
                    )}
                    {selectedSubmission.marketing_consent && (
                      <Badge variant="outline" className="text-blue-500 border-blue-500/30">
                        Marketing Consent
                      </Badge>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Message</p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedSubmission.message}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Status</p>
                    <Select
                      value={selectedSubmission.status}
                      onValueChange={(value) => updateStatus(selectedSubmission.id, value)}
                      disabled={updating}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="responded">Responded</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedSubmission.responded_at && (
                    <div>
                      <p className="text-sm text-muted-foreground">Responded At</p>
                      <p className="font-medium text-green-500">
                        {format(new Date(selectedSubmission.responded_at), "MMM d, yyyy h:mm a")}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <a href={`mailto:${selectedSubmission.email}?subject=Re: Your inquiry to Dobeu Tech Solutions`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Reply via Email
                      </a>
                    </Button>
                    {selectedSubmission.status !== "archived" && (
                      <Button 
                        variant="outline" 
                        onClick={() => updateStatus(selectedSubmission.id, "archived")}
                        disabled={updating}
                      >
                        <Archive className="h-4 w-4 mr-1" />
                        Archive
                      </Button>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Internal Notes</p>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add internal notes about this submission..."
                      rows={4}
                    />
                    <Button onClick={saveNotes} disabled={updating} className="mt-2">
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
