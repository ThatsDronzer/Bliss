"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, AlertCircle, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SignIn } from "@clerk/nextjs"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginDialog({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <SignIn path="/login" routing="path" signUpUrl="/signup" redirectUrl="/" appearance={{ variables: { colorPrimary: '#db2777' } }} />
      </DialogContent>
    </Dialog>
  )
}
