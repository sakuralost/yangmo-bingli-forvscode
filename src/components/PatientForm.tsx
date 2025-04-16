import React, { useState } from 'react';
import { Record, DiagnosisRecord } from '../types';

type NewRecordData = Omit<Record, '_id' | 'createTime' | 'lastDiagnosisTime'>;

interface PatientFormProps {
    onSave: (data: NewRecordData) => void;
    onCancel: () => void;
    disabled?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSave, onCancel, disabled = false }) => {
    // 表单数据状态
    const [formData, setFormData] = useState({
        caseName: '', // 必填
        symptom: '',
        contact: '',
        gender: '' as '' | '男' | '女',
        age: '',
        diagnosisContent: '', // 必填
        images: [] as string[]
    });

    // 错误信息状态
    const [errors, setErrors] = useState({
        caseName: '',
        diagnosisContent: ''
    });

    // 处理输入改变
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // 清除对应字段的错误信息
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // 处理图片上传
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            // 这里应该实际上传图片到服务器，这里仅作示例
            const newImages = Array.from(files).map(file => URL.createObjectURL(file));
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }));
        }
    };

    // 处理表单提交
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // 验证必填字段
        let hasError = false;
        const newErrors = { caseName: '', diagnosisContent: '' };
        
        if (!formData.caseName.trim()) {
            newErrors.caseName = '病例名称为必填项';
            hasError = true;
        }
        
        if (!formData.diagnosisContent.trim()) {
            newErrors.diagnosisContent = '诊断记录为必填项';
            hasError = true;
        }
        
        if (hasError) {
            setErrors(newErrors);
            return;
        }

        // 构建诊断记录
        const diagnosisRecord: DiagnosisRecord = {
            content: formData.diagnosisContent,
            diagnosisTime: new Date().toISOString(),  // 使用ISO字符串格式
            images: formData.images
        };

        // 构建提交的数据
        const submitData: NewRecordData = {
            caseName: formData.caseName,
            symptom: formData.symptom || undefined,
            contact: formData.contact || undefined,
            gender: formData.gender || undefined,
            age: formData.age ? Number(formData.age) : undefined,
            diagnosisRecords: [diagnosisRecord]
        };

        onSave(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="patient-form">
            <div className="form-group">
                <label>病例名称 <span className="required">*</span></label>
                <input
                    type="text"
                    name="caseName"
                    value={formData.caseName}
                    onChange={handleChange}
                    className={errors.caseName ? 'error' : ''}
                />
                {errors.caseName && <span className="error-message">{errors.caseName}</span>}
            </div>

            <div className="form-group">
                <label>病症名称</label>
                <input
                    type="text"
                    name="symptom"
                    value={formData.symptom}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>联系方式</label>
                <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>性别</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                >
                    <option value="">请选择</option>
                    <option value="男">男</option>
                    <option value="女">女</option>
                </select>
            </div>

            <div className="form-group">
                <label>年龄</label>
                <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="0"
                    max="200"
                />
            </div>

            <div className="form-group">
                <label>诊断记录 <span className="required">*</span></label>
                <textarea
                    name="diagnosisContent"
                    value={formData.diagnosisContent}
                    onChange={handleChange}
                    className={errors.diagnosisContent ? 'error' : ''}
                />
                {errors.diagnosisContent && <span className="error-message">{errors.diagnosisContent}</span>}
            </div>

            <div className="form-group">
                <label>上传图片</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                />
                <div className="image-preview">
                    {formData.images.map((img, index) => (
                        <img key={index} src={img} alt={`预览 ${index + 1}`} />
                    ))}
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" disabled={disabled}>
                    {disabled ? '保存中...' : '保存'}
                </button>
                <button type="button" onClick={onCancel} disabled={disabled}>
                    取消
                </button>
            </div>
        </form>
    );
};

export default PatientForm;