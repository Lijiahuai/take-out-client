import React, { useState } from 'react';
import { Outlet,useNavigate } from 'react-router-dom';
import { Layout, Menu, theme, Avatar, Dropdown, Space, Badge, message } from 'antd';
import {
    DashboardOutlined,
    ShoppingCartOutlined,
    MenuOutlined,
    PieChartOutlined,
    SettingOutlined,
    BellOutlined,
    UserOutlined
} from '@ant-design/icons';

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
            icon: <DashboardOutlined />,
            label: '数据总览',
            path: 'dashboard',
        },
        {
            key: '2',
            icon: <ShoppingCartOutlined />,
            label: '订单管理',
        },
        {
            key: '3',
            icon: <MenuOutlined />,
            label: '菜品管理',
        },
        {
            key: '4',
            icon: <PieChartOutlined />,
            label: '数据报表',
        },
        {
            key: '5',
            icon: <SettingOutlined />,
            label: '店铺设置',
        },
    ];

    const userMenuItems = [
        {
            key: '1',
            label: '个人中心',
        },
        {
            key: '2',
            label: '账户设置',
        },
        {
            type: 'divider',
        },
        {
            key: '3',
            label: '退出登录',
        },
    ];

    const onMenuClick = ({ key }) => {
        // 处理主菜单点击
        const mainMenuItem = items.find(item => item.key === key);
        if (mainMenuItem) {
          // 处理主菜单点击逻辑
          switch(key) {
            case '1': // 数据总览
              navigate('/admin/dashboard');
              break;
            case '2': // 订单管理
              navigate('/admin/orders');
              break;
            case '3': // 菜品管理
              navigate('/admin/menu');
              break;
            case '4': // 数据报表
              navigate('/admin/reports');
              break;
            case '5': // 店铺设置
              navigate('/admin/settings');
              break;
            default:
              break;
          }
          return;
        }
      
        // 处理用户菜单点击
        switch(key) {
          case '1': // 个人中心
            navigate('/admin/profile');
            break;
          case '2': // 账户设置
            navigate('/admin/account-settings');
            break;
          case '3': // 退出登录
            message.info('您已退出登录');
            // 这里添加退出登录逻辑，例如：
            // logout();
            // navigate('/login');
            break;
          default:
            break;
        }
      };


    return (
        <Layout className="min-h-screen">
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                width={220}
                theme="light"
            >
                <div className="h-12 m-4 flex items-center justify-center">
                    <h1 className="text-xl font-bold text-gray-800">
                        {collapsed ? 'LOGO' : '商家后台管理系统'}
                    </h1>
                </div>
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={items}
                    style={{ borderRight: 0 }}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: '0 24px',
                        background: colorBgContainer,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div className="flex items-center">
                        <h2 className="text-lg font-semibold">美味餐厅管理后台</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge count={5} size="small">
                            <BellOutlined className="text-lg cursor-pointer" />
                        </Badge>
                        <Dropdown
                            menu={{
                                items: userMenuItems,
                                onClick: onMenuClick,
                            }}
                        >
                            <Space className="cursor-pointer">
                                <Avatar icon={<UserOutlined />} />
                                <span className="font-medium">管理员</span>
                            </Space>
                        </Dropdown>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: 8,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}