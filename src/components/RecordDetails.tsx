import React, { useState } from 'react';
import { Record, DiagnosisRecord } from '../types';

interface RecordDetailsProps {
    record: Record;
    onUpdate: (updatedRecord: Record) => void;
}

const RecordDetails: React.FC<RecordDetailsProps> = ({ record, onUpdate }) => {
    // 管理新增诊断记录的状态
    const [newDiagnosis, setNewDiagnosis] = useState({
        content: '',
        images: [] as string[]
    });

    // 管理修改诊断记录的状态
    const [editingDiagnosis, setEditingDiagnosis] = useState<{
        index: number;
        content: string;
        images: string[];
    } | null>(null);

    // 处理图片上传
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            // 这里应该实际上传图片到服务器，这里仅作示例
            const newImages = Array.from(files).map(file => URL.createObjectURL(file));
            if (isEditing && editingDiagnosis) {
                setEditingDiagnosis({
                    ...editingDiagnosis,
                    images: [...editingDiagnosis.images, ...newImages]
                });
            } else {
                setNewDiagnosis(prev => ({
                    ...prev,
                    images: [...prev.images, ...newImages]
                }));
            }
        }
    };

    // 添加新的诊断记录
    const handleAddDiagnosis = () => {
        if (!newDiagnosis.content.trim()) {
            alert('诊断记录内容不能为空');
            return;
        }

        const newDiagnosisRecord: DiagnosisRecord = {
            content: newDiagnosis.content,
            diagnosisTime: new Date().toISOString(),
            images: newDiagnosis.images
        };

        const updatedRecord = {
            ...record,
            diagnosisRecords: [...record.diagnosisRecords, newDiagnosisRecord],
            lastDiagnosisTime: newDiagnosisRecord.diagnosisTime
        };

        onUpdate(updatedRecord);
        setNewDiagnosis({ content: '', images: [] });
    };

    // 修改诊断记录
    const handleUpdateDiagnosis = () => {
        if (!editingDiagnosis || !editingDiagnosis.content.trim()) {
            alert('诊断记录内容不能为空');
            return;
        }

        const updatedRecords = [...record.diagnosisRecords];
        const updatedDiagnosis: DiagnosisRecord = {
            content: editingDiagnosis.content,
            images: editingDiagnosis.images,
            diagnosisTime: new Date().toISOString(),
            modifiedTime: new Date().toISOString()
        };
        updatedRecords[editingDiagnosis.index] = updatedDiagnosis;

        const updatedRecord = {
            ...record,
            diagnosisRecords: updatedRecords
        };

        onUpdate(updatedRecord);
        setEditingDiagnosis(null);
    };

    // 格式化日期时间
    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('zh-CN');
    };

    return (
        <div className="record-details">
            <h2>病例详细信息</h2>
            
            {/* 基本信息 */}
            <section className="basic-info">
                <h3>基本信息</h3>
                <div><label>病例名称：</label>{record.caseName}</div>
                <div><label>病症名称：</label>{record.symptom || '无'}</div>
                <div><label>联系方式：</label>{record.contact || '无'}</div>
                <div><label>性别：</label>{record.gender || '未指定'}</div>
                <div><label>年龄：</label>{record.age || '未指定'}</div>
                <div><label>创建时间：</label>{formatDateTime(record.createTime)}</div>
                <div><label>最后诊断时间：</label>{formatDateTime(record.lastDiagnosisTime)}</div>
            </section>

            {/* 诊断记录列表 */}
            <section className="diagnosis-records">
                <h3>诊断记录列表</h3>
                {record.diagnosisRecords.map((diagnosis, index) => (
                    <div key={index} className="diagnosis-record">
                        {editingDiagnosis?.index === index ? (
                            // 编辑模式
                            <div className="diagnosis-edit">
                                <textarea
                                    value={editingDiagnosis.content}
                                    onChange={(e) => setEditingDiagnosis({
                                        ...editingDiagnosis,
                                        content: e.target.value
                                    })}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleImageUpload(e, true)}
                                />
                                <div className="image-preview">
                                    {editingDiagnosis.images.map((img, imgIndex) => (
                                        <img key={imgIndex} src={img} alt={`诊断图片 ${imgIndex + 1}`} />
                                    ))}
                                </div>
                                <div className="actions">
                                    <button onClick={handleUpdateDiagnosis}>保存</button>
                                    <button onClick={() => setEditingDiagnosis(null)}>取消</button>
                                </div>
                            </div>
                        ) : (
                            // 查看模式
                            <div className="diagnosis-view">
                                <p>{diagnosis.content}</p>
                                <div className="image-preview">
                                    {diagnosis.images?.map((img, imgIndex) => (
                                        <img key={imgIndex} src={img} alt={`诊断图片 ${imgIndex + 1}`} />
                                    ))}
                                </div>
                                <div className="diagnosis-info">
                                    <span>诊断时间：{formatDateTime(diagnosis.diagnosisTime)}</span>
                                    {diagnosis.modifiedTime && (
                                        <span>修改时间：{formatDateTime(diagnosis.modifiedTime)}</span>
                                    )}
                                </div>
                                <button onClick={() => setEditingDiagnosis({
                                    index,
                                    content: diagnosis.content,
                                    images: diagnosis.images || []
                                })}>修改</button>
                            </div>
                        )}
                    </div>
                ))}
            </section>

            {/* 新增诊断记录 */}
            <section className="new-diagnosis">
                <h3>新增诊断记录</h3>
                <div className="diagnosis-input">
                    <textarea
                        value={newDiagnosis.content}
                        onChange={(e) => setNewDiagnosis({
                            ...newDiagnosis,
                            content: e.target.value
                        })}
                        placeholder="请输入诊断记录"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e, false)}
                    />
                    <div className="image-preview">
                        {newDiagnosis.images.map((img, index) => (
                            <img key={index} src={img} alt={`新增诊断图片 ${index + 1}`} />
                        ))}
                    </div>
                    <button onClick={handleAddDiagnosis}>添加诊断记录</button>
                </div>
            </section>
        </div>
    );
};

export default RecordDetails;