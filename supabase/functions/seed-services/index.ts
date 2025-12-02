import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting to seed services...');

    const services = [
      {
        name: 'Website Design & Development',
        description: 'Professional website design and development with modern, responsive layouts that drive conversions and enhance user experience.',
        category: 'website',
        base_price: 3000,
        features: [
          'Responsive design (mobile, tablet, desktop)',
          'Up to 10 pages',
          'SEO-optimized structure',
          'Contact forms integration',
          'Social media integration',
          '1 month post-launch support',
          'Google Analytics setup',
          'Fast loading times'
        ],
        add_ons: [
          {
            name: 'SEO Optimization Package',
            price: 500,
            description: 'Comprehensive SEO audit and optimization'
          },
          {
            name: 'Google Business & AdWords Setup',
            price: 300,
            description: 'Complete Google Business profile and AdWords campaign setup'
          },
          {
            name: 'E-commerce Integration',
            price: 1500,
            description: 'Full shopping cart and payment gateway integration'
          },
          {
            name: 'Content Management System',
            price: 800,
            description: 'Easy-to-use CMS for content updates'
          }
        ],
        is_active: true
      },
      {
        name: 'Custom Software Development',
        description: 'Tailored software solutions built from the ground up to meet your specific business needs and workflows.',
        category: 'software',
        base_price: 8000,
        features: [
          'Custom application development',
          'Database design and implementation',
          'API development and integration',
          'User authentication and authorization',
          'Admin dashboard',
          'Documentation',
          '3 months maintenance',
          'Deployment and hosting setup'
        ],
        add_ons: [
          {
            name: 'Mobile App Development',
            price: 5000,
            description: 'Native or cross-platform mobile application'
          },
          {
            name: 'Advanced Analytics Dashboard',
            price: 2000,
            description: 'Custom reporting and data visualization'
          },
          {
            name: 'Third-party API Integrations',
            price: 1000,
            description: 'Integration with external services and APIs'
          },
          {
            name: 'Automated Testing Suite',
            price: 1500,
            description: 'Comprehensive automated testing implementation'
          }
        ],
        is_active: true
      },
      {
        name: 'Technology Training & Workshops',
        description: 'Hands-on training sessions and workshops to upskill your team on modern technologies and best practices.',
        category: 'learning',
        base_price: 1500,
        features: [
          'Customized curriculum',
          'Up to 20 participants',
          '4-hour workshop session',
          'Hands-on exercises',
          'Training materials included',
          'Certificate of completion',
          'Post-training Q&A support (2 weeks)',
          'Recording of session'
        ],
        add_ons: [
          {
            name: 'Additional Workshop Day',
            price: 1200,
            description: 'Extended training with additional topics'
          },
          {
            name: 'One-on-One Coaching',
            price: 200,
            description: 'Per hour individual coaching sessions'
          },
          {
            name: 'Custom Learning Materials',
            price: 500,
            description: 'Branded training guides and resources'
          },
          {
            name: 'Follow-up Session',
            price: 800,
            description: '2-hour follow-up session after 30 days'
          }
        ],
        is_active: true
      },
      {
        name: 'Technology Consulting',
        description: 'Expert guidance on technology strategy, architecture decisions, and digital transformation initiatives.',
        category: 'consulting',
        base_price: 2500,
        features: [
          'Technology assessment and audit',
          'Strategic roadmap development',
          'Architecture review and recommendations',
          'Vendor evaluation and selection',
          'Risk assessment',
          'Implementation planning',
          '2 follow-up consultation sessions',
          'Detailed report with actionable insights'
        ],
        add_ons: [
          {
            name: 'Ongoing Monthly Retainer',
            price: 2000,
            description: 'Monthly consulting services (10 hours)'
          },
          {
            name: 'Emergency Support',
            price: 300,
            description: 'Per hour urgent consultation'
          },
          {
            name: 'Team Workshops',
            price: 1000,
            description: 'Present findings and recommendations to your team'
          },
          {
            name: 'Implementation Oversight',
            price: 3000,
            description: 'Project management during implementation phase'
          }
        ],
        is_active: true
      },
      {
        name: 'Strategic Planning & Optimization',
        description: 'Comprehensive analysis and optimization of your digital operations to maximize efficiency and ROI.',
        category: 'optimization',
        base_price: 4000,
        features: [
          'Business process analysis',
          'Digital transformation strategy',
          'Performance optimization recommendations',
          'Cost-benefit analysis',
          'Technology stack evaluation',
          'Scalability planning',
          'Competitive analysis',
          '90-day action plan'
        ],
        add_ons: [
          {
            name: 'Implementation Support',
            price: 2500,
            description: '6-week implementation assistance'
          },
          {
            name: 'Monthly Performance Review',
            price: 800,
            description: 'Ongoing optimization and reporting'
          },
          {
            name: 'Team Training on New Processes',
            price: 1500,
            description: 'Training team on optimized workflows'
          },
          {
            name: 'Automation Setup',
            price: 2000,
            description: 'Implement automation tools and workflows'
          }
        ],
        is_active: true
      }
    ];

    const { data, error } = await supabase
      .from('services')
      .insert(services)
      .select();

    if (error) {
      console.error('Error inserting services:', error);
      throw error;
    }

    console.log(`Successfully seeded ${data.length} services`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Seeded ${data.length} services`,
        services: data 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in seed-services function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
