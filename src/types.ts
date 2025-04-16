// 定义诊断记录的接口
export interface DiagnosisRecord {
    _id?: string;
    content: string;
    diagnosisTime: string;  // 改为string类型
    modifiedTime?: string;  // 添加可选的修改时间
    images: string[];
}

// 定义病例记录的接口
export interface Record {
    _id: string;
    caseName: string;  // 病例名称（必填）
    symptom?: string;  // 病症名称（非必填）
    contact?: string;  // 联系方式（非必填）
    gender?: '男' | '女' | '';  // 性别（非必填）
    age?: number;  // 年龄（非必填）
    diagnosisRecords: DiagnosisRecord[];  // 诊断记录数组（必填）
    createTime: string;  // 创建时间，改为string类型
    lastDiagnosisTime: string;  // 最后诊断时间，改为string类型
}