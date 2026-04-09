import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MentorAI — Your Personal Career Guide",
  description:
    "AI-powered career mentorship platform for Indian students. Get personalized career roadmaps, connect with parents, and unlock your potential.",
  keywords: "career guidance, AI mentor, Indian students, career roadmap, JEE, NEET, UPSC",
  openGraph: {
    title: "MentorAI — Your Personal Career Guide",
    description: "AI-powered career mentorship for Indian students",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full" suppressHydrationWarning>{children}</body>
    </html>
  );
}
