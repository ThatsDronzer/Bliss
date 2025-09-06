"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, Send } from "lucide-react"

import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mockMessages } from "@/lib/auth"

export default function VendorMessagesPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const userRole = user?.unsafeMetadata?.role as string || "user"
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?role=vendor")
    } else if (isLoaded && isSignedIn && userRole !== "vendor") {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, userRole, router])

  // Message helper functions
  const markMessageAsRead = (messageId: string) => {
    // In a real app, this would make an API call to mark the message as read
    console.log(`Marking message ${messageId} as read`)
    // For now we can just update the local state if needed
  }

  const sendMessage = (conversationId: string, message: string, sender: string) => {
    // In a real app, this would make an API call to send the message
    console.log(`Sending message to conversation ${conversationId}: ${message}`)
    // For now we can just update the local state if needed
  }

  // Scroll to bottom of messages when conversation changes or new message is sent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedConversation])

  if (!isLoaded || !isSignedIn || userRole !== "vendor") {
    return null
  }

  // Filter messages based on search and only show messages for this vendor
  const filteredMessages = mockMessages
    .filter((message) => message.vendorId === "venue-example")
    .filter((message) => message.clientName.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSelectConversation = (conversation: any) => {
    // Mark as read when selected
    markMessageAsRead(conversation.id)
    setSelectedConversation(conversation)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    // Send the message
    sendMessage(selectedConversation.id, newMessage, "vendor")
    setNewMessage("")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-500 mt-1">Communicate with your clients</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-250px)] min-h-[500px] border rounded-lg overflow-hidden">
        {/* Conversations List */}
        <div className="w-full md:w-80 border-r">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100%-61px)]">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === message.id ? "bg-gray-50" : ""
                  }`}
                  onClick={() => handleSelectConversation(message)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={message.clientImage || "/placeholder.svg"}
                        alt={message.clientName}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                      {message.unread && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{message.clientName}</h3>
                        <span className="text-xs text-gray-500">{new Date(message.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{message.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-gray-500">No messages found</p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Conversation View */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-3 border-b flex items-center gap-3">
                <Image
                  src={selectedConversation.clientImage || "/placeholder.svg"}
                  alt={selectedConversation.clientName}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium">{selectedConversation.clientName}</h3>
                  <p className="text-xs text-gray-500">Client</p>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedConversation.conversation.map((msg: any, index: number) => (
                    <div key={index} className={`flex ${msg.sender === "vendor" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`rounded-lg p-3 max-w-[80%] ${
                          msg.sender === "vendor" ? "bg-primary/10" : "bg-gray-100"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <div className="p-3 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    className="min-h-[60px] resize-none"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button type="submit" size="icon" className="h-[60px] w-[60px]" disabled={!newMessage.trim()}>
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-4">
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-gray-500 mt-1">Choose a client to view your conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
