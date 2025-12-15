import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Save } from "lucide-react";

const newsletterSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase with hyphens only (e.g., my-post-title)",
    ),
  excerpt: z.string().max(500, "Excerpt is too long").optional(),
  content: z.string().min(1, "Content is required"),
  is_published: z.boolean().default(false),
  is_public: z.boolean().default(false),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export default function AdminNewsletterEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = useApi();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isEditMode = !!id;

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      is_published: false,
      is_public: false,
    },
  });

  const fetchPost = useCallback(async () => {
    try {
      const data = await api.get<NewsletterFormValues>(`/newsletter?id=${id}`);
      if (data) {
        form.reset(data);
      }
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load newsletter post",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [api, id, form, toast]);

  useEffect(() => {
    if (isEditMode) {
      fetchPost();
    } else {
      setLoading(false);
    }
  }, [isEditMode, fetchPost]);

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    form.setValue("title", value);
    if (!isEditMode || !form.getValues("slug")) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 100);
      form.setValue("slug", slug);
    }
  };

  const onSubmit = async (data: NewsletterFormValues) => {
    setSaving(true);
    try {
      if (isEditMode) {
        await api.patch(`/newsletter?id=${id}`, data);
        toast({
          title: "Success",
          description: "Newsletter post updated",
        });
      } else {
        await api.post("/newsletter", data);
        toast({
          title: "Success",
          description: "Newsletter post created",
        });
      }
      navigate("/admin/newsletter");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? "update" : "create"} post`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/admin/newsletter">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Newsletter
            </Link>
          </Button>
          <h1 className="text-4xl font-bold">
            {isEditMode ? "Edit Newsletter Post" : "Create Newsletter Post"}
          </h1>
        </div>

        <Card className="shadow-material">
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
            <CardDescription>
              {isEditMode
                ? "Update your newsletter post content"
                : "Fill in the details for your new newsletter post"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="Enter post title"
                          maxLength={200}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="my-post-title"
                          maxLength={100}
                        />
                      </FormControl>
                      <FormDescription>
                        Used in the URL: /newsletter/{field.value || "..."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Brief description of the post"
                          rows={2}
                          maxLength={500}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/500 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Write your newsletter content here..."
                          rows={15}
                          className="font-mono text-sm"
                        />
                      </FormControl>
                      <FormDescription>
                        Supports Markdown formatting
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-6">
                  <FormField
                    control={form.control}
                    name="is_published"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer">
                            Published
                          </FormLabel>
                          <FormDescription>
                            Make this post visible to users
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_public"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer">
                            Public
                          </FormLabel>
                          <FormDescription>
                            Visible without login
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {isEditMode ? "Update Post" : "Create Post"}
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link to="/admin/newsletter">Cancel</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
