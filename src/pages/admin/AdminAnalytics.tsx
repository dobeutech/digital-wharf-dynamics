import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BarChart3, Users, MousePointer, TrendingUp, Activity, Eye } from "lucide-react";
import { MIXPANEL_EVENTS } from "@/lib/mixpanel";

export default function AdminAnalytics() {
  const mixpanelProjectUrl = "https://mixpanel.com/project/f5596f8dbfc32267e58b767dd1ede3ea";

  const trackedEvents = [
    { name: MIXPANEL_EVENTS.SIGN_UP, category: "Auth", description: "User completed signup", icon: Users },
    { name: MIXPANEL_EVENTS.SIGN_IN, category: "Auth", description: "User logged in with email/password", icon: Users },
    { name: MIXPANEL_EVENTS.SIGN_IN_GOOGLE, category: "Auth", description: "User logged in with Google", icon: Users },
    { name: MIXPANEL_EVENTS.SIGN_OUT, category: "Auth", description: "User signed out", icon: Users },
    { name: MIXPANEL_EVENTS.SERVICE_VIEWED, category: "Commerce", description: "User viewed service details", icon: Eye },
    { name: MIXPANEL_EVENTS.CHECKOUT_STARTED, category: "Commerce", description: "User initiated checkout", icon: TrendingUp },
    { name: MIXPANEL_EVENTS.CONTACT_FORM_SUBMITTED, category: "Engagement", description: "Contact form submitted", icon: MousePointer },
    { name: MIXPANEL_EVENTS.NEWSLETTER_SUBSCRIBED, category: "Engagement", description: "Newsletter subscription", icon: Activity },
    { name: MIXPANEL_EVENTS.PAGE_VIEW, category: "Navigation", description: "Page view tracked", icon: BarChart3 },
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
              <Button 
                asChild 
                variant="secondary" 
                className="w-full"
              >
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
              <CardDescription>
                Watch user session replays
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                asChild 
                variant="outline" 
                className="w-full"
              >
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
              <CardDescription>
                Analyze conversion funnels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                asChild 
                variant="outline" 
                className="w-full"
              >
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
                    <Badge variant="outline" className={getCategoryColor(event.category)}>
                      {event.category}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-sm mb-1">{event.name}</h3>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuration Info */}
        <Card className="shadow-material mt-6">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Current Mixpanel setup details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Project Token</label>
                  <p className="font-mono text-sm bg-muted px-3 py-2 rounded mt-1">
                    f5596f8dbfc32267e58b767dd1ede3ea
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Autocapture</label>
                  <p className="text-sm mt-1">
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      Enabled
                    </Badge>
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Session Recording</label>
                  <p className="text-sm mt-1">
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      100% of sessions
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Page View Tracking</label>
                  <p className="text-sm mt-1">
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      All routes tracked
                    </Badge>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
