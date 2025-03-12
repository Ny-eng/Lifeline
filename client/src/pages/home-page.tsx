import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Category, Event } from "@shared/schema";
import { TimelineChart } from "@/components/timeline/timeline-chart";
import { EventForm } from "@/components/timeline/event-form";
import { CategoryManager } from "@/components/timeline/category-manager";
import {
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  ListPlus,
  LineChart,
  Filter,
  RefreshCw,
  Calendar,
  MoreVertical,
  Copy
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { getStoredEvents, getStoredCategories, saveEvents, saveCategories, generateId } from "@/lib/local-storage";
import { useLanguage } from "@/hooks/use-language";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// getScoreStatus and getScoreEmoji functions remain unchanged

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

function formatEventsToText(events: Event[], categories: Category[], language: string): string {
  const sortedEvents = [...events].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return sortedEvents.map(event => {
    const category = categories.find(c => c.id === event.categoryId);
    const scoreStatus = getScoreStatus(event.score);
    const date = new Date(event.date).toLocaleDateString(
      language === 'ja' ? 'ja-JP' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );

    const lines = [
      `📅 ${date}`,
      `${getScoreEmoji(event.score)} ${event.title} (Score: ${event.score} - ${scoreStatus.label})`,
      category ? `🏷️ ${category.name}` : null,
      event.description ? `📝 ${event.description}` : null,
      '---'
    ].filter(Boolean);

    return lines.join('\n');
  }).join('\n\n');
}

export default function HomePage() {
  const { toast } = useToast();
  const [addEventDialogOpen, setAddEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [showAllDetails, setShowAllDetails] = useState(false);
  const { t, toggleLanguage, language } = useLanguage();

  // Load data from local storage on mount
  useEffect(() => {
    setEvents(getStoredEvents());
    setCategories(getStoredCategories());
  }, []);

  const sortedEvents = useMemo(() => {
    const filtered = events.filter(event =>
      selectedCategory === "all" || event.categoryId === selectedCategory
    );

    return [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "highest":
          return b.score - a.score;
        case "lowest":
          return a.score - b.score;
        default:
          return 0;
      }
    });
  }, [events, selectedCategory, sortOrder]);


  const handleCreateEvent = (data: Omit<Event, 'id'>) => {
    const newEvent = { ...data, id: generateId() };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    setAddEventDialogOpen(false);
    toast({
      title: "Success",
      description: "Event added successfully",
    });
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    const updatedEvents = events.map(event =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    setEditingEvent(null);
    toast({
      title: "Success",
      description: "Event updated successfully",
    });
  };

  const handleDeleteEvent = (id: number) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    toast({
      title: "Success",
      description: "Event deleted successfully",
    });
  };

  const handleCreateCategory = (data: { name: string; color: string }) => {
    const newCategory = { ...data, id: generateId() };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    toast({
      title: "Success",
      description: "Category created successfully",
    });
  };

  const handleUpdateCategory = (category: Category) => {
    const updatedCategories = categories.map(c =>
      c.id === category.id ? category : c
    );
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    toast({
      title: "Success",
      description: "Category updated successfully",
    });
  };

  const handleDeleteCategory = (id: number) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    toast({
      title: "Success",
      description: "Category deleted successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors">
                Lifeline
              </h1>
            </Link>
            <Tabs
              value={language}
              onValueChange={(value) => value !== language && toggleLanguage()}
              className="ml-2"
            >
              <TabsList>
                <TabsTrigger value="en">EN</TabsTrigger>
                <TabsTrigger value="ja">JP</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Collapsible className="mt-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 w-full justify-start p-2 hover:bg-accent rounded-lg">
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium">{t("Getting Started Guide")}</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg mt-2">
                <div className="bg-card p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <ListPlus className="h-5 w-5" />
                    <span className="font-medium">{t("1. Create Categories")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t("Create color-coded categories for your events")}</p>
                </div>
                <div className="bg-card p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Plus className="h-5 w-5" />
                    <span className="font-medium">{t("2. Add Events")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t("Add life events with dates and scores")}</p>
                </div>
                <div className="bg-card p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <LineChart className="h-5 w-5" />
                    <span className="font-medium">{t("3. View Timeline")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t("Visualize your journey on the interactive chart")}</p>
                </div>
                <div className="bg-card p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Filter className="h-5 w-5" />
                    <span className="font-medium">{t("4. Filter View")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t("Filter events by category")}</p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-4 sm:p-6" id="timeline-section">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-lg font-semibold">{t("Timeline Chart")}</h2>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <Select
                    value={selectedCategory === "all" ? "all" : selectedCategory.toString()}
                    onValueChange={(value) =>
                      setSelectedCategory(value === "all" ? "all" : parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder={t("Category")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Categories")}</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    <Dialog open={addEventDialogOpen} onOpenChange={setAddEventDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                          <Plus className="h-4 w-4 mr-2" />
                          {t("Add Event")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>{t("Add New Event")}</DialogTitle>
                        </DialogHeader>
                        {categories.length === 0 ? (
                          <div className="text-center py-4 text-muted-foreground">
                            {t("No categories found. Please create a category first.")}
                          </div>
                        ) : (
                          <EventForm
                            categories={categories}
                            onSubmit={handleCreateEvent}
                          />
                        )}
                      </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setEvents(getStoredEvents());
                          setCategories(getStoredCategories());
                          toast({
                            title: "Success",
                            description: "Chart data refreshed",
                          });
                        }}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          {t("Refresh")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setEvents([]);
                            saveEvents([]);
                            toast({
                              title: t("Success"),
                              description: t("All events have been deleted"),
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t("Delete All")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                  <Calendar className="h-8 w-8 mb-4" />
                  <p>{t("No events found")}</p>
                  <p className="text-sm">{t("Add your first event to start tracking your life journey")}</p>
                </div>
              ) : (
                <TimelineChart
                  events={sortedEvents}
                  categories={categories}
                  onEventUpdate={handleUpdateEvent}
                  onEventClick={(event) => setEditingEvent(event)}
                />
              )}
            </Card>

            <Card className="p-4 sm:p-6" id="events-section">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{t("Event History")}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={() => setShowAllDetails(!showAllDetails)}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showAllDetails ? 'rotate-180' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => {
                      const formattedText = formatEventsToText(sortedEvents, categories, language);
                      navigator.clipboard.writeText(formattedText);
                      toast({
                        title: t("Success"),
                        description: t("Event history copied to clipboard"),
                      });
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {t("Copy Timeline")}
                  </Button>
                </div>
                <Select
                  value={sortOrder}
                  onValueChange={setSortOrder}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={t("Sort by...")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t("Newest First")}</SelectItem>
                    <SelectItem value="oldest">{t("Oldest First")}</SelectItem>
                    <SelectItem value="highest">{t("Highest Score")}</SelectItem>
                    <SelectItem value="lowest">{t("Lowest Score")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {events.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  {t("No events found")}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedEvents.map((event) => {
                    const category = categories.find((c) => c.id === event.categoryId);
                    const scoreStatus = getScoreStatus(event.score);
                    return (
                      <div key={event.id} className="event-card">
                        <Collapsible open={showAllDetails}>
                          <CollapsibleTrigger asChild>
                            <div className="space-y-2 cursor-pointer">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1">
                                  <span className="text-2xl leading-none">{getScoreEmoji(event.score)}</span>
                                  <span className="text-xl font-semibold" style={{ color: scoreStatus.color }}>
                                    {event.score}
                                  </span>
                                  <span
                                    className="text-xs px-1.5 py-0.5 rounded-full hidden sm:inline-block"
                                    style={{
                                      backgroundColor: scoreStatus.color + "20",
                                      color: scoreStatus.color
                                    }}
                                  >
                                    {scoreStatus.label}
                                  </span>
                                  <span
                                    className="text-xs px-1.5 py-0.5 sm:hidden"
                                    style={{
                                      color: scoreStatus.color
                                    }}
                                  >
                                    {scoreStatus.label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingEvent(event)}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>{t("Delete Event")}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          {t("This action cannot be undone. This event will be permanently deleted.")}
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteEvent(event.id)}
                                        >
                                          {t("Delete")}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowAllDetails(!showAllDetails)}
                                  >
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showAllDetails ? 'rotate-180' : ''}`} />
                                  </Button>
                                </div>
                              </div>
                              <h3 className="text-sm font-medium">{event.title}</h3>
                              <div className="text-xs text-muted-foreground flex items-center gap-2">
                                {new Date(event.date).toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                                {category && (
                                  <span
                                    className="px-1.5 py-0.5 rounded-full"
                                    style={{
                                      backgroundColor: category.color + "20",
                                      color: category.color
                                    }}
                                  >
                                    {t(category.name)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            {event.description && (
                              <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                            )}
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="p-4 sm:p-6">
              <CategoryManager
                categories={categories}
                onCreateCategory={handleCreateCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
              />
              {categories.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  {t("No categories found")}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("Edit Event")}</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <EventForm
              categories={categories}
              onSubmit={(data) => handleUpdateEvent({
                ...data,
                id: editingEvent.id,
              })}
              defaultValues={editingEvent}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}