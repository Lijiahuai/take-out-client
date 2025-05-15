import React, { useState, useRef } from 'react';
import { Layout, Menu, theme, Avatar, Badge, Dropdown, Space } from 'antd';
import CartDrawer from '../cart/CartDrawer'; // 路径按你项目结构调整
import {
  UserOutlined,
  MessageOutlined,
  BellOutlined,
  HomeOutlined,
  ShoppingOutlined,
  HeartOutlined,
  SettingOutlined,
  LogoutOutlined,
  ShoppingCartOutlined // 导入购物车图标
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './UserHome.css';

const { Header, Content, Sider } = Layout;

const UserHome = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartVisible, setCartVisible] = useState(false);
  const { role, data } = JSON.parse(localStorage.getItem('userInfo'));


  // 用户信息
  const user = {
    name: data.real_name,
    gender: data.gender,
    phone: data.phone,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    unreadMessages: 3,
    unreadNotifications: 5,
    location: {
      x: data.x,
      y: data.y,
    }
  };

  // 导航菜单项
  const menuItems = [
    { key: 'home', icon: <HomeOutlined />, label: '首页' },
    { key: 'map', icon: <ShoppingOutlined />, label: '附近商家' },
    { key: 'orders', icon: <ShoppingOutlined />, label: '我的订单' },
    { key: 'favorites', icon: <HeartOutlined />, label: '我的收藏' },
    { key: 'messages', icon: <MessageOutlined />, label: '消息中心' },
    { key: 'settings', icon: <SettingOutlined />, label: '设置' }
  ];

  // 主菜单点击处理函数
  const onMainMenuClick = ({ key }) => {
    switch (key) {
      case 'home':
        navigate('/user/home');
        break;
      case 'map':
        navigate('/user/map');
        break;
      case 'orders':
        navigate('/user/orders');
        break;
      case 'favorites':
        navigate('/user/favorites');
        break;
      case 'messages':
        navigate('/user/messages');
        break;
      case 'settings':
        navigate('/user/profile');
        break;
      default:
        break;
    }
  };

  // 用户下拉菜单
  const userMenu = (
    <Menu
      items={[
        {
          key: 'profile',
          label: '个人资料',
          icon: <UserOutlined />,
          onClick: () => navigate('/user/profile')
        },
        {
          key: 'settings',
          label: '账户设置',
          icon: <SettingOutlined />,
          onClick: () => navigate('/user/settings')
        },
        { type: 'divider' },
        {
          key: 'logout',
          label: '退出登录',
          icon: <LogoutOutlined />,
          danger: true,
          onClick: () => navigate('/login')
        }
      ]}
    />
  );

  // 获取当前选中的菜单项
  const selectedKey = menuItems.find(item =>
    location.pathname.includes(item.key)
  )?.key || 'home';

  // 拖拽相关代码
  const [cartPosition, setCartPosition] = useState({ x: 1500, y: 800 }); // 初始位置
  const dragRef = useRef(null);

  const handleMouseDown = (e) => {
    // 计算初始位置
    const offsetX = e.clientX - cartPosition.x;
    const offsetY = e.clientY - cartPosition.y;

    const handleMouseMove = (e) => {
      setCartPosition({
        x: e.clientX - offsetX,
        y: e.clientY - offsetY
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={220}
      >
        <div className="logo" onClick={() => navigate('/user')}>
          {collapsed ? 'LOGO' : '家怀外卖'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={menuItems}
          onClick={onMainMenuClick}
        />
      </Sider>

      <Layout>
        {/* 顶部导航 */}
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="header-content">
            <div className="header-left"></div>

            <div className="header-right">
              <Space size="large">
                <Badge count={user.unreadMessages} size="small">
                  <MessageOutlined
                    className="header-icon"
                    onClick={() => navigate('/user/messages')}
                  />
                </Badge>

                <Badge count={user.unreadNotifications} size="small">
                  <BellOutlined
                    className="header-icon"
                    onClick={() => navigate('/user/notifications')}
                  />
                </Badge>

                <Dropdown overlay={userMenu} placement="bottomRight">
                  <div className="user-info">
                    <Avatar src={user.avatar} />
                    {!collapsed && <span className="username">{user.name}</span>}
                  </div>
                </Dropdown>
              </Space>
            </div>
          </div>
        </Header>

        {/* 主内容区 - 关键修复：添加 Outlet */}
        <Content style={{ margin: '16px' }}>
          <div className={`content-container ${collapsed ? 'collapsed' : 'not-collapsed'}`}>
            <Outlet />
          </div>
        </Content>
        {/* 购物车浮动面板 */}
        <CartDrawer visible={cartVisible} onClose={() => setCartVisible(false)} />
      </Layout>

      {/* 浮动购物车图标 */}
      <div
        className="floating-cart-icon"
        onClick={() => setCartVisible(true)}
        onMouseDown={handleMouseDown}
        ref={dragRef}
        style={{
          left: `${cartPosition.x}px`,  // 动态位置
          top: `${cartPosition.y}px`,   // 动态位置
        }}
      >
        <ShoppingCartOutlined />
      </div>
    </Layout>
  );
};

export default UserHome;
