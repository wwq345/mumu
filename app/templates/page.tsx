"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, ChevronDown, Heart, Download, Share2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState("all")

  const templates = [
    {
      id: 1,
      title: "E-commerce Product Promotion",
      category: "电商零售",
      scenario: "促销海报",
      size: "朋友圈竖版",
      image: "/placeholder.svg?height=400&width=300",
      likes: 245,
      downloads: 1.2,
    },
    {
      id: 2,
      title: "Online Course Advertisement",
      category: "教育培训",
      scenario: "社交媒体",
      size: "微博横版",
      image: "/placeholder.svg?height=300&width=400",
      likes: 189,
      downloads: 0.9,
    },
    {
      id: 3,
      title: "Restaurant Menu Special",
      category: "餐饮服务",
      scenario: "印刷物料",
      size: "A4印刷",
      image: "/placeholder.svg?height=400&width=300",
      likes: 132,
      downloads: 0.7,
    },
    {
      id: 4,
      title: "Tech Conference Invitation",
      category: "科技互联网",
      scenario: "活动邀请",
      size: "邮件头图",
      image: "/placeholder.svg?height=300&width=400",
      likes: 278,
      downloads: 1.5,
    },
    {
      id: 5,
      title: "Fashion Sale Announcement",
      category: "电商零售",
      scenario: "促销海报",
      size: "朋友圈竖版",
      image: "/placeholder.svg?height=400&width=300",
      likes: 210,
      downloads: 1.1,
    },
    {
      id: 6,
      title: "Webinar Registration",
      category: "教育培训",
      scenario: "活动邀请",
      size: "邮件头图",
      image: "/placeholder.svg?height=300&width=400",
      likes: 156,
      downloads: 0.8,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <span className="text-xl font-bold">DesignFlow</span>
          </Link>
          <nav className="flex items-center gap-6 flex-1">
            <Link href="/templates" className="text-sm font-medium text-primary">
              Templates
            </Link>
            <Link href="/editor" className="text-sm font-medium hover:text-primary">
              Editor
            </Link>
            <Link href="/assets" className="text-sm font-medium hover:text-primary">
              Assets
            </Link>
            <Link href="/team" className="text-sm font-medium hover:text-primary">
              Team
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">Template Market</h1>
              <p className="text-muted-foreground">
                Browse thousands of professionally designed templates for any industry or purpose
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search templates..." className="pl-8 w-full" />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="industry">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="ecommerce">电商零售</SelectItem>
                    <SelectItem value="education">教育培训</SelectItem>
                    <SelectItem value="food">餐饮服务</SelectItem>
                    <SelectItem value="tech">科技互联网</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="scenario">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Scenarios</SelectItem>
                    <SelectItem value="promotion">促销海报</SelectItem>
                    <SelectItem value="social">社交媒体</SelectItem>
                    <SelectItem value="print">印刷物料</SelectItem>
                    <SelectItem value="event">活动邀请</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="size">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="vertical">朋友圈竖版</SelectItem>
                    <SelectItem value="horizontal">微博横版</SelectItem>
                    <SelectItem value="a4">A4印刷</SelectItem>
                    <SelectItem value="email">邮件头图</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Templates</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="recent">Recently Added</TabsTrigger>
                <TabsTrigger value="premium">Premium</TabsTrigger>
                <TabsTrigger value="free">Free</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <Card key={template.id} className="overflow-hidden group">
                      <CardHeader className="p-0">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={template.image || "/placeholder.svg"}
                            alt={template.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button variant="secondary" size="sm">
                              Edit
                            </Button>
                            <Button variant="secondary" size="sm">
                              Preview
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
                      {tab.charAt(0).toUpperCase() + tab.slice(1)} templates will be displayed here
                    </p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex justify-center mt-6">
              <Button variant="outline">
                Load more templates
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2025 DesignFlow. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
