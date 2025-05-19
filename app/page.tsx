"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brush, Wrench } from "lucide-react"

export default function HomePage() {
  const scenarios = [
    {
      id: "poster",
      name: "海报设计",
      description: "设计各种促销、招聘和推荐海报",
      image: "/images/covers/poster-cover.jpg",
    },
    {
      id: "banner",
      name: "营销头图设计",
      description: "为各种营销活动设计头图",
      image: "/images/covers/banner-cover.jpg",
    },
    {
      id: "marketing-header",
      name: "Banner设计",
      description: "为各种营销活动设计Banner",
      image: "/images/covers/marketing-header-cover.jpg",
    },
    {
      id: "activity-floor",
      name: "楼层条设计",
      description: "设计不同样式的楼层条",
      image: "/images/covers/activity-floor-cover.jpg",
    },
    {
      id: "ppt-cover",
      name: "PPT专题封面",
      description: "为各类PPT设计专业封面",
      image: "/images/covers/ppt-cover-cover.jpg",
    },
    {
      id: "battle-report",
      name: "战报封面",
      description: "为各类战报进行设计",
      image: "/images/covers/battle-report-cover.jpg",
    },
  ]

  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    
    try {
      const formData = formDataMap[selectedTemplate.id];
      if (!formData) {
        throw new Error('请先填写内容设置');
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: selectedTemplate.id,
          content: formData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '生成失败');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 mr-6 ml-8">
            <Brush className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DesignFlow</span>
          </Link>
          <div className="flex-1"></div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center py-6">
        <div className="container flex flex-col gap-6 items-center justify-center">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl font-bold">选择设计场景</h1>
            <p className="text-muted-foreground">
              根据你的需求选择设计场景，我们将为你提供专业模板
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {scenarios.map((scenario) => {
              const devIds = ["marketing-header", "activity-floor", "ppt-cover", "battle-report"];
              const isDev = devIds.includes(scenario.id);
              const cardContent = (
                <Card className="overflow-hidden h-full transition-all hover:shadow-lg cursor-pointer relative" style={{ minWidth: 340, minHeight: 240 }}>
                  <div className="aspect-[2/1] relative overflow-hidden" style={{ minHeight: 140 }}>
                    <Image
                      src={scenario.image}
                      alt={scenario.name}
                      fill
                      priority
                      className="object-cover"
                      onError={(e) => {
                        // 图片加载错误时使用占位符
                        const target = e.target as HTMLImageElement;
                        target.src = `/placeholder.svg?height=200&width=400&text=${scenario.name}`;
                      }}
                    />
                    {isDev && (
                      <div style={{position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2}}>
                        <span style={{display: 'flex', alignItems: 'center', gap: 8}}>
                          <Wrench size={20} style={{color: '#222'}} />
                          <span style={{fontSize: 18, color: '#222', fontWeight: 600}}>开发中</span>
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className={`font-bold text-xl mb-2 ${isDev ? 'text-gray-400' : 'text-black'}`}>{scenario.name}</h3>
                    <p className="text-base text-muted-foreground">{scenario.description}</p>
                  </CardContent>
                </Card>
              );
              return isDev ? (
                <div key={scenario.id} style={{pointerEvents: 'none', userSelect: 'none'}}>{cardContent}</div>
              ) : (
                <Link href={`/editor?scenario=${scenario.id}`} key={scenario.id}>
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground ml-8">© 2025 DesignFlow. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
