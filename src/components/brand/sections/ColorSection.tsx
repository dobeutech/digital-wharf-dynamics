import { ColorSwatch } from "../kit/ColorSwatch";

export const ColorSection = () => (
  <section className="space-y-8">
    <h2 className="text-3xl font-bold border-l-4 border-dobeu-indigo pl-4">
      Color Palette
    </h2>
    <div>
      <h3 className="font-semibold mb-4">Primary Colors</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <ColorSwatch color="bg-dobeu-indigo" name="Primary Indigo" hex="#6B5CE7" />
        <ColorSwatch color="bg-dobeu-deep" name="Deep Indigo" hex="#4A3FA8" />
        <ColorSwatch color="bg-dobeu-amber" name="Warm Amber" hex="#F4A261" />
        <ColorSwatch color="bg-dobeu-cream" name="Soft Cream" hex="#FFF8F0" />
      </div>
    </div>
    <div>
      <h3 className="font-semibold mb-4">Dark Mode</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <ColorSwatch color="bg-dobeu-dark" name="Dark Surface" hex="#1A1A2E" />
        <ColorSwatch color="bg-[#242440]" name="Dark Elevated" hex="#242440" />
        <ColorSwatch color="bg-dobeu-gray" name="Dark Gray" hex="#2D2D3A" />
        <ColorSwatch color="bg-white" name="White" hex="#FFFFFF" />
      </div>
    </div>
    <div>
      <h3 className="font-semibold mb-4">Tints</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <ColorSwatch color="bg-dobeu-tint-indigo" name="Indigo Tint" hex="#E8E5FA" />
        <ColorSwatch color="bg-dobeu-tint-amber" name="Amber Tint" hex="#FEF0E0" />
      </div>
    </div>
  </section>
);
