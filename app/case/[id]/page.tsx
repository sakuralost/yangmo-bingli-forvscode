"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ArrowLeft, Edit, ImagePlus } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Label } from "@/components/ui/label"

// 模拟数据，实际应用中应从API获取
const caseData = {
  id: "1",
  name: "张三",
  symptom: "头痛",
  contact: "13800138000",
  gender: "男",
  age: 45,
  diagnoses: [
    {
      id: "1",
      content: "患者反映头痛持续一周，伴有轻微眩晕。建议进行头部CT检查，排除器质性病变。",
      createdAt: new Date("2023-04-10T09:30:00").toISOString(),
      updatedAt: null,
      images: [],
    },
    {
      id: "2",
      content: "CT检查结果正常，无明显异常。诊断为紧张性头痛，开具止痛药物。",
      createdAt: new Date("2023-04-15T14:20:00").toISOString(),
      updatedAt: null,
      images: [],
    },
  ],
}

export default function CaseDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [caseDetails, setCaseDetails] = useState(caseData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newDiagnosis, setNewDiagnosis] = useState("")
  const [newDiagnosisImages, setNewDiagnosisImages] = useState<File[]>([])
  const [newDiagnosisImageUrls, setNewDiagnosisImageUrls] = useState<string[]>([])
  const [editDiagnosis, setEditDiagnosis] = useState({ id: "", content: "" })
  const [editDiagnosisImages, setEditDiagnosisImages] = useState<File[]>([])
  const [editDiagnosisImageUrls, setEditDiagnosisImageUrls] = useState<string[]>([])

  // 实际应用中，应该在组件挂载时从API获取数据
  useEffect(() => {
    // 从 localStorage 获取病例数据
    const savedCasesJSON = localStorage.getItem("cases")
    if (savedCasesJSON) {
      const savedCases = JSON.parse(savedCasesJSON)
      const foundCase = savedCases.find((c) => c.id === params.id)
      if (foundCase) {
        setCaseDetails(foundCase)
      }
    }

    // 模拟API调用
    // const fetchCaseDetails = async () => {
    //   const response = await fetch(`/api/cases/${params.id}`)
    //   const data = await response.json()
    //   setCaseDetails(data)
    // }
    // fetchCaseDetails()
  }, [params.id])

  // 添加图片处理函数
  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)
      setNewDiagnosisImages((prev) => [...prev, ...newImages])

      // 创建预览URL
      const newImageUrls = newImages.map((file) => URL.createObjectURL(file))
      setNewDiagnosisImageUrls((prev) => [...prev, ...newImageUrls])
    }
  }

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)
      setEditDiagnosisImages((prev) => [...prev, ...newImages])

      // 创建预览URL
      const newImageUrls = newImages.map((file) => URL.createObjectURL(file))
      setEditDiagnosisImageUrls((prev) => [...prev, ...newImageUrls])
    }
  }

  // 修改添加诊断记录函数
  const handleAddDiagnosis = async () => {
    if (!newDiagnosis.trim()) {
      alert("诊断记录不能为空")
      return
    }

    // 处理图片，将File对象转换为可存储的格式
    const imageDataUrls = await Promise.all(
      newDiagnosisImages.map(async (file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
          reader.readAsDataURL(file)
        })
      }),
    )

    // 创建新的诊断记录
    const newDiagnosisData = {
      id: Date.now().toString(),
      content: newDiagnosis,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      images: imageDataUrls.map((dataUrl, index) => ({
        id: `img_${Date.now()}_${index}`,
        dataUrl,
        name: newDiagnosisImages[index].name,
      })),
    }

    // 更新本地状态
    const updatedCaseDetails = {
      ...caseDetails,
      diagnoses: [...(caseDetails.diagnoses || []), newDiagnosisData],
      lastDiagnosisTime: new Date().toISOString(),
    }

    setCaseDetails(updatedCaseDetails)

    // 更新 localStorage
    const savedCasesJSON = localStorage.getItem("cases")
    if (savedCasesJSON) {
      const savedCases = JSON.parse(savedCasesJSON)
      const updatedCases = savedCases.map((c) => (c.id === params.id ? updatedCaseDetails : c))
      localStorage.setItem("cases", JSON.stringify(updatedCases))
    }

    // 重置状态
    setNewDiagnosis("")
    setNewDiagnosisImages([])
    setNewDiagnosisImageUrls([])
    setIsAddDialogOpen(false)
  }

  // 修改编辑诊断记录函数
  const handleEditDiagnosis = async () => {
    if (!editDiagnosis.content.trim()) {
      alert("诊断记录不能为空")
      return
    }

    // 找到要修改的诊断记录
    const diagnosisToUpdate = caseDetails.diagnoses.find((d) => d.id === editDiagnosis.id)

    if (!diagnosisToUpdate) {
      alert("找不到要修改的诊断记录")
      return
    }

    // 处理图片，将File对象转换为可存储的格式
    const imageDataUrls = await Promise.all(
      editDiagnosisImages.map(async (file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
          reader.readAsDataURL(file)
        })
      }),
    )

    // 创建更新后的诊断记录
    const updatedDiagnosisData = {
      ...diagnosisToUpdate,
      content: editDiagnosis.content,
      updatedAt: new Date().toISOString(),
      images: [
        ...(diagnosisToUpdate.images || []),
        ...imageDataUrls.map((dataUrl, index) => ({
          id: `img_${Date.now()}_${index}`,
          dataUrl,
          name: editDiagnosisImages[index].name,
        })),
      ],
    }

    // 更新本地状态
    const updatedCaseDetails = {
      ...caseDetails,
      diagnoses: caseDetails.diagnoses.map((d) => (d.id === editDiagnosis.id ? updatedDiagnosisData : d)),
      lastDiagnosisTime: new Date().toISOString(),
    }

    setCaseDetails(updatedCaseDetails)

    // 更新 localStorage
    const savedCasesJSON = localStorage.getItem("cases")
    if (savedCasesJSON) {
      const savedCases = JSON.parse(savedCasesJSON)
      const updatedCases = savedCases.map((c) => (c.id === params.id ? updatedCaseDetails : c))
      localStorage.setItem("cases", JSON.stringify(updatedCases))
    }

    // 重置状态
    setEditDiagnosis({ id: "", content: "" })
    setEditDiagnosisImages([])
    setEditDiagnosisImageUrls([])
    setIsEditDialogOpen(false)
  }

  // 修改打开编辑对话框的函数
  const openEditDialog = (diagnosis) => {
    setEditDiagnosis({
      id: diagnosis.id,
      content: diagnosis.content,
    })
    // 如果有图片，设置图片URL
    if (diagnosis.images && diagnosis.images.length > 0) {
      setEditDiagnosisImageUrls(diagnosis.images.map((img) => img.dataUrl))
    } else {
      setEditDiagnosisImageUrls([])
    }
    setEditDiagnosisImages([])
    setIsEditDialogOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Button variant="ghost" className="mb-4 pl-0" onClick={() => router.push("/")}>
        <ArrowLeft className="mr-2" size={16} />
        返回
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>病例详情</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">病例名称</p>
            <p className="font-medium">{caseDetails.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">病症名称</p>
            <p>{caseDetails.symptom || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">联系方式</p>
            <p>{caseDetails.contact || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">性别</p>
            <p>{caseDetails.gender || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">年龄</p>
            <p>{caseDetails.age || "-"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">诊断记录</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>新增诊断记录</Button>
      </div>

      <div className="space-y-4">
        {caseDetails.diagnoses.map((diagnosis) => (
          <Card key={diagnosis.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm text-gray-500">
                  {formatDate(diagnosis.createdAt)}
                  {diagnosis.updatedAt && <span className="ml-2">(已修改于 {formatDate(diagnosis.updatedAt)})</span>}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    openEditDialog(diagnosis)
                  }}
                >
                  <Edit size={16} className="mr-1" />
                  修改
                </Button>
              </div>
              <p className="whitespace-pre-line mb-4">{diagnosis.content}</p>

              {/* 显示诊断记录的图片 */}
              {diagnosis.images && diagnosis.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">附件图片：</p>
                  <div className="flex flex-wrap gap-2">
                    {diagnosis.images.map((image, index) => (
                      <div key={image.id} className="relative w-24 h-24">
                        <img
                          src={image.dataUrl || "/placeholder.svg"}
                          alt={`诊断图片 ${index + 1}`}
                          className="w-full h-full object-cover rounded-md cursor-pointer"
                          onClick={() => window.open(image.dataUrl, "_blank")}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 新增诊断记录对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>新增诊断记录</DialogTitle>
          </DialogHeader>
          <Textarea
            value={newDiagnosis}
            onChange={(e) => setNewDiagnosis(e.target.value)}
            placeholder="请输入诊断记录..."
            rows={6}
          />

          {/* 图片上传区域 */}
          <div className="space-y-2">
            <Label>上传图片</Label>
            <div className="flex flex-wrap gap-2">
              {newDiagnosisImageUrls.map((url, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`上传图片 ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    onClick={() => {
                      setNewDiagnosisImageUrls((prev) => prev.filter((_, i) => i !== index))
                      setNewDiagnosisImages((prev) => prev.filter((_, i) => i !== index))
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
              <label className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
                <ImagePlus className="text-gray-400" size={20} />
                <input type="file" accept="image/*" multiple onChange={handleNewImageChange} className="hidden" />
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setNewDiagnosis("")
                setNewDiagnosisImages([])
                setNewDiagnosisImageUrls([])
                setIsAddDialogOpen(false)
              }}
            >
              取消
            </Button>
            <Button onClick={handleAddDiagnosis}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 修改诊断记录对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>修改诊断记录</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editDiagnosis.content}
            onChange={(e) => setEditDiagnosis((prev) => ({ ...prev, content: e.target.value }))}
            placeholder="请输入诊断记录..."
            rows={6}
          />

          {/* 图片上传区域 */}
          <div className="space-y-2">
            <Label>上传图片</Label>
            <div className="flex flex-wrap gap-2">
              {editDiagnosisImageUrls.map((url, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`上传图片 ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
              <label className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
                <ImagePlus className="text-gray-400" size={20} />
                <input type="file" accept="image/*" multiple onChange={handleEditImageChange} className="hidden" />
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDiagnosis({ id: "", content: "" })
                setEditDiagnosisImages([])
                setEditDiagnosisImageUrls([])
                setIsEditDialogOpen(false)
              }}
            >
              取消
            </Button>
            <Button onClick={handleEditDiagnosis}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
