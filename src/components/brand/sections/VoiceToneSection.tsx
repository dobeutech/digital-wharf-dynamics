import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Lightbulb, Users, Zap, Shield } from "lucide-react";

const voiceAttributes = [
  {
    icon: Lightbulb,
    title: "Builder-First",
    description:
      "We speak to creators, developers, and makers. Our tone respects their expertise while remaining welcoming to newcomers.",
    example:
      "Instead of: 'Leverage our enterprise solutions.' Say: 'Ship faster with production-ready templates.'",
  },
  {
    icon: Users,
    title: "Clear and Confident",
    description:
      "Direct communication that demonstrates value without unnecessary jargon.",
    example:
      "Instead of: 'Comprehensive digital transformation.' Say: 'Tools that save you hours every week.'",
  },
  {
    icon: Zap,
    title: "Action-Oriented",
    description: "Focus on outcomes and results with strong, active language.",
    example:
      "Instead of: 'Browse our offerings.' Say: 'Find your next starter kit.'",
  },
  {
    icon: Shield,
    title: "Trustworthy and Transparent",
    description: "Honest communication about what each product delivers.",
    example:
      "Instead of: 'Best in class solutions.' Say: 'Here's exactly what's included and how it works.'",
  },
];

export function VoiceToneSection() {
  return (
    <section id="voice-tone" className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Voice & Tone</h2>
        <p className="text-muted-foreground">
          Our brand voice reflects who we serve: builders who value quality tools
          and clear communication.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {voiceAttributes.map((attribute) => (
          <Card key={attribute.title}>
            <CardHeader>
              <attribute.icon className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{attribute.title}</CardTitle>
              <CardDescription>{attribute.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm italic">{attribute.example}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Writing Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Use active voice and strong verbs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Keep sentences concise and scannable</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Lead with benefits, not features</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Speak to builders — respect their technical literacy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Avoid buzzwords and corporate speak</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Be specific about what each product includes</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
