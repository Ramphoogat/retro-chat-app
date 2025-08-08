import { api, APIError } from "encore.dev/api";
import { chatDB } from "./db";

export interface GetSessionByLinkRequest {
  linkId: string;
}

export interface GetSessionByLinkResponse {
  sessionId: string;
  hostName: string;
}

// Gets session information by public link ID.
export const getSessionByLink = api<GetSessionByLinkRequest, GetSessionByLinkResponse>(
  { expose: true, method: "GET", path: "/chat/sessions/link/:linkId" },
  async (req) => {
    if (!req.linkId.trim()) {
      throw APIError.invalidArgument("Link ID is required");
    }

    const session = await chatDB.queryRow<{
      id: string;
      host_name: string;
      is_active: boolean;
    }>`
      SELECT id, host_name, is_active
      FROM chat_sessions
      WHERE public_link_id = ${req.linkId}
    `;

    if (!session) {
      throw APIError.notFound("Session not found");
    }

    if (!session.is_active) {
      throw APIError.failedPrecondition("Session is no longer active");
    }

    return {
      sessionId: session.id,
      hostName: session.host_name,
    };
  }
);
