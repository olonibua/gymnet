"use client";

import dynamic from "next/dynamic";

// Dynamically import the HomePage content with no SSR
const HomeContent = dynamic(() => import("@/components/home/HomeContent"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
    </div>
  ),
});

export default function Home() {
  return <HomeContent />;
}
