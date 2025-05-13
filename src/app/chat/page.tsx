"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const isYouTubeUrl = (url: string): boolean => {
  return url.includes("youtube.com") || url.includes("youtu.be");
};

const convertYouTubeUrlToEmbed = (url: string): string => {
  // Handle youtu.be format
  if (url.includes("youtu.be")) {
    const videoId = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }

  // Handle youtube.com format
  if (url.includes("youtube.com/watch")) {
    const videoId = new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }

  // If it's already an embed URL, return as is
  if (url.includes("youtube.com/embed")) {
    return url.includes("autoplay=1")
      ? url
      : `${url}${url.includes("?") ? "&" : "?"}autoplay=1`;
  }

  // If we can't parse it, return the original URL
  return url;
};

type Message = {
  id: string;
  content: string;
  sender: "bot" | "user";
};

type Option = {
  id: string;
  text: string;
  response: string;
};

type Prompt = {
  id: string;
  title: string;
  message: string;
  options: Option[];
  useCommonResponse: boolean;
  commonResponse: string;
};

// Typing indicator component
const TypingIndicator = () => {
  return (
    <div className="flex w-fit items-center space-x-1 p-3 rounded-lg bg-gray-200 text-gray-800">
      <div
        className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}></div>
      <div
        className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}></div>
      <div
        className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}></div>
    </div>
  );
};

export default function StructuredChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState(
    "https://rdvs21sr88.ufs.sh/f/s3nfBmqMFiPznFahl20y4zuStmYao6D92OXFQwAHV1Mr8Iej"
  );
  const [finalMessage, setFinalMessage] = useState(
    "I wanted to share this special moment with you ❤️"
  );
  const [isTyping, setIsTyping] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: "1",
      title: "Greeting",
      message:
        "Hi there! I've been thinking about you. How are you doing today?",
      options: [
        {
          id: "1-1",
          text: "I'm doing great! How about you?",
          response:
            "I am excited cuz its your birthday. My baby is 21 yay. I was thinking about all the memories we have made together.",
        },
        {
          id: "1-2",
          text: "I miss you",
          response:
            "I miss you too babe and that is why I thought we should revisit some of our favourite memories together.",
        },
        {
          id: "1-3",
          text: "What are you up to?",
          response: "Just thinking about you and all our wonderful memories.",
        },
      ],
      useCommonResponse: false,
      commonResponse:
        "That's wonderful to hear! I've been thinking about our special memories together.",
    },
    {
      id: "2",
      title: "Core Memories",
      message: "What's your favorite memory of us together?",
      options: [
        {
          id: "2-1",
          text: "Our first date",
          response:
            "That was magical! I'll never forget how nervous I was and how beautiful you looked in the streets of Khan Market hehe",
        },
        {
          id: "2-2",
          text: "That trip to the Mumbai",
          response:
            "The sunset was perfect that day, but not as perfect as you.",
        },
        {
          id: "2-3",
          text: "When we cooked dinner together",
          response:
            "Even though we burned the pasta, it was still the best meal ever because I was with you.",
        },
      ],
      useCommonResponse: false,
      commonResponse:
        "That's one of my favorites too! Those special moments mean everything to me.",
    },
    {
      id: "3",
      title: "Things I Love",
      message: "Do you know what I love most about you?",
      options: [
        {
          id: "3-1",
          text: "My smile?",
          response:
            "Yes! Your smile lights up my entire world every time I see it.",
        },
        {
          id: "3-2",
          text: "My kindness?",
          response:
            "Your kindness and compassion for others is truly inspiring.",
        },
        {
          id: "3-3",
          text: "My sense of humor?",
          response:
            "Definitely! You always know how to make me laugh, even on my worst days.",
        },
      ],
      useCommonResponse: true,
      commonResponse:
        "That and so much more! Everything about you is perfect to me.",
    },
    {
      id: "4",
      title: "Friends",
      message: "Do you miss me and your friends?",
      options: [
        {
          id: "4-1",
          text: "Yes",
          response:
            "awwww.... well a video shall be played next to show our best memories.",
        },
        {
          id: "4-2",
          text: "No",
          response: "hmmmm..... too bad we miss you ❤️",
        },
      ],
      useCommonResponse: false,
      commonResponse: "",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with the first prompt
  useEffect(() => {
    if (prompts.length > 0) {
      setIsTyping(true);

      // Show typing indicator for 2 seconds before showing the first message
      setTimeout(() => {
        const initialMessage: Message = {
          id: Date.now().toString(),
          content: prompts[0].message,
          sender: "bot",
        };
        setMessages([initialMessage]);
        setIsTyping(false);
      }, 2000);
    }
  }, []);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSelectOption = (optionId: string) => {
    const currentPrompt = prompts[currentPromptIndex];
    const selectedOption = currentPrompt.options.find(
      (opt) => opt.id === optionId
    );

    if (!selectedOption) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: selectedOption.text,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);

    // Determine response based on whether using common response or individual responses
    const responseText = currentPrompt.useCommonResponse
      ? currentPrompt.commonResponse
      : selectedOption.response;

    // Show typing indicator
    setIsTyping(true);

    // Simulate typing delay (2 seconds)
    setTimeout(() => {
      // Hide typing indicator and add bot response
      // setIsTyping(false);

      const botMessage: Message = {
        id: Date.now().toString(),
        content: responseText,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);

      // Move to next prompt or show video
      const nextPromptIndex = currentPromptIndex + 1;
      if (nextPromptIndex < prompts.length) {
        // Move to next prompt
        setCurrentPromptIndex(nextPromptIndex);

        // Show typing indicator for the next prompt message
        setTimeout(() => {
          setIsTyping(true);

          // Show the next prompt message after 2 seconds
          setTimeout(() => {
            setIsTyping(false);
            const nextPromptMessage: Message = {
              id: Date.now().toString(),
              content: prompts[nextPromptIndex].message,
              sender: "bot",
            };
            setMessages((prev) => [...prev, nextPromptMessage]);
          }, 2000);
        }, 1000);
      } else {
        // End of prompts, show final message and video
        setTimeout(() => {
          if (videoUrl) {
            // Show typing indicator for final message
            setIsTyping(true);

            // Show final message after 2 seconds
            setTimeout(() => {
              setIsTyping(false);
              const finalBotMessage: Message = {
                id: Date.now().toString(),
                content: finalMessage,
                sender: "bot",
              };
              setMessages((prev) => [...prev, finalBotMessage]);
              setShowVideo(true);
            }, 2000);
          }
        }, 1000);
      }
    }, 2000);
  };

  const resetChat = () => {
    if (prompts.length > 0) {
      setMessages([]);
      setCurrentPromptIndex(0);
      setShowVideo(false);

      // Show typing indicator
      setIsTyping(true);

      // Show first message after 2 seconds
      setTimeout(() => {
        setIsTyping(false);
        const initialMessage: Message = {
          id: Date.now().toString(),
          content: prompts[0].message,
          sender: "bot",
        };
        setMessages([initialMessage]);
      }, 2000);
    }
  };

  // Prompt management functions
  const addPrompt = () => {
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      title: `Prompt ${prompts.length + 1}`,
      message: "",
      options: [
        { id: `new-${Date.now()}-1`, text: "", response: "" },
        { id: `new-${Date.now()}-2`, text: "", response: "" },
      ],
      useCommonResponse: false,
      commonResponse: "",
    };
    setPrompts((prev) => [...prev, newPrompt]);
  };

  const removePrompt = (promptId: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== promptId));
  };

  const updatePrompt = (
    promptId: string,
    field: keyof Prompt,
    value: string | boolean
  ) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === promptId ? { ...p, [field]: value } : p))
    );
  };

  const addOption = (promptId: string) => {
    const newOption: Option = {
      id: `${promptId}-${Date.now()}`,
      text: "",
      response: "",
    };
    setPrompts((prev) =>
      prev.map((p) =>
        p.id === promptId ? { ...p, options: [...p.options, newOption] } : p
      )
    );
  };

  const removeOption = (promptId: string, optionId: string) => {
    setPrompts((prev) =>
      prev.map((p) =>
        p.id === promptId
          ? { ...p, options: p.options.filter((o) => o.id !== optionId) }
          : p
      )
    );
  };

  const updateOption = (
    promptId: string,
    optionId: string,
    field: keyof Option,
    value: string
  ) => {
    setPrompts((prev) =>
      prev.map((p) =>
        p.id === promptId
          ? {
              ...p,
              options: p.options.map((o) =>
                o.id === optionId ? { ...o, [field]: value } : o
              ),
            }
          : p
      )
    );
  };

  const movePrompt = (promptId: string, direction: "up" | "down") => {
    const currentIndex = prompts.findIndex((p) => p.id === promptId);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === prompts.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newPrompts = [...prompts];
    const [removed] = newPrompts.splice(currentIndex, 1);
    newPrompts.splice(newIndex, 0, removed);
    setPrompts(newPrompts);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Tabs
        defaultValue="chat"
        className="w-full max-w-6xl mx-auto h-full flex-1 p-4">
        {/* add hidden to the tablist */}
        <TabsList className="grid w-full grid-cols-2 hidden">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="w-full flex-1 flex">
          <Card className="w-full flex-1 bg-transparent border-transparent shadow-none">
            <CardHeader className="p-0">
              <CardTitle className="font-extrabold text-2xl">
                Chat with Your Special Someone ❤️
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full overflow-y-auto p-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}>
                  <span
                    className={`inline-block p-3 rounded-lg font-medium ${
                      message.sender === "user"
                        ? "bg-pink-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}>
                    {message.content}
                  </span>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="mb-4 text-left">
                  <TypingIndicator />
                </div>
              )}

              {showVideo && videoUrl && (
                <div className="my-4 flex justify-center">
                  {isYouTubeUrl(videoUrl) ? (
                    <iframe
                      className="rounded-lg max-w-full"
                      width="560"
                      height="315"
                      src={convertYouTubeUrlToEmbed(videoUrl)}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen></iframe>
                  ) : (
                    <video
                      controls
                      autoPlay
                      className="rounded-lg max-w-full max-h-[500px]"
                      src={videoUrl}>
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            <CardFooter className="flex flex-col items-stretch p-0">
              {currentPromptIndex < prompts.length &&
                !showVideo &&
                !isTyping && (
                  <div className="grid grid-cols-1 gap-2 w-full mb-4">
                    {prompts[currentPromptIndex].options.map((option) => (
                      <Button
                        key={option.id}
                        onClick={() => handleSelectOption(option.id)}
                        className="bg-pink-100 text-pink-800 hover:bg-pink-200 justify-start text-left h-auto py-3 px-4 font-normal">
                        {option.text}
                      </Button>
                    ))}
                  </div>
                )}

              {/* {showVideo && (
                <Button onClick={resetChat} variant="outline" className="mt-2">
                  Reset Chat
                </Button>
              )} */}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="w-full flex-1 flex">
          <Card className="w-full flex-1 bg-transparent border-transparent shadow-none">
            <CardHeader className="p-0">
              <CardTitle>Customize Your Conversation Flow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-0">
              <div>
                <h3 className="text-lg font-medium mb-2">Final Video</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">
                      Video URL:
                    </label>
                    <Input
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://example.com/video.mp4"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">
                      Final Message:
                    </label>
                    <Textarea
                      value={finalMessage}
                      onChange={(e) => setFinalMessage(e.target.value)}
                      placeholder="Enter the message to show with the video"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Conversation Prompts</h3>
                  <Button
                    onClick={addPrompt}
                    className="bg-pink-500 hover:bg-pink-600">
                    <PlusCircle size={16} className="mr-2" />
                    Add Prompt
                  </Button>
                </div>

                <Accordion type="multiple" className="w-full">
                  {prompts.map((prompt, index) => (
                    <AccordionItem
                      key={prompt.id}
                      value={prompt.id}
                      className="border border-gray-200 rounded-md mb-4 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => movePrompt(prompt.id, "up")}
                            disabled={index === 0}
                            className="h-8 w-8 p-0">
                            <ChevronUp size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => movePrompt(prompt.id, "down")}
                            disabled={index === prompts.length - 1}
                            className="h-8 w-8 p-0">
                            <ChevronDown size={16} />
                          </Button>
                        </div>
                        <AccordionTrigger className="flex-1 hover:no-underline">
                          <span className="font-medium">
                            {prompt.title || `Prompt ${index + 1}`}
                          </span>
                        </AccordionTrigger>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removePrompt(prompt.id);
                          }}
                          className="h-8 w-8 p-0 text-red-500">
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      <AccordionContent className="px-4 pt-4 pb-2">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-500 mb-1 block">
                              Prompt Title (for organization):
                            </label>
                            <Input
                              value={prompt.title}
                              onChange={(e) =>
                                updatePrompt(prompt.id, "title", e.target.value)
                              }
                              placeholder="Enter a title for this prompt"
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="text-sm text-gray-500 mb-1 block">
                              Bot Message:
                            </label>
                            <Textarea
                              value={prompt.message}
                              onChange={(e) =>
                                updatePrompt(
                                  prompt.id,
                                  "message",
                                  e.target.value
                                )
                              }
                              placeholder="Enter the message the bot will send"
                              className="w-full"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`common-response-${prompt.id}`}
                              checked={prompt.useCommonResponse}
                              onCheckedChange={(checked) =>
                                updatePrompt(
                                  prompt.id,
                                  "useCommonResponse",
                                  checked
                                )
                              }
                            />
                            <Label htmlFor={`common-response-${prompt.id}`}>
                              Use common response for all options
                            </Label>
                          </div>

                          {prompt.useCommonResponse && (
                            <div>
                              <label className="text-sm text-gray-500 mb-1 block">
                                Common Response:
                              </label>
                              <Textarea
                                value={prompt.commonResponse}
                                onChange={(e) =>
                                  updatePrompt(
                                    prompt.id,
                                    "commonResponse",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter the response for all options"
                                className="w-full"
                              />
                            </div>
                          )}

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="text-sm font-medium">
                                Response Options:
                              </label>
                              <Button
                                size="sm"
                                onClick={() => addOption(prompt.id)}
                                className="bg-pink-500 hover:bg-pink-600 h-8">
                                <PlusCircle size={14} className="mr-1" />
                                Add Option
                              </Button>
                            </div>

                            <div className="space-y-4">
                              {prompt.options.map((option, optIndex) => (
                                <Card
                                  key={option.id}
                                  className="p-3 border border-gray-200">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-sm font-medium">
                                      Option {optIndex + 1}
                                    </h4>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        removeOption(prompt.id, option.id)
                                      }
                                      className="h-7 w-7 p-0 text-red-500">
                                      <Trash2 size={14} />
                                    </Button>
                                  </div>

                                  <div className="space-y-3">
                                    <div>
                                      <label className="text-xs text-gray-500 mb-1 block">
                                        Option Text:
                                      </label>
                                      <Textarea
                                        value={option.text}
                                        onChange={(e) =>
                                          updateOption(
                                            prompt.id,
                                            option.id,
                                            "text",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter option text"
                                        className="w-full text-sm min-h-[60px]"
                                      />
                                    </div>

                                    {!prompt.useCommonResponse && (
                                      <div>
                                        <label className="text-xs text-gray-500 mb-1 block">
                                          Response:
                                        </label>
                                        <Textarea
                                          value={option.response}
                                          onChange={(e) =>
                                            updateOption(
                                              prompt.id,
                                              option.id,
                                              "response",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Enter response text"
                                          className="w-full text-sm min-h-[60px]"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
