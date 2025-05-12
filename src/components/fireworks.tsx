"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  distance: number;
  delay: number;
}

export function Fireworks() {
  const [fireworks, setFireworks] = useState<
    Array<{ id: number; particles: Particle[] }>
  >([]);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    // Create new fireworks more frequently (every 300ms)
    const interval = setInterval(() => {
      createFirework();
    }, 300);

    // Create multiple initial fireworks for immediate impact
    for (let i = 0; i < 3; i++) {
      setTimeout(() => createFirework(), i * 200);
    }

    return () => clearInterval(interval);
  }, []);

  const createFirework = () => {
    const fireworkId = Date.now();
    const particles: Particle[] = [];

    // Check if this is one of the last fireworks (based on time)
    const isLastFewFireworks = Date.now() > startTime + 3500; // Last 1.5 seconds of animation

    // Get screen dimensions for responsive sizing
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 768;

    // Random position for the firework - keep more centered on mobile
    const xRange = isMobile ? 0.8 : 1; // Narrower range on mobile
    const x = screenWidth * 0.1 + Math.random() * screenWidth * xRange;

    // Keep fireworks more in view on mobile
    const yMax = isMobile ? window.innerHeight * 0.5 : window.innerHeight * 0.7;
    const y = Math.random() * yMax + window.innerHeight * 0.1;

    // Random color for the firework with more vibrant options
    const colors = [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
      "#ff8800",
      "#ff0088",
      "#8800ff",
      "#00ff88",
      "#88ff00",
      "#ffffff",
      "#ffcc00",
      "#00ffcc",
      "#cc00ff",
      "#ff00cc", // More vibrant colors
    ];

    // For the last few fireworks, use brighter colors
    const lastFireworkColors = [
      "#ffffff",
      "#ffff00",
      "#ff8800",
      "#00ffff",
      "#ff00ff",
    ];

    // Sometimes use a gradient of similar colors for a more cohesive explosion
    const useGradient = Math.random() > 0.5;

    // For last few fireworks, use brighter colors
    const baseColor = isLastFewFireworks
      ? lastFireworkColors[
          Math.floor(Math.random() * lastFireworkColors.length)
        ]
      : colors[Math.floor(Math.random() * colors.length)];

    // Create more particles for bigger explosions, especially on the last few
    const baseParticleCount = isMobile ? 40 : 50; // Base count adjusted for mobile
    const particleCount = isLastFewFireworks
      ? baseParticleCount + 30 // More particles for last fireworks
      : Math.floor(Math.random() * 30) + baseParticleCount;

    // Make particles larger on mobile
    const sizeMultiplier = isMobile ? 1.5 : 1;
    // Make last few fireworks even larger
    const lastFireworkSizeMultiplier = isLastFewFireworks ? 1.5 : 1;

    for (let i = 0; i < particleCount; i++) {
      // Determine color - either all same or slight variations
      let color = baseColor;
      if (!useGradient) {
        color = isLastFewFireworks
          ? lastFireworkColors[
              Math.floor(Math.random() * lastFireworkColors.length)
            ]
          : colors[Math.floor(Math.random() * colors.length)];
      }

      // Create particle with staggered animation
      particles.push({
        id: i,
        x,
        y,
        color,
        // Larger particles for mobile and last fireworks
        size:
          (Math.random() * 6 + 2) * sizeMultiplier * lastFireworkSizeMultiplier,
        angle: Math.random() * Math.PI * 2,
        // Shorter distance on mobile for better visibility
        distance: Math.random() * (isMobile ? 120 : 150) + (isMobile ? 40 : 50),
        delay: Math.random() * 0.2, // Staggered animation
      });
    }

    setFireworks((prev) => [...prev, { id: fireworkId, particles }]);

    // Remove firework after animation
    setTimeout(() => {
      setFireworks((prev) => prev.filter((fw) => fw.id !== fireworkId));
    }, 2000);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {fireworks.map((firework, index) => (
        <div key={firework.id + index}>
          {firework.particles.map((particle) => (
            <motion.div
              key={`${firework.id + index}-${particle.id}`}
              className="absolute rounded-full"
              initial={{
                x: particle.x,
                y: particle.y,
                opacity: 1,
                scale: 0.8,
                backgroundColor: particle.color,
              }}
              animate={{
                x: particle.x + Math.cos(particle.angle) * particle.distance,
                y: particle.y + Math.sin(particle.angle) * particle.distance,
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
                delay: particle.delay,
              }}
              style={{
                width: particle.size,
                height: particle.size,
                boxShadow: `0 0 ${particle.size * 2.5}px 1px ${particle.color}`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
