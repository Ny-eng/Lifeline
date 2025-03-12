import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loading } from "./loading";

interface TransitionWrapperProps {
  children: ReactNode;
}

export function TransitionWrapper({ children }: TransitionWrapperProps) {
  const [location] = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [content, setContent] = useState(children);

  useEffect(() => {
    const handleTransition = async () => {
      setIsTransitioning(true);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Wait for exit animation
      setContent(children);
      setIsTransitioning(false);
    };

    handleTransition();
  }, [location, children]);

  if (isTransitioning) {
    return <Loading fullScreen message="思い出を呼び出しています..." />;
  }

  return (
    <div className={`animate-memory-lane`}>
      {content}
    </div>
  );
}
