import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/lib/api";
import { Loader2, Plus, FileText } from "lucide-react";

interface NewsletterPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  is_published: boolean;
  is_public: boolean;
  published_at: string | null;
  created_at: string;
}

export default function AdminNewsletter() {
  const api = useApi();
  const [posts, setPosts] = useState<NewsletterPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await api.get<NewsletterPost[]>("/newsletter");
      setPosts(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching newsletter posts:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">Newsletter Management</h1>
            <p className="text-xl text-muted-foreground">
              Create and manage newsletter posts
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/newsletter/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="shadow-material">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                    {post.excerpt && (
                      <p className="text-muted-foreground text-sm">{post.excerpt}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {post.is_published ? (
                      <Badge variant="default">Published</Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                    {post.is_public && <Badge variant="secondary">Public</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {post.published_at ? (
                      <span>Published: {new Date(post.published_at).toLocaleDateString()}</span>
                    ) : (
                      <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>
                    )}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/newsletter/edit/${post.id}`}>
                      <FileText className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {posts.length === 0 && (
          <Card className="shadow-material">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No newsletter posts yet</p>
              <Button asChild>
                <Link to="/admin/newsletter/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Post
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
