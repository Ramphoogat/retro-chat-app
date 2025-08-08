import { useState, useEffect, useRef } from "react";
import { ChatWindow } from "./components/ChatWindow";
import { MessageInput } from "./components/MessageInput";
import { SessionSetup } from "./components/SessionSetup";
import { Terminal } from "./components/Terminal";
import backend from "~backend/client";
import type { ChatMessage } from "~backend/chat/stream";

interface SessionInfo {
  sessionId: string;
  hostName: string;
  username: string;
  userColor: string;
}

export default function App() {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const streamRef = useRef<any>(null);

  const connectToChat = async (session: SessionInfo) => {
    try {
      const stream = await backend.chat.chatStream({
        sessionId: session.sessionId,
        username: session.username,
      });
      
      streamRef.current = stream;
      setSessionInfo(session);
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
      throw error;
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!streamRef.current || !messageText.trim() || !sessionInfo) return;

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      username: sessionInfo.username,
      message: messageText,
      timestamp: new Date(),
      color: sessionInfo.userColor,
      sessionId: sessionInfo.sessionId,
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
    setSessionInfo(null);
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
        <SessionSetup onConnect={connectToChat} />
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
              SESSION: <span className="text-cyan-400">{sessionInfo?.sessionId}</span>
            </span>
            <span className="text-sm">
              HOST: <span className="text-yellow-400">{sessionInfo?.hostName}</span>
            </span>
            <span className="text-sm">
              USER: <span style={{ color: sessionInfo?.userColor }}>{sessionInfo?.username}</span>
            </span>
            <button
              onClick={disconnect}
              className="px-3 py-1 bg-red-900 border border-red-500 text-red-400 hover:bg-red-800 transition-colors"
            >
              DISCONNECT
            </button>
          </div>
        </div>
        <ChatWindow messages={messages} currentUser={sessionInfo?.username || ""} />
        <MessageInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
}
