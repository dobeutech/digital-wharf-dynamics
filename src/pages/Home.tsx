import { CustomCursor } from "@/components/layout/CustomCursor";
import { EnhancedHero } from "@/components/home/EnhancedHero";
import { Mission } from "@/components/home/Mission";
import { Services } from "@/components/home/Services";
import { Work } from "@/components/home/Work";
import { Pricing } from "@/components/home/Pricing";
import { PageMeta } from "@/components/seo/PageMeta";
import { TypeformFloatingButton } from "@/components/TypeformFloatingButton";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Home"
        description="Transform your business with custom web solutions. DOBEU builds fast, modern websites and software that help you grow and serve customers better."
        keywords="web development, custom websites, software development, business growth, modern web solutions, responsive design"
      />
      <CustomCursor />
      <EnhancedHero />
      <Mission />
      <Services />
      <Work />
      <Pricing />
      <TypeformFloatingButton
        position="bottom-right"
        source="home-page"
        title="Let's Talk"
        description="Have a project in mind? Let's discuss how we can help bring your vision to life."
      />
    </>
  );
}
