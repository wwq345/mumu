"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  FolderPlus,
  Upload,
  Grid,
  List,
  MoreHorizontal,
  ImageIcon,
  FileText,
  FileVideo,
  FileAudio,
  Trash2,
  Download,
  Edit,
  Star,
  StarOff,
  Brush,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

// 定义资产类型
type AssetType = "image" | "video" | "document" | "audio" | "other";

interface Asset {
  id: number;
  name: string;
  type: AssetType;
  size: string;
  modified: string;
  starred: boolean;
  preview: string | null;
  tags: string[];
}

export default function AssetsPage() {
  const [viewMode, setViewMode] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")

  const assets: Asset[] = [
    {
      id: 1,
      name: "产品照片1.jpg",
      type: "image",
      size: "1.2 MB",
      modified: "2025-05-10",
      starred: true,
      preview: "/placeholder.svg?height=200&width=200&text=产品照片",
      tags: ["产品", "电商"],
    },
    {
      id: 2,
      name: "公司标志.png",
      type: "image",
      size: "0.5 MB",
      modified: "2025-05-09",
      starred: false,
      preview: "/placeholder.svg?height=200&width=200&text=公司标志",
      tags: ["品牌", "标志"],
    },
    {
      id: 3,
      name: "营销演示.pdf",
      type: "document",
      size: "3.7 MB",
      modified: "2025-05-08",
      starred: false,
      preview: null,
      tags: ["营销", "演示"],
    },
    {
      id: 4,
      name: "产品演示.mp4",
      type: "video",
      size: "24.5 MB",
      modified: "2025-05-07",
      starred: true,
      preview: null,
      tags: ["产品", "视频"],
    },
    {
      id: 5,
      name: "背景音乐.mp3",
      type: "audio",
      size: "5.8 MB",
      modified: "2025-05-06",
      starred: false,
      preview: null,
      tags: ["音乐", "背景"],
    },
    {
      id: 6,
      name: "团队照片.jpg",
      type: "image",
      size: "2.3 MB",
      modified: "2025-05-05",
      starred: false,
      preview: "/placeholder.svg?height=200&width=200&text=团队照片",
      tags: ["团队", "公司"],
    },
  ]

  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-6 w-6 text-blue-500" />
      case "document":
        return <FileText className="h-6 w-6 text-green-500" />
      case "video":
        return <FileVideo className="h-6 w-6 text-purple-500" />
      case "audio":
        return <FileAudio className="h-6 w-6 text-orange-500" />
      default:
        return <FileText className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <Brush className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DesignFlow</span>
          </Link>
          <nav className="flex items-center gap-6 flex-1">
            <Link href="/templates/browse" className="text-sm font-medium hover:text-primary">
              模板市场
            </Link>
            <Link href="/editor" className="text-sm font-medium hover:text-primary">
              编辑器
            </Link>
            <Link href="/assets" className="text-sm font-medium text-primary">
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
              <h1 className="text-3xl font-bold">素材库</h1>
              <p className="text-muted-foreground">在一个集中的位置组织和访问所有设计素材</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="搜索素材..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  上传
                </Button>
                <Button variant="outline">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  新建文件夹
                </Button>
                <Select defaultValue="date">
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="排序方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">名称</SelectItem>
                    <SelectItem value="date">日期</SelectItem>
                    <SelectItem value="size">大小</SelectItem>
                    <SelectItem value="type">类型</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-r-none h-9 w-9"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-l-none h-9 w-9"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">所有文件</TabsTrigger>
                <TabsTrigger value="images">图片</TabsTrigger>
                <TabsTrigger value="documents">文档</TabsTrigger>
                <TabsTrigger value="videos">视频</TabsTrigger>
                <TabsTrigger value="audio">音频</TabsTrigger>
                <TabsTrigger value="starred">已标星</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                {filteredAssets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 border rounded-lg">
                    <p className="text-muted-foreground mb-2">没有找到匹配的素材</p>
                    <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                      清除搜索
                    </Button>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredAssets.map((asset) => (
                      <Card key={asset.id} className="overflow-hidden group">
                        <CardContent className="p-0">
                          <div className="relative">
                            {asset.type === "image" ? (
                              <div className="aspect-square bg-muted">
                                <Image
                                  src={asset.preview || "/placeholder.svg"}
                                  alt={asset.name}
                                  width={200}
                                  height={200}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="aspect-square bg-muted flex items-center justify-center">
                                {getAssetIcon(asset.type as AssetType)}
                              </div>
                            )}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    下载
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    重命名
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    {asset.starred ? (
                                      <>
                                        <StarOff className="h-4 w-4 mr-2" />
                                        取消标星
                                      </>
                                    ) : (
                                      <>
                                        <Star className="h-4 w-4 mr-2" />
                                        标星
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    删除
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-3">
                          <div className="flex items-start gap-2 w-full">
                            {asset.starred && <Star className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{asset.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {asset.size} • {asset.modified}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {asset.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left font-medium text-xs w-8">
                            <Checkbox />
                          </th>
                          <th className="py-3 px-4 text-left font-medium text-xs">名称</th>
                          <th className="py-3 px-4 text-left font-medium text-xs">类型</th>
                          <th className="py-3 px-4 text-left font-medium text-xs">大小</th>
                          <th className="py-3 px-4 text-left font-medium text-xs">修改日期</th>
                          <th className="py-3 px-4 text-left font-medium text-xs">标签</th>
                          <th className="py-3 px-4 text-left font-medium text-xs w-8"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAssets.map((asset) => (
                          <tr key={asset.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <Checkbox />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {getAssetIcon(asset.type as AssetType)}
                                <span className="text-sm">{asset.name}</span>
                                {asset.starred && <Star className="h-4 w-4 text-yellow-500" />}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm capitalize">
                              {asset.type === "image"
                                ? "图片"
                                : asset.type === "document"
                                  ? "文档"
                                  : asset.type === "video"
                                    ? "视频"
                                    : asset.type === "audio"
                                      ? "音频"
                                      : asset.type}
                            </td>
                            <td className="py-3 px-4 text-sm">{asset.size}</td>
                            <td className="py-3 px-4 text-sm">{asset.modified}</td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {asset.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    下载
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    重命名
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    {asset.starred ? (
                                      <>
                                        <StarOff className="h-4 w-4 mr-2" />
                                        取消标星
                                      </>
                                    ) : (
                                      <>
                                        <Star className="h-4 w-4 mr-2" />
                                        标星
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    删除
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>

              {["images", "documents", "videos", "audio", "starred"].map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-0">
                  <div className="flex items-center justify-center h-40 border rounded-lg">
                    <p className="text-muted-foreground">
                      {tab === "images" && "图片将在这里显示"}
                      {tab === "documents" && "文档将在这里显示"}
                      {tab === "videos" && "视频将在这里显示"}
                      {tab === "audio" && "音频将在这里显示"}
                      {tab === "starred" && "已标星的素材将在这里显示"}
                    </p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
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
