import { useState, useRef, useEffect } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "@/components/ChatMessage";
import { MessageInput } from "@/components/MessageInput";
import { useToast } from "@/hooks/use-toast";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { sendQuery, resetConversation, getMessages } from "@/lib/api";
import type { FunctionCall } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
  functionCalls?: FunctionCall[];
}

const Chat = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMessages, setIsFetchingMessages] = useState(true);

  // ✅ Use isListening from the hook (remove isRecording state)
  const { isListening, toggleListening } = useVoiceRecognition({
    onTranscript: (transcript) => {
      // Automatically send the transcribed message
      handleSendMessage(transcript);
    },
    continuous: false,
  });

  // Fetch messages from backend on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await getMessages();
        
        if (response.messages.length > 0) {
          setMessages(response.messages);
        } else {
          // No messages in backend, show default greeting
          setMessages([
            {
              role: "assistant",
              content: "Hello! I'm your AI assistant. How can I help you today?",
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
        toast({
          title: "Error",
          description: "Failed to load conversation history",
          variant: "destructive",
        });
        // Fallback to default greeting
        setMessages([
          {
            role: "assistant",
            content: "Hello! I'm your AI assistant. How can I help you today?",
          },
        ]);
      } finally {
        setIsFetchingMessages(false);
      }
    };

    loadMessages();
  }, [toast]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (!isFetchingMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isFetchingMessages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content }]);
    setIsLoading(true);

    try {
      const response = await sendQuery(content);
      
      // Add assistant response with function calls
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.response_text,
          functionCalls: response.function_calls,
        },
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      console.error("Query error:", error);
      
      // Remove the optimistic user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await resetConversation();
      
      // Reset to default greeting
      setMessages([
        {
          role: "assistant",
          content: "Chat restarted. How can I help you today?",
        },
      ]);
      
      toast({
        title: "Chat Restarted",
        description: "Your conversation has been reset",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset conversation. Please try again.",
        variant: "destructive",
      });
      console.error("Reset error:", error);
    }
  };

  if (isFetchingMessages) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <ChatHeader onRefresh={handleRefresh} />
      
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {messages.map((message, index) => (
            <ChatMessage 
              key={index} 
              role={message.role} 
              content={message.content}
              functionCalls={message.functionCalls}
            />
          ))}
          {isLoading && (
            <div className="flex gap-3 mb-6 animate-fade-in">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-card border border-border">
                <p className="text-sm text-muted-foreground">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <MessageInput
        onSendMessage={handleSendMessage}
        onVoiceInput={toggleListening}
        isRecording={isListening}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Chat;
