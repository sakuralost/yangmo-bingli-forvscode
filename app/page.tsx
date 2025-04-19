"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"

// 模拟数据，实际应用中应从API获取
const initialCases = [
  {
    id: "1",
    name: "张三",
    symptom: "头痛",
    contact: "13800138000",
    gender: "男",
    age: 45,
    lastDiagnosisTime: new Date("2023-04-15").toISOString(),
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
  },
  {
    id: "2",
    name: "李四",
    symptom: "腹痛",
    contact: "13900139000",
    gender: "女",
    age: 32,
    lastDiagnosisTime: new Date("2023-04-10").toISOString(),
    diagnoses: [
      {
        id: "1",
        content: "患者腹痛3天，伴有恶心、呕吐症状。建议进行腹部B超检查。",
        createdAt: new Date("2023-04-10T10:15:00").toISOString(),
        updatedAt: null,
        images: [],
      },
    ],
  },
  {
    id: "3",
    name: "王五",
    symptom: "发热",
    contact: "13700137000",
    gender: "男",
    age: 28,
    lastDiagnosisTime: new Date("2023-04-05").toISOString(),
    diagnoses: [
      {
        id: "1",
        content: "患者发热38.5℃，伴有咳嗽、咽痛症状。考虑上呼吸道感染，建议服用退烧药和抗生素。",
        createdAt: new Date("2023-04-05T16:30:00").toISOString(),
        updatedAt: null,
        images: [],
      },
    ],
  },
]

export default function HomePage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [cases, setCases] = useState<any[]>([])
  const [filteredCases, setFilteredCases] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 搜索功能
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredCases(cases)
      return
    }

    const filtered = cases.filter(
      (c) =>
        c.name.includes(searchTerm) ||
        c.symptom?.includes(searchTerm) ||
        c.contact?.includes(searchTerm) ||
        // 如果搜索词是数字，则匹配联系方式
        (/^\d+$/.test(searchTerm) && c.contact?.includes(searchTerm)),
    )
    setFilteredCases(filtered)
  }

  // 当搜索词变化时执行搜索
  useEffect(() => {
    if (!isLoading) {
      handleSearch()
    }
  }, [searchTerm, isLoading])

  // 初始化数据
  useEffect(() => {
    // 检查 localStorage 中是否已有数据
    const savedCasesJSON = localStorage.getItem("cases")

    if (savedCasesJSON) {
      // 如果有数据，使用保存的数据
      const savedCases = JSON.parse(savedCasesJSON)
      setCases(savedCases)
      setFilteredCases(savedCases)
    } else {
      // 如果没有数据，初始化 localStorage 并使用初始数据
      localStorage.setItem("cases", JSON.stringify(initialCases))
      setCases(initialCases)
      setFilteredCases(initialCases)
    }

    setIsLoading(false)
  }, [])

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">病例记录辅助系统</h1>

      {/* 搜索栏和新增按钮 */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="搜索病例名称、病症、联系方式..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => router.push("/add-case")}>新增病例</Button>
      </div>

      {/* 加载状态 */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">加载中...</div>
      ) : (
        /* 病例列表 */
        <div className="space-y-4">
          {filteredCases.length > 0 ? (
            filteredCases.map((caseItem) => (
              <Card
                key={caseItem.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/case/${caseItem.id}`)}
              >
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">病例名称</p>
                      <p className="font-medium">{caseItem.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">病症名称</p>
                      <p>{caseItem.symptom || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">联系方式</p>
                      <p>{caseItem.contact || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">性别</p>
                      <p>{caseItem.gender || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">年龄</p>
                      <p>{caseItem.age || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">最后诊断时间</p>
                      <p>{formatDate(caseItem.lastDiagnosisTime)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">无符合搜索条件的病例</div>
          )}
        </div>
      )}
    </div>
  )
}
