import { useState } from "react";
import { Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onVoiceInput: () => void;
  isRecording: boolean;
  isLoading: boolean;
}

export const MessageInput = ({
  onSendMessage,
  onVoiceInput,
  isRecording,
  isLoading,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-xl sticky bottom-0">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex gap-2 items-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={onVoiceInput}
            disabled={isLoading}
            className={cn(
              "flex-shrink-0 w-12 h-12 rounded-xl transition-all duration-300",
              isRecording
                ? "bg-destructive text-destructive-foreground animate-pulse-glow glow-purple"
                : "bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/30 hover:glow-purple"
            )}
          >
            <Mic className="w-5 h-5" />
          </Button>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Waiting for response..." : "Type your message..."}
            disabled={isLoading}
            className="resize-none min-h-[60px] max-h-[200px]"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            size="icon"
            className="flex-shrink-0 w-12 h-12 rounded-xl"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
};
