import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar, CheckCircle2, Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  order_index: number;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  progress_percentage: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  tasks: Task[];
}

export default function Projects() {
  const { user } = useAuth();
  const api = useApi();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    if (!user) return;

    try {
      const projectsData = await api.get<Project[]>("/projects");

      // Fetch tasks for each project
      const projectsWithTasks = await Promise.all(
        (projectsData || []).map(async (project) => {
          try {
            const tasks = await api.get<Task[]>(`/project-tasks?project_id=${project.id}`);
            return { ...project, tasks: tasks || [] };
          } catch {
            return { ...project, tasks: [] };
          }
        })
      );

      setProjects(projectsWithTasks);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [user, api, toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const toggleTask = async (projectId: string, taskId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/project-tasks?id=${taskId}`, {
        is_completed: !currentStatus,
        completed_at: !currentStatus ? new Date().toISOString() : null,
      });
      fetchProjects();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in_progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "on_hold":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Your Projects</h1>
          <p className="text-xl text-muted-foreground">Track progress and manage tasks</p>
        </div>

        {projects.length === 0 ? (
          <Card className="shadow-material">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No projects yet</p>
              <p className="text-sm text-muted-foreground">
                Purchase a service to get started with your first project
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <Card key={project.id} className="shadow-material">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                      {project.description && (
                        <CardDescription className="text-base">{project.description}</CardDescription>
                      )}
                    </div>
                    <Badge variant="outline" className={getStatusColor(project.status)}>
                      {project.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{project.progress_percentage}%</span>
                    </div>
                    <Progress value={project.progress_percentage} className="h-3" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {project.start_date && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Started: {format(new Date(project.start_date), "MMM d, yyyy")}</span>
                      </div>
                    )}
                    {project.end_date && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {format(new Date(project.end_date), "MMM d, yyyy")}</span>
                      </div>
                    )}
                  </div>

                  {project.tasks.length > 0 && (
                    <div className="space-y-3 pt-4 border-t">
                      <h4 className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Task Checklist
                      </h4>
                      <div className="space-y-2">
                        {project.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                          >
                            <Checkbox
                              checked={task.is_completed}
                              onCheckedChange={() => toggleTask(project.id, task.id, task.is_completed)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p
                                className={`font-medium ${
                                  task.is_completed ? "line-through text-muted-foreground" : ""
                                }`}
                              >
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
