// src/router/index.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Auth/Login.js';
import Register from '../pages/Auth/Register';
import AdminHome from '../pages/admin/Home/AdminHome.jsx';
import Dashboard from '../pages/admin/Dashboard/Dashboard.jsx';
import DishList from '../pages/admin/Dishes/DishList.jsx';
import OrderList from '../pages/admin/Orders/OrderList.jsx';
import AdminInfoEditor from '../pages/admin/Settings/AdminInfoEditor.jsx';
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* 管理员路由 */}
        <Route path="/admin" element={<AdminHome />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dish" element={<DishList />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="edit" element={<AdminInfoEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
