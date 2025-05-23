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
import Image, { StaticImageData } from "next/image";
import AaryanProfile from "../../public/images/aaryanProfile.png";
import AaryanShowcase from "../../public/images/test.jpeg";
import ManishProfile from "../../public/images/manishProfile.png";
import ManishShowcase from "../../public/images/manishShowcase.png";
import SiddhantProfile from "../../public/images/siddhantProfile.png";
import SiddhantShowcase from "../../public/images/siddhantShowcase.png";
import ArshiyaProfile from "../../public/images/arshiyaProfile.png";
import ArshiyaShowcase from "../../public/images/arshiyaShowcase.png";
import AndreaProfile from "../../public/images/andreaProfile.png";
import AndreaShowcase from "../../public/images/andreaShowcase.png";
import AditProfile from "../../public/images/aditProfile.png";
import AditShowcase from "../../public/images/aditShowcase.png";
import AnanyaProfile from "../../public/images/ananyaProfile.png";
import AnanyaShowcase from "../../public/images/ananyaShowcase.png";

// Sample message data - using a function to ensure fresh data each time
const getInitialMessages = () => [
  {
    id: 1,
    sender: "Ananya Mazumdar",
    subject: "Happy birthday VANSHIKAAA🥳🫶🏻",
    profileImage: AnanyaProfile,
    showcaseImage: AnanyaShowcase,
    preview:
      "It has been one of my life’s greatest pleasures meeting you. Even though we spent like 3 days together i think i love you. Youre beautiful and smart and kind and i enjoy your presence thoroughly 🙂‍↕️ I hope you become a great lawyer so if a patient ever sues me ill know who to call. Have a great day sweetu♥️",
    timestamp: "14/05/25",
    read: false,
  },
  {
    id: 2,
    sender: "Adit Bidani",
    subject: "hbd",
    profileImage: AditProfile,
    showcaseImage: AditShowcase,
    preview: "happy birthday vanshan",
    timestamp: "14/05/25",
    read: false,
  },
  {
    id: 3,
    sender: "Arshiya Bidani",
    subject: "Happiest 21st babydoll ❤️❤️ ",
    profileImage: ArshiyaProfile,
    showcaseImage: ArshiyaShowcase,
    preview:
      "You are the most sweetest and the most amazing human I have ever met. You literally bring light and joy into a room 🥺💋Thank you for being in all our lives and making us all so happy. You deserve everything and more today ❤️",
    timestamp: "14/05/25",
    read: false,
  },
  {
    id: 4,
    sender: "Manish Manwani",
    subject: "Happy brithday broski",
    profileImage: ManishProfile,
    showcaseImage: ManishShowcase,
    preview:
      "Hope you have jolly good birthday mate! May all your dreams come true and you have a fantastic year ahead. Sending you lots of love and best wishes from Sydney. Cheers to you! 🎂🥳",
    timestamp: "14/05/25",
    read: false,
  },
  {
    id: 5,
    sender: "Siddhant",
    subject:
      "To my youngest and the jolliest sister Meethi (Maybe coz you have not tasted 3rd year yet)",
    profileImage: SiddhantProfile,
    showcaseImage: SiddhantShowcase,
    preview:
      "So i don't do appreciation but the way you can hold a smile even when the world is crashing around you is so admirable. But the way you can cry on a call with me makes our relationship so special. Give it a day more post your bday and then it's time for a la fiesta supremo. I wanna tell you so many things but I do not want to make this post emotional So I ll just want to say bloody learn to keep your sneakers clean. A very happy birthday kiddo",
    timestamp: "14/05/25",
    read: false,
  },
  {
    id: 6,
    sender: "Andrea",
    subject: "happy birthday meethi,",
    profileImage: AndreaProfile,
    showcaseImage: AndreaShowcase,
    preview:
      "you bring along with you this laughter and warmth and sunshine everywhere you go and yet somehow manage to do this with a silent maturity and emotional intelligence. You are a very special person in my life, especially as the first person I ever spoke spoke to at Jindal and while my awkwardness came across as insane yapping I'm glad you stuck around to find out that I am indeed an insane yapper only! I hope you know that I am forever so proud of you and how you handle life and I know that even in scenarios where you haven't been dealt the best cards in life juari that you are you'll still end up winning the game screams Cabo irrationally outta nowhere. Whether it be the late night convos with you where I was given diabolical information while kapoor sleeps in ignorance or the times you opened your heart to me with such faith and trust that it made me love you all over again, these are all moments I will hold dear for the rest of my life and wherever we go and whoever we become, i will always speak of you as one of the best things i earned at law school. We are quite different people but I think we come together in ways that are so beautiful especially in the moments where it matters, I always know if the need ever arises you've got my back and I hope you know that the inverse is equally true, thank you for replicating the kind of warmth I would only expect from family in the room. If there's a reason I tend to call the hostel my home, the biggest part of that is you and kapoor. Here's to few more years of law school, assignments, meltdowns, occasional bhandi that doesn't end in sprains, an infinite number of card games and many many more years of friendship. You have family in us <3 ~Love Andhra",
    timestamp: "14/05/25",
    read: false,
  },
  {
    id: 7,
    sender: "Aaryan baby",
    subject: "Der Geburtstag meines Lieblingsmädchens",
    profileImage: AaryanProfile,
    showcaseImage: AaryanShowcase,
    preview:
      "Happy birthdayyyy my loveee. I miss you soooo much. I know it would have been better if I was there and we could celebrate your birthday in person but I will try and make it the best day of your year. One year back we were just a situationship but look at us now, dating and me getting excited for your birthday. I hope to see you soon cutu. I love youuuu",
    timestamp: "14/05/25",
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
  profileImage: StaticImageData;
  showcaseImage: StaticImageData;
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
    <div className="relative h-full w-full flex flex-col gap-2">
      <h1 className="text-2xl font-bold text-center">Message Inbox</h1>
      {/* Instructions */}
      <div className="w-full text-center text-sm text-gray-500 flex gap-2 items-center justify-center">
        <p className="text-red-500/50 font-bold">Swipe left if you hate it</p>
        <p className="text-green-500/50 font-bold">
          {" "}
          Swipe right if you love it
        </p>
      </div>
      <div className="relative w-full h-[600px]">
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
            <Card className="w-full h-full shadow-md p-0">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2 items-center justify-center">
                    <h3 className="font-semibold text-lg">
                      {nextMessage.sender}
                    </h3>
                    <div className="object-cover w-10 h-10 overflow-hidden flex items-center justify-center rounded-full">
                      <Image
                        src={nextMessage.profileImage}
                        alt="profile image"
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 h-full flex items-center">
                    {nextMessage.timestamp}
                  </span>
                </div>
                <h4 className="font-medium mb-2">{nextMessage.subject}</h4>
                <p className="text-gray-600 mb-2 max-h-[200px] overflow-scroll">
                  {nextMessage.preview}
                </p>
                <div className="object-cover w-full h-20 flex-grow overflow-hidden flex items-center justify-center rounded-2xl">
                  <Image
                    className="scale-125"
                    src={nextMessage.showcaseImage}
                    alt="showcaseImage"
                    width={500}
                    height={500}
                  />
                </div>
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
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2 items-center justify-center">
                  <h3 className="font-semibold text-lg">
                    {currentMessage.sender}
                  </h3>
                  <div className="object-cover w-10 h-10 overflow-hidden flex items-center justify-center rounded-full">
                    <Image
                      src={currentMessage.profileImage}
                      alt="profile image"
                      width={40}
                      height={40}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-500 h-full flex items-center">
                  {currentMessage.timestamp}
                </span>
              </div>
              <h4 className="font-medium mb-2">{currentMessage.subject}</h4>
              <p className="text-gray-600 mb-2 max-h-[200px] overflow-scroll">
                {currentMessage.preview}
              </p>
              <div className="object-cover w-full h-20 flex-grow overflow-hidden flex items-center justify-center rounded-2xl">
                <Image
                  className="scale-125"
                  src={currentMessage.showcaseImage}
                  alt="showcaseImage"
                  width={500}
                  height={500}
                />
              </div>
              {/* Action buttons */}
              {/* <div className="flex justify-between items-center mt-6 gap-4">
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
              </div> */}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
