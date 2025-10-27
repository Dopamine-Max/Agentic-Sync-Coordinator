import { RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onRefresh: () => void;
}

export const ChatHeader = ({ onRefresh }: ChatHeaderProps) => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 glow-purple">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">AgentSync</h1>
            <p className="text-sm text-muted-foreground">Your smart sync-up assistant</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          className="bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 hover:glow-purple"
        >
          <RefreshCw className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};
