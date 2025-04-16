import React, { useState, useMemo } from 'react';
import { Record } from '../types';
import { useNavigate } from 'react-router-dom';

interface RecordListProps {
    records: Record[];
}

const RecordList: React.FC<RecordListProps> = ({ records }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // 处理搜索逻辑，支持拼音首字母、文本和数字搜索
    const filteredRecords = useMemo(() => {
        if (!searchTerm) return records;
        
        const searchLower = searchTerm.toLowerCase();
        
        return records.filter(record => {
            // 搜索病例名称
            const caseNameMatch = record.caseName.toLowerCase().includes(searchLower);
            
            // 搜索病症名称
            const symptomMatch = record.symptom?.toLowerCase().includes(searchLower);
            
            // 搜索联系方式（数字搜索）
            const contactMatch = record.contact?.includes(searchTerm);
            
            // 搜索诊断记录
            const diagnosisMatch = record.diagnosisRecords.some(diagnosis => 
                diagnosis.content.toLowerCase().includes(searchLower)
            );
            
            return caseNameMatch || symptomMatch || contactMatch || diagnosisMatch;
        });
    }, [records, searchTerm]);

    // 格式化日期时间
    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('zh-CN');
    };

    // 处理点击病例记录事件
    const handleRecordClick = (recordId: string) => {
        navigate(`/record/${recordId}`);
    };

    return (
        <div className="record-list-container">
            {/* 搜索框 */}
            <div className="search-box">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="输入关键词搜索病例（支持病例名称、病症名称、联系方式和诊断记录）"
                />
            </div>

            {/* 病例列表 */}
            <div className="records-table">
                {filteredRecords.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>病例名称</th>
                                <th>病症名称</th>
                                <th>联系方式</th>
                                <th>性别</th>
                                <th>年龄</th>
                                <th>最后诊断时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map(record => (
                                <tr
                                    key={record._id}
                                    onClick={() => handleRecordClick(record._id)}
                                    className="record-row"
                                >
                                    <td>{record.caseName}</td>
                                    <td>{record.symptom || '无'}</td>
                                    <td>{record.contact || '无'}</td>
                                    <td>{record.gender || '未指定'}</td>
                                    <td>{record.age || '未指定'}</td>
                                    <td>{formatDateTime(record.lastDiagnosisTime)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-records">
                        {searchTerm ? '无符合搜索条件的病例' : '暂无病例记录'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecordList;