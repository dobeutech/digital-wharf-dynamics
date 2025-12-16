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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Save } from "lucide-react";

const serviceSchema = z.object({
  name: z
    .string()
    .min(1, "Service name is required")
    .max(100, "Name is too long"),
  category: z.string().min(1, "Category is required"),
  description: z.string().max(1000, "Description is too long").optional(),
  base_price: z.coerce
    .number()
    .min(0, "Price must be positive")
    .max(1000000, "Price is too high"),
  is_active: z.boolean().default(true),
  features: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const categories = [
  { value: "web", label: "Web Development" },
  { value: "software", label: "Software Development" },
  { value: "consulting", label: "Consulting" },
  { value: "training", label: "Training & Learning" },
  { value: "strategic", label: "Strategic Planning" },
  { value: "other", label: "Other" },
];

export default function AdminServiceEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = useApi();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isEditMode = !!id;

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      base_price: 0,
      is_active: true,
      features: "",
    },
  });

  const fetchService = useCallback(async () => {
    try {
      const data = await api.get<ServiceFormValues>(`/services?id=${id}`);
      if (data) {
        form.reset(data);
      }
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load service",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [api, id, form, toast]);

  useEffect(() => {
    if (isEditMode) {
      fetchService();
    } else {
      setLoading(false);
    }
  }, [isEditMode, fetchService]);

  const onSubmit = async (data: ServiceFormValues) => {
    setSaving(true);
    try {
      if (isEditMode) {
        await api.patch(`/services?id=${id}`, data);
        toast({
          title: "Success",
          description: "Service updated",
        });
      } else {
        await api.post("/services", data);
        toast({
          title: "Success",
          description: "Service created",
        });
      }
      navigate("/admin/services");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? "update" : "create"} service`,
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
            <Link to="/admin/services">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Link>
          </Button>
          <h1 className="text-4xl font-bold">
            {isEditMode ? "Edit Service" : "Create New Service"}
          </h1>
        </div>

        <Card className="shadow-material">
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>
              {isEditMode
                ? "Update your service offering"
                : "Define a new service for your catalog"}
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Custom Web Application"
                          maxLength={100}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe what this service includes..."
                          rows={4}
                          maxLength={1000}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/1000 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="base_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price ($) *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          step={1}
                          placeholder="0"
                        />
                      </FormControl>
                      <FormDescription>
                        Starting price for this service
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Features</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="One feature per line:
Custom design
Responsive layout
SEO optimization"
                          rows={6}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter each feature on a new line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer">Active</FormLabel>
                        <FormDescription>
                          Show this service to customers
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

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
                        {isEditMode ? "Update Service" : "Create Service"}
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link to="/admin/services">Cancel</Link>
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
