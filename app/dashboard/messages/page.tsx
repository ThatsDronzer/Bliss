"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, Send, Clock } from "lucide-react"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function MessagesPage() {
  const router = useRouter()
  const { isAuthenticated, messages, user, sendMessage } = useAuth()
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const filteredChats = messages.filter((chat) =>
    chat.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedChatMessages = selectedChat
    ? messages.find((chat) => chat.id === selectedChat)?.messages || []
    : []

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageText.trim() && selectedChat) {
      sendMessage(selectedChat, messageText, "client")
      setMessageText("")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Chat List */}
        <div className="w-full md:w-1/3">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-gray-500 mt-1">Chat with your vendors</p>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-2">
              {filteredChats.map((chat) => (
                <Card
                  key={chat.id}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedChat === chat.id ? "bg-gray-50 border-primary" : ""
                  }`}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={chat.vendorImage} />
                        <AvatarFallback>{chat.vendorName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold truncate">{chat.vendorName}</h3>
                          <span className="text-xs text-gray-500">
                            {new Date(chat.messages[chat.messages.length - 1]?.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {chat.messages[chat.messages.length - 1]?.text}
                        </p>
                        {chat.unread && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-white mt-1">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className="flex-1">
          {selectedChat ? (
            <div className="h-[calc(100vh-200px)] flex flex-col bg-white rounded-lg border">
              {/* Chat Header */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={messages.find((chat) => chat.id === selectedChat)?.vendorImage}
                    />
                    <AvatarFallback>
                      {messages.find((chat) => chat.id === selectedChat)?.vendorName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {messages.find((chat) => chat.id === selectedChat)?.vendorName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {messages.find((chat) => chat.id === selectedChat)?.vendorCategory}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedChatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.sender === "client" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === "client"
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div
                          className={`flex items-center gap-1 mt-1 text-xs ${
                            message.sender === "client" ? "text-primary-50" : "text-gray-500"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <Button type="submit" disabled={!messageText.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 rounded-lg border">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
