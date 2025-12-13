import { useMemo } from "react";
import { AccessibleContactsTable } from "./AccessibleContactsTable";
import { ResponsiveTable, MobileCardView } from "@/components/ui/responsive-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";

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

interface ResponsiveContactsTableProps {
  submissions: ContactSubmission[];
  onViewDetails: (submission: ContactSubmission) => void;
  loading?: boolean;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  read: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  responded: "bg-green-500/10 text-green-500 border-green-500/20",
  archived: "bg-muted text-muted-foreground border-muted",
};

export function ResponsiveContactsTable({
  submissions,
  onViewDetails,
  loading = false
}: ResponsiveContactsTableProps) {
  const mobileCards = useMemo(() => {
    return submissions.map((submission) => (
      <Card key={submission.id} className={submission.status === "new" ? "border-primary/20 bg-primary/5" : ""}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{submission.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{submission.email}</p>
            </div>
            <Badge className={statusColors[submission.status] || ""}>
              {submission.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {submission.phone && (
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm">{submission.phone}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground">Message</p>
            <p className="text-sm line-clamp-3">{submission.message}</p>
          </div>
          {submission.submitted_at && (
            <div>
              <p className="text-xs text-muted-foreground">Submitted</p>
              <p className="text-sm">
                <time dateTime={submission.submitted_at}>
                  {format(new Date(submission.submitted_at), "MMM d, yyyy 'at' h:mm a")}
                </time>
              </p>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(submission)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    ));
  }, [submissions, onViewDetails]);

  return (
    <>
      {/* Mobile Card View */}
      <MobileCardView
        items={submissions}
        renderCard={(_, index) => mobileCards[index]}
        emptyMessage="No contact submissions found"
      />

      {/* Desktop Table View */}
      <ResponsiveTable>
        <AccessibleContactsTable
          submissions={submissions}
          onViewDetails={onViewDetails}
          loading={loading}
        />
      </ResponsiveTable>
    </>
  );
}

