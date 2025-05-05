import MessageSwiper from "@/components/message-swiper";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full h-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">Message Inbox</h1>
        <MessageSwiper />
      </div>
    </main>
  );
}
