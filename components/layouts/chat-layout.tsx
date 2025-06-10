import { ChatWidget } from "@/components/ui/chat-widget";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
} 