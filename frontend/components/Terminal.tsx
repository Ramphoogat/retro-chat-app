import { useState, useEffect } from "react";

export function Terminal() {
  const [bootText, setBootText] = useState("");
  const bootSequence = [
    "INITIALIZING NEURAL NETWORK...",
    "LOADING QUANTUM ENCRYPTION...",
    "ESTABLISHING SECURE CONNECTION...",
    "CHAT PROTOCOL ACTIVATED",
  ];

  useEffect(() => {
    let currentIndex = 0;
    let currentText = "";
    
    const typeText = () => {
      if (currentIndex < bootSequence.length) {
        const targetText = bootSequence[currentIndex];
        if (currentText.length < targetText.length) {
          currentText += targetText[currentText.length];
          setBootText(currentText);
          setTimeout(typeText, 50);
        } else {
          currentIndex++;
          currentText += "\n";
          setTimeout(typeText, 500);
        }
      }
    };

    typeText();
  }, []);

  return (
    <div className="bg-black border-b border-green-500 p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-100"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-200"></div>
        <span className="ml-4 text-cyan-400 text-sm">RETRO_CHAT_SYSTEM_v1.0</span>
      </div>
      <pre className="text-xs text-green-400 whitespace-pre-wrap min-h-[60px]">
        {bootText}
      </pre>
    </div>
  );
}
