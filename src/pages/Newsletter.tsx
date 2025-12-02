import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar, Lock } from "lucide-react";
import DOMPurify from "dompurify";

interface NewsPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  slug: string;
  published_at: string | null;
  is_published: boolean;
  is_public: boolean;
}

export default function Newsletter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("newsletter_posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load newsletter posts",
        variant: "destructive",
      });
      return;
    }

    setPosts(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
        <p className="text-muted-foreground">Loading newsletter...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">The Digital Wharf</h1>
          <p className="text-xl text-muted-foreground">
            Exclusive updates and insights for our members
          </p>
        </div>

        <Card className="shadow-material mb-8 gradient-hero">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Members Only Content
            </CardTitle>
            <CardDescription className="text-foreground/80">
              Access exclusive articles, behind-the-scenes updates, and member-only announcements
            </CardDescription>
          </CardHeader>
        </Card>

        {posts.length === 0 ? (
          <Card className="shadow-material">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No newsletter posts available yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back soon for exclusive member content
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="shadow-material hover:shadow-material-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {!post.is_public && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Members Only
                      </Badge>
                    )}
                    {post.is_public && <Badge variant="outline">Public</Badge>}
                    {post.published_at && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(post.published_at), "MMM d, yyyy")}
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{post.title}</CardTitle>
                  {post.excerpt && <CardDescription className="text-base">{post.excerpt}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
