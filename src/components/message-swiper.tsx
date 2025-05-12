"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useAnimation,
  type PanInfo,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Sample message data - using a function to ensure fresh data each time
const getInitialMessages = () => [
  {
    id: 1,
    sender: "John Doe",
    subject: "Project Update",
    preview:
      "I've completed the first phase of the project and would like to discuss the next steps.",
    timestamp: "10:30 AM",
    read: false,
  },
  {
    id: 2,
    sender: "Jane Smith",
    subject: "Meeting Tomorrow",
    preview:
      "Just a reminder that we have a team meeting scheduled for tomorrow at 2 PM.",
    timestamp: "Yesterday",
    read: false,
  },
  {
    id: 3,
    sender: "Alex Johnson",
    subject: "New Feature Request",
    preview:
      "The client has requested a new feature for the application. Let's discuss it soon.",
    timestamp: "Yesterday",
    read: false,
  },
  {
    id: 4,
    sender: "Sarah Williams",
    subject: "Vacation Plans",
    preview:
      "I'll be on vacation next week. Can you cover for me during that time?",
    timestamp: "2 days ago",
    read: false,
  },
  {
    id: 5,
    sender: "Michael Brown",
    subject: "Bug Report",
    preview:
      "I found a critical bug in the latest release. We need to fix it ASAP.",
    timestamp: "3 days ago",
    read: false,
  },
];

type Message = {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  read: boolean;
};

export default function MessageSwiper() {
  const [messages, setMessages] = useState<Message[]>(getInitialMessages());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const router = useRouter();

  const backgroundOpacity = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    [0.8, 0.9, 1, 0.9, 0.8]
  );

  const leftIndicatorOpacity = useTransform(x, [-200, -50, 0], [1, 0.5, 0]);
  const rightIndicatorOpacity = useTransform(x, [0, 50, 200], [0, 0.5, 1]);

  const resetCardState = () => {
    // Reset all motion and animation states
    setDirection(null);
    x.set(0); // Reset the x motion value to 0
    controls.set({ x: 0, opacity: 1 }); // Immediately set controls without animation
  };

  const handleDragEnd = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100;

    if (info.offset.x > threshold) {
      // Swiped right - mark as read
      setDirection("right");
      await controls.start({
        x: 500,
        opacity: 0,
        transition: { duration: 0.3 },
      });
      markMessageAs(currentIndex, true);
    } else if (info.offset.x < -threshold) {
      // Swiped left - mark as unread
      setDirection("left");
      await controls.start({
        x: -500,
        opacity: 0,
        transition: { duration: 0.3 },
      });
      markMessageAs(currentIndex, false);
    } else {
      // Return to center if not swiped far enough
      controls.start({
        x: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      });
    }
  };

  const markMessageAs = (index: number, read: boolean) => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      if (newMessages[index]) {
        newMessages[index] = { ...newMessages[index], read };
      }
      return newMessages;
    });

    // Move to next message if available
    if (currentIndex < messages.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      // Reset position for next card
      resetCardState();
    } else {
      // No more messages
      setCurrentIndex(-1);
    }
  };

  // Preload next image (if any)
  const preloadNextMessage = () => {
    // In a real app, you might want to preload images or data here
    // This is a placeholder for that functionality
  };

  useEffect(() => {
    preloadNextMessage();
  }, [currentIndex]);

  const handleReset = () => {
    router.push("/chat");
    // // Create a fresh deep copy of initial messages with all read states reset to false

    // const resetMessages = getInitialMessages().map((msg) => ({
    //   ...msg,
    //   read: false,
    // }));

    // // Reset all state
    // setMessages(resetMessages);
    // setCurrentIndex(0);

    // // Reset all motion and animation states
    // resetCardState();
  };

  if (currentIndex === -1 || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-center">
        <h2 className="text-xl font-semibold mb-2">
          ❤️ Aaryan sent you something
        </h2>
        <p className="text-gray-500 relative">
          He really misses you and wanted to say something{" "}
          <span className="animate-bounce absolute -bottom-1">👇</span>
        </p>
        <span className="mt-4 relative inline-flex">
          <button
            className="px-4 py-2 bg-pink-200 font-bold text-pink-800 hover:bg-pink-200 rounded-md transition-colors relative"
            onClick={handleReset}>
            🤭 Go to chat
          </button>
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex size-3 rounded-full bg-pink-500"></span>
          </span>
        </span>
      </div>
    );
  }

  const currentMessage = messages[currentIndex];
  const nextMessage =
    currentIndex < messages.length - 1 ? messages[currentIndex + 1] : null;

  return (
    <div className="relative h-full w-full flex flex-col gap-4">
      <div className="relative w-full h-[400px]">
        {/* Action indicators */}
        <div className="absolute top-1/2 left-6 transform -translate-y-1/2 z-20">
          <motion.div
            style={{ opacity: leftIndicatorOpacity }}
            className="bg-red-500 text-white p-3 rounded-full">
            <X size={24} />
          </motion.div>
        </div>

        <div className="absolute top-1/2 right-6 transform -translate-y-1/2 z-20">
          <motion.div
            style={{ opacity: rightIndicatorOpacity }}
            className="bg-green-500 text-white p-3 rounded-full">
            <Check size={24} />
          </motion.div>
        </div>

        {/* Next card (positioned behind) */}
        {nextMessage && (
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            style={{ opacity: backgroundOpacity }}>
            <Card className="w-full h-full shadow-md">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">
                    {nextMessage.sender}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {nextMessage.timestamp}
                  </span>
                </div>
                <h4 className="font-medium mb-2">{nextMessage.subject}</h4>
                <p className="text-gray-600 flex-grow">{nextMessage.preview}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Current card (on top) */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          animate={controls}
          style={{ x, rotate, opacity }}
          className="absolute top-0 left-0 w-full h-full z-10">
          <Card
            className={cn(
              "w-full h-full shadow-lg border-2 p-0",
              direction === "left"
                ? "border-red-500"
                : direction === "right"
                ? "border-green-500"
                : "border-transparent"
            )}>
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">
                  {currentMessage.sender}
                </h3>
                <span className="text-sm text-gray-500">
                  {currentMessage.timestamp}
                </span>
              </div>
              <h4 className="font-medium mb-2">{currentMessage.subject}</h4>
              <p className="text-gray-600 flex-grow">
                {currentMessage.preview}
              </p>

              {/* Action buttons */}
              <div className="flex justify-between items-center mt-6 gap-4">
                <button
                  onClick={async () => {
                    setDirection("left");
                    await controls.start({
                      x: -500,
                      opacity: 0,
                      transition: { duration: 0.3 },
                    });
                    markMessageAs(currentIndex, false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-colors">
                  <X size={18} />
                  <span>Mark Unread</span>
                </button>

                <button
                  onClick={async () => {
                    setDirection("right");
                    await controls.start({
                      x: 500,
                      opacity: 0,
                      transition: { duration: 0.3 },
                    });
                    markMessageAs(currentIndex, true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-md transition-colors">
                  <Check size={18} />
                  <span>Mark Read</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      {/* Instructions */}
      <div className="w-full text-center text-sm text-gray-500">
        <p>Swipe left to mark as unread, swipe right to mark as read</p>
      </div>
    </div>
  );
}
