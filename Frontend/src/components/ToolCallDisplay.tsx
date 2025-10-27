import { useState } from "react";
import { ChevronDown, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FunctionCall } from "@/lib/api";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface ToolCallDisplayProps {
  functionCalls: FunctionCall[];
}

export const ToolCallDisplay = ({ functionCalls }: ToolCallDisplayProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!functionCalls || functionCalls.length === 0) {
    return null;
  }

  return (
    <div className="mt-3">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-colors">
            <Wrench className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">
              {functionCalls.length} tool{functionCalls.length > 1 ? "s" : ""} used
            </span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-2 space-y-2">
          {functionCalls.map((call, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-muted/50 border border-border/50 space-y-2"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {call.function_name}
                </Badge>
              </div>
              
              {Object.keys(call.parameters).length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Parameters:</p>
                  <div className="bg-background/50 rounded p-2 font-mono text-xs space-y-1">
                    {Object.entries(call.parameters).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <span className="text-primary font-semibold">{key}:</span>
                        <span className="text-foreground break-all">
                          {typeof value === 'object' 
                            ? JSON.stringify(value, null, 2) 
                            : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};