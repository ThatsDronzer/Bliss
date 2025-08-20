import { useState } from "react"
import { AlertTriangle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConfirmDeleteDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDeleteDialog({ open, onConfirm, onCancel }: ConfirmDeleteDialogProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col items-center">
        <AlertTriangle className="h-10 w-10 text-red-500 mb-2" />
        <h3 className="text-lg font-bold mb-2 text-gray-900">Delete Review?</h3>
        <p className="text-gray-600 mb-4 text-center">Are you sure you want to delete this review? This action cannot be undone.</p>
        <div className="flex gap-2 w-full">
          <Button variant="destructive" className="flex-1" onClick={onConfirm}>Delete</Button>
          <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}
