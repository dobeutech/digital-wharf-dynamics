import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Shield,
  ShieldCheck,
  User,
} from "lucide-react";
import { format } from "date-fns";

interface Profile {
  id: string;
  username: string;
  auth_user_id: string;
  created_at: string;
}

interface AccessibleUsersTableProps {
  profiles: Profile[];
  userRoles: Map<string, string[]>;
  onToggleRole: (userId: string, role: "admin" | "moderator" | "user") => void;
  loading?: boolean;
}

type SortField = "username" | "created_at" | "roles";
type SortDirection = "asc" | "desc" | "none";

export function AccessibleUsersTable({
  profiles,
  userRoles,
  onToggleRole,
  loading = false,
}: AccessibleUsersTableProps) {
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => {
        if (prev === "asc") return "desc";
        if (prev === "desc") return "none";
        return "asc";
      });
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedProfiles = useMemo(() => {
    if (sortDirection === "none") return profiles;

    return [...profiles].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "username":
          comparison = a.username
            .toLowerCase()
            .localeCompare(b.username.toLowerCase());
          break;
        case "created_at":
          comparison =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "roles": {
          const aRoles = userRoles.get(a.auth_user_id) || [];
          const bRoles = userRoles.get(b.auth_user_id) || [];
          comparison = aRoles.length - bRoles.length;
          break;
        }
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [profiles, sortField, sortDirection, userRoles]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field || sortDirection === "none") {
      return <ArrowUpDown className="h-4 w-4 ml-1" aria-hidden="true" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="h-4 w-4 ml-1" aria-hidden="true" />;
    }
    return <ArrowDown className="h-4 w-4 ml-1" aria-hidden="true" />;
  };

  const getAriaSort = (
    field: SortField,
  ): "ascending" | "descending" | "none" => {
    if (sortField !== field) return "none";
    if (sortDirection === "asc") return "ascending";
    if (sortDirection === "desc") return "descending";
    return "none";
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="h-4 w-4" aria-hidden="true" />;
      case "moderator":
        return <Shield className="h-4 w-4" aria-hidden="true" />;
      default:
        return <User className="h-4 w-4" aria-hidden="true" />;
    }
  };

  const getRolePriority = (role: string): number => {
    switch (role) {
      case "admin":
        return 3;
      case "moderator":
        return 2;
      case "user":
        return 1;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div
        className="text-center py-8 text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        Loading user accounts...
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground" role="status">
        No users found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div role="status" aria-live="polite" className="sr-only">
        Showing {sortedProfiles.length} user accounts.
        {sortField && sortDirection !== "none"
          ? ` Sorted by ${sortField} ${sortDirection === "asc" ? "ascending" : "descending"}.`
          : ""}
      </div>

      <div className="overflow-x-auto">
        <Table role="table" aria-label="User accounts and roles">
          <caption className="sr-only">
            User accounts with role management capabilities. Use the column
            headers to sort. Use the role buttons to assign or remove roles.
          </caption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col" aria-sort={getAriaSort("username")}>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("username")}
                  className="font-semibold hover:bg-transparent p-0"
                  aria-label={`Sort by username ${sortField === "username" && sortDirection !== "none" ? (sortDirection === "asc" ? "descending" : "ascending") : "ascending"}`}
                >
                  Username
                  {getSortIcon("username")}
                </Button>
              </TableHead>
              <TableHead scope="col" aria-sort={getAriaSort("roles")}>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("roles")}
                  className="font-semibold hover:bg-transparent p-0"
                  aria-label={`Sort by number of roles ${sortField === "roles" && sortDirection !== "none" ? (sortDirection === "asc" ? "descending" : "ascending") : "ascending"}`}
                >
                  Current Roles
                  {getSortIcon("roles")}
                </Button>
              </TableHead>
              <TableHead scope="col" aria-sort={getAriaSort("created_at")}>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("created_at")}
                  className="font-semibold hover:bg-transparent p-0"
                  aria-label={`Sort by join date ${sortField === "created_at" && sortDirection !== "none" ? (sortDirection === "asc" ? "descending" : "ascending") : "ascending"}`}
                >
                  Joined
                  {getSortIcon("created_at")}
                </Button>
              </TableHead>
              <TableHead scope="col">Manage Roles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProfiles.map((profile) => {
              const roles = userRoles.get(profile.auth_user_id) || [];
              const sortedRoles = [...roles].sort(
                (a, b) => getRolePriority(b) - getRolePriority(a),
              );

              return (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{profile.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className="flex flex-wrap gap-2"
                      role="list"
                      aria-label={`Roles for ${profile.username}`}
                    >
                      {sortedRoles.length > 0 ? (
                        sortedRoles.map((role) => (
                          <Badge
                            key={role}
                            variant="outline"
                            className="gap-1"
                            role="listitem"
                          >
                            {getRoleIcon(role)}
                            <span className="capitalize">{role}</span>
                          </Badge>
                        ))
                      ) : (
                        <Badge
                          variant="outline"
                          className="gap-1"
                          role="listitem"
                        >
                          {getRoleIcon("user")}
                          <span>User</span>
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <time dateTime={profile.created_at}>
                      {format(new Date(profile.created_at), "MMM d, yyyy")}
                    </time>
                  </TableCell>
                  <TableCell>
                    <div
                      className="flex flex-wrap gap-2"
                      role="group"
                      aria-label={`Role management for ${profile.username}`}
                    >
                      <Button
                        variant={
                          roles.includes("admin") ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          onToggleRole(profile.auth_user_id, "admin")
                        }
                        aria-label={
                          roles.includes("admin")
                            ? `Remove admin role from ${profile.username}`
                            : `Give admin role to ${profile.username}`
                        }
                        aria-pressed={roles.includes("admin")}
                      >
                        <ShieldCheck
                          className="h-4 w-4 mr-1"
                          aria-hidden="true"
                        />
                        {roles.includes("admin") ? "Remove" : "Make"} Admin
                      </Button>
                      <Button
                        variant={
                          roles.includes("moderator") ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          onToggleRole(profile.auth_user_id, "moderator")
                        }
                        aria-label={
                          roles.includes("moderator")
                            ? `Remove moderator role from ${profile.username}`
                            : `Give moderator role to ${profile.username}`
                        }
                        aria-pressed={roles.includes("moderator")}
                      >
                        <Shield className="h-4 w-4 mr-1" aria-hidden="true" />
                        {roles.includes("moderator") ? "Remove" : "Make"}{" "}
                        Moderator
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
