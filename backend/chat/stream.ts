import { api, StreamInOut } from "encore.dev/api";

const connectedStreams: Set<StreamInOut<ChatMessage, ChatMessage>> = new Set();

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  color: string;
}

// Real-time chat streaming endpoint that handles bidirectional communication.
export const chatStream = api.streamInOut<ChatMessage, ChatMessage>(
  { expose: true, path: "/chat/stream" },
  async (stream) => {
    connectedStreams.add(stream);

    try {
      for await (const chatMessage of stream) {
        // Broadcast the message to all connected clients
        for (const cs of connectedStreams) {
          try {
            await cs.send(chatMessage);
          } catch (err) {
            // If there's an error sending the message, remove the client from the map
            connectedStreams.delete(cs);
          }
        }
      }
    } finally {
      connectedStreams.delete(stream);
    }
  }
);
