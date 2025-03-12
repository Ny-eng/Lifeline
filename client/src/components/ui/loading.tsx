import { Loader2 } from "lucide-react";

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

export function Loading({ fullScreen = false, message }: LoadingProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 bg-shimmer-gradient animate-shimmer rounded-full"></div>
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
          </div>
          {message && (
            <p className="text-muted-foreground animate-pulse-soft">{message}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-shimmer-gradient animate-shimmer rounded-full"></div>
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
      {message && (
        <p className="ml-3 text-sm text-muted-foreground animate-pulse-soft">
          {message}
        </p>
      )}
    </div>
  );
}
