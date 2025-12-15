import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  BarChart3,
  Users,
  MousePointer,
  TrendingUp,
  Activity,
  Eye,
  ArrowRight,
} from "lucide-react";
import { MIXPANEL_EVENTS } from "@/lib/mixpanel";
import { FUNNEL_STEPS } from "@/lib/posthog";

export default function AdminAnalytics() {
  const mixpanelProjectUrl =
    "https://mixpanel.com/project/f5596f8dbfc32267e58b767dd1ede3ea";
  const posthogProjectUrl =
    "https://us.posthog.com/project/phc_Gaksl1OP0ZVYeErlumeRTuj5xJqPMQPe3H8UKxMpwAM";

  const trackedEvents = [
    {
      name: MIXPANEL_EVENTS.SIGN_UP,
      category: "Auth",
      description: "User completed signup",
      icon: Users,
    },
    {
      name: MIXPANEL_EVENTS.SIGN_IN,
      category: "Auth",
      description: "User logged in with email/password",
      icon: Users,
    },
    {
      name: MIXPANEL_EVENTS.SIGN_IN_GOOGLE,
      category: "Auth",
      description: "User logged in with Google",
      icon: Users,
    },
    {
      name: MIXPANEL_EVENTS.SIGN_OUT,
      category: "Auth",
      description: "User signed out",
      icon: Users,
    },
    {
      name: MIXPANEL_EVENTS.SERVICE_VIEWED,
      category: "Commerce",
      description: "User viewed service details",
      icon: Eye,
    },
    {
      name: MIXPANEL_EVENTS.CHECKOUT_STARTED,
      category: "Commerce",
      description: "User initiated checkout",
      icon: TrendingUp,
    },
    {
      name: MIXPANEL_EVENTS.CONTACT_FORM_SUBMITTED,
      category: "Engagement",
      description: "Contact form submitted",
      icon: MousePointer,
    },
    {
      name: MIXPANEL_EVENTS.NEWSLETTER_SUBSCRIBED,
      category: "Engagement",
      description: "Newsletter subscription",
      icon: Activity,
    },
    {
      name: MIXPANEL_EVENTS.PAGE_VIEW,
      category: "Navigation",
      description: "Page view tracked",
      icon: BarChart3,
    },
  ];

  const funnelSteps = [
    { step: 1, name: "Site Visit", event: FUNNEL_STEPS.SITE_VISIT },
    { step: 2, name: "Signup Complete", event: FUNNEL_STEPS.SIGNUP_COMPLETE },
    { step: 3, name: "Shop Viewed", event: FUNNEL_STEPS.SHOP_VIEWED },
    {
      step: 4,
      name: "Service Detail Viewed",
      event: FUNNEL_STEPS.SERVICE_DETAIL_VIEWED,
    },
    {
      step: 5,
      name: "Checkout Initiated",
      event: FUNNEL_STEPS.CHECKOUT_INITIATED,
    },
    {
      step: 6,
      name: "Purchase Complete",
      event: FUNNEL_STEPS.PURCHASE_COMPLETE,
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Auth: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      Commerce: "bg-green-500/10 text-green-500 border-green-500/20",
      Engagement: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      Navigation: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Analytics Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            View and manage Mixpanel analytics tracking
          </p>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-material gradient-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Mixpanel Dashboard
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                View full analytics in Mixpanel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" className="w-full">
                <a
                  href={mixpanelProjectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Open Mixpanel
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-material">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Session Recordings
              </CardTitle>
              <CardDescription>Watch user session replays</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <a
                  href={`${mixpanelProjectUrl}/recordings`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  View Recordings
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-material">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Funnels & Reports
              </CardTitle>
              <CardDescription>Analyze conversion funnels</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <a
                  href={`${mixpanelProjectUrl}/reports`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  View Reports
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* PostHog A/B Testing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-material border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-500" />
                PostHog Dashboard
              </CardTitle>
              <CardDescription>
                A/B testing, feature flags & session replays
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <a
                  href={posthogProjectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Open PostHog
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a
                  href={`${posthogProjectUrl}/experiments`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  A/B Experiments
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-material border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Feature Flags
              </CardTitle>
              <CardDescription>
                Manage feature rollouts and experiments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <a
                  href={`${posthogProjectUrl}/feature_flags`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Manage Feature Flags
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <div className="text-xs text-muted-foreground">
                Use{" "}
                <code className="bg-muted px-1 py-0.5 rounded">
                  isFeatureEnabled('flag_key')
                </code>{" "}
                in code
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Funnel */}
        <Card className="shadow-material mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Signup-to-Purchase Funnel
            </CardTitle>
            <CardDescription>
              Track user journey from first visit to completed purchase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-center gap-2 py-4">
              {funnelSteps.map((step, index) => (
                <div key={step.event} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {step.step}
                    </div>
                    <span className="text-xs text-center mt-2 max-w-20">
                      {step.name}
                    </span>
                  </div>
                  {index < funnelSteps.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-muted-foreground mx-2" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Events tracked:</strong> Each step fires both Mixpanel
                and PostHog events for cross-platform funnel analysis.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tracked Events Reference */}
        <Card className="shadow-material">
          <CardHeader>
            <CardTitle>Tracked Events Reference</CardTitle>
            <CardDescription>
              All custom events being tracked in the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trackedEvents.map((event) => (
                <div
                  key={event.name}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <event.icon className="h-5 w-5 text-primary" />
                    <Badge
                      variant="outline"
                      className={getCategoryColor(event.category)}
                    >
                      {event.category}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-sm mb-1">{event.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuration Info */}
        <Card className="shadow-material mt-6">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Analytics platform setup details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Mixpanel</h4>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Project Token
                  </label>
                  <p className="font-mono text-xs bg-muted px-3 py-2 rounded mt-1">
                    f5596f8dbfc32267e58b767dd1ede3ea
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 border-green-500/20"
                  >
                    Autocapture
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 border-green-500/20"
                  >
                    100% Recording
                  </Badge>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">PostHog</h4>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Project Key
                  </label>
                  <p className="font-mono text-xs bg-muted px-3 py-2 rounded mt-1">
                    phc_Gaksl1OP0ZVYeErlumeRTuj5xJqPMQPe3H8UKxMpwAM
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 border-green-500/20"
                  >
                    Feature Flags
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 border-green-500/20"
                  >
                    A/B Testing
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
