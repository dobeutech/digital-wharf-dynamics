import { CustomCursor } from "@/components/layout/CustomCursor";
import { Hero } from "@/components/home/Hero";
import { Mission } from "@/components/home/Mission";
import { Services } from "@/components/home/Services";
import { Work } from "@/components/home/Work";
import { Pricing } from "@/components/home/Pricing";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <Hero />
      <Mission />
      <Services />
      <Work />
      <Pricing />
    </>
  );
}
