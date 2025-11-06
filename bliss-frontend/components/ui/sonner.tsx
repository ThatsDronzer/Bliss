"use client"

import { Toaster as Sonner } from "sonner"
import { useTheme } from "next-themes"

type ToasterProps = React.ComponentProps<typeof Sonner>

export const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      closeButton
      visibleToasts={5}
      toastOptions={{
        duration: 5000,
        unstyled: false,
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg w-full max-w-md",
          title: "text-base font-semibold",
          description: "group-[.toast]:text-muted-foreground text-sm mt-1",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground text-sm px-3 py-1.5",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground text-sm px-3 py-1.5",
          closeButton: "group-[.toast]:text-foreground/50 hover:group-[.toast]:text-foreground",
          success: "!bg-pink-50 !text-pink-800 !border-pink-200",
          error: "!bg-red-50 !text-red-800 !border-red-200",
          warning: "!bg-amber-50 !text-amber-800 !border-amber-200",
          info: "!bg-blue-50 !text-blue-800 !border-blue-200",
          loading: "!bg-pink-50 !text-pink-800 !border-pink-200",
        },
        style: {
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          minHeight: '4rem',
          gap: '0.5rem',
        }
      }}
      {...props}
    />
  )
}