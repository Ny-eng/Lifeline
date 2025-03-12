import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEventSchema } from "@shared/schema";
import type { Category } from "@shared/schema";
import { z } from "zod";

const formSchema = insertEventSchema.extend({
  date: z.string(),
  categoryId: z.number().nullable(),
});

type EventFormProps = {
  categories: Category[];
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<z.infer<typeof formSchema>>;
};

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

export function EventForm({
  categories,
  onSubmit,
  defaultValues,
}: EventFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      score: 50,
      categoryId: null,
      order: 0,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="score"
          render={({ field }) => {
            const scoreStatus = getScoreStatus(field.value);
            return (
              <FormItem>
                <FormLabel>Score</FormLabel>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getScoreEmoji(field.value)}</span>
                    <span className="font-medium" style={{ color: scoreStatus.color }}>
                      {field.value}
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: scoreStatus.color + "20",
                        color: scoreStatus.color
                      }}
                    >
                      {scoreStatus.label}
                    </span>
                  </div>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === "null" ? null : parseInt(value))}
                value={field.value === null ? "null" : field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null">No Category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Save Event
        </Button>
      </form>
    </Form>
  );
}