import { api, StreamInOut } from "encore.dev/api";

// Map of session ID to connected streams
const sessionStreams: Map<string, Set<StreamInOut<ChatMessage, ChatMessage>>> = new Map();

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  color: string;
  sessionId: string;
}

export interface ChatHandshake {
  sessionId: string;
  username: string;
}

// Real-time chat streaming endpoint that handles bidirectional communication within sessions.
export const chatStream = api.streamInOut<ChatHandshake, ChatMessage, ChatMessage>(
  { expose: true, path: "/chat/stream" },
  async (handshake, stream) => {
    const { sessionId } = handshake;
    
    // Get or create the set of streams for this session
    if (!sessionStreams.has(sessionId)) {
      sessionStreams.set(sessionId, new Set());
    }
    
    const streams = sessionStreams.get(sessionId)!;
    streams.add(stream);

    try {
      for await (const chatMessage of stream) {
        // Only broadcast to streams in the same session
        for (const cs of streams) {
          try {
            await cs.send(chatMessage);
          } catch (err) {
            // If there's an error sending the message, remove the client from the session
            streams.delete(cs);
          }
        }
      }
    } finally {
      streams.delete(stream);
      
      // Clean up empty session sets
      if (streams.size === 0) {
        sessionStreams.delete(sessionId);
      }
    }
  }
);
