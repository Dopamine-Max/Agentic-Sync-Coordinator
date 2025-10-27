import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolCallDisplay } from "@/components/ToolCallDisplay";
import type { FunctionCall } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  functionCalls?: FunctionCall[];
}

export const ChatMessage = ({ role, content, functionCalls }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 mb-6 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center glow-purple">
          <Bot className="w-5 h-5 text-primary" />
        </div>
      )}
      <div className="max-w-[80%]">
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-lg",
            isUser
              ? "bg-primary text-primary-foreground gradient-primary"
              : "bg-card border border-border"
          )}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Style headings
                  h1: ({ ...props }) => <h1 className="text-lg font-bold mt-4 mb-2" {...props} />,
                  h2: ({ ...props }) => <h2 className="text-base font-bold mt-3 mb-2" {...props} />,
                  h3: ({ ...props }) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,
                  
                  // Style lists
                  ul: ({ ...props }) => <ul className="list-disc list-inside my-2 space-y-1" {...props} />,
                  ol: ({ ...props }) => <ol className="list-decimal list-inside my-2 space-y-1" {...props} />,
                  li: ({ ...props }) => <li className="ml-2" {...props} />,
                  
                  // Style code blocks - handle inline detection differently
                  code: ({ className, children, ...props }) => {
                    const isInline = !className?.includes('language-');
                    return isInline ? (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-muted p-3 rounded-lg text-xs font-mono overflow-x-auto my-2" {...props}>
                        {children}
                      </code>
                    );
                  },
                  
                  // Style links
                  a: ({ ...props }) => (
                    <a className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer" {...props} />
                  ),
                  
                  // Style blockquotes
                  blockquote: ({ ...props }) => (
                    <blockquote className="border-l-4 border-primary/20 pl-4 italic my-2" {...props} />
                  ),
                  
                  // Style tables
                  table: ({ ...props }) => (
                    <div className="overflow-x-auto my-2">
                      <table className="min-w-full border-collapse" {...props} />
                    </div>
                  ),
                  th: ({ ...props }) => (
                    <th className="border border-border px-3 py-2 bg-muted font-semibold text-left" {...props} />
                  ),
                  td: ({ ...props }) => (
                    <td className="border border-border px-3 py-2" {...props} />
                  ),
                  
                  // Style paragraphs
                  p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        
        {!isUser && functionCalls && functionCalls.length > 0 && (
          <ToolCallDisplay functionCalls={functionCalls} />
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center glow-purple">
          <User className="w-5 h-5 text-primary" />
        </div>
      )}
    </div>
  );
};
