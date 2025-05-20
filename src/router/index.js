// src/router/index.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Auth/Login.js';
import Register from '../pages/Auth/Register';
import { CartProvider } from '../pages/user/context/CartContext.jsx';


// 管理员页面
import AdminHome from '../pages/admin/Home/AdminHome.jsx';
import Dashboard from '../pages/admin/Dashboard/Dashboard.jsx';
import DishList from '../pages/admin/Dishes/DishList.jsx';
import OrderList from '../pages/admin/Orders/OrderList.jsx';
import MerchantOrder from '../pages/admin/Orders/MerchantOrder.jsx';
import AdminInfoEditor from '../pages/admin/Settings/AdminInfoEditor.jsx';

// 用户页面
import UserHome from '../pages/user/userhome/UserHome.jsx';
import UserDashboard from '../pages/user/dashboard/UserDashboard.jsx';
import SimulatedMap from '../pages/user/map/SimulatedMap.jsx'
import UserOrderList from '../pages/user/order/UserOrderList.jsx';
import UserProfile from '../pages/user/settings/UserProfile.jsx';
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
          <Route path="merchant" element={<MerchantOrder />} />
          <Route path="edit" element={<AdminInfoEditor />} />
        </Route>


        <Route
          path="/user"
          element={
            <CartProvider>
              <UserHome />
            </CartProvider>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="home" element={<UserDashboard />} />
          <Route path="map" element={<SimulatedMap />} />
          <Route path="orders" element={<UserOrderList />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}
