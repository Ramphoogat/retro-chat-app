import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 bg-gray-900 border border-green-500 p-4">
      <div className="flex-1 relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter message..."
          className="bg-black border-green-500 text-green-400 font-mono placeholder:text-green-600 focus:border-cyan-400 pr-12"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 text-xs">
          {message.length}/256
        </div>
      </div>
      <Button
        onClick={handleSend}
        disabled={!message.trim()}
        className="bg-green-900 border border-green-500 text-green-400 hover:bg-green-800 px-4 disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
}
