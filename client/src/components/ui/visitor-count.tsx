import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Users } from "lucide-react";

export function VisitorCount() {
  const [count, setCount] = useState<number>(0);
  const { t } = useLanguage();

  useEffect(() => {
    const incrementCount = async () => {
      try {
        const response = await fetch('/api/visitors/increment', {
          method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to increment visitor count');
        const data = await response.json();
        setCount(data.count);
      } catch (err) {
        console.error("Error incrementing visitor count:", err);
      }
    };

    incrementCount();
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground animate-fade-in">
      <Users className="h-4 w-4" />
      <span>{count.toLocaleString()}</span>
    </div>
  );
}