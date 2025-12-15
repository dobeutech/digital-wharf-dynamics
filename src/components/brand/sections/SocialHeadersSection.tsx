import React from "react";
import { SocialHeaderPreview } from "../kit/SocialHeaderPreview";

export const SocialHeadersSection = () => (
  <section className="space-y-8">
    <h2 className="text-3xl font-bold border-l-4 border-green-500 pl-4">
      Social Media Headers
    </h2>
    <div className="grid grid-cols-1 gap-12">
      <SocialHeaderPreview
        platform="Twitter"
        width="3/1"
        height="h-48"
        color="bg-gradient-to-r from-blue-900 to-black"
      />
      <SocialHeaderPreview
        platform="LinkedIn"
        width="4/1"
        height="h-40"
        color="bg-gradient-to-r from-black to-neutral-800"
      />
      <SocialHeaderPreview
        platform="Facebook"
        width="16/9"
        height="h-64"
        color="bg-gradient-to-br from-yellow-400 to-orange-500"
      />
    </div>
  </section>
);
