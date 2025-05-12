"use client";
import { IntroAnimation } from "@/components/intro-animation";
import MessageSwiper from "@/components/message-swiper";
import { useEffect, useState } from "react";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [hasShownIntro, setHasShownIntro] = useState(false);

  // Track if the intro has been shown before
  useEffect(() => {
    if (showIntro && !hasShownIntro) {
      setHasShownIntro(true);
    }
  }, [showIntro, hasShownIntro]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 relative">
      {showIntro && (
        <IntroAnimation
          text="Happy Birthday Vanshika!"
          duration={6000}
          onComplete={() => setShowIntro(false)}
        />
      )}
      <div className="w-full h-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">Message Inbox</h1>
        <MessageSwiper />
      </div>
    </main>
  );
}
