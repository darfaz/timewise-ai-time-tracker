import { Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useConfig } from "@/contexts/ConfigContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const ConnectionStatus = () => {
  const { isConnected, API_BASE_URL } = useConfig();

  if (API_BASE_URL.includes('localhost')) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="gap-1.5">
              <WifiOff className="h-3 w-3" />
              Mock Mode
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Using mock data - configure backend URL in settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={isConnected ? "default" : "destructive"} 
            className="gap-1.5"
          >
            {isConnected ? (
              <>
                <Wifi className="h-3 w-3" />
                Connected
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                Disconnected
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isConnected ? 'Backend connected' : 'Unable to connect to backend'}</p>
          <p className="text-xs text-muted-foreground">{API_BASE_URL}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
