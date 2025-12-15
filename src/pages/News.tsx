import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { PageMeta } from "@/components/seo/PageMeta";

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

export default function News() {
  const api = useApi();
  const { toast } = useToast();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await api.get<NewsPost[]>("/news");
      setPosts(data || []);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load news posts",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [api, toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
        <p className="text-muted-foreground">Loading news...</p>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Latest News & Updates"
        description="Stay updated with the latest news, announcements, and insights from DOBEU. Read about our projects, technology trends, and industry updates."
        keywords="tech news, web development updates, software development blog, DOBEU news, technology insights"
        canonical="https://dobeu.net/news"
      />
      <div className="min-h-screen pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Latest News</h1>
            <p className="text-xl text-muted-foreground">
              Stay updated with our latest announcements and insights
            </p>
          </div>

          {posts.length === 0 ? (
            <Card className="shadow-material">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  No news posts available yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="shadow-material hover:shadow-material-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Public</Badge>
                      {post.published_at && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(post.published_at), "MMM d, yyyy")}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{post.title}</CardTitle>
                    {post.excerpt && (
                      <CardDescription className="text-base">
                        {post.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      {post.content.substring(0, 300)}
                      {post.content.length > 300 && "..."}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
