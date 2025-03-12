import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export function ScoreGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <HelpCircle className="h-4 w-4 mr-2" />
          Score Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Understanding Event Scores</DialogTitle>
          <DialogDescription>
            Scores help you track the impact and importance of life events
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Score Ranges</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤩</span>
                <div>
                  <div className="font-medium" style={{ color: 'hsl(142, 76%, 36%)' }}>90-100: Excellent</div>
                  <p className="text-muted-foreground">Major positive life events and achievements</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">😊</span>
                <div>
                  <div className="font-medium" style={{ color: 'hsl(221, 83%, 53%)' }}>70-89: Good</div>
                  <p className="text-muted-foreground">Positive experiences and minor achievements</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🙂</span>
                <div>
                  <div className="font-medium" style={{ color: 'hsl(41, 96%, 50%)' }}>50-69: Normal</div>
                  <p className="text-muted-foreground">Regular daily events and experiences</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">😐</span>
                <div>
                  <div className="font-medium" style={{ color: 'hsl(32, 95%, 44%)' }}>30-49: Fair</div>
                  <p className="text-muted-foreground">Minor challenges or setbacks</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">😢</span>
                <div>
                  <div className="font-medium" style={{ color: 'hsl(0, 84%, 60%)' }}>0-29: Low</div>
                  <p className="text-muted-foreground">Major challenges or difficult events</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Tips for Scoring</h4>
            <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
              <li>Consider both the immediate and long-term impact of the event</li>
              <li>Be consistent in how you score similar types of events</li>
              <li>Use the full range of scores to better track your life's ups and downs</li>
              <li>Don't hesitate to update scores as your perspective changes</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
