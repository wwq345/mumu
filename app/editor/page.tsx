"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import {
  Download,
  ArrowLeft,
  Upload,
  Brush,
  Loader2,
  CheckCircle,
  Search,
  ChevronDown,
  LayoutTemplate,
  ImageIcon,
  FileIcon as FilePresentation,
  BarChart,
  Filter,
  PanelTop,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// 定义工作流ID的类型
type WorkflowIds = {
  [key: string]: string;
};

// 定义工作流ID映射关系
const WORKFLOW_IDS: WorkflowIds = {
  // 营销头图场景
  "marketing-header": "7456751735379034153",
  
  // 海报设计场景
  "poster": "7456751735379034153",
  
  // 横幅设计场景
  "banner": "7456751735379034153",
  
  // 活动楼层场景
  "activity-floor": "7456751735379034153",
  
  // PPT封面场景
  "ppt-cover": "7456751735379034153",
  
  // 数据报表场景
  "battle-report": "7456751735379034153",
  
  // 模板特定的工作流ID，如果某个模板需要使用特殊的工作流
  "marketing-1": "7456751735379034153", // Seasonal Header
  "marketing-2": "7456751735379034153", // Promotion Header
  "marketing-3": "7456751735379034153", // Festival Header
  "banner-2": "7505972589878525964", // Product Banner
  "poster-promotion-1": "7506032012164972584", // 促销海报-简约
  "marketing-4": "7458978395117453353", // 新增模版3
};

// 获取默认工作流ID作为后备方案
const DEFAULT_WORKFLOW_ID = "7456751735379034153";

// 根据场景和模板获取工作流ID的函数
const getWorkflowId = (scenarioId: string, templateId: string | null) => {
  // 如果有特定模板的工作流ID，优先使用
  if (templateId && WORKFLOW_IDS[templateId]) {
    return WORKFLOW_IDS[templateId];
  }
  
  // 其次使用场景的工作流ID
  if (WORKFLOW_IDS[scenarioId]) {
    return WORKFLOW_IDS[scenarioId];
  }
  
  // 最后使用默认工作流ID
  return DEFAULT_WORKFLOW_ID;
};

async function runCozeWorkflow(parameters = {}, maxRetries = 2, scenarioId: string, templateId: string | null) {
  const apiKey = "pat_XlxqdPUCipTd1sC7AzZCxzo3DNtpNhFQMnGyxoACsHxy4P8OvSgzSARxcnPV3NcN"
  const url = "https://api.coze.cn/v1/workflow/run"

  // 获取对应的工作流ID
  const workflowId = getWorkflowId(scenarioId, templateId);
  console.log(`使用工作流ID: ${workflowId} (场景: ${scenarioId}, 模板: ${templateId || '未指定'})`);

  const payload = {
    workflow_id: workflowId,
    parameters,
  }

  // 重试机制
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`尝试重新请求 (${attempt}/${maxRetries})...`);
        // 每次重试增加延迟，避免过于频繁的请求
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        // 添加超时参数
        // signal: AbortSignal.timeout(15000), // 15秒超时
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(`API请求失败，状态码 ${response.status}: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()

      // 存储工作流ID
      const workflowId = data.workflow_id || payload.workflow_id

      console.log(`工作流执行成功. 工作流ID: ${workflowId}`)

      return { workflowId, data }
    } catch (error) {
      console.error(`执行Coze工作流出错 (尝试 ${attempt + 1}/${maxRetries + 1}):`, error)
      lastError = error;
      
      // 检查是否是服务器维护错误码 720702069
      if (error instanceof Error && error.message.includes('720702069')) {
        console.warn('检测到Coze服务器维护错误 (720702069)，将直接抛出而不重试');
        (error as any).isServerMaintenance = true; // 添加标记，表示这是服务器维护错误
        throw error;
      }
      
      // 如果是网络错误或服务器错误，继续重试
      if (error instanceof Error && (
          error.name === 'AbortError' || 
          error.message.includes('network') || 
          error.message.includes('timeout') ||
          (error.message.includes('status') && error.message.includes('5'))
      )) {
        continue;
      } else {
        // 其他错误直接抛出
        throw error;
      }
    }
  }
  
  // 如果所有重试都失败，抛出最后一个错误
  throw lastError || new Error('请求Coze API失败，达到最大重试次数');
}

// 定义表单字段类型
type FormField = {
  id: string;
  label: string;
  type: string;
  placeholder: string;
}

// 定义模板表单字段映射类型
type TemplateFormFields = {
  [key: string]: FormField[];
}

// 定义场景默认字段映射类型
type ScenarioDefaultFields = {
  [key: string]: FormField[];
}

// 定义表单数据类型
interface FormDataType {
  [key: string]: string | FormDataValue;
  prompt: string;
  toop1: FormDataValue;
  toop2: FormDataValue;
  toop3: FormDataValue;
  toop4: FormDataValue;
  logo1: FormDataValue;
}

type FormDataValue = string | null | { id: string; preview: string; fileName: string };

// 定义事件类型
interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {
  target: HTMLInputElement | HTMLTextAreaElement;
}

// 辅助函数：将表单值转换为字符串
const getInputValue = (value: FormDataValue): string => {
  if (value === null) return "";
  if (typeof value === "object") return value.id;
  return String(value);
};

// 定义状态类型
type Status = "completed" | "processing" | "failed" | "pending";

const getStatusColor = ((status: Status): string => {
  switch (status) {
    case "completed":
      return "bg-green-500"
    case "processing":
      return "bg-blue-500"
    case "failed":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}) as (status: Status) => string;

export default function EditorPage() {
  const searchParams = useSearchParams()
  const initialScenarioId = searchParams.get("scenario") || "poster"

  const [selectedScenario, setSelectedScenario] = useState(initialScenarioId)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [isColorFilterOpen, setIsColorFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedColor, setSelectedColor] = useState("all")
  const [formDataMap, setFormDataMap] = useState<{ [templateId: string]: FormDataType }>({});
  const [formData, setFormData] = useState<FormDataType>({
    prompt: "",
    toop1: null,
    toop2: null,
    toop3: null,
    toop4: null,
    logo1: null,
  })
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [uploadingFields, setUploadingFields] = useState<{ [key: string]: boolean }>({})

  // 场景数据 - 全部使用中文
  const scenarios = [
    {
      id: "poster",
      name: "海报设计",
      icon: <ImageIcon className="h-6 w-6" />,
    },
    {
      id: "banner",
      name: "营销头图",
      icon: <PanelTop className="h-6 w-6" />,
    },
    {
      id: "marketing-header",
      name: "Banner",
      icon: <ImageIcon className="h-6 w-6" />,
    },
    {
      id: "activity-floor",
      name: "活动楼层",
      icon: <LayoutTemplate className="h-6 w-6" />,
    },
    {
      id: "ppt-cover",
      name: "PPT封面",
      icon: <FilePresentation className="h-6 w-6" />,
    },
    {
      id: "battle-report",
      name: "战报设计",
      icon: <BarChart className="h-6 w-6" />,
    },
  ]

  // 分类数据 - 基于选择的场景提供不同的分类
  const getCategoriesByScenario = (scenarioId: string) => {
    const commonCategories = [{ id: "all", name: "全部" }]

    switch (scenarioId) {
      case "poster":
        return [
          ...commonCategories,
          { id: "promotion", name: "促销" },
          { id: "referral", name: "推荐" },
          { id: "recruitment", name: "招聘" },
          { id: "communication", name: "沟通" },
          { id: "corporate", name: "企业" },
        ]
      case "banner":
        return [
          ...commonCategories,
          { id: "promotion", name: "促销" },
          { id: "product", name: "产品" },
        ]
      case "marketing-header":
        return [
          ...commonCategories,
          { id: "seasonal", name: "季节" },
          { id: "promotion", name: "促销" },
          { id: "festival", name: "节日" },
        ]
      case "activity-floor":
        return [
          ...commonCategories,
          { id: "product", name: "产品" },
          { id: "category", name: "类别" },
          { id: "promotion", name: "促销" },
        ]
      case "ppt-cover":
        return [
          ...commonCategories,
          { id: "business", name: "商业" },
          { id: "training", name: "培训" },
          { id: "proposal", name: "提案" },
        ]
      case "battle-report":
        return [
          ...commonCategories,
          { id: "data", name: "数据报告" },
          { id: "achievement", name: "成就" },
          { id: "summary", name: "总结" },
        ]
      default:
        return commonCategories
    }
  }

  // Get categories for current scenario
  const categories = getCategoriesByScenario(selectedScenario)

  // 颜色数据
  const colors = [
    { id: "all", name: "全部", hex: "#FFFFFF" },
    { id: "red", name: "红色", hex: "#FF4D4F" },
    { id: "blue", name: "蓝色", hex: "#1890FF" },
    { id: "green", name: "绿色", hex: "#52C41A" },
    { id: "yellow", name: "黄色", hex: "#FAAD14" },
    { id: "purple", name: "紫色", hex: "#722ED1" },
  ]

  // Template data - provide different templates based on scenario
  const getTemplates = (scenarioId: string) => {
    switch (scenarioId) {
      case "poster":
        return [
          {
            id: "poster-promotion-1",
            name: "卡通线条风格",
            image: "/images/covers/poster-promotion-1.jpg",
            isPopular: true,
            category: "promotion",
            color: "blue",
          },
        ]
      case "banner":
        return [
          {
            id: "banner-1",
            name: "模版1",
            image: "/images/covers/banner-1.jpg",
            isPopular: true,
            category: "promotion",
            color: "red",
          },
          {
            id: "banner-2",
            name: "模版2",
            image: "/images/covers/banner-2.jpg",
            isPopular: false,
            category: "product",
            color: "blue",
          },
        ]
      case "marketing-header":
        return [
          {
            id: "marketing-1",
            name: "Seasonal Header",
            image: "/placeholder.svg?height=300&width=200&text=Seasonal Header",
            isPopular: true,
            category: "seasonal",
            color: "green",
          },
          {
            id: "marketing-2",
            name: "Promotion Header",
            image: "/placeholder.svg?height=300&width=200&text=Promotion Header",
            isPopular: false,
            category: "promotion",
            color: "red",
          },
          {
            id: "marketing-3",
            name: "Festival Header",
            image: "/placeholder.svg?height=300&width=200&text=Festival Header",
            isPopular: true,
            category: "festival",
            color: "yellow",
          },
          {
            id: "marketing-4",
            name: "模版3",
            image: "/placeholder.svg?height=300&width=200&text=模版3",
            isPopular: false,
            category: "promotion",
            color: "yellow",
          },
        ]
      case "activity-floor":
        return [
          {
            id: "floor-1",
            name: "Product Display Floor",
            image: "/placeholder.svg?height=300&width=200&text=Product Display Floor",
            isPopular: true,
            category: "product",
            color: "blue",
          },
          {
            id: "floor-2",
            name: "Category Navigation Floor",
            image: "/placeholder.svg?height=300&width=200&text=Category Navigation Floor",
            isPopular: false,
            category: "category",
            color: "green",
          },
          {
            id: "floor-3",
            name: "Promotion Activity Floor",
            image: "/placeholder.svg?height=300&width=200&text=Promotion Activity Floor",
            isPopular: true,
            category: "promotion",
            color: "red",
          },
        ]
      case "ppt-cover":
        return [
          {
            id: "ppt-1",
            name: "Business Report Cover",
            image: "/placeholder.svg?height=300&width=200&text=Business Report Cover",
            isPopular: true,
            category: "business",
            color: "blue",
          },
          {
            id: "ppt-2",
            name: "Training Material Cover",
            image: "/placeholder.svg?height=300&width=200&text=Training Material Cover",
            isPopular: false,
            category: "training",
            color: "green",
          },
          {
            id: "ppt-3",
            name: "Project Proposal Cover",
            image: "/placeholder.svg?height=300&width=200&text=Project Proposal Cover",
            isPopular: true,
            category: "proposal",
            color: "purple",
          },
        ]
      case "battle-report":
        return [
          {
            id: "report-1",
            name: "Data Report Long Image",
            image: "/placeholder.svg?height=300&width=200&text=Data Report Long Image",
            isPopular: true,
            category: "data",
            color: "blue",
          },
          {
            id: "report-2",
            name: "Achievement Display Long Image",
            image: "/placeholder.svg?height=300&width=200&text=Achievement Display Long Image",
            isPopular: false,
            category: "achievement",
            color: "red",
          },
          {
            id: "report-3",
            name: "Work Summary Long Image",
            image: "/placeholder.svg?height=300&width=200&text=Work Summary Long Image",
            isPopular: true,
            category: "summary",
            color: "green",
          },
        ]
      default:
        return []
    }
  }

  // 获取当前场景的模板
  const templates = getTemplates(selectedScenario)

  // 筛选模板
  const filteredTemplates = templates.filter((template) => {
    // 搜索筛选
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase())

    // 分类筛选
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory

    // 颜色筛选
    const matchesColor = selectedColor === "all" || template.color === selectedColor

    return matchesSearch && matchesCategory && matchesColor
  })

  // 更新常量定义
  const TEMPLATE_FORM_FIELDS: TemplateFormFields = {
    // 营销头图模板 - 市场推广
    "marketing-2": [
      { id: "prompt", label: "提示词", type: "textarea", placeholder: "输入推广文案，例如：五一大促，全场5折" },
      { id: "toop1", label: "背景图片", type: "image", placeholder: "上传背景图片" },
      { id: "logo1", label: "Logo", type: "image", placeholder: "上传品牌Logo" },
    ],
    
    // 营销头图模板 - 季节性
    "marketing-1": [
      { id: "prompt", label: "提示词", type: "textarea", placeholder: "输入季节主题，例如：夏日清凉" },
      { id: "toop1", label: "主图", type: "image", placeholder: "上传主题图片" },
      { id: "toop2", label: "辅助图", type: "image", placeholder: "上传辅助图片" },
    ],
    
    // 营销头图模板 - 节日
    "marketing-3": [
      { id: "prompt", label: "提示词", type: "textarea", placeholder: "输入节日名称和祝福语" },
      { id: "toop1", label: "节日图片", type: "image", placeholder: "上传节日相关图片" },
      { id: "toop2", label: "产品图片", type: "image", placeholder: "上传产品图片" },
    ],
    
    // 促销海报-简约（与工作流 7506032012164972584 输入一致）
    "poster-promotion-1": [
      { id: "input", label: "描述", type: "textarea", placeholder: "请输入主题描述" },
      { id: "logo", label: "二维码", type: "image", placeholder: "上传二维码图片" },
    ],
    
    // 新增模版3（与工作流 7458978395117453353 输入一致）
    "marketing-4": [
      { id: "tup", label: "主图", type: "image", placeholder: "上传主图" },
      { id: "prompt", label: "文案", type: "textarea", placeholder: "请输入文案" },
      { id: "logo", label: "Logo图片", type: "image", placeholder: "上传Logo图片" },
    ],
    
    // 默认字段 - 用于未配置的模板
    "default": [
      { id: "prompt", label: "描述", type: "textarea", placeholder: "输入营销活动的描述" },
      { id: "toop1", label: "商品1", type: "image", placeholder: "上传透明商品图" },
      { id: "toop2", label: "商品2", type: "image", placeholder: "上传透明商品图" },
      { id: "toop3", label: "商品3", type: "image", placeholder: "上传透明商品图" },
      { id: "toop4", label: "商品4", type: "image", placeholder: "上传透明商品图" },
      { id: "logo1", label: "Logo", type: "image", placeholder: "上传Logo" },
    ],

    // Product Banner（与工作流 7505972589878525964 输入一致）
    "banner-2": [
      { id: "input", label: "描述", type: "textarea", placeholder: "输入营销活动的描述" },
      { id: "a", label: "商品1", type: "image", placeholder: "上传透明商品图" },
      { id: "b", label: "商品2", type: "image", placeholder: "上传透明商品图" },
      { id: "c", label: "商品3", type: "image", placeholder: "上传透明商品图" },
    ],
  };
  
  const SCENARIO_DEFAULT_FIELDS: ScenarioDefaultFields = {
    "marketing-header": TEMPLATE_FORM_FIELDS["marketing-2"], // 营销头图默认使用推广配置
    "poster": TEMPLATE_FORM_FIELDS["poster-promotion-1"],
    // 可以根据需要添加更多场景的默认配置
  };

  // 获取表单字段 - 根据选定的场景和模板ID
  const getFormFields = (scenarioId: string) => {
    // 如果有选择特定模板，优先使用模板的字段配置
    if (selectedTemplate && TEMPLATE_FORM_FIELDS[selectedTemplate]) {
      return TEMPLATE_FORM_FIELDS[selectedTemplate];
    }
    
    // 如果没有特定模板或模板没有配置，使用场景默认配置
    if (SCENARIO_DEFAULT_FIELDS[scenarioId]) {
      return SCENARIO_DEFAULT_FIELDS[scenarioId];
    }
    
    // 最后的后备方案 - 使用默认字段
    return TEMPLATE_FORM_FIELDS["default"];
  }

  const formFields = getFormFields(selectedScenario)

  // 选择模板
  useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0].id)
    }
  }, [templates, selectedTemplate])

  // 切换模板时，自动切换内容
  useEffect(() => {
    if (selectedTemplate) {
      setFormData(
        formDataMap[selectedTemplate] || {
          prompt: "",
          toop1: null,
          toop2: null,
          toop3: null,
          toop4: null,
          logo1: null,
        }
      );
    }
  }, [selectedTemplate]);

  // 编辑内容时，实时同步到formDataMap
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [id]: value };
      if (selectedTemplate) {
        setFormDataMap((map) => ({ ...map, [selectedTemplate]: newData }));
      }
      return newData;
    });
  };

  // 处理场景变化
  const handleScenarioChange = (scenarioId: string): void => {
    setSelectedScenario(scenarioId)
    setSelectedTemplate(null)
    setSelectedCategory("all")
    setSelectedColor("all")
  }

  // 图片上传等其它setFormData的地方也要同步formDataMap
  const handleImageUpload = async (fieldId: string): Promise<void> => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setUploadingFields((prev) => ({ ...prev, [fieldId]: true }));
      try {
        const formDataObj = new FormData();
        formDataObj.append("file", file);
        const response = await fetch("https://api.coze.cn/v1/files/upload", {
          method: "POST",
          headers: {
            "Authorization": `Bearer pat_XlxqdPUCipTd1sC7AzZCxzo3DNtpNhFQMnGyxoACsHxy4P8OvSgzSARxcnPV3NcN`,
            "Accept": "application/json",
          },
          body: formDataObj,
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            `上传失败: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`
          );
        }
        const data = await response.json();
        const fileId = data.id || (data.data && data.data.id);
        if (!fileId) {
          console.error('响应数据结构:', data);
          throw new Error('上传成功但未收到file_id，请检查控制台日志');
        }
        setFormData((prev) => {
          const newData = {
            ...prev,
            [fieldId]: {
              id: fileId,
              preview: URL.createObjectURL(file),
              fileName: file.name,
            },
          };
          if (selectedTemplate) {
            setFormDataMap((map) => ({ ...map, [selectedTemplate]: newData }));
          }
          return newData;
        });
        console.log('图片上传成功:', { fieldId, fileId });
      } catch (error) {
        console.error(`上传图片到Coze API失败:`, error);
        let errorMessage = '上传失败，请稍后重试';
        if (error instanceof Error) {
          if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
            errorMessage = '网络连接错误，请检查您的网络连接';
          } else if (error.message.includes('401')) {
            errorMessage = 'API密钥无效或已过期';
          } else if (error.message.includes('413')) {
            errorMessage = '文件太大';
          } else {
            errorMessage = error.message;
          }
        }
        alert(errorMessage);
      } finally {
        setUploadingFields((prev) => ({ ...prev, [fieldId]: false }));
      }
    };
    fileInput.click();
  };

  // 更新后的生成函数，用于提取和保存从响应中获取的图片URL
  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true)
    setIsGenerated(false)
    setGeneratedImageUrl(null)

    try {
      // 获取当前模板的表单数据
      const currentFormData = formDataMap[selectedTemplate] || formData;
      console.log("提示词内容:", currentFormData.prompt)

      // 获取当前模板的字段配置
      const currentFields = selectedTemplate && TEMPLATE_FORM_FIELDS[selectedTemplate] 
        ? TEMPLATE_FORM_FIELDS[selectedTemplate]
        : SCENARIO_DEFAULT_FIELDS[selectedScenario] || TEMPLATE_FORM_FIELDS["default"];
      
      // 创建参数对象，与Coze工作流需要的输入字段完全匹配
      interface Parameters {
        [key: string]: any;
        prompt: string;
      }
      
      const parameters: Parameters = {
        prompt: currentFormData.prompt || "",
      }
      
      // 根据当前模板的字段配置，添加所有需要的参数
      currentFields.forEach(field => {
        // 跳过提示词，因为已经添加过了
        if (field.id === "prompt") return;
        
        const fieldValue = currentFormData[field.id];
        
        // 检查字段是否有值，并且是图片类型
        if (fieldValue && field.type === "image") {
          const fileId = typeof fieldValue === 'object' ? fieldValue.id : fieldValue;
          
          // 使用字段ID作为参数名，保持一致性
          parameters[field.id] = {
            type: "file",
            file_id: fileId
          };
        } else if (fieldValue) {
          // 对于非图片类型的字段，直接添加值
          parameters[field.id] = fieldValue;
        }
      });
      
      // 记录用于调试
      console.log("当前使用的模板ID:", selectedTemplate);
      console.log("当前使用的字段配置:", currentFields.map(f => f.id).join(", "));

      // 记录发送给API的完整参数对象
      console.log("发送给API的参数:", parameters)

      // 执行Coze工作流，传递场景ID和模板ID
      const { workflowId, data } = await runCozeWorkflow(
        parameters, 
        2, 
        selectedScenario,  // 传入当前场景ID
        selectedTemplate   // 传入当前模板ID
      )

      // 存储工作流ID以便后续使用
      console.log(`设计已生成，工作流ID: ${workflowId}`)

      // 处理响应数据以提取图片URL
      try {
        // 首先检查是否有错误码
        if (data.code !== undefined && data.code !== 0) {
          console.error(`API返回错误: 代码 ${data.code}, 消息: ${data.msg || "未知错误"}`);
          throw new Error(`Coze API返回错误: ${data.msg || "未知错误"}`);
        }
        
        console.log("完整响应数据:", data);
        
        // 通用URL提取函数 - 增强版
        const extractUrlFromText = (text: string) => {
          if (!text) return null;
          
          // 如果文本本身就是URL
          if (text.startsWith('http')) return text;
          
          // 尝试从文本中提取URL - 更宽松的正则表达式
          const urlMatch = text.match(/(https?:\/\/[^\s"'><\[\]{}()\\\n]+)/g);
          return urlMatch && urlMatch.length > 0 ? urlMatch[0] : null;
        };

        // 递归搜索对象中的URL
        const findUrlInObject = (obj: any): string | null => {
          if (!obj) return null;
          
          // 直接检查是否为URL字符串
          if (typeof obj === 'string') {
            const url = extractUrlFromText(obj);
            if (url) return url;
          }
          
          // 如果是数组，遍历每个元素
          if (Array.isArray(obj)) {
            for (const item of obj) {
              const url = findUrlInObject(item);
              if (url) return url;
            }
            return null;
          }
          
          // 如果是对象，检查常见的URL字段
          if (typeof obj === 'object') {
            const urlKeys = ['url', 'image', 'img', 'imageUrl', 'src', 'href', 'link', 'output', 'result'];
            
            // 首先检查常见字段
            for (const key of urlKeys) {
              if (obj[key] && typeof obj[key] === 'string') {
                const url = extractUrlFromText(obj[key]);
                if (url) return url;
              }
            }
            
            // 递归检查所有其他字段
            for (const key in obj) {
              if (obj[key] && typeof obj[key] === 'object') {
                const url = findUrlInObject(obj[key]);
                if (url) return url;
              }
            }
          }
          
          return null;
        };
        
        // 主要图片提取逻辑 - 尝试多种方法
        let imageUrl = null;
        
        // 1. 尝试使用我们的递归搜索函数
        imageUrl = findUrlInObject(data);
        if (imageUrl) {
          console.log("通过递归搜索找到图片URL:", imageUrl);
          setGeneratedImageUrl(imageUrl);
          setIsGenerated(true);
          return;
        }
        
        // 2. 如果data.data是字符串，尝试直接提取
        if (typeof data.data === 'string') {
          imageUrl = extractUrlFromText(data.data);
          if (imageUrl) {
            console.log("直接从data.data提取URL:", imageUrl);
            setGeneratedImageUrl(imageUrl);
            setIsGenerated(true);
            return;
          }
          
          // 尝试解析JSON
          try {
            const jsonData = JSON.parse(data.data);
            imageUrl = findUrlInObject(jsonData);
            if (imageUrl) {
              console.log("从data.data的JSON中提取URL:", imageUrl);
              setGeneratedImageUrl(imageUrl);
              setIsGenerated(true);
              return;
            }
          } catch (e) {
            // 不是有效的JSON，忽略错误
          }
        }
        
        // 3. 如果现有方法都失败了，尝试直接序列化整个响应并搜索URL
        try {
          const dataStr = JSON.stringify(data);
          const allUrls = dataStr.match(/(https?:\/\/[^\s"'><\[\]{}()\\\n]+)/g) || [];
          
          // 筛选可能的图片URL（通常包含常见图片域名或扩展名）
          const imageUrlCandidates = allUrls.filter(url => 
            url.match(/\.(jpg|jpeg|png|gif|webp|svg)/) || 
            url.includes('image') || 
            url.includes('img') || 
            url.includes('cdn') ||
            url.includes('storage')
          );
          
          if (imageUrlCandidates.length > 0) {
            imageUrl = imageUrlCandidates[0];
            console.log("通过全文搜索提取URL:", imageUrl);
            setGeneratedImageUrl(imageUrl);
            setIsGenerated(true);
            return;
          }
        } catch (e) {
          console.error("序列化响应时出错:", e);
        }
        
        // 如果所有方法都失败，记录警告
        console.warn("无法从任何已知格式中提取图片URL:", data);
        alert("生成成功，但无法识别图片URL格式。请检查API响应格式并更新代码。");
        
      } catch (parseError) {
        console.error("处理响应时出错:", parseError);
      }

      // Update UI to show generation is complete
      setIsGenerated(true)
    } catch (error) {
      console.error("生成设计时出错:", error)
      
      // 提供更详细的错误信息给用户
      if (error instanceof Error) {
        if (error.message.includes("Coze API返回错误")) {
          // 显示来自Coze API的具体错误信息
          if (error.message.includes("720702069")) {
            // 特定处理服务器暂时性问题
            alert("Coze服务器目前正在维护或遇到临时问题。请稍后再试。这是服务器端的问题，不是您的应用程序问题。")
            console.log("遇到Coze服务器临时问题，错误代码：720702069")
          } else {
            alert(`设计生成失败: ${error.message}. 请稍后再试或联系管理员。`)
          }
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
          // 网络错误
          alert("网络连接错误: 请检查您的网络连接并再试一次。")
        } else {
          // 其他错误
          alert("生成设计时出错，请再试一次。")
        }
      } else {
        alert("生成设计失败，请稍后再试。")
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // 处理导出
  const handleExport = () => {
    if (generatedImageUrl) {
      // 如果我们有生成的图片URL，在新标签页中打开或触发下载
      window.open(generatedImageUrl, "_blank")
    } else {
      // 当没有可用的图片URL时的后备方案
      console.log("触发了导出但没有可用的图片URL")
      alert("没有可供导出的图片")
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 ml-8">
              <Brush className="h-5 w-5 text-primary" />
              <span className="font-bold">DesignFlow</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                返回场景选择
              </Button>
            </Link>
          </div>

          <Button onClick={handleExport} disabled={!isGenerated || !generatedImageUrl}>
            <Download className="h-4 w-4 mr-2" />
            导出图片
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 左侧 - 场景选择 */}
        <div className="w-[70px] border-r bg-background flex flex-col items-center py-4">
          {scenarios.map((scenario) => {
            const devIds = ["marketing-header", "activity-floor", "ppt-cover", "battle-report"];
            const isDev = devIds.includes(scenario.id);
            const menuItem = (
              <div
                className={cn(
                  "flex flex-col items-center justify-center w-full py-3 px-2 cursor-pointer",
                  selectedScenario === scenario.id
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:bg-muted",
                  isDev && "opacity-60 cursor-not-allowed"
                )}
              >
                {scenario.icon}
                <span className="text-xs mt-1 text-center">{scenario.name}</span>
              </div>
            );
            return isDev ? (
              <div key={scenario.id} style={{pointerEvents: 'none', userSelect: 'none'}}>{menuItem}</div>
            ) : (
              <div key={scenario.id} onClick={() => handleScenarioChange(scenario.id)}>{menuItem}</div>
            );
          })}
        </div>

        {/* 中间 - 模板选择 */}
        <div className="w-[240px] border-r bg-background overflow-y-auto">
          <div className="p-4 border-b sticky top-0 bg-background z-10">
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索模板"
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
                                {/* 分类筛选下拉菜单 */}
                  <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full flex items-center justify-between">
                    <div className="flex items-center truncate">
                      <span className="truncate">
                        {selectedCategory === "all"
                          ? "分类"
                          : categories.find((c) => c.id === selectedCategory)?.name}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 ml-1 min-w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[160px]">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(selectedCategory === category.id && "bg-primary/10 font-medium")}
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

                                {/* 颜色筛选下拉菜单 */}
                  <DropdownMenu open={isColorFilterOpen} onOpenChange={setIsColorFilterOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full flex items-center justify-between">
                    <div className="flex items-center truncate">
                      {selectedColor !== "all" && (
                        <div
                          className="h-3 w-3 min-w-3 rounded-full mr-2"
                          style={{ backgroundColor: colors.find((c) => c.id === selectedColor)?.hex }}
                        />
                      )}
                      <span className="truncate">
                        {selectedColor === "all" ? "颜色" : colors.find((c) => c.id === selectedColor)?.name}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 ml-1 min-w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  {colors.map((color) => (
                    <DropdownMenuItem
                      key={color.id}
                      onClick={() => {
                        setSelectedColor(color.id)
                        setIsColorFilterOpen(false)
                      }}
                      className={cn("flex items-center", selectedColor === color.id && "bg-primary/10 font-medium")}
                    >
                      {color.id !== "all" && (
                        <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: color.hex }} />
                      )}
                      {color.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 p-4">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={cn(
                    "relative rounded-lg overflow-hidden cursor-pointer transition-all",
                    selectedTemplate === template.id
                      ? "ring-2 ring-primary border border-primary"
                      : "hover:ring-1 hover:ring-primary border-0",
                  )}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  {/* 模板图片区域 */}
                  <div className="relative aspect-[16/9] bg-gray-200">
                    <Image
                      src={template.image || "/placeholder.svg"}
                      alt={template.name}
                      fill
                      className="object-cover"
                    />

                    {/* 热门标签 */}
                    {template.isPopular && (
                      <div className="absolute top-0 right-0 bg-black text-white text-xs px-2 py-1 rounded-bl-md">
                        热门
                      </div>
                    )}

                    {/* 颜色指示器 */}
                    <div
                      className="absolute bottom-2 right-2 h-4 w-4 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: colors.find((c) => c.id === template.color)?.hex }}
                    />
                  </div>

                  {/* 模板名称区域 */}
                  <div className="p-2 bg-white">
                    <p className="text-sm font-medium">{template.name}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <Filter className="h-12 w-12 mb-2 opacity-20" />
                <p>未找到匹配的模板</p>
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => {
                    setSelectedCategory("all")
                    setSelectedColor("all")
                    setSearchQuery("")
                  }}
                >
                  清除筛选
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 中间 - 预览区域 */}
        <div className="flex-1 bg-muted/30 overflow-auto flex items-center justify-center p-4">
          <div className="relative">
            <div className="bg-white shadow-lg rounded-md p-8 flex flex-col items-center max-w-4xl w-full text-center mx-auto">
              {isGenerating ? (
                <>
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-lg font-medium">设计生成中...</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    请稍候，我们正在为您创建精美的设计
                  </p>
                </>
              ) : isGenerated && generatedImageUrl ? (
                <div className="w-full">
                  <img
                    src={generatedImageUrl}
                    alt="生成的设计"
                    style={{ maxWidth: "90%", maxHeight: "80vh", width: "auto", height: "auto", display: "block", margin: "0 auto" }}
                    className="mb-4 rounded-md"
                    onLoad={() => console.log("图片加载成功")}
                    onError={(e) => {
                      console.error("图片加载失败:", generatedImageUrl);
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <p className="text-sm text-muted-foreground">生成成功！</p>
                  <a 
                    href={generatedImageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    查看原图
                  </a>
                </div>
              ) : (
                <>
                  <p className="text-lg font-medium">请在右侧填写内容并点击生成按钮</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    填写提示词并上传图片，我们将为您生成精美的设计
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 右侧 - 内容输入区域 */}
        <div className="w-[300px] border-l bg-background overflow-y-auto">
          <ScrollArea className="h-full">
            <div className="p-4">
              <h3 className="font-medium mb-4">内容设置</h3>

              <div className="space-y-4">
                {/* 表单字段 */}
                {formFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.id}
                        placeholder={field.placeholder}
                        value={getInputValue(formData[field.id])}
                        onChange={handleInputChange}
                        className="resize-none"
                        rows={3}
                      />
                    ) : field.type === "image" ? (
                      <Card className="border-dashed">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                          {formData[field.id] ? (
                            <div className="w-full">
                              <div className="relative aspect-[16/9] w-full mb-2 overflow-hidden rounded-md bg-gray-100">
                                {uploadingFields[field.id] ? (
                                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                  </div>
                                ) : (
                                  <img
                                    src={typeof formData[field.id] === 'object' && formData[field.id] !== null
                                      ? (formData[field.id] as { preview: string }).preview
                                      : String(formData[field.id])}
                                    alt={`${field.label}`}
                                    className="absolute w-full h-full object-contain"
                                    style={{
                                      maxWidth: '100%',
                                      maxHeight: '100%',
                                    }}
                                  />
                                )}
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleImageUpload(field.id)}
                                className="w-full"
                                disabled={uploadingFields[field.id]}
                              >
                                {uploadingFields[field.id] ? '上传中...' : `更改${field.label}`}
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground mb-2">
                                {field.placeholder}（非必填）
                              </p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleImageUpload(field.id)}
                                disabled={uploadingFields[field.id]}
                              >
                                {uploadingFields[field.id] ? '上传中...' : `上传${field.label}`}
                              </Button>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <Input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={getInputValue(formData[field.id])}
                        onChange={handleInputChange as any}
                      />
                    )}
                  </div>
                ))}

                <Separator className="my-4" />

                {/* 生成按钮 */}
                <Button className="w-full" size="lg" onClick={handleGenerate} disabled={isGenerating}>
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
            </div>
          </ScrollArea>
        </div>
      </div>

      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground ml-8">© 2025 DesignFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
