"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { Fireworks } from "@/components/fireworks";

interface IntroAnimationProps {
  text: string;
  duration?: number;
  onComplete?: () => void;
}

export function IntroAnimation({
  text,
  duration = 6000,
  onComplete,
}: IntroAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showFireworks, setShowFireworks] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Show fireworks after a short delay
    const fireworksTimer = setTimeout(() => {
      setShowFireworks(true);
    }, 800);

    // Start fade out process before completely hiding
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, duration - 1500); // Start fading 1.5 seconds before the end (slower fade)

    // Set a timeout to hide the component after the animation duration
    const hideTimer = setTimeout(() => {
      setIsVisible(false);

      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => {
      clearTimeout(fireworksTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50 overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{
            opacity: isFadingOut ? 0 : 1,
            backgroundColor: isFadingOut
              ? "rgba(255, 255, 255, 0)"
              : "rgba(255, 255, 255, 1)",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}>
          {showFireworks && <Fireworks />}

          <motion.div
            className="flex flex-col items-center gap-8"
            initial={{ scale: 0.2, y: 100 }}
            animate={{
              scale: 1,
              y: 0,
              opacity: isFadingOut ? 0 : 1,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 1,
              },
            }}>
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-foreground text-center"
              animate={{
                opacity: isFadingOut ? 0 : 1,
              }}
              transition={{
                duration: 0.8,
              }}>
              {text}
            </motion.h1>

            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: isFadingOut ? 0 : 1,
              }}
              transition={{
                duration: 0.8,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}>
              <Heart className="h-16 w-16 text-red-500 fill-red-500" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
