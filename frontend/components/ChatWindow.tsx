import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "~backend/chat/stream";

interface ChatWindowProps {
  messages: ChatMessage[];
  currentUser: string;
}

export function ChatWindow({ messages, currentUser }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="flex-1 bg-gray-900 border border-green-500 mb-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent pointer-events-none"></div>
      <ScrollArea className="h-96">
        <div ref={scrollRef} className="p-4 space-y-2 font-mono text-sm">
          {messages.length === 0 ? (
            <div className="text-center text-green-600 py-8">
              <p className="animate-pulse">WAITING FOR TRANSMISSION...</p>
              <p className="text-xs mt-2">No active connections detected</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.username === currentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 border ${
                    message.username === currentUser
                      ? "bg-cyan-900/30 border-cyan-500 text-cyan-400"
                      : "bg-gray-800/50 border-green-500"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-bold text-xs"
                      style={{ color: message.color }}
                    >
                      {message.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-green-400 break-words">{message.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-green-500/10 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
}
