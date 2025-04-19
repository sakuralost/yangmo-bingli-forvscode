"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ImagePlus } from "lucide-react"

export default function AddCasePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    symptom: "",
    contact: "",
    gender: "",
    age: "",
    diagnosis: "",
  })
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)
      setImages((prev) => [...prev, ...newImages])

      // 创建预览URL
      const newImageUrls = newImages.map((file) => URL.createObjectURL(file))
      setImageUrls((prev) => [...prev, ...newImageUrls])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 验证必填字段
    if (!formData.name || !formData.diagnosis) {
      alert("请填写必填字段：病例名称和诊断记录")
      return
    }

    // 处理图片，将File对象转换为可存储的格式
    const imageDataUrls = await Promise.all(
      images.map(async (file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
          reader.readAsDataURL(file)
        })
      }),
    )

    // 创建新病例对象
    const newCase = {
      id: Date.now().toString(), // 使用时间戳作为临时ID
      name: formData.name,
      symptom: formData.symptom,
      contact: formData.contact,
      gender: formData.gender,
      age: formData.age ? Number.parseInt(formData.age) : null,
      lastDiagnosisTime: new Date().toISOString(),
      diagnoses: [
        {
          id: Date.now().toString(),
          content: formData.diagnosis,
          createdAt: new Date().toISOString(),
          updatedAt: null,
          images: imageDataUrls.map((dataUrl, index) => ({
            id: `img_${Date.now()}_${index}`,
            dataUrl,
            name: images[index].name,
          })),
        },
      ],
    }

    // 从 localStorage 获取现有病例
    const existingCasesJSON = localStorage.getItem("cases")
    const existingCases = existingCasesJSON ? JSON.parse(existingCasesJSON) : []

    // 添加新病例
    const updatedCases = [...existingCases, newCase]

    // 保存到 localStorage
    localStorage.setItem("cases", JSON.stringify(updatedCases))

    // 实际应用中，这里应该调用API保存数据
    // const response = await fetch('/api/cases', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(formData),
    // });

    // if (response.ok) {
    //   router.push('/');
    // } else {
    //   alert('保存失败，请重试');
    // }

    console.log("保存的数据:", newCase)
    console.log("上传的图片:", images)
    router.push("/")
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>新增病例</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                病例名称 <span className="text-red-500">*</span>
              </Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptom">病症名称</Label>
              <Input id="symptom" name="symptom" value={formData.symptom} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">联系方式</Label>
              <Input id="contact" name="contact" value={formData.contact} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">性别</Label>
                <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择性别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="男">男</SelectItem>
                    <SelectItem value="女">女</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">年龄</Label>
                <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis">
                诊断记录 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="diagnosis"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>上传图片</Label>
              <div className="flex flex-wrap gap-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`上传图片 ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      onClick={() => {
                        setImageUrls((prev) => prev.filter((_, i) => i !== index))
                        setImages((prev) => prev.filter((_, i) => i !== index))
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
                  <ImagePlus className="text-gray-400" />
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/")}>
              取消
            </Button>
            <Button type="submit">保存</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
