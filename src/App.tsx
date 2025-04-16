// 引入 React 库
import React from 'react';
// 引入 react-router-dom 中的路由相关组件
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// 引入页面组件
import HomePage from './pages/HomePage';
import PatientPage from './pages/PatientPage';
import RecordPage from './pages/RecordPage';

// 定义主应用组件
const App: React.FC = () => {
  return (
    // 使用 Router 组件包裹整个应用，提供路由功能
    <Router>
      {/* 使用 Routes 组件确保每次只渲染一个路由 */}
      <Routes>
        {/* 定义根路径的路由，渲染 HomePage 组件 */}
        <Route path="/" element={<HomePage />} />
        {/* 定义 /patient 路径的路由，渲染 PatientPage 组件 */}
        <Route path="/patient" element={<PatientPage />} />
        {/* 定义 /record/:id 路径的路由，渲染 RecordPage 组件 */}
        <Route path="/record/:id" element={<RecordPage />} />
      </Routes>
    </Router>
  );
};

// 导出主应用组件，供其他模块使用
export default App;