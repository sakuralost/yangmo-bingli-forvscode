import mongoose from 'mongoose';

// 诊断记录 Schema
const diagnosisRecordSchema = new mongoose.Schema({
    content: { type: String, required: true },
    diagnosisTime: { type: Date, default: Date.now },
    images: [{ type: String }]
});

// 病例记录 Schema
const recordSchema = new mongoose.Schema({
    caseName: { type: String, required: true },
    symptom: String,
    contact: String,
    gender: {
        type: String,
        enum: ['男', '女', ''],
        default: ''
    },
    age: Number,
    diagnosisRecords: [diagnosisRecordSchema],
    createTime: { type: Date, default: Date.now },
    lastDiagnosisTime: { type: Date, default: Date.now }
});

// 创建索引来优化搜索性能
recordSchema.index({ caseName: 'text', symptom: 'text' });

export const Record = mongoose.model('Record', recordSchema);