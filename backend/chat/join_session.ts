import { api, APIError } from "encore.dev/api";
import { chatDB } from "./db";

export interface JoinSessionRequest {
  sessionId: string;
  password: string;
  username: string;
}

export interface JoinSessionResponse {
  sessionId: string;
  hostName: string;
  username: string;
}

// Joins an existing chat session with the correct password.
export const joinSession = api<JoinSessionRequest, JoinSessionResponse>(
  { expose: true, method: "POST", path: "/chat/sessions/join" },
  async (req) => {
    if (!req.sessionId.trim()) {
      throw APIError.invalidArgument("Session ID is required");
    }
    
    if (!req.password.trim()) {
      throw APIError.invalidArgument("Password is required");
    }
    
    if (!req.username.trim()) {
      throw APIError.invalidArgument("Username is required");
    }

    const session = await chatDB.queryRow<{
      id: string;
      host_name: string;
      password: string;
      is_active: boolean;
    }>`
      SELECT id, host_name, password, is_active
      FROM chat_sessions
      WHERE id = ${req.sessionId.toUpperCase()}
    `;

    if (!session) {
      throw APIError.notFound("Session not found");
    }

    if (!session.is_active) {
      throw APIError.failedPrecondition("Session is no longer active");
    }

    if (session.password !== req.password) {
      throw APIError.permissionDenied("Invalid password");
    }

    return {
      sessionId: session.id,
      hostName: session.host_name,
      username: req.username,
    };
  }
);
