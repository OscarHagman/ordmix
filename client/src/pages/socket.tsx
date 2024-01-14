import { useState, useEffect } from "react"
import { Inter } from 'next/font/google'
import socket from "@/lib/socketIo"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    const messageListener = (message: string) => {
      setMessages((messages) => [...messages, message]);
    };

    socket.on("message", messageListener);

    // Cleanup the event listener
    return () => {
      socket.off("message", messageListener);
    };
  }, [])
  
  const handleSendMessage = () => {
    socket.emit("message", "Hello World!")
  }

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-6 ${inter.className}`}>
      <h1 className="text-3xl font-bold">Socket.io</h1>

      <div className="flex flex-col items-center justify-center gap-1">
        {messages.map((message, index) => (
          <h1 key={index} className="px-4 py-2 rounded bg-slate-700">{message}</h1>
        ))}
      </div>

      <div className="flex gap-4 font-bold">
        <button className="px-4 py-2 bg-blue-500 rounded" onClick={handleSendMessage}>
          Send Message
        </button>
        <button onClick={() => setMessages([])} className="px-4 py-2 bg-red-500 rounded">
          Clear Messages
        </button>
        <button onClick={() => console.log(messages)} className="px-4 py-2 bg-green-600 rounded">
          Log Messages
        </button>
      </div>
    </main>
  )
}