import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 用于获取路由参数和导航
import RecordDetails from '../components/RecordDetails'; // 导入显示病例详情的组件
import { fetchRecordById } from '../services/api'; // 导入根据ID获取病例数据的API方法
import { Record } from '../types';

// 定义一个函数式组件 RecordPage
const RecordPage: React.FC = () => {
    // 从路由参数中获取病例的ID
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // 修改 record 的状态类型为 Record | null
    const [record, setRecord] = React.useState<Record | null>(null);

    // 定义状态变量 loading，用于指示数据是否正在加载，初始值为 true
    const [loading, setLoading] = React.useState(true);

    // 定义状态变量 error，用于存储错误信息，初始值为 null
    const [error, setError] = React.useState<string | null>(null);

    // 使用 React 的 useEffect 钩子在组件加载时执行副作用操作
    React.useEffect(() => {
        // 定义一个异步函数，用于获取病例数据
        const getRecord = async () => {
            if (!id) {
                setError('Invalid record ID');
                setLoading(false);
                return;
            }
            try {
                // 调用 API 方法，根据 ID 获取病例数据
                const data = await fetchRecordById(id);
                // 将获取到的数据存储到 record 状态中
                setRecord(data);
            } catch (err) {
                // 如果发生错误，将错误信息存储到 error 状态中
                setError('Failed to fetch record');
            } finally {
                // 无论成功还是失败，都将 loading 状态设置为 false
                setLoading(false);
            }
        };

        // 调用异步函数获取病例数据
        getRecord();
    }, [id]); // 依赖项为 id，当 id 变化时重新执行

    // 如果数据正在加载，显示加载提示
    if (loading) {
        return <div>Loading...</div>;
    }

    // 如果发生错误，显示错误信息
    if (error) {
        return <div>{error}</div>;
    }

    // 如果成功获取到病例数据，显示病例详情；否则显示“未找到病例”提示
    return (
        <div>
            <div style={{ padding: '20px' }}>
                <button 
                    onClick={() => navigate('/')}
                    style={{
                        padding: '8px 16px',
                        marginBottom: '20px',
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    返回主页
                </button>
            </div>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            {record && (
                <RecordDetails 
                    record={record} 
                    onUpdate={(updatedRecord) => setRecord(updatedRecord)} 
                />
            )}
            {!loading && !record && !error && (
                <div>未找到病例</div>
            )}
        </div>
    );
};

// 导出 RecordPage 组件，供其他模块使用
export default RecordPage;