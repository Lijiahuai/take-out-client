// src/router/index.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Auth/Login.js';
import Register from '../pages/Auth/Register';
import AdminHome from '../pages/admin/Home/AdminHome.jsx';
import Dashboard from '../pages/admin/Dashboard/Dashboard.jsx';
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* 管理员路由 */}
        <Route path="/admin" element={<AdminHome />}>
          <Route index element={<Dashboard />} /> {/* 默认显示仪表盘 */}
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
