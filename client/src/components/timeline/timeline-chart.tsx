import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { Event, Category } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface TimelineChartProps {
  events: Event[];
  categories: Category[];
  onEventUpdate: (event: Event) => void;
  onEventClick?: (event: Event) => void;
}

export function TimelineChart({ events, categories, onEventUpdate, onEventClick }: TimelineChartProps) {
  const { t } = useLanguage();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || events.length === 0) return;

    const container = containerRef.current;

    // Clear existing SVG and tooltips
    d3.select(svgRef.current).selectAll("*").remove();
    d3.select(container).selectAll(".tooltip").remove();

    // Calculate responsive dimensions
    const margin = { top: 20, right: 30, bottom: 80, left: 50 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Sort events by date
    const sortedEvents = [...events].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Add padding to date range
    const dateRange = d3.extent(sortedEvents, (d: Event) => new Date(d.date)) as [Date, Date];
    const startDate = new Date(dateRange[0]);
    const endDate = new Date(dateRange[1]);
    startDate.setMonth(startDate.getMonth() - 1);
    endDate.setMonth(endDate.getMonth() + 1);

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain([startDate, endDate])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // Create line generator
    const line = d3
      .line<Event>()
      .x((d: Event) => xScale(new Date(d.date)))
      .y((d: Event) => yScale(d.score))
      .curve(d3.curveMonotoneX);

    // Draw the main line
    svg
      .append("path")
      .datum(sortedEvents)
      .attr("fill", "none")
      .attr("stroke", "hsl(var(--muted-foreground))")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Create hover tooltip
    const tooltip = d3.select(container)
      .append("div")
      .attr("class", "tooltip absolute hidden bg-popover text-popover-foreground p-2 rounded-lg shadow-lg text-sm")
      .style("pointer-events", "none")
      .style("z-index", "60");

    let tooltipTimeout: number;

    // Draw points
    svg
      .selectAll(".point")
      .data(sortedEvents)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (d: Event) => xScale(new Date(d.date)))
      .attr("cy", (d: Event) => yScale(d.score))
      .attr("r", 6)
      .attr("fill", (d: Event) => {
        const scoreStatus = getScoreStatus(d.score);
        return scoreStatus.color;
      })
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .style("touch-action", "none")
      .style("z-index", "45")
      .on("mouseover", (event: MouseEvent, d: Event) => {
        if (tooltipTimeout) {
          window.clearTimeout(tooltipTimeout);
        }
        const category = categories.find(c => c.id === d.categoryId);
        const scoreStatus = getScoreStatus(d.score);
        tooltip
          .html(`
            <div class="space-y-1">
              <div class="text-2xl">${getScoreEmoji(d.score)}</div>
              <div style="color: ${scoreStatus.color}" class="font-bold">${d.score}</div>
              <div class="text-xs text-muted-foreground">
                ${new Date(d.date).toLocaleDateString()}
              </div>
              <div class="font-medium">${d.title}</div>
              ${category ? `<div class="text-xs" style="color: ${category.color}">${t(category.name)}</div>` : ''}
            </div>
          `)
          .style("left", `${(event as any).offsetX + 10}px`)
          .style("top", `${(event as any).offsetY - 10}px`)
          .classed("hidden", false);
      })
      .on("mouseout", () => {
        tooltipTimeout = window.setTimeout(() => {
          tooltip.classed("hidden", true);
        }, 100);
      })
      .on("click", (event: MouseEvent, d: Event) => {
        if (onEventClick) {
          onEventClick(d);
        }
      });

    // Add score labels
    svg.selectAll(".score-label")
      .data(sortedEvents)
      .enter()
      .append("g")
      .attr("class", "score-label")
      .each(function (d: Event) {
        const x = xScale(new Date(d.date));
        const y = yScale(d.score) - 10;
        const scoreStatus = getScoreStatus(d.score);

        // Add white outline text
        const label = d3.select(this);
        label.append("text")
          .attr("x", x)
          .attr("y", y)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("fill", "white")
          .attr("stroke", "white")
          .attr("stroke-width", 3)
          .attr("paint-order", "stroke")
          .text(d.score);

        label.append("text")
          .attr("x", x)
          .attr("y", y)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("fill", scoreStatus.color)
          .text(d.score);
      });

    // Add axes with adjusted settings for better mobile display
    const xAxis = d3.axisBottom(xScale)
      .ticks(width > 600 ? 10 : 5)
      .tickFormat(d3.timeFormat("%Y/%m/%d") as any);

    const yAxis = d3.axisLeft(yScale)
      .ticks(10);

    // Add x-axis with adjusted label positioning
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    // Add y-axis
    svg.append("g").call(yAxis);

    // Add grid lines
    svg.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat(() => "")
      );

  }, [events, categories, onEventUpdate, onEventClick, t]);

  return (
    <AspectRatio ratio={16 / 9} className="w-full bg-card">
      <div className="w-full h-full relative" ref={containerRef}>
        <svg
          ref={svgRef}
          className="w-full h-full"
        />
        <style>{`
          .tooltip {
            z-index: 60;
          }
          .point {
            z-index: 45;
          }
        `}</style>
      </div>
    </AspectRatio>
  );
}

function getScoreStatus(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Excellent', color: 'hsl(142, 76%, 36%)' };
  if (score >= 70) return { label: 'Good', color: 'hsl(221, 83%, 53%)' };
  if (score >= 50) return { label: 'Normal', color: 'hsl(41, 96%, 50%)' };
  if (score >= 30) return { label: 'Fair', color: 'hsl(32, 95%, 44%)' };
  return { label: 'Low', color: 'hsl(0, 84%, 60%)' };
}

function getScoreEmoji(score: number): string {
  if (score >= 90) return "🤩";
  if (score >= 70) return "😊";
  if (score >= 50) return "🙂";
  if (score >= 30) return "😐";
  if (score >= 10) return "😕";
  return "😢";
}