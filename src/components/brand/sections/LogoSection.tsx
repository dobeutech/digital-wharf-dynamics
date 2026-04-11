import { Card } from "../../ui/card";
import { Logo } from "../../layout/Logo";

export const LogoSection = () => (
  <section className="space-y-8">
    <h2 className="text-3xl font-bold border-l-4 border-dobeu-indigo pl-4">
      Logotype & Mark
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="p-12 bg-dobeu-dark border-dobeu-gray flex items-center justify-center">
        <Logo />
      </Card>
      <Card className="p-12 bg-white border-gray-200 flex items-center justify-center">
        <Logo />
      </Card>
      <Card className="p-12 bg-dobeu-cream border-dobeu-amber/30 flex items-center justify-center">
        <Logo />
      </Card>
    </div>
    <Card className="p-6">
      <h3 className="font-semibold mb-3">Logo Construction</h3>
      <p className="text-sm text-muted-foreground mb-4">
        The Dobeu overlap mark consists of three elements: an indigo circle, a
        deep indigo circle, and an amber ellipse at the intersection. This
        represents the convergence of ideas, technology, and creativity.
      </p>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-dobeu-indigo" />
          <span className="text-sm">Indigo #6B5CE7</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-dobeu-deep" />
          <span className="text-sm">Deep Indigo #4A3FA8</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-dobeu-amber" />
          <span className="text-sm">Warm Amber #F4A261</span>
        </div>
      </div>
    </Card>
  </section>
);
