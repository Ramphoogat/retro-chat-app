import { api, APIError } from "encore.dev/api";
import { chatDB } from "./db";

export interface CreateSessionRequest {
  hostName: string;
  password: string;
}

export interface CreateSessionResponse {
  sessionId: string;
  hostName: string;
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

    await chatDB.exec`
      INSERT INTO chat_sessions (id, host_name, password)
      VALUES (${sessionId}, ${req.hostName}, ${req.password})
    `;

    return {
      sessionId,
      hostName: req.hostName,
    };
  }
);
