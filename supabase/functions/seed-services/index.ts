import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get authorization header for user authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Create client with user's JWT to check their role
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabaseAuth
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (roleError || !roleData) {
      console.error("Role check failed:", roleError);
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(`Admin user ${user.id} authorized for seed-services`);

    // Use service role key for inserting data
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Starting to seed services...");

    const services = [
      {
        name: "Website Design & Development",
        description:
          "Professional website design and development tailored to your business needs. Contact us for a custom project quote based on your specific requirements.",
        category: "Website",
        base_price: 0,
        features: [
          "Custom responsive design",
          "Mobile optimization",
          "Content management system",
          "Basic SEO setup",
          "Contact form integration",
          "Social media integration",
          "Google Analytics setup",
        ],
        add_ons: [
          {
            name: "Advanced SEO Package",
            price: 500,
            description: "Comprehensive SEO optimization",
          },
          {
            name: "Google Business Profile Setup",
            price: 300,
            description: "Complete Google Business profile setup",
          },
          {
            name: "E-commerce Integration",
            price: 1500,
            description: "Full shopping cart and payment gateway",
          },
        ],
        is_active: true,
      },
      {
        name: "Custom Software Development",
        description:
          "Build scalable software solutions for your business. Reach out to discuss your project scope and receive a tailored quote.",
        category: "Software",
        base_price: 0,
        features: [
          "Custom application development",
          "Database design",
          "API integration",
          "User authentication",
          "Deployment support",
          "Documentation",
          "Maintenance period included",
        ],
        add_ons: [
          {
            name: "Mobile App Development",
            price: 3000,
            description: "Native or cross-platform mobile app",
          },
          {
            name: "Advanced Analytics Dashboard",
            price: 2000,
            description: "Custom reporting and visualizations",
          },
          {
            name: "Third-party API Integration",
            price: 1000,
            description: "Integration with external services",
          },
        ],
        is_active: true,
      },
      {
        name: "Technical Consulting",
        description:
          "Expert technical consulting at $250 per hour. Schedule a consultation to discuss your technology strategy, architecture, or implementation needs.",
        category: "Consulting",
        base_price: 250,
        features: [
          "$250 per hour consulting",
          "Technology strategy & planning",
          "Architecture review",
          "Code review & optimization",
          "Team training & mentorship",
          "Project planning",
          "Flexible scheduling",
        ],
        add_ons: [
          {
            name: "Follow-up Session (1hr)",
            price: 250,
            description: "Additional hour of consulting",
          },
          {
            name: "Documentation Package",
            price: 500,
            description: "Comprehensive documentation of recommendations",
          },
          {
            name: "Implementation Support (5hrs)",
            price: 1250,
            description: "Hands-on implementation assistance",
          },
        ],
        is_active: true,
      },
      {
        name: "Learning & Training",
        description:
          "Personalized technical training sessions designed for your team. Contact us to create a custom learning plan that fits your needs.",
        category: "Learning",
        base_price: 0,
        features: [
          "One-on-one instruction",
          "Hands-on projects",
          "Custom curriculum",
          "Progress tracking",
          "Ongoing support",
          "Training materials included",
        ],
        add_ons: [
          {
            name: "Group Training Session",
            price: 400,
            description: "Training for up to 10 participants",
          },
          {
            name: "Recorded Session Access",
            price: 100,
            description: "Recording of training sessions",
          },
          {
            name: "Practice Project Review",
            price: 200,
            description: "Detailed review of practice work",
          },
        ],
        is_active: true,
      },
      {
        name: "Strategic Planning & Optimization",
        description:
          "Comprehensive business and technology strategy services. Schedule a consultation to discuss how we can optimize your operations.",
        category: "Strategic Planning",
        base_price: 0,
        features: [
          "Business analysis",
          "Technology roadmap",
          "Process optimization",
          "Competitive analysis",
          "Implementation guidance",
          "ROI analysis",
        ],
        add_ons: [
          {
            name: "Detailed Implementation Plan",
            price: 800,
            description: "Step-by-step implementation roadmap",
          },
          {
            name: "Quarterly Strategy Review",
            price: 1000,
            description: "Ongoing strategic guidance",
          },
          {
            name: "Executive Presentation",
            price: 500,
            description: "Professional presentation of findings",
          },
        ],
        is_active: true,
      },
      {
        name: "Monthly Retainer",
        description:
          "Ongoing development and support with priority access to our team. Perfect for businesses needing consistent technical support and development.",
        category: "Retainer",
        base_price: 4000,
        features: [
          "20 hours of development per month",
          "Priority support & response",
          "Regular progress updates",
          "Flexible task management",
          "Rollover of unused hours",
          "Direct team access",
          "Monthly strategy calls",
        ],
        add_ons: [
          {
            name: "Additional 5 Hours",
            price: 1000,
            description: "Extra development hours as needed",
          },
          {
            name: "Emergency Support Access",
            price: 500,
            description: "After-hours support availability",
          },
          {
            name: "Dedicated Project Manager",
            price: 1500,
            description: "Dedicated PM for your projects",
          },
        ],
        is_active: true,
      },
    ];

    const { data, error } = await supabase
      .from("services")
      .insert(services)
      .select();

    if (error) {
      console.error("Error inserting services:", error);
      throw error;
    }

    console.log(`Successfully seeded ${data.length} services`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Seeded ${data.length} services`,
        services: data,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in seed-services function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
