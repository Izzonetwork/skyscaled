import type { Metadata } from "next";
import "./globals.css";
import { CHANNEL_INFO } from "@/data/skyscaledData";
import Starfield from "@/components/Starfield";

export const metadata: Metadata = {
  metadataBase: new URL("https://skyscaled.com"),
  title: {
    default: "SKYSCALED — The Universe, Scaled to Human Understanding | @skyscaled",
    template: "%s | SKYSCALED (@skyscaled)",
  },
  description:
    "Official hub for Skyscaled (@skyscaled on YouTube): 3-minute sourced explainers, an interactive astronomical calendar for telescopes, and cosmic-scale models grounded in NASA, ESA, and JPL data.",
  keywords: [
    "Skyscaled",
    "@skyscaled",
    "space explainers",
    "cosmic scale",
    "universe scale model",
    "Voyager 1 one light-day November 18 2026",
    "Starship Flight 14 orbital explainer",
    "Andromeda galaxy star hop guide",
    "Boomerang Nebula 1 Kelvin",
    "global sky events UTC",
    "astronomical calendar for telescopes",
    "astrophysics shorts",
  ],
  authors: [{ name: "Hristo Stefanov", url: "https://skyscaled.com" }],
  creator: "Skyscaled (@skyscaled)",
  publisher: "Skyscaled",
  alternates: {
    canonical: "https://skyscaled.com",
  },
  openGraph: {
    type: "website",
    url: "https://skyscaled.com",
    siteName: "SKYSCALED",
    title: "SKYSCALED — The Universe, Scaled to Human Understanding",
    description:
      "3-minute sourced explainers and daily Shorts on space, astrophysics, orbital engineering, and global sky events. Watch on YouTube @skyscaled.",
    images: [
      {
        url: "/images/og-skyscaled.jpg",
        width: 1200,
        height: 630,
        alt: "SKYSCALED — The Universe, Scaled to Human Understanding (@skyscaled)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SKYSCALED — The Universe, Scaled to Human Understanding",
    description:
      "Shrink Earth to a 1 mm grain of sand and explore the cosmos to scale in 3 minutes. Watch on YouTube @skyscaled.",
    images: ["/images/og-skyscaled.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://skyscaled.com/#organization",
      name: "Skyscaled",
      alternateName: "@skyscaled",
      url: "https://skyscaled.com",
      logo: {
        "@type": "ImageObject",
        url: "https://skyscaled.com/images/profile-800.jpg",
        width: 800,
        height: 800,
      },
      description: CHANNEL_INFO.mission,
      founder: {
        "@type": "Person",
        name: "Hristo Stefanov",
      },
      sameAs: [
        "https://www.youtube.com/@skyscaled",
        "https://www.youtube.com/channel/UCyAn6JTDfmDBt8tcTQ-FEsA",
        "https://www.instagram.com/skyscaled/",
        "https://www.facebook.com/profile.php?id=61595040335544",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://skyscaled.com/#website",
      url: "https://skyscaled.com",
      name: "SKYSCALED — The Universe, Scaled to Human Understanding",
      publisher: {
        "@id": "https://skyscaled.com/#organization",
      },
      inLanguage: "en",
    },
    {
      "@type": "VideoObject",
      name: "How Big Is the Universe, Really?",
      description:
        "Shrink Earth to a 1 mm grain of sand and trace the scale of the cosmos from the Moon and Sun to Voyager 1 at one light-day (November 18, 2026), Andromeda, and the 93-billion-light-year observable universe.",
      thumbnailUrl: ["https://skyscaled.com/thumbnails/ep01-universe-scale.jpg"],
      uploadDate: "2026-10-06T14:00:00Z",
      duration: "PT3M8S",
      contentUrl: "https://www.youtube.com/watch?v=nmhP2Z7zKN8",
      embedUrl: "https://www.youtube.com/embed/nmhP2Z7zKN8",
      publisher: {
        "@id": "https://skyscaled.com/#organization",
      },
    },
    {
      "@type": "VideoObject",
      name: "Starship Finally Reached Orbit: What Flight 14 Changed",
      description:
        "On September 28, 2026, Starship Flight 14 added the final 1% of velocity to reach full orbit, deployed 26 Starlink V3 satellites, and completed its first deorbit burn.",
      thumbnailUrl: ["https://skyscaled.com/thumbnails/ep02-starship-orbit.jpg"],
      uploadDate: "2026-10-09T15:00:00Z",
      duration: "PT3M4S",
      contentUrl: "https://www.youtube.com/watch?v=SzQe6SKwP0U",
      embedUrl: "https://www.youtube.com/embed/SzQe6SKwP0U",
      publisher: {
        "@id": "https://skyscaled.com/#organization",
      },
    },
    {
      "@type": "VideoObject",
      name: "The Big Bang in One Calendar Year",
      description:
        "Compress 13.8 billion years of cosmic history into one 365-day calendar year, from the Cosmic Microwave Background on January 1 to the formation of the Sun and Earth on September 1.",
      thumbnailUrl: ["https://skyscaled.com/thumbnails/ep06-big-bang-calendar.jpg"],
      uploadDate: "2026-10-21T15:00:00Z",
      duration: "PT3M12S",
      contentUrl: "https://www.youtube.com/watch?v=p82cVukjiB4",
      embedUrl: "https://www.youtube.com/embed/p82cVukjiB4",
      publisher: {
        "@id": "https://skyscaled.com/#organization",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-cyan-500 selection:text-slate-950">
        <Starfield className="pointer-events-none fixed inset-0 z-0" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
