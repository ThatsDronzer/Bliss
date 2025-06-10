"use client"

import { useState } from "react"
import { MessageCircle, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "👋 Hi! I'm your Blissmet assistant. How can I help you today?",
    sender: "bot",
    timestamp: new Date(),
  },
]

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! Our team will get back to you soon. In the meantime, you can check our FAQ section or browse vendors.",
        sender: "bot",
      timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <>
      {/* Floating button */}
      <Button
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl border">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
                <div>
              <h3 className="font-semibold">Blissmet Assistant</h3>
              <p className="text-xs text-gray-500">We typically reply in a few minutes</p>
                </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
          <ScrollArea className="h-96 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

            {/* Input */}
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
                <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                  <Send className="w-4 h-4" />
                </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
