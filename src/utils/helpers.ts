// 定义患者数据的类型
interface PatientData {
    name: string;
    condition: string;
    contact: string;
    gender: string;
    age: number;
}

// 验证患者数据的函数
export const validatePatientData = (data: PatientData): boolean => {
    // 解构数据对象，提取需要的字段
    const { name, condition, contact, gender, age } = data;
    // 检查是否所有字段都存在
    if (!name || !condition || !contact || !gender || !age) {
        return false; // 如果有字段缺失，返回 false
    }
    // 检查年龄是否为正数且为数字类型
    if (typeof age !== 'number' || age <= 0) {
        return false; // 如果年龄无效，返回 false
    }
    return true; // 数据有效，返回 true
};

// 格式化日期的函数
export const formatDate = (date: Date): string => {
    // 定义日期格式选项
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    // 使用 toLocaleDateString 方法格式化日期
    return new Date(date).toLocaleDateString(undefined, options);
};

export const formatDateTime = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};

// 定义记录的类型
interface Record {
    name: string;
    condition: string;
    [key: string]: any;
}

// 搜索记录的函数
export const searchRecords = (records: Record[], query: string): Record[] => {
    // 使用 filter 方法筛选符合条件的记录
    return records.filter(record => 
        // 检查记录的姓名是否包含查询关键字（忽略大小写）
        record.name.toLowerCase().includes(query.toLowerCase()) ||
        // 检查记录的病情描述是否包含查询关键字（忽略大小写）
        record.condition.toLowerCase().includes(query.toLowerCase())
    );
};