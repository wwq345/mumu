"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Download,
  FileImage,
  FileIcon as FilePdf,
  Share2,
  Copy,
  CloudUpload,
  Check,
  Loader2,
  Settings,
  Brush,
  ImageIcon,
  Smartphone,
  Laptop,
  Printer,
  ArrowLeft,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ExportsPage() {
  const [exportFormat, setExportFormat] = useState("jpeg")
  const [quality, setQuality] = useState([80])
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [isLinkCopied, setIsLinkCopied] = useState(false)
  const [isExported, setIsExported] = useState(false)

  // Simulate export process
  const handleExport = () => {
    setIsExporting(true)
    setExportProgress(0)

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          setIsExported(true)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleCopyLink = () => {
    // Simulate copying link to clipboard
    setIsLinkCopied(true)
    setTimeout(() => setIsLinkCopied(false), 2000)
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
            <Link href="/assets" className="text-sm font-medium hover:text-primary">
              素材库
            </Link>
            <Link href="/exports" className="text-sm font-medium text-primary">
              导出中心
            </Link>
          </nav>
          <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-2">
              <Link href="/editor">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">导出中心</h1>
            </div>
            <p className="text-muted-foreground">选择导出格式和质量，生成下载链接</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>预览</CardTitle>
                    <CardDescription>您的设计预览</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <div className="relative border rounded-md overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=400&width=300&text=设计预览"
                        alt="设计预览"
                        width={300}
                        height={400}
                        className="object-cover"
                      />
                      {isExporting && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                          <Loader2 className="h-8 w-8 text-white animate-spin mb-2" />
                          <p className="text-white text-sm">正在导出...</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      设计名称: <span className="font-medium">我的设计</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={exportFormat === "jpeg" ? "default" : "outline"}>JPEG</Badge>
                      <Badge variant={exportFormat === "png" ? "default" : "outline"}>PNG</Badge>
                      <Badge variant={exportFormat === "pdf" ? "default" : "outline"}>PDF</Badge>
                    </div>
                  </CardFooter>
                </Card>

                {isExported && (
                  <Card>
                    <CardHeader>
                      <CardTitle>导出成功</CardTitle>
                      <CardDescription>您的设计已成功导出</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-muted rounded-md">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <CloudUpload className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">云存储链接</p>
                          <p className="text-sm text-muted-foreground">您的设计已上传至云存储</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleCopyLink}>
                          {isLinkCopied ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              已复制
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              复制链接
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          下载文件
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Share2 className="h-4 w-4 mr-2" />
                          分享
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>最近导出</CardTitle>
                    <CardDescription>您最近导出的设计</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "营销海报", date: "2025-05-14", format: "JPEG", size: "1.2 MB" },
                        { name: "产品展示", date: "2025-05-12", format: "PNG", size: "2.4 MB" },
                        { name: "活动邀请函", date: "2025-05-10", format: "PDF", size: "3.7 MB" },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            {item.format === "JPEG" && <FileImage className="h-5 w-5 text-blue-500" />}
                            {item.format === "PNG" && <FileImage className="h-5 w-5 text-green-500" />}
                            {item.format === "PDF" && <FilePdf className="h-5 w-5 text-red-500" />}
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.date} • {item.format} • {item.size}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>导出设置</CardTitle>
                    <CardDescription>选择导出格式和质量</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label>文件格式</Label>
                      <RadioGroup
                        defaultValue={exportFormat}
                        onValueChange={setExportFormat}
                        className="grid grid-cols-3 gap-2"
                      >
                        <div>
                          <RadioGroupItem value="jpeg" id="jpeg" className="sr-only" />
                          <Label
                            htmlFor="jpeg"
                            className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground ${
                              exportFormat === "jpeg" ? "border-primary" : "border-muted"
                            }`}
                          >
                            <FileImage className="h-6 w-6 mb-2" />
                            JPEG
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="png" id="png" className="sr-only" />
                          <Label
                            htmlFor="png"
                            className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground ${
                              exportFormat === "png" ? "border-primary" : "border-muted"
                            }`}
                          >
                            <FileImage className="h-6 w-6 mb-2" />
                            PNG
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="pdf" id="pdf" className="sr-only" />
                          <Label
                            htmlFor="pdf"
                            className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground ${
                              exportFormat === "pdf" ? "border-primary" : "border-muted"
                            }`}
                          >
                            <FilePdf className="h-6 w-6 mb-2" />
                            PDF
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {(exportFormat === "jpeg" || exportFormat === "png") && (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label>质量</Label>
                          <span className="text-sm">{quality}%</span>
                        </div>
                        <Slider value={quality} onValueChange={setQuality} min={10} max={100} step={1} />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>小文件</span>
                          <span>高质量</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label>使用场景</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col items-center gap-1 p-3 border rounded-md hover:border-primary cursor-pointer">
                          <Smartphone className="h-5 w-5 mb-1" />
                          <span className="text-sm">社交媒体</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-3 border rounded-md hover:border-primary cursor-pointer">
                          <Laptop className="h-5 w-5 mb-1" />
                          <span className="text-sm">网站</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-3 border rounded-md hover:border-primary cursor-pointer">
                          <Printer className="h-5 w-5 mb-1" />
                          <span className="text-sm">印刷</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-3 border rounded-md hover:border-primary cursor-pointer">
                          <ImageIcon className="h-5 w-5 mb-1" />
                          <span className="text-sm">其他</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="watermark" className="flex items-center gap-2">
                          添加水印
                        </Label>
                        <Switch id="watermark" />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="metadata" className="flex items-center gap-2">
                          包含元数据
                        </Label>
                        <Switch id="metadata" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={handleExport} disabled={isExporting}>
                      {isExporting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          正在导出 ({exportProgress}%)
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          导出设计
                        </>
                      )}
                    </Button>
                  </CardFooter>
                  {isExporting && (
                    <div className="px-6 pb-4">
                      <Progress value={exportProgress} className="h-2" />
                    </div>
                  )}
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>高级设置</CardTitle>
                    <CardDescription>配置更多导出选项</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>自定义尺寸</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">宽度 (px)</Label>
                          <Input type="number" placeholder="宽度" defaultValue="1080" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">高度 (px)</Label>
                          <Input type="number" placeholder="高度" defaultValue="1920" />
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      更多设置
                    </Button>
                  </CardContent>
                </Card>
              </div>
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
