"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, Send, Store } from "lucide-react"

import { useRoleAuth } from "@/hooks/use-role-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AdminMessagesPage() {
  const router = useRouter()
  const { isAuthorized, isLoading } = useRoleAuth("admin")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Demo messages data for admin-vendor conversations
  const messages = [
    {
      id: "1",
      vendorId: "vendor-1",
      vendorName: "Royal Palace",
      vendorImage: "/placeholder.svg",
      category: "Venue",
      lastMessage: "Thank you for the payment confirmation",
      date: "2024-03-15",
      unread: false,
      conversation: [
        {
          sender: "vendor",
          message: "Hello, I have a question about the payment schedule",
          timestamp: "2024-03-15T10:00:00"
        },
        {
          sender: "admin",
          message: "Hi! I can help you with that. What would you like to know?",
          timestamp: "2024-03-15T10:05:00"
        },
        {
          sender: "vendor",
          message: "When will the payment be processed?",
          timestamp: "2024-03-15T10:10:00"
        },
        {
          sender: "admin",
          message: "The payment will be processed within 3-5 business days after the event completion",
          timestamp: "2024-03-15T10:15:00"
        },
        {
          sender: "vendor",
          message: "Thank you for the payment confirmation",
          timestamp: "2024-03-15T10:20:00"
        }
      ]
    },
    {
      id: "2",
      vendorId: "vendor-2",
      vendorName: "Dream Decorators",
      vendorImage: "/placeholder.svg",
      category: "Decoration",
      lastMessage: "I need help with my listing",
      date: "2024-03-14",
      unread: true,
      conversation: [
        {
          sender: "vendor",
          message: "I need help with my listing",
          timestamp: "2024-03-14T14:30:00"
        }
      ]
    },
    {
      id: "3",
      vendorId: "vendor-3",
      vendorName: "Catering Plus",
      vendorImage: "/placeholder.svg",
      category: "Catering",
      lastMessage: "Booking confirmed for next week",
      date: "2024-03-13",
      unread: false,
      conversation: [
        {
          sender: "admin",
          message: "Your booking for next week has been confirmed",
          timestamp: "2024-03-13T09:00:00"
        },
        {
          sender: "vendor",
          message: "Great! I'll prepare everything accordingly",
          timestamp: "2024-03-13T09:05:00"
        },
        {
          sender: "admin",
          message: "Perfect! Let us know if you need anything",
          timestamp: "2024-03-13T09:10:00"
        }
      ]
    }
  ]

  // Scroll to bottom of messages when conversation changes or new message is sent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedConversation, messages])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Return null if not authorized (will redirect via useRoleAuth hook)
  if (!isAuthorized) {
    return null
  }

  // Filter messages based on search
  const filteredMessages = messages.filter((message) => 
    message.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    // Add new message to conversation
    const newMsg = {
      sender: "admin",
      message: newMessage,
      timestamp: new Date().toISOString()
    }

    // In real app, send message to backend
    console.log("Sending message:", newMsg)
    
    setNewMessage("")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-500 mt-1">Communicate with vendors</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-250px)] min-h-[500px] border rounded-lg overflow-hidden">
        {/* Conversations List */}
        <div className="w-full md:w-80 border-r">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search vendors..."
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
                        src={message.vendorImage || "/placeholder.svg"}
                        alt={message.vendorName}
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
                        <h3 className="font-medium truncate">{message.vendorName}</h3>
                        <span className="text-xs text-gray-500">{new Date(message.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{message.category}</p>
                      <p className="text-sm text-gray-400 truncate">{message.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-gray-500">No vendors found</p>
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
                  src={selectedConversation.vendorImage || "/placeholder.svg"}
                  alt={selectedConversation.vendorName}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium">{selectedConversation.vendorName}</h3>
                  <p className="text-xs text-gray-500">{selectedConversation.category} • Vendor</p>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedConversation.conversation.map((msg: any, index: number) => (
                    <div key={index} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`rounded-lg p-3 max-w-[80%] ${
                          msg.sender === "admin" ? "bg-primary/10" : "bg-gray-100"
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
                <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium">Select a vendor</p>
                <p className="text-gray-500 mt-1">Choose a vendor to start a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 