import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";

interface SessionInfo {
  sessionId: string;
  hostName: string;
  username: string;
  userColor: string;
}

interface SessionSetupProps {
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

export function SessionSetup({ onConnect }: SessionSetupProps) {
  const [activeTab, setActiveTab] = useState("host");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  // Host form state
  const [hostName, setHostName] = useState("");
  const [hostPassword, setHostPassword] = useState("");
  const [hostUsername, setHostUsername] = useState("");
  const [hostColor, setHostColor] = useState("#00ff00");
  const [createdSession, setCreatedSession] = useState<{
    sessionId: string;
    hostName: string;
    publicLink: string;
  } | null>(null);

  // Join form state
  const [joinSessionId, setJoinSessionId] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [joinUsername, setJoinUsername] = useState("");
  const [joinColor, setJoinColor] = useState("#00ff00");

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      });
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const openPublicLink = () => {
    if (createdSession?.publicLink) {
      window.open(createdSession.publicLink, '_blank');
    }
  };

  const handleCreateSession = async () => {
    if (!hostName.trim() || !hostPassword.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await backend.chat.createSession({
        hostName: hostName.trim(),
        password: hostPassword.trim(),
      });

      setCreatedSession(response);
      toast({
        title: "Session created!",
        description: `Session ${response.sessionId} is ready`,
      });
    } catch (error) {
      console.error("Failed to create session:", error);
      toast({
        title: "Failed to create session",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinAsHost = async () => {
    if (!createdSession || !hostUsername.trim()) {
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
        sessionId: createdSession.sessionId,
        hostName: createdSession.hostName,
        username: hostUsername.trim(),
        userColor: hostColor,
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

  const handleJoinSession = async () => {
    if (!joinSessionId.trim() || !joinPassword.trim() || !joinUsername.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await backend.chat.joinSession({
        sessionId: joinSessionId.trim().toUpperCase(),
        password: joinPassword.trim(),
        username: joinUsername.trim(),
      });

      await onConnect({
        sessionId: response.sessionId,
        hostName: response.hostName,
        username: response.username,
        userColor: joinColor,
      });
    } catch (error) {
      console.error("Failed to join session:", error);
      toast({
        title: "Failed to join session",
        description: "Please check your session ID and password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-lg w-full space-y-6 bg-gray-900 border border-green-500 p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-cyan-400 mb-2 glitch-text">
            SESSION CONTROL
          </h2>
          <p className="text-green-400 text-sm">Create or join a secure chat session</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black border border-green-500">
            <TabsTrigger 
              value="host" 
              className="data-[state=active]:bg-green-900 data-[state=active]:text-green-400 text-green-600"
            >
              HOST SESSION
            </TabsTrigger>
            <TabsTrigger 
              value="join" 
              className="data-[state=active]:bg-green-900 data-[state=active]:text-green-400 text-green-600"
            >
              JOIN SESSION
            </TabsTrigger>
          </TabsList>

          <TabsContent value="host" className="space-y-4">
            {!createdSession ? (
              <>
                <div>
                  <Label htmlFor="hostName" className="text-green-400 text-sm font-mono">
                    HOST NAME:
                  </Label>
                  <Input
                    id="hostName"
                    type="text"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    placeholder="Enter host name..."
                    className="mt-1 bg-black border-green-500 text-green-400 font-mono placeholder:text-green-600 focus:border-cyan-400"
                  />
                </div>

                <div>
                  <Label htmlFor="hostPassword" className="text-green-400 text-sm font-mono">
                    SESSION PASSWORD:
                  </Label>
                  <Input
                    id="hostPassword"
                    type="password"
                    value={hostPassword}
                    onChange={(e) => setHostPassword(e.target.value)}
                    placeholder="Create a password..."
                    className="mt-1 bg-black border-green-500 text-green-400 font-mono placeholder:text-green-600 focus:border-cyan-400"
                  />
                </div>

                <Button
                  onClick={handleCreateSession}
                  disabled={!hostName.trim() || !hostPassword.trim() || isLoading}
                  className="w-full bg-green-900 border border-green-500 text-green-400 hover:bg-green-800 font-mono text-lg py-3 disabled:opacity-50"
                >
                  {isLoading ? "CREATING..." : "CREATE SESSION"}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-3 p-4 bg-black border border-cyan-500">
                  <h3 className="text-cyan-400 font-mono text-lg">SESSION CREATED</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 text-sm">SESSION ID:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-mono">{createdSession.sessionId}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(createdSession.sessionId, "Session ID")}
                          className="h-6 w-6 p-0 text-green-400 hover:text-cyan-400"
                        >
                          {copiedField === "Session ID" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 text-sm">PASSWORD:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-mono">{hostPassword}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(hostPassword, "Password")}
                          className="h-6 w-6 p-0 text-green-400 hover:text-cyan-400"
                        >
                          {copiedField === "Password" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-green-500">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-yellow-400 text-sm font-bold">PUBLIC LINK:</span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(createdSession.publicLink, "Public Link")}
                            className="h-6 w-6 p-0 text-yellow-400 hover:text-yellow-300"
                          >
                            {copiedField === "Public Link" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={openPublicLink}
                            className="h-6 w-6 p-0 text-yellow-400 hover:text-yellow-300"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-yellow-400 font-mono break-all bg-gray-800 p-2 border border-yellow-500">
                        {createdSession.publicLink}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-yellow-400 text-xs">
                    Share the public link for instant access, or share the session ID and password for manual entry
                  </p>
                </div>

                <div>
                  <Label htmlFor="hostUsername" className="text-green-400 text-sm font-mono">
                    YOUR USERNAME:
                  </Label>
                  <Input
                    id="hostUsername"
                    type="text"
                    value={hostUsername}
                    onChange={(e) => setHostUsername(e.target.value)}
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
                        onClick={() => setHostColor(color)}
                        className={`w-8 h-8 border-2 transition-all ${
                          hostColor === color ? "border-white scale-110" : "border-gray-600"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleJoinAsHost}
                  disabled={!hostUsername.trim() || isLoading}
                  className="w-full bg-green-900 border border-green-500 text-green-400 hover:bg-green-800 font-mono text-lg py-3 disabled:opacity-50"
                >
                  {isLoading ? "CONNECTING..." : "JOIN YOUR SESSION"}
                </Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="join" className="space-y-4">
            <div>
              <Label htmlFor="joinSessionId" className="text-green-400 text-sm font-mono">
                SESSION ID:
              </Label>
              <Input
                id="joinSessionId"
                type="text"
                value={joinSessionId}
                onChange={(e) => setJoinSessionId(e.target.value.toUpperCase())}
                placeholder="Enter session ID..."
                className="mt-1 bg-black border-green-500 text-green-400 font-mono placeholder:text-green-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <Label htmlFor="joinPassword" className="text-green-400 text-sm font-mono">
                PASSWORD:
              </Label>
              <Input
                id="joinPassword"
                type="password"
                value={joinPassword}
                onChange={(e) => setJoinPassword(e.target.value)}
                placeholder="Enter session password..."
                className="mt-1 bg-black border-green-500 text-green-400 font-mono placeholder:text-green-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <Label htmlFor="joinUsername" className="text-green-400 text-sm font-mono">
                USERNAME:
              </Label>
              <Input
                id="joinUsername"
                type="text"
                value={joinUsername}
                onChange={(e) => setJoinUsername(e.target.value)}
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
                    onClick={() => setJoinColor(color)}
                    className={`w-8 h-8 border-2 transition-all ${
                      joinColor === color ? "border-white scale-110" : "border-gray-600"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <Button
              onClick={handleJoinSession}
              disabled={!joinSessionId.trim() || !joinPassword.trim() || !joinUsername.trim() || isLoading}
              className="w-full bg-green-900 border border-green-500 text-green-400 hover:bg-green-800 font-mono text-lg py-3 disabled:opacity-50"
            >
              {isLoading ? "CONNECTING..." : "JOIN SESSION"}
            </Button>
          </TabsContent>
        </Tabs>

        <div className="text-center text-xs text-green-600 font-mono">
          <p>WARNING: UNAUTHORIZED ACCESS PROHIBITED</p>
          <p className="animate-pulse">NEURAL LINK ESTABLISHED</p>
        </div>
      </div>
    </div>
  );
}
