import { createContext, useContext, useState, ReactNode } from "react";

type Language = "ja" | "en";

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
};

const translations = {
  ja: {
    // Timeline related
    "Timeline Chart": "タイムラインチャート",
    "Event History": "イベント履歴",
    "View Timeline": "タイムラインを見る",
    "Open Timeline": "タイムラインを開く",
    "Visual Timeline": "タイムラインビュー",

    // Categories
    "Categories": "カテゴリー",
    "Add Category": "カテゴリー追加",
    "Create Category": "カテゴリー作成",
    "Edit Category": "カテゴリー編集",
    "Category": "カテゴリー",
    "All Categories": "すべてのカテゴリー",
    "No categories found": "カテゴリーがありません",
    "No categories found. Please create a category first.": "カテゴリーが見つかりません。先にカテゴリーを作成してください。",
    "Create": "作成",
    "Update": "更新",

    // Names
    "Name": "名前",
    "Color": "色",

    // Events
    "Add Event": "イベント追加",
    "Add New Event": "新規イベント追加",
    "Edit Event": "イベント編集",
    "Delete Event": "イベントの削除",
    "No events found": "イベントがありません",
    "Add your first event to start tracking your life journey": "最初のイベントを追加して人生の軌跡の記録を開始",

    // Feature descriptions
    "Getting Started Guide": "はじめ方ガイド",
    "1. Create Categories": "1. カテゴリーを作成",
    "2. Add Events": "2. イベントを追加",
    "3. View Timeline": "3. タイムラインを表示",
    "4. Filter View": "4. 表示をフィルター",
    "Create color-coded categories for your events": "イベントを整理するためのカラーコード付きカテゴリーを作成",
    "Add life events with dates and scores": "日付とスコアを設定してライフイベントを追加",
    "Visualize your journey on the interactive chart": "インタラクティブなチャートで人生の軌跡を可視化",
    "Filter events by category": "カテゴリーでイベントをフィルター",

    // Sort options
    "Sort by...": "並び替え...",
    "Newest First": "新しい順",
    "Oldest First": "古い順",
    "Highest Score": "スコア高い順",
    "Lowest Score": "スコア低い順",

    // Actions
    "Cancel": "キャンセル",
    "Delete": "削除",
    "Delete All": "全て削除",
    "Success": "成功",
    "All events have been deleted": "全てのイベントが削除されました",
    "Delete All Events": "全てのイベントを削除",
    "This action cannot be undone. This will permanently delete all your events.": "この操作は取り消せません。全てのイベントが完全に削除されます。",
    "This action cannot be undone. This event will be permanently deleted.": "この操作は取り消せません。このイベントは完全に削除されます。",

    // Categories
    "Work": "仕事",
    "Study": "学習",
    "Health": "健康",
    "Hobby": "趣味",
    "Travel": "旅行",
    "Family": "家族",
    "Friends": "友人",
    "Personal": "個人",
    "Other": "その他",

    // Landing page
    "Reflect on Your Life Journey": "人生を振り返る",
    "Visualize and understand your life's journey through an interactive timeline. Discover patterns, learn from experiences, and gain meaningful insights about yourself.": "インタラクティブなタイムラインで人生を振り返り、パターンを発見し、経験から学び、自己理解を深めましょう。",
    "Start Reflecting": "振り返りを始める",

    // Feature cards
    "Emotional Tracking": "感情の記録",
    "Pattern Discovery": "パターンの発見",
    "Smart Insights": "意味のある洞察",

    "Track emotional changes and significant moments in your life journey": "人生における感情の変化と重要な出来事を記録",
    "See your life's journey through a beautiful, interactive timeline": "美しいインタラクティブなタイムラインで人生を振り返る",
    "Organize and categorize life events to discover patterns": "ライフイベントを整理・分類してパターンを発見",
    "Gain insights into your life's turning points and growth": "人生の転機と成長への洞察を得る",

    // Call to action
    "Begin Your Reflection": "振り返りを始めましょう",
    "Look back on your journey and understand yourself better": "あなたの歩みを振り返り、より深い自己理解へ",
  },
  en: {
    // Timeline related
    "Timeline Chart": "Timeline Chart",
    "Event History": "Event History",
    "View Timeline": "View Timeline",
    "Open Timeline": "Open Timeline",
    "Visual Timeline": "Visual Timeline",

    // Categories
    "Categories": "Categories",
    "Add Category": "Add Category",
    "Create Category": "Create Category",
    "Edit Category": "Edit Category",
    "Category": "Category",
    "All Categories": "All Categories",
    "No categories found": "No categories found",
    "No categories found. Please create a category first.": "No categories found. Please create a category first.",
    "Create": "Create",
    "Update": "Update",

    // Names
    "Name": "Name",
    "Color": "Color",

    // Events
    "Add Event": "Add Event",
    "Add New Event": "Add New Event",
    "Edit Event": "Edit Event",
    "Delete Event": "Delete Event",
    "No events found": "No events found",
    "Add your first event to start tracking your life journey": "Add your first event to start tracking your life journey",

    // Feature descriptions
    "Getting Started Guide": "Getting Started Guide",
    "1. Create Categories": "1. Create Categories",
    "2. Add Events": "2. Add Events",
    "3. View Timeline": "3. View Timeline",
    "4. Filter View": "4. Filter View",
    "Create color-coded categories for your events": "Create color-coded categories for your events",
    "Add life events with dates and scores": "Add life events with dates and scores",
    "Visualize your journey on the interactive chart": "Visualize your journey on the interactive chart",
    "Filter events by category": "Filter events by category",

    // Sort options
    "Sort by...": "Sort by...",
    "Newest First": "Newest First",
    "Oldest First": "Oldest First",
    "Highest Score": "Highest Score",
    "Lowest Score": "Lowest Score",

    // Actions
    "Cancel": "Cancel",
    "Delete": "Delete",
    "Delete All": "Delete All",
    "Success": "Success",
    "All events have been deleted": "All events have been deleted",
    "Delete All Events": "Delete All Events",
    "This action cannot be undone. This will permanently delete all your events.": "This action cannot be undone. This will permanently delete all your events.",
    "This action cannot be undone. This event will be permanently deleted.": "This action cannot be undone. This event will be permanently deleted.",

    // Categories
    "Work": "Work",
    "Study": "Study",
    "Health": "Health",
    "Hobby": "Hobby",
    "Travel": "Travel",
    "Family": "Family",
    "Friends": "Friends",
    "Personal": "Personal",
    "Other": "Other",

    // Landing page
    "Reflect on Your Life Journey": "Reflect on Your Life Journey",
    "Visualize and understand your life's journey through an interactive timeline. Discover patterns, learn from experiences, and gain meaningful insights about yourself.": "Visualize and understand your life's journey through an interactive timeline. Discover patterns, learn from experiences, and gain meaningful insights about yourself.",
    "Start Reflecting": "Start Reflecting",

    // Feature cards
    "Emotional Tracking": "Emotional Tracking",
    "Pattern Discovery": "Pattern Discovery",
    "Smart Insights": "Smart Insights",

    "Track emotional changes and significant moments in your life journey": "Track emotional changes and significant moments in your life journey",
    "See your life's journey through a beautiful, interactive timeline": "See your life's journey through a beautiful, interactive timeline",
    "Organize and categorize life events to discover patterns": "Organize and categorize life events to discover patterns",
    "Gain insights into your life's turning points and growth": "Gain insights into your life's turning points and growth",

    // Call to action
    "Begin Your Reflection": "Begin Your Reflection",
    "Look back on your journey and understand yourself better": "Look back on your journey and understand yourself better",
  }
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const toggleLanguage = () => {
    setLanguage(language === "ja" ? "en" : "ja");
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations["ja"]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}