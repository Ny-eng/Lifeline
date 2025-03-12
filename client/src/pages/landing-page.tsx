import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { ChevronRight, LineChart, ListPlus, Filter, Calendar, Menu } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisitorCount } from "@/components/ui/visitor-count";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function LandingPage() {
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 text-transparent bg-clip-text">
                Lifeline
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <VisitorCount />
              <Tabs
                value={language}
                onValueChange={(value) => value !== language && toggleLanguage()}
              >
                <TabsList>
                  <TabsTrigger value="en">EN</TabsTrigger>
                  <TabsTrigger value="ja">JP</TabsTrigger>
                </TabsList>
              </Tabs>
              <Link href="/timeline">
                <Button variant="outline">{t("Open Timeline")} 🚀</Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 pt-6">
                    <div className="flex justify-center">
                      <VisitorCount />
                    </div>
                    <Tabs
                      value={language}
                      onValueChange={(value) => value !== language && toggleLanguage()}
                      className="w-full"
                    >
                      <TabsList className="w-full">
                        <TabsTrigger value="en" className="flex-1">EN</TabsTrigger>
                        <TabsTrigger value="ja" className="flex-1">JP</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <Link href="/timeline" className="w-full">
                      <Button variant="outline" className="w-full">
                        {t("Open Timeline")} 🚀
                      </Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="relative py-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="container mx-auto text-center relative">
            <div className="animate-in fade-in duration-1000 slide-in-from-bottom-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/50 text-transparent bg-clip-text whitespace-pre-line leading-relaxed">
                {language === 'ja' ? 
                  "思い出を紡ぐ、あなたのストーリー" :
                  "Your Life Story, Beautifully Told"}
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto whitespace-pre-line leading-relaxed">
                {language === 'ja' ? 
                  "毎日の小さな出来事から人生の大きな節目まで。大切な思い出を、あなただけのタイムラインに残していきませんか？" :
                  "Transform your memories into a beautiful timeline. Every joy, challenge, and triumph tells your unique story. 🌱"}
              </p>

              <Link href="/timeline">
                <Button size="lg" className="gap-2 group">
                  {language === 'ja' ? "タイムラインを作る" : "Start Your Journey"}
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group bg-card hover:bg-accent transition-colors p-6 rounded-lg space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">
                  {language === 'ja' ? "大切な思い出を記録" : "Emotional Journey"}
                </h3>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {language === 'ja' ? 
                    "楽しかったこと、頑張ったこと。その時の気持ちを大切に残しておけます" :
                    "Capture your feelings, celebrate your highs, and learn from every moment"}
                </p>
              </div>

              <div className="group bg-card hover:bg-accent transition-colors p-6 rounded-lg space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">
                  {language === 'ja' ? "わかりやすい可視化" : "Visual Story"}
                </h3>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {language === 'ja' ? 
                    "グラフで見える形に。時間と共に変化する自分の気持ちを振り返れます" :
                    "Watch your journey unfold through beautiful, interactive charts"}
                </p>
              </div>

              <div className="group bg-card hover:bg-accent transition-colors p-6 rounded-lg space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ListPlus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">
                  {language === 'ja' ? "カテゴリで整理" : "Pattern Discovery"}
                </h3>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {language === 'ja' ? 
                    "仕事、趣味、家族など。カテゴリ別に整理して新しい発見が見つかります" :
                    "Organize and discover patterns in your life journey"}
                </p>
              </div>

              <div className="group bg-card hover:bg-accent transition-colors p-6 rounded-lg space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Filter className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">
                  {language === 'ja' ? "成長の記録" : "Smart Insights"}
                </h3>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {language === 'ja' ? 
                    "日々の小さな変化から、人生の大きな転機まで。成長の軌跡を見つけられます" :
                    "Gain insights from your journey and plan your next chapter"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 to-transparent" />
          <div className="container mx-auto text-center relative">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/50 text-transparent bg-clip-text">
              {language === 'ja' ? 
                "さぁ、はじめてみましょう" :
                "Ready to Begin?"}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto whitespace-pre-line leading-relaxed">
              {language === 'ja' ? 
                "あなたの大切な思い出を、素敵なタイムラインにしていきませんか？" :
                "Start capturing your amazing journey today!"}
            </p>
            <Link href="/timeline">
              <Button size="lg" className="gap-2 group">
                {language === 'ja' ? "タイムラインを作る" : "Open Timeline"}
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}