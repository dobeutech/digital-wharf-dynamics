import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogoSection } from "./sections/LogoSection";
import { ColorSection } from "./sections/ColorSection";
import { TypographySection } from "./sections/TypographySection";
import { VoiceToneSection } from "./sections/VoiceToneSection";
import { UsageSection } from "./sections/UsageSection";
import { SocialTemplatesSection } from "./sections/SocialTemplatesSection";
import { SocialHeadersSection } from "./sections/SocialHeadersSection";

export function BrandKit() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Brand Kit</h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to maintain consistency across all DBE brand
            touchpoints.
          </p>
        </div>

        <Tabs defaultValue="logo" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="logo">Logo</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="voice">Voice & Tone</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>

          <TabsContent value="logo" className="space-y-8">
            <LogoSection />
          </TabsContent>

          <TabsContent value="colors" className="space-y-8">
            <ColorSection />
          </TabsContent>

          <TabsContent value="typography" className="space-y-8">
            <TypographySection />
          </TabsContent>

          <TabsContent value="voice" className="space-y-8">
            <VoiceToneSection />
          </TabsContent>

          <TabsContent value="usage" className="space-y-8">
            <UsageSection />
          </TabsContent>

          <TabsContent value="social" className="space-y-8">
            <SocialTemplatesSection />
          </TabsContent>

          <TabsContent value="headers" className="space-y-8">
            <SocialHeadersSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
