import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RecordList from '../components/RecordList';
import { fetchRecords } from '../services/api';
import { Record } from '../types';

const ADMIN_PASSWORD = 'yangmo'; // 管理员密码

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [records, setRecords] = useState<Record[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    // 验证管理员密码
    const handleLogin = () => {
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setError('');
            // 将认证状态保存在 sessionStorage 中，这样刷新页面时不需要重新输入密码
            sessionStorage.setItem('isAuthenticated', 'true');
        } else {
            setError('密码错误');
        }
        setPassword('');
    };

    // 检查是否已经认证
    useEffect(() => {
        const auth = sessionStorage.getItem('isAuthenticated');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    // 加载病例数据
    const loadRecords = async () => {
        setIsLoading(true);
        setLoadError(null);
        try {
            const fetchedRecords = await fetchRecords();
            setRecords(fetchedRecords);
        } catch (error) {
            setLoadError(error instanceof Error ? error.message : '加载病例数据失败');
            console.error('加载病例数据失败:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 监听认证状态和路由变化，重新加载数据
    useEffect(() => {
        if (isAuthenticated) {
            loadRecords();
        }
    }, [isAuthenticated, location.key]); // 添加 location.key 作为依赖项

    // 跳转到新增病例页面
    const handleAddNewRecord = () => {
        navigate('/patient');
    };

    // 如果未认证，显示登录界面
    if (!isAuthenticated) {
        return (
            <div className="login-container">
                <h2>杨墨病例管理系统</h2>
                <div className="login-form">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="请输入管理员密码"
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    <button onClick={handleLogin}>登录</button>
                    {error && <p className="error-message">{error}</p>}
                </div>
            </div>
        );
    }

    // 已认证，显示主界面
    return (
        <div className="home-page">
            <header className="app-header">
                <h1>杨墨病例管理系统</h1>
                <button
                    className="add-record-button"
                    onClick={handleAddNewRecord}
                >
                    新增病例
                </button>
            </header>

            <main className="main-content">
                {isLoading && <div className="loading">正在加载数据...</div>}
                {loadError && (
                    <div className="error-message">
                        {loadError}
                        <button onClick={() => window.location.reload()}>重试</button>
                    </div>
                )}
                {!isLoading && !loadError && <RecordList records={records} />}
            </main>
        </div>
    );
};

export default HomePage;