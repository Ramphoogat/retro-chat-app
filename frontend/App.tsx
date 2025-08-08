import { useState, useEffect, useRef } from "react";
import { ChatWindow } from "./components/ChatWindow";
import { MessageInput } from "./components/MessageInput";
import { UserSetup } from "./components/UserSetup";
import { Terminal } from "./components/Terminal";
import backend from "~backend/client";
import type { ChatMessage } from "~backend/chat/stream";

export default function App() {
  const [username, setUsername] = useState<string>("");
  const [userColor, setUserColor] = useState<string>("#00ff00");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const streamRef = useRef<any>(null);

  const connectToChat = async () => {
    if (!username.trim()) return;

    try {
      const stream = await backend.chat.chatStream();
      streamRef.current = stream;
      setIsConnected(true);

      // Listen for incoming messages
      (async () => {
        try {
          for await (const message of stream) {
            setMessages(prev => [...prev, message]);
          }
        } catch (error) {
          console.error("Stream error:", error);
          setIsConnected(false);
        }
      })();
    } catch (error) {
      console.error("Failed to connect to chat:", error);
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!streamRef.current || !messageText.trim()) return;

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      username,
      message: messageText,
      timestamp: new Date(),
      color: userColor,
    };

    try {
      await streamRef.current.send(message);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const disconnect = () => {
    if (streamRef.current) {
      streamRef.current.close();
      streamRef.current = null;
    }
    setIsConnected(false);
    setMessages([]);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.close();
      }
    };
  }, []);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono">
        <Terminal />
        <UserSetup
          username={username}
          setUsername={setUsername}
          userColor={userColor}
          setUserColor={setUserColor}
          onConnect={connectToChat}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col">
      <Terminal />
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-cyan-400 glitch-text">
            CHAT_TERMINAL_v2.1
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              USER: <span style={{ color: userColor }}>{username}</span>
            </span>
            <button
              onClick={disconnect}
              className="px-3 py-1 bg-red-900 border border-red-500 text-red-400 hover:bg-red-800 transition-colors"
            >
              DISCONNECT
            </button>
          </div>
        </div>
        <ChatWindow messages={messages} currentUser={username} />
        <MessageInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
}
