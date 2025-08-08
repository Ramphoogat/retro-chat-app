import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserSetupProps {
  username: string;
  setUsername: (username: string) => void;
  userColor: string;
  setUserColor: (color: string) => void;
  onConnect: () => void;
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

export function UserSetup({ username, setUsername, userColor, setUserColor, onConnect }: UserSetupProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!username.trim()) return;
    setIsConnecting(true);
    await onConnect();
    setIsConnecting(false);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6 bg-gray-900 border border-green-500 p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-cyan-400 mb-2 glitch-text">
            ACCESS TERMINAL
          </h2>
          <p className="text-green-400 text-sm">Enter credentials to join the network</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-green-400 text-sm font-mono">
              USERNAME:
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your handle..."
              className="mt-1 bg-black border-green-500 text-green-400 font-mono placeholder:text-green-600 focus:border-cyan-400"
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            />
          </div>

          <div>
            <Label className="text-green-400 text-sm font-mono">
              USER COLOR:
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
            onClick={handleConnect}
            disabled={!username.trim() || isConnecting}
            className="w-full bg-green-900 border border-green-500 text-green-400 hover:bg-green-800 font-mono text-lg py-3 disabled:opacity-50"
          >
            {isConnecting ? "CONNECTING..." : "JACK IN"}
          </Button>
        </div>

        <div className="text-center text-xs text-green-600 font-mono">
          <p>WARNING: UNAUTHORIZED ACCESS PROHIBITED</p>
          <p className="animate-pulse">NEURAL LINK ESTABLISHED</p>
        </div>
      </div>
    </div>
  );
}
