import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, ArrowUp, ArrowDown, Eye } from "lucide-react";
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

interface AccessibleContactsTableProps {
  submissions: ContactSubmission[];
  onViewDetails: (submission: ContactSubmission) => void;
  loading?: boolean;
}

type SortField = "name" | "email" | "status" | "submitted_at";
type SortDirection = "asc" | "desc" | "none";

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  read: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  responded: "bg-green-500/10 text-green-500 border-green-500/20",
  archived: "bg-muted text-muted-foreground border-muted",
};

export function AccessibleContactsTable({
  submissions,
  onViewDetails,
  loading = false
}: AccessibleContactsTableProps) {
  const [sortField, setSortField] = useState<SortField>("submitted_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => {
        if (prev === "asc") return "desc";
        if (prev === "desc") return "none";
        return "asc";
      });
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedSubmissions = useMemo(() => {
    if (sortDirection === "none") return submissions;

    return [...submissions].sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "status":
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        case "submitted_at":
          aValue = new Date(a.submitted_at || 0).getTime();
          bValue = new Date(b.submitted_at || 0).getTime();
          break;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [submissions, sortField, sortDirection]);

  const paginatedSubmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedSubmissions.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedSubmissions, currentPage]);

  const totalPages = Math.ceil(sortedSubmissions.length / itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedSubmissions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedSubmissions.map(s => s.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field || sortDirection === "none") {
      return <ArrowUpDown className="h-4 w-4 ml-1" aria-hidden="true" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="h-4 w-4 ml-1" aria-hidden="true" />;
    }
    return <ArrowDown className="h-4 w-4 ml-1" aria-hidden="true" />;
  };

  const getAriaSort = (field: SortField): "ascending" | "descending" | "none" => {
    if (sortField !== field) return "none";
    if (sortDirection === "asc") return "ascending";
    if (sortDirection === "desc") return "descending";
    return "none";
  };

  const truncateMessage = (message: string, maxLength: number = 80) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground" role="status" aria-live="polite">
        Loading contact submissions...
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground" role="status">
        No contact submissions found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div role="status" aria-live="polite" className="sr-only">
        Showing {paginatedSubmissions.length} of {sortedSubmissions.length} contact submissions.
        {(sortField !== "submitted_at" && sortDirection !== "none") || (sortField === "submitted_at" && sortDirection !== "desc") ?
          ` Sorted by ${sortField} ${sortDirection === "asc" ? "ascending" : sortDirection === "desc" ? "descending" : ""}.` :
          ""
        }
      </div>

      <div className="overflow-x-auto">
        <Table role="table" aria-label="Contact form submissions">
          <caption className="sr-only">
            Contact form submissions with sorting and filtering capabilities.
            Use the column headers to sort. Use the view button to see full details.
          </caption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.size === paginatedSubmissions.length && paginatedSubmissions.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all visible submissions"
                />
              </TableHead>
              <TableHead scope="col" aria-sort={getAriaSort("name")}>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="font-semibold hover:bg-transparent p-0"
                  aria-label={`Sort by name ${sortField === "name" && sortDirection !== "none" ? sortDirection === "asc" ? "descending" : "ascending" : "ascending"}`}
                >
                  Name
                  {getSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead scope="col" aria-sort={getAriaSort("email")}>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("email")}
                  className="font-semibold hover:bg-transparent p-0"
                  aria-label={`Sort by email ${sortField === "email" && sortDirection !== "none" ? sortDirection === "asc" ? "descending" : "ascending" : "ascending"}`}
                >
                  Email
                  {getSortIcon("email")}
                </Button>
              </TableHead>
              <TableHead scope="col">Phone</TableHead>
              <TableHead scope="col" className="max-w-[200px]">Message</TableHead>
              <TableHead scope="col" aria-sort={getAriaSort("status")}>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="font-semibold hover:bg-transparent p-0"
                  aria-label={`Sort by status ${sortField === "status" && sortDirection !== "none" ? sortDirection === "asc" ? "descending" : "ascending" : "ascending"}`}
                >
                  Status
                  {getSortIcon("status")}
                </Button>
              </TableHead>
              <TableHead scope="col" aria-sort={getAriaSort("submitted_at")}>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("submitted_at")}
                  className="font-semibold hover:bg-transparent p-0"
                  aria-label={`Sort by submission date ${sortField === "submitted_at" && sortDirection !== "none" ? sortDirection === "asc" ? "descending" : "ascending" : "ascending"}`}
                >
                  Submitted
                  {getSortIcon("submitted_at")}
                </Button>
              </TableHead>
              <TableHead scope="col">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSubmissions.map((submission) => (
              <TableRow
                key={submission.id}
                className={submission.status === "new" ? "bg-primary/5" : ""}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(submission.id)}
                    onCheckedChange={() => toggleSelect(submission.id)}
                    aria-label={`Select ${submission.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{submission.name}</TableCell>
                <TableCell>{submission.email}</TableCell>
                <TableCell>{submission.phone || <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell className="max-w-[200px]">
                  <span className="text-sm text-muted-foreground">
                    {truncateMessage(submission.message)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[submission.status] || ""}>
                    {submission.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {submission.submitted_at
                    ? <time dateTime={submission.submitted_at}>
                        {format(new Date(submission.submitted_at), "MMM d, yyyy")}
                      </time>
                    : <span className="text-muted-foreground">—</span>
                  }
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(submission)}
                    aria-label={`View details for ${submission.name}'s submission`}
                  >
                    <Eye className="h-4 w-4 mr-1" aria-hidden="true" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between" role="navigation" aria-label="Pagination">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} ({sortedSubmissions.length} total submissions)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {selectedIds.size > 0 && (
        <div
          className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between"
          role="status"
          aria-live="polite"
        >
          <span className="text-sm font-medium">
            {selectedIds.size} submission{selectedIds.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedIds(new Set())}>
              Clear Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
