"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Loader2, CheckCircle } from "lucide-react"

// 添加类型定义
type ImageData = {
  id: string;
  preview: string;
  fileName: string;
} | null;

type FormData = {
  prompt: string;
  image: ImageData;
};

export default function SimpleEditorPage() {
  const [formData, setFormData] = useState<FormData>({
    prompt: "",
    image: null,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // 处理图片上传
  const handleImageUpload = async () => {
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = "image/*"
    
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      setIsUploading(true)

      try {
        // 上传图片到Coze API
        const formData = new FormData()
        formData.append("file", file)
        
        const response = await fetch("https://api.coze.cn/v1/files/upload", {
          method: "POST",
          headers: {
            "Authorization": `Bearer pat_XlxqdPUCipTd1sC7AzZCxzo3DNtpNhFQMnGyxoACsHxy4P8OvSgzSARxcnPV3NcN`,
            "Accept": "application/json",
          },
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`上传失败: ${response.status}`)
        }

        const data = await response.json()
        const fileId = data.id || (data.data && data.data.id)
        
        if (!fileId) {
          throw new Error('上传成功但未收到file_id')
        }

        setFormData(prev => ({
          ...prev,
          image: {
            id: fileId,
            preview: URL.createObjectURL(file),
            fileName: file.name
          }
        }))

      } catch (error) {
        console.error('上传失败:', error)
        alert('上传失败，请重试')
      } finally {
        setIsUploading(false)
      }
    }

    fileInput.click()
  }

  // 处理生成设计
  const handleGenerate = async () => {
    if (!formData.prompt) {
      alert('请输入提示词')
      return
    }

    setIsGenerating(true)
    setIsGenerated(false)
    setGeneratedImageUrl(null)

    try {
      const parameters: any = {
        prompt: formData.prompt,
      }

      if (formData.image?.id) {
        parameters.toop1 = {
          type: "file",
          file_id: formData.image.id
        }
      }

      const response = await fetch("https://api.coze.cn/v1/workflow/run", {
        method: "POST",
        headers: {
          "Authorization": `Bearer pat_XlxqdPUCipTd1sC7AzZCxzo3DNtpNhFQMnGyxoACsHxy4P8OvSgzSARxcnPV3NcN`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workflow_id: "7456751735379034153",
          parameters,
        }),
      })

      if (!response.ok) {
        throw new Error(`生成失败: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.data && typeof data.data === "string") {
        const parsedData = JSON.parse(data.data)
        if (parsedData.image) {
          setGeneratedImageUrl(parsedData.image)
        }
      }

      setIsGenerated(true)
    } catch (error) {
      console.error('生成失败:', error)
      alert('生成失败，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* 输入区域 */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h1 className="text-xl font-semibold">简单设计生成器</h1>
          
          {/* 提示词输入 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">提示词</label>
            <Textarea
              placeholder="请输入提示词，描述您想要的设计效果"
              value={formData.prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
              rows={3}
            />
          </div>

          {/* 图片上传 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">上传图片（可选）</label>
            <Card className="border-dashed">
              <CardContent className="p-4">
                {formData.image ? (
                  <div className="space-y-4">
                    <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-100">
                      {isUploading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : (
                        <img
                          src={formData.image.preview}
                          alt="上传的图片"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleImageUpload}
                      disabled={isUploading}
                      className="w-full"
                    >
                      {isUploading ? "上传中..." : "更换图片"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      点击上传图片
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={handleImageUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? "上传中..." : "选择图片"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 生成按钮 */}
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleGenerate}
            disabled={isGenerating || !formData.prompt}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                生成中...
              </>
            ) : isGenerated ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                重新生成
              </>
            ) : (
              "生成设计"
            )}
          </Button>
        </div>

        {/* 预览区域 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">预览</h2>
          <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
            {isGenerating ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">设计生成中...</p>
                </div>
              </div>
            ) : generatedImageUrl ? (
              <img
                src={generatedImageUrl}
                alt="生成的设计"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  生成的设计将在这里显示
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 