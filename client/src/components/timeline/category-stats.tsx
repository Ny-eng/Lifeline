import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Category, Event } from "@shared/schema";
import { TrendingDown, TrendingUp, ArrowRight, Activity, Calendar } from "lucide-react";

interface CategoryStatsProps {
  events: Event[];
  categories: Category[];
}

export function CategoryStats({ events, categories }: CategoryStatsProps) {
  // カテゴリー別の統計を計算
  const categoryStats = categories.map(category => {
    const categoryEvents = events.filter(event => event.categoryId === category.id);
    const averageScore = categoryEvents.length > 0
      ? Math.round(categoryEvents.reduce((sum, e) => sum + e.score, 0) / categoryEvents.length)
      : 0;

    // トレンドを計算（最近のイベントのスコア平均と以前のイベントのスコア平均を比較）
    const sortedEvents = [...categoryEvents].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const midPoint = Math.floor(sortedEvents.length / 2);
    const recentEvents = sortedEvents.slice(0, midPoint);
    const olderEvents = sortedEvents.slice(midPoint);

    const recentAvg = recentEvents.length > 0
      ? Math.round(recentEvents.reduce((sum, e) => sum + e.score, 0) / recentEvents.length)
      : 0;
    const olderAvg = olderEvents.length > 0
      ? Math.round(olderEvents.reduce((sum, e) => sum + e.score, 0) / olderEvents.length)
      : 0;

    const trend = recentAvg > olderAvg ? "上昇" : recentAvg < olderAvg ? "下降" : "安定";

    return {
      ...category,
      eventCount: categoryEvents.length,
      averageScore,
      trend,
      recentAvg,
      olderAvg
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Statistics</CardTitle>
        <CardDescription>Average scores and trends by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryStats.map(stat => (
            <div
              key={stat.id}
              className="p-3 rounded-lg"
              style={{ backgroundColor: stat.color + "10" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stat.color }}
                  />
                  <span className="font-medium" style={{ color: stat.color }}>
                    {stat.name}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  <Activity className="h-4 w-4 inline mr-1" />
                  {stat.eventCount} events
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm">
                  Average Score: <span className="font-medium">{stat.averageScore}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span>{stat.trend === "上昇" ? <TrendingUp className="h-4 w-4 text-green-500" /> : 
                         stat.trend === "下降" ? <TrendingDown className="h-4 w-4 text-red-500" /> : 
                         <ArrowRight className="h-4 w-4 text-yellow-500" />}</span>
                  <span className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">
                      {stat.olderAvg} → {stat.recentAvg}
                    </span>
                    <span>{stat.trend}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}