import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  if (!dateString) return "-"

  const date = new Date(dateString)
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// 添加一个辅助函数，用于初始化数据库
export function initializeDatabase() {
  // 检查 localStorage 中是否已有数据
  const savedCasesJSON = localStorage.getItem("cases")

  if (!savedCasesJSON) {
    // 初始数据
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

    // 保存到 localStorage
    localStorage.setItem("cases", JSON.stringify(initialCases))
    return initialCases
  }

  return JSON.parse(savedCasesJSON)
}
