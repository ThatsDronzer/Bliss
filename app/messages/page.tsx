"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Send, Bot } from "lucide-react"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function MessagesPage() {
  const router = useRouter()
  const { isAuthenticated, isVendor, user, vendor, messages } = useAuth()
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")

  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    // In a real app, this would send the message to your backend
    setNewMessage("")
  }

  // Filter messages based on user type
  const filteredMessages = messages.filter((msg) => {
    if (isVendor) {
      return msg.vendorId === vendor?.id
    }
    return msg.userId === user?.id
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat List */}
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {filteredMessages.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedChat === chat.id
                          ? "bg-primary text-white"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedChat(chat.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={chat.avatar || "/placeholder.svg"}
                          alt={chat.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{chat.name}</h3>
                          <p className="text-sm opacity-80">{chat.lastMessage}</p>
                        </div>
                        {chat.unread && (
                          <div className="w-3 h-3 rounded-full bg-primary-foreground"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              {selectedChat ? (
                <div className="h-[700px] flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <Image
                        src={
                          messages.find((m) => m.id === selectedChat)?.avatar ||
                          "/placeholder.svg"
                        }
                        alt="Chat Avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="font-medium">
                          {messages.find((m) => m.id === selectedChat)?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {isVendor ? "Customer" : "Vendor"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {/* Show chatbot message for customers */}
                      {!isVendor && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">
                              Hi! I'm your AI assistant. I can help you with general
                              inquiries. For specific vendor questions, please use
                              the contact form or wait for the vendor to respond.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Actual messages would be mapped here */}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button type="submit">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="h-[700px] flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="font-medium text-lg mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-500">
                      Choose a chat from the left to start messaging
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 