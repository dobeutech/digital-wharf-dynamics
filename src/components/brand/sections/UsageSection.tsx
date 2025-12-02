import { UsageExample } from "@/components/brand/kit/UsageExample";

export function UsageSection() {
  return (
    <section id="usage" className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Usage Guidelines</h2>
        <p className="text-muted-foreground">
          Follow these guidelines to maintain brand consistency across all applications.
        </p>
      </div>

      <div className="space-y-6">
        <UsageExample
          title="Logo Usage"
          dos={[
            "Use the full logo with adequate clear space",
            "Maintain the original proportions",
            "Use approved color variations",
            "Ensure minimum size requirements are met",
          ]}
          donts={[
            "Stretch, distort, or rotate the logo",
            "Change the logo colors",
            "Add effects like shadows or outlines",
            "Place on busy backgrounds",
          ]}
        />

        <UsageExample
          title="Color Application"
          dos={[
            "Use the primary color for main CTAs",
            "Maintain WCAG AA contrast ratios",
            "Use color variables from the design system",
            "Test colors in both light and dark modes",
          ]}
          donts={[
            "Use colors not in the brand palette",
            "Override system colors with hardcoded values",
            "Ignore accessibility guidelines",
            "Mix color schemes inconsistently",
          ]}
        />

        <UsageExample
          title="Typography"
          dos={[
            "Use the established type scale",
            "Maintain proper line heights",
            "Follow the font hierarchy",
            "Ensure text is readable on all backgrounds",
          ]}
          donts={[
            "Use random font sizes",
            "Set line heights below 1.4",
            "Mix too many font weights",
            "Use decorative fonts for body text",
          ]}
        />
      </div>
    </section>
  );
}
