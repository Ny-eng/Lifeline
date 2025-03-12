import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCategorySchema } from "@shared/schema";
import type { Category } from "@shared/schema";
import { z } from "zod";
import { X, Edit2 } from "lucide-react";
import { categoryColors } from "@/lib/colors";
import { useLanguage } from "@/hooks/use-language";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryManagerProps {
  categories: Category[];
  onCreateCategory: (category: z.infer<typeof insertCategorySchema>) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: number) => void;
}

export function CategoryManager({
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategoryManagerProps) {
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof insertCategorySchema>>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: "",
      color: categoryColors[0],
    },
  });

  function onSubmit(values: z.infer<typeof insertCategorySchema>) {
    if (editingCategory) {
      onUpdateCategory({ ...values, id: editingCategory.id });
      setEditingCategory(null);
    } else {
      onCreateCategory(values);
    }
    form.reset();
    setOpen(false);
  }

  function startEditing(category: Category) {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      color: category.color,
    });
    setOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("Categories")}</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">{t("Add Category")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? t("Edit Category") : t("Create Category")}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Name")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Color")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryColors.map((color) => (
                            <SelectItem key={color} value={color}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                                <span>{color}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  {editingCategory ? t("Update") : t("Create")} {t("Category")}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-2 bg-card rounded-md"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span>{t(category.name)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => startEditing(category)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteCategory(category.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}