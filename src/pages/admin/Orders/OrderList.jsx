import React, { useEffect, useState } from 'react';
import { Table, Tag, message, Space, Select } from 'antd';
import { getOrders } from './OrderApi';
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './OrderList.css';

const OrderList = () => {
    // 定义订单列表的状态
    const [orders, setOrders] = useState([]);
    // 定义筛选后的订单列表的状态
    const [filteredOrders, setFilteredOrders] = useState([]);
    // 定义加载状态
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    // 根据订单状态返回对应的标签
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

        const s = statusMap[status] || {
            text: '未知',
            color: 'gray',
            icon: <ClockCircleOutlined />
        };

        return (
            <Tag
                className="status-tag"
                color={s.color}
                icon={s.icon}
            >
                {s.text}
            </Tag>
        );
    };

    // 获取订单列表
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const orderData = await getOrders();
            console.log("订单列表", orderData);
            setOrders(orderData);
            setFilteredOrders(orderData);
        } catch (err) {
            message.error('加载订单失败');
        } finally {
            setLoading(false);
        }
    };

    // 组件挂载时获取订单列表
    useEffect(() => {
        fetchOrders();
    }, []);

    // 监听筛选状态变化，更新筛选后的订单列表
    useEffect(() => {
        if (statusFilter === 'all') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === parseInt(statusFilter)));
        }
    }, [statusFilter, orders]);

    // 定义表格列
    const columns = [
        { title: '订单号', dataIndex: 'orderId', key: 'order_id' },
        { title: '用户姓名', dataIndex: 'realName', key: 'real_name' },
        { title: '联系电话', dataIndex: 'phone', key: 'phone' },
        {
            title: '地址坐标',
            key: 'location',
            render: (_, record) => `(${record.x}, ${record.y})`
        },
        { title: '菜品', dataIndex: 'dishName', key: 'dish_name' },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            render: (v) => <span className="price-cell">￥{v}</span>
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            render: (v) => v || <span className="empty-text">-</span>
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => getStatusTag(status)
        },
        {
            title: '下单时间',
            dataIndex: 'create_time',
            key: 'create_time',
            render: (t) => dayjs(t).format('YYYY-MM-DD HH:mm:ss')
        }
    ];

    return (
        <div className="order-list-container">
            <div className="filter-section">
                <span>订单状态筛选：</span>
                <Select
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value)}
                >
                    <Select.Option value="all">全部</Select.Option>
                    <Select.Option value="0">待支付</Select.Option>
                    <Select.Option value="1">已支付</Select.Option>
                    <Select.Option value="2">配送中</Select.Option>
                    <Select.Option value="3">已完成</Select.Option>
                    <Select.Option value="4">已取消</Select.Option>
                </Select>
            </div>

            <Table
                className="order-table"
                dataSource={filteredOrders}
                columns={columns}
                rowKey="order_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default OrderList;