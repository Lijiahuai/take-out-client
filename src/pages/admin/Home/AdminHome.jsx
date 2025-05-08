import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, theme, Avatar, Dropdown, Space, Badge, message } from 'antd';
import {
    DashboardOutlined,
    ShoppingCartOutlined,
    MenuOutlined,
    PieChartOutlined,
    SettingOutlined,
    BellOutlined,
    UserOutlined,
    LogoutOutlined,
    ProfileOutlined,
    SettingFilled
} from '@ant-design/icons';
import './style/AdminHome.css'; // 引入自定义样式

const { Header, Sider, Content } = Layout;

export default function AdminHome() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const items = [
        {
            key: '1',
            icon: <DashboardOutlined className="menu-icon" />,
            label: '数据总览',
            path: 'dashboard',
        },
        {
            key: '2',
            icon: <ShoppingCartOutlined className="menu-icon" />,
            label: '订单管理',
        },
        {
            key: '3',
            icon: <MenuOutlined className="menu-icon" />,
            label: '菜品管理',
            path: 'dish',
        },
        {
            key: '4',
            icon: <PieChartOutlined className="menu-icon" />,
            label: '数据报表',
        },
        {
            key: '5',
            icon: <SettingOutlined className="menu-icon" />,
            label: '店铺设置',
        },
    ];

    const userMenuItems = [
        {
            key: '1',
            label: '个人中心',
            icon: <ProfileOutlined />,
        },
        {
            key: '2',
            label: '账户设置',
            icon: <SettingFilled />,
        },
        {
            type: 'divider',
        },
        {
            key: '3',
            label: '退出登录',
            icon: <LogoutOutlined />,
            danger: true,
        },
    ];

    const onMenuClick = ({ key }) => {
        const mainMenuItem = items.find(item => item.key === key);
        if (mainMenuItem) {
            switch (key) {
                case '1': navigate('/admin/dashboard'); break;
                case '2': navigate('/admin/orders'); break;
                case '3': navigate('/admin/dish'); break;
                case '4': navigate('/admin/reports'); break;
                case '5': navigate('/admin/settings'); break;
                default: break;
            }
            return;
        }

        switch (key) {
            case '1': navigate('/admin/profile'); break;
            case '2': navigate('/admin/account-settings'); break;
            case '3':
                message.success('您已安全退出');
                // logout();
                navigate('/login');
                break;
            default: break;
        }
    };

    return (
        <Layout className="admin-layout">
            <Sider

                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                width={220}
                theme="light"
                className="admin-sider"
            >
                <div className="admin-logo">
                    {collapsed ? (
                        <div className="logo-collapsed">🍔</div>
                    ) : (
                        <h1 className="logo-text">美味餐厅管理系统</h1>
                    )}
                </div>
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={items}
                    className="admin-menu"
                    onClick={onMenuClick}
                />
            </Sider>
            <Layout className="admin-content-layout">
                <Header className="admin-header">
                    <div className="header-left">
                        <h2 className="header-title">商家控制台</h2>
                    </div>
                    <div className="header-right">
                        <Badge
                            count={5}
                            size="small"
                            className="notification-badge"
                        >
                            <BellOutlined className="notification-icon" />
                        </Badge>
                        <Dropdown
                            menu={{
                                items: userMenuItems,
                                onClick: onMenuClick,
                            }}
                            placement="bottomRight"
                        >
                            <Space className="user-avatar">
                                <Avatar
                                    icon={<UserOutlined />}
                                    className="avatar"
                                />
                                <span className="username">管理员</span>
                            </Space>
                        </Dropdown>
                    </div>
                </Header>
                <Content className="admin-main-content">
                    <div className="content-container">
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout >
    );
}