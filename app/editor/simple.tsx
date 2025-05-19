"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

// 定义表单字段类型
interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
}

// 定义表单数据类型
interface FormData {
  [key: string]: string | ImageUploadData | undefined;
  prompt: string;
}

// 定义上传图片数据类型
interface ImageUploadData {
  id: string;
  preview: string;
  fileName: string;
}

// 上传文件到Coze API
async function uploadFileToCoze(file: File) {
  const apiKey = "pat_XlxqdPUCipTd1sC7AzZCxzo3DNtpNhFQMnGyxoACsHxy4P8OvSgzSARxcnPV3NcN"
  const url = "https://api.coze.cn/v1/files/upload"
  
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData
  })
  
  const result = await response.json()
  
  if (result.code !== 0 || !result.data || !result.data.id) {
    throw new Error(`上传失败: ${result.msg || '未知错误'}`)
  }
  
  return result.data.id
}

// 营销头图工作流ID
const MARKETING_HEADER_WORKFLOW_ID = "7456751735379034153";

// 简化版表单字段配置 - 与复杂版的Promotion Header保持一致
const FORM_FIELDS: FormField[] = [
  { id: "prompt", label: "提示词", type: "textarea", placeholder: "输入推广文案，例如：五一大促，全场5折" },
  { id: "toop1", label: "背景图片", type: "image", placeholder: "上传背景图片" },
  { id: "logo1", label: "Logo", type: "image", placeholder: "上传品牌Logo" },
];

// API调用函数
async function callCozeAPI(formData: FormData) {
  const apiKey = "pat_XlxqdPUCipTd1sC7AzZCxzo3DNtpNhFQMnGyxoACsHxy4P8OvSgzSARxcnPV3NcN"
  const url = "https://api.coze.cn/v1/workflow/run"

  const parameters: Record<string, any> = {
    prompt: formData.prompt || "",
  }
  
  // 添加所有图片字段
  Object.keys(formData).forEach(key => {
    const value = formData[key];
    if (key !== "prompt" && value && typeof value === 'object') {
      parameters[key] = {
        type: "file",
        file_id: value.id
      };
    }
  });

  // 简化版只使用营销头图的工作流ID
  const payload = {
    workflow_id: MARKETING_HEADER_WORKFLOW_ID,
    parameters,
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }

    const data = await response.json()
    console.log("API响应:", data)
    
    if (data.code !== 0) {
      throw new Error(`Coze API错误: ${data.msg || "未知错误"}`)
    }

    // 解析返回的图片URL
    if (data.data && typeof data.data === "string") {
      const parsed = JSON.parse(data.data)
      if (parsed.image) {
        return parsed.image
      }
    }
    
    throw new Error("无法从响应中提取图片URL")
  } catch (error) {
    console.error("API调用出错:", error)
    throw error
  }
}

export default function SimplePage() {
  const [formData, setFormData] = useState<FormData>({
    prompt: "",
  });
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 处理文本输入
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // 处理图片上传
  const handleImageUpload = async (fieldId: string) => {
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = "image/*"

    fileInput.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        // 创建本地预览
        const previewUrl = URL.createObjectURL(file)
        
        // 上传到Coze
        const fileId = await uploadFileToCoze(file)
        
        // 保存上传的图片信息
        setFormData(prev => ({
          ...prev,
          [fieldId]: {
            id: fileId,
            preview: previewUrl,
            fileName: file.name
          }
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "上传图片失败")
      } finally {
        setIsLoading(false)
      }
    }
    
    fileInput.click()
  }
  
  // 删除已上传的图片
  const handleRemoveImage = (fieldId: string) => {
    setFormData(prev => {
      const newData = { ...prev };
      delete newData[fieldId];
      return newData;
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.prompt || !formData.prompt.trim()) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // 使用所有表单数据
      const url = await callCozeAPI(formData)
      setImageUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">简易营销头图生成器</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {FORM_FIELDS.map((field) => {
          const value = formData[field.id];
          const isImage = field.type === "image";
          const imageData = isImage && value && typeof value === "object" ? value as ImageUploadData : null;

          return (
            <div key={field.id} className="space-y-2">
              <label htmlFor={field.id} className="block font-medium">
                {field.label}
              </label>
              
              {field.type === "textarea" ? (
                <Textarea
                  id={field.id}
                  value={typeof value === "string" ? value : ""}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  rows={4}
                />
              ) : field.type === "image" ? (
                <div className="space-y-2">
                  {imageData ? (
                    <div className="relative">
                      <img
                        src={imageData.preview}
                        alt={imageData.fileName}
                        className="max-w-full h-auto rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveImage(field.id)}
                      >
                        删除
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-32"
                      onClick={() => handleImageUpload(field.id)}
                    >
                      {field.placeholder}
                    </Button>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}

        <Separator className="my-6" />

        <div className="flex justify-between items-center">
          <div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <Button type="submit" disabled={isLoading || !formData.prompt.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                {imageUrl ? <CheckCircle className="mr-2 h-4 w-4" /> : null}
                {imageUrl ? "重新生成" : "生成图片"}
              </>
            )}
          </Button>
        </div>
      </form>

      {imageUrl && (
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">生成结果</h2>
          <div className="relative">
            <img src={imageUrl} alt="生成的图片" className="w-full h-auto rounded-lg" />
            <Button
              className="absolute top-2 right-2"
              size="sm"
              onClick={() => window.open(imageUrl, "_blank")}
            >
              在新窗口打开
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 