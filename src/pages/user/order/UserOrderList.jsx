import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, message } from 'antd';
import { EyeOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getUserOrders } from './api';
import './UserOrderList.css';

const UserOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const navigate = useNavigate();

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const allOrders = await getUserOrders();
            setOrders(allOrders);
            setPagination(prev => ({
                ...prev,
                total: allOrders.length,
            }));
        } catch (error) {
            console.error('加载订单失败:', error);
            message.error('获取订单数据失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleTableChange = (newPagination) => {
        setPagination(newPagination);
    };

    const getStatusTag = (status) => {
        const statusMap = {
            0: {
                text: '待支付',
                color: 'orange',
                icon: <ClockCircleOutlined />
            },
            1: {
                text: '已支付',
                color: 'blue',
                icon: <ClockCircleOutlined />
            },
            2: {
                text: '配送中',
                color: 'geekblue',
                icon: <ClockCircleOutlined />
            },
            3: {
                text: '已完成',
                color: 'green',
                icon: <CheckCircleOutlined />
            },
            4: {
                text: '已取消',
                color: 'red',
                icon: <CloseCircleOutlined />
            },
        };
        return (
            <Tag
                color={statusMap[status]?.color || 'default'}
                icon={statusMap[status]?.icon}
                className="status-tag"
            >
                {statusMap[status]?.text || '未知'}
            </Tag>
        );
    };

    const columns = [
        {
            title: '订单信息',
            key: 'order_info',
            render: (_, record) => (
                <div className="order-info-block">
                    <div className="order-id">订单号: {record.order_id}</div>
                    <div className="order-time">
                        创建时间: {new Date(record.create_time).toLocaleString()}
                    </div>
                    <div>状态: {getStatusTag(record.status)}</div>
                </div>
            ),
        },
        {
            title: '店铺信息',
            key: 'shop_info',
            render: (_, record) => (
                <div className="shop-info-block">
                    <div className="shop-name">{record.shop_name}</div>
                    <div className="shop-phone">联系电话: {record.phone}</div>
                    <div className="shop-location">
                        位置: ({record.x_coord}, {record.y_coord})
                    </div>
                    {record.shop_description && (
                        <div className="shop-description">{record.shop_description}</div>
                    )}
                </div>
            ),
        },
        {
            title: '菜品信息',
            key: 'dish_info',
            render: (_, record) => (
                <div className="dish-info-block">
                    <div className="dish-name">{record.dish_name}</div>
                    <div className="dish-price">价格: ¥{record.price?.toFixed(2)}</div>
                    <div className="dish-category">分类: {record.category}</div>
                </div>
            ),
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/user/orders/detail/${record.order_id}`)}
                        className="action-button"
                    >
                        详情
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="user-order-container">
            <div className="order-header">
                <h2>我的订单</h2>
                <p>查看您的所有订单记录</p>
            </div>

            <Table
                columns={columns}
                rowKey="order_id"
                dataSource={orders}
                pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50'],
                    showTotal: (total) => `共 ${total} 条订单`,
                }}
                loading={loading}
                onChange={handleTableChange}
                className="order-table"
                rowClassName="order-row"
                bordered
                scroll={{ x: 1200 }}
            />
        </div>
    );
};

export default UserOrderList;