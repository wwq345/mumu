"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Heart, Download, Share2, Brush } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TemplateBrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedScenario, setSelectedScenario] = useState("all")
  const [selectedSize, setSelectedSize] = useState("all")

  const templates = [
    {
      id: 1,
      title: "电商促销海报",
      category: "电商零售",
      scenario: "促销海报",
      size: "朋友圈竖版",
      image: "/placeholder.svg?height=400&width=300&text=电商促销海报",
      likes: 245,
      downloads: 1.2,
      premium: false,
    },
    {
      id: 2,
      title: "教育课程宣传",
      category: "教育培训",
      scenario: "社交媒体",
      size: "微博横版",
      image: "/placeholder.svg?height=300&width=400&text=教育课程宣传",
      likes: 189,
      downloads: 0.9,
      premium: true,
    },
    {
      id: 3,
      title: "餐厅菜单设计",
      category: "餐饮服务",
      scenario: "印刷物料",
      size: "A4印刷",
      image: "/placeholder.svg?height=400&width=300&text=餐厅菜单设计",
      likes: 132,
      downloads: 0.7,
      premium: false,
    },
    {
      id: 4,
      title: "科技会议邀请函",
      category: "科技互联网",
      scenario: "活动邀请",
      size: "邮件头图",
      image: "/placeholder.svg?height=300&width=400&text=科技会议邀请函",
      likes: 278,
      downloads: 1.5,
      premium: true,
    },
    {
      id: 5,
      title: "时尚促销活动",
      category: "电商零售",
      scenario: "促销海报",
      size: "朋友圈竖版",
      image: "/placeholder.svg?height=400&width=300&text=时尚促销活动",
      likes: 210,
      downloads: 1.1,
      premium: false,
    },
    {
      id: 6,
      title: "网络研讨会注册",
      category: "教育培训",
      scenario: "活动邀请",
      size: "邮件头图",
      image: "/placeholder.svg?height=300&width=400&text=网络研讨会注册",
      likes: 156,
      downloads: 0.8,
      premium: true,
    },
  ]

  const filteredTemplates = templates.filter((template) => {
    return (
      (selectedCategory === "all" || template.category === selectedCategory) &&
      (selectedScenario === "all" || template.scenario === selectedScenario) &&
      (selectedSize === "all" || template.size === selectedSize)
    )
  })

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <Brush className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DesignFlow</span>
          </Link>
          <nav className="flex items-center gap-6 flex-1">
            <Link href="/templates/browse" className="text-sm font-medium text-primary">
              模板市场
            </Link>
            <Link href="/editor" className="text-sm font-medium hover:text-primary">
              编辑器
            </Link>
            <Link href="/assets" className="text-sm font-medium hover:text-primary">
              素材库
            </Link>
            <Link href="/exports" className="text-sm font-medium hover:text-primary">
              导出中心
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm">
              登录
            </Button>
            <Button size="sm">注册</Button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">模板市场</h1>
              <p className="text-muted-foreground">浏览和筛选适合各种场景的专业设计模板</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="搜索模板..." className="pl-8 w-full" />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select defaultValue="all" onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="行业分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有行业</SelectItem>
                    <SelectItem value="电商零售">电商零售</SelectItem>
                    <SelectItem value="教育培训">教育培训</SelectItem>
                    <SelectItem value="餐饮服务">餐饮服务</SelectItem>
                    <SelectItem value="科技互联网">科技互联网</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all" onValueChange={setSelectedScenario}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="使用场景" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有场景</SelectItem>
                    <SelectItem value="促销海报">促销海报</SelectItem>
                    <SelectItem value="社交媒体">社交媒体</SelectItem>
                    <SelectItem value="印刷物料">印刷物料</SelectItem>
                    <SelectItem value="活动邀请">活动邀请</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all" onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="尺寸规格" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有尺寸</SelectItem>
                    <SelectItem value="朋友圈竖版">朋友圈竖版</SelectItem>
                    <SelectItem value="微博横版">微博横版</SelectItem>
                    <SelectItem value="A4印刷">A4印刷</SelectItem>
                    <SelectItem value="邮件头图">邮件头图</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">全部模板</TabsTrigger>
                <TabsTrigger value="popular">热门模板</TabsTrigger>
                <TabsTrigger value="recent">最新上传</TabsTrigger>
                <TabsTrigger value="premium">高级模板</TabsTrigger>
                <TabsTrigger value="free">免费模板</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <Card key={template.id} className="overflow-hidden group">
                      <CardHeader className="p-0">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={template.image || "/placeholder.svg"}
                            alt={template.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          {template.premium && <Badge className="absolute top-2 right-2 bg-primary">高级</Badge>}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Link href={`/editor?template=${template.id}`}>
                              <Button variant="secondary" size="sm">
                                使用此模板
                              </Button>
                            </Link>
                            <Button variant="secondary" size="sm">
                              预览
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-lg">{template.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {template.category}
                          </span>
                          <span className="text-xs bg-muted px-2 py-1 rounded-full">{template.scenario}</span>
                          <span className="text-xs bg-muted px-2 py-1 rounded-full">{template.size}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <span className="text-sm text-muted-foreground">{template.likes}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            {template.downloads}k
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {["popular", "recent", "premium", "free"].map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-0">
                  <div className="flex items-center justify-center h-40 border rounded-lg">
                    <p className="text-muted-foreground">
                      {tab === "popular" && "热门模板将在这里显示"}
                      {tab === "recent" && "最新上传的模板将在这里显示"}
                      {tab === "premium" && "高级模板将在这里显示"}
                      {tab === "free" && "免费模板将在这里显示"}
                    </p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex justify-center mt-6">
              <Button variant="outline">加载更多模板</Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2025 DesignFlow. 保留所有权利。</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              条款
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              隐私
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              联系我们
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
