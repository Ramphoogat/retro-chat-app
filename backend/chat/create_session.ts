import { api, APIError, Header } from "encore.dev/api";
import { chatDB } from "./db";

export interface CreateSessionRequest {
  hostName: string;
  password: string;
}

export interface CreateSessionResponse {
  sessionId: string;
  hostName: string;
  publicLink: string;
}

// Creates a new chat session with a unique ID and password.
export const createSession = api<CreateSessionRequest, CreateSessionResponse>(
  { expose: true, method: "POST", path: "/chat/sessions" },
  async (req) => {
    if (!req.hostName.trim()) {
      throw APIError.invalidArgument("Host name is required");
    }
    
    if (!req.password.trim()) {
      throw APIError.invalidArgument("Password is required");
    }

    const sessionId = crypto.randomUUID().substring(0, 8).toUpperCase();
    const publicLinkId = crypto.randomUUID();

    await chatDB.exec`
      INSERT INTO chat_sessions (id, host_name, password, public_link_id)
      VALUES (${sessionId}, ${req.hostName}, ${req.password}, ${publicLinkId})
    `;

    // Generate the public link URL - use a more reliable method to get the host
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' // Replace with your actual domain
      : 'http://localhost:3000';
    
    const publicLink = `${baseUrl}/join/${publicLinkId}`;

    return {
      sessionId,
      hostName: req.hostName,
      publicLink,
    };
  }
);
