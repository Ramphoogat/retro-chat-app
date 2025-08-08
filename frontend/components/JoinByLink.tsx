import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import backend from "~backend/client";

interface SessionInfo {
  sessionId: string;
  hostName: string;
  username: string;
  userColor: string;
}

interface JoinByLinkProps {
  linkId: string;
  onConnect: (session: SessionInfo) => Promise<void>;
}

const retroColors = [
  "#00ff00", // Green
  "#ff00ff", // Magenta
  "#00ffff", // Cyan
  "#ffff00", // Yellow
  "#ff8000", // Orange
  "#8000ff", // Purple
  "#ff0080", // Pink
  "#80ff00", // Lime
];

export function JoinByLink({ linkId, onConnect }: JoinByLinkProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionData, setSessionData] = useState<{
    sessionId: string;
    hostName: string;
  } | null>(null);
  const [username, setUsername] = useState("");
  const [userColor, setUserColor] = useState("#00ff00");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setIsLoading(true);
        const response = await backend.chat.getSessionByLink({ linkId });
        setSessionData(response);
      } catch (error) {
        console.error("Failed to fetch session data:", error);
        setError("Invalid or expired link");
        toast({
          title: "Invalid Link",
          description: "This session link is invalid or has expired",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, [linkId, toast]);

  const handleJoin = async () => {
    if (!username.trim() || !sessionData) {
      toast({
        title: "Missing information",
        description: "Please enter your username",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onConnect({
        sessionId: sessionData.sessionId,
        hostName: sessionData.hostName,
        username: username.trim(),
        userColor,
      });
    } catch (error) {
      console.error("Failed to join session:", error);
      toast({
        title: "Failed to join session",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-lg w-full space-y-6 bg-gray-900 border border-red-500 p-8 shadow-2xl text-center">
          <h2 className="text-3xl font-bold text-red-400 mb-2">
            ACCESS DENIED
          </h2>
          <p className="text-red-400 text-sm mb-4">
            The session link is invalid or has expired
          </p>
          <Link to="/">
            <Button className="bg-green-900 border border-green-500 text-green-400 hover:bg-green-800 font-mono">
              RETURN TO MAIN TERMINAL
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading && !sessionData) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-lg w-full space-y-6 bg-gray-900 border border-green-500 p-8 shadow-2xl text-center">
          <h2 className="text-3xl font-bold text-cyan-400 mb-2 glitch-text">
            VERIFYING ACCESS
          </h2>
          <p className="text-green-400 text-sm animate-pulse">
            Authenticating session link...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-lg w-full space-y-6 bg-gray-900 border border-green-500 p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-cyan-400 mb-2 glitch-text">
            JOIN SESSION
          </h2>
          <p className="text-green-400 text-sm">You've been invited to join a chat session</p>
        </div>

        {sessionData && (
          <div className="space-y-4 p-4 bg-black border border-cyan-500">
            <h3 className="text-cyan-400 font-mono text-lg">SESSION INFO</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-green-400 text-sm">SESSION ID:</span>
                <span className="text-cyan-400 font-mono">{sessionData.sessionId}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-green-400 text-sm">HOST:</span>
                <span className="text-yellow-400 font-mono">{sessionData.hostName}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="username" className="text-green-400 text-sm font-mono">
            YOUR USERNAME:
          </Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username..."
            className="mt-1 bg-black border-green-500 text-green-400 font-mono placeholder:text-green-600 focus:border-cyan-400"
          />
        </div>

        <div>
          <Label className="text-green-400 text-sm font-mono">
            YOUR COLOR:
          </Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {retroColors.map((color) => (
              <button
                key={color}
                onClick={() => setUserColor(color)}
                className={`w-8 h-8 border-2 transition-all ${
                  userColor === color ? "border-white scale-110" : "border-gray-600"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <Button
          onClick={handleJoin}
          disabled={!username.trim() || isLoading || !sessionData}
          className="w-full bg-green-900 border border-green-500 text-green-400 hover:bg-green-800 font-mono text-lg py-3 disabled:opacity-50"
        >
          {isLoading ? "CONNECTING..." : "JOIN SESSION"}
        </Button>

        <div className="text-center">
          <Link to="/" className="text-cyan-400 hover:text-cyan-300 text-sm font-mono underline">
            Create your own session instead
          </Link>
        </div>

        <div className="text-center text-xs text-green-600 font-mono">
          <p>WARNING: UNAUTHORIZED ACCESS PROHIBITED</p>
          <p className="animate-pulse">NEURAL LINK ESTABLISHED</p>
        </div>
      </div>
    </div>
  );
}
