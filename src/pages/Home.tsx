import { EnhancedHero } from "@/components/home/EnhancedHero";
import { Mission } from "@/components/home/Mission";
import { Services } from "@/components/home/Services";
import { Work } from "@/components/home/Work";
import { Pricing } from "@/components/home/Pricing";
import { PageMeta } from "@/components/seo/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Home"
        description="Templates and tools for builders. Browse curated digital products, starter kits, and developer tools at dobeu.store."
        keywords="templates, tools, builders, developer tools, starter kits, digital products, software marketplace"
      />
      <EnhancedHero />
      <Mission />
      <Services />
      <Work />
      <Pricing />
    </>
  );
}
