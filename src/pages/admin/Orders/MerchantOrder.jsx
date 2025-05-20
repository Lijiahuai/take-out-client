import React, { useState, useEffect, useRef } from 'react';
import { List, Button, Tag, message, Badge, Descriptions } from 'antd';
import { CheckOutlined, CloseOutlined, ClockCircleOutlined } from '@ant-design/icons';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { getPendingOrders, acceptOrder, rejectOrder } from './OrderApi';
import './MerchantOrder.css';
import { showNotification } from '../../../components/ui/Notification';
import NewOrderModal from './NewOrderModal';

const MerchantOrder = () => {
    const [orders, setOrders] = useState([]);
    const stompClientRef = useRef(null);


    // 将 newOrder 改为订单队列
    const [orderQueue, setOrderQueue] = useState([]); // 改为数组存储多订单
    const [currentOrder, setCurrentOrder] = useState(null); // 当前展示的订单
    const [modalVisible, setModalVisible] = useState(false);

    // 状态映射（根据实际业务需求验证状态码）
    const statusTagMap = {
        0: { text: '待支付', color: 'orange' },
        1: { text: '已支付', color: 'blue' },
        2: { text: '配送中', color: 'geekblue' },
        3: { text: '已完成', color: 'green' },
        4: { text: '已取消', color: 'red' },
    };

    // 初始化加载订单
    useEffect(() => {
        const fetchInitialOrders = async () => {
            try {
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const unFinishedOrders = await getPendingOrders(adminInfo.data.adminId);
                setOrders(unFinishedOrders);
            } catch (error) {
                showNotification('获取订单数据失败', 'error');
            }
        };
        fetchInitialOrders();
    }, []);

    // 监听订单队列变化，弹出下一个订单
    useEffect(() => {
        if (orderQueue.length > 0 && !currentOrder) {
            // 取出队列第一个订单
            const [firstOrder, ...rest] = orderQueue;
            setCurrentOrder(firstOrder);
            setOrderQueue(rest);
            setModalVisible(true);
        }
    }, [orderQueue, currentOrder]);

    // WebSocket连接
    useEffect(() => {
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
        const adminId = adminInfo?.data?.adminId;
        if (!adminId) return;

        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                stompClient.subscribe(`/topic/orders/${adminId}`, (message) => {
                    const order = JSON.parse(message.body);
                    showNotification(`新订单：#${order.orderId}`, 'info');
                    // 不直接加入orders，先放newOrder弹窗里
                    setOrderQueue(prev => [...prev, order]);
                });
            },
            onStompError: (frame) => {
                console.error('STOMP Error:', frame.headers['message']);
            }
        });

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => stompClient.deactivate();
    }, []);

    // 新订单确认处理
    const handleConfirmNewOrder = (order) => {
        setOrders(prev => [order, ...prev]);
        // 关闭当前弹窗，并清空当前订单
        setModalVisible(false);
        setCurrentOrder(null); // 触发下一个订单弹窗
    };

    // 关闭弹窗处理
    const handleCancelNewOrder = () => {
        setModalVisible(false);
        setCurrentOrder(null); // 触发下一个订单弹窗
    };


    // 处理订单操作
    const handleOrderAction = async (orderId, action) => {
        try {
            await (action === 'accept' ? acceptOrder(orderId) : rejectOrder(orderId));
            showNotification(`订单#${orderId}已${action === 'accept' ? '接单' : '拒单'}`, 'success');
            setOrders(prev => prev.filter(order => order.orderId !== orderId));
        } catch (error) {
            showNotification('操作失败，请重试', 'error');
        }
    };

    return (
        <div className="merchant-container">
            <div className="order-header">
                <h2>待处理订单 <Badge count={orders.length} style={{ backgroundColor: '#52c41a' }} /></h2>
                <p>通过 WebSocket 实时接收订单</p>
            </div>

            <List
                itemLayout="vertical"
                dataSource={orders}
                renderItem={item => (
                    <List.Item className="order-card">
                        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
                            {/* 修正字段开始 */}
                            <Descriptions.Item label="订单号">#{item.orderId}</Descriptions.Item>
                            <Descriptions.Item label="下单时间" span={2}>
                                {new Date(item.createTime).toLocaleString()}
                            </Descriptions.Item>
                            <Descriptions.Item label="客户信息">
                                <div className="user-info-block">
                                    <div>{item.realName}</div>
                                    <div>{item.phone}</div>
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="菜品信息">
                                <div className="dish-info">
                                    <div className="dish-name">{item.dishName || '未知菜品'}</div>
                                    <div className="dish-price">价格: {item.price > 0 ? `¥${item.price}` : '待确认'}</div>
                                </div>
                            </Descriptions.Item>
                            {/* 修正字段结束 */}

                            <Descriptions.Item label="配送坐标">
                                ({item.x}, {item.y})
                            </Descriptions.Item>

                            <Descriptions.Item label="订单状态" span={3}>
                                <Tag
                                    color={statusTagMap[item.status]?.color || 'default'}
                                    icon={<ClockCircleOutlined />}
                                >
                                    {statusTagMap[item.status]?.text || '未知状态'}
                                </Tag>
                            </Descriptions.Item>

                            {item.remark && (
                                <Descriptions.Item label="用户备注" span={3}>
                                    <div className="remark-block">{item.remark}</div>
                                </Descriptions.Item>
                            )}

                            <Descriptions.Item label="操作" span={3}>
                                <div className="action-buttons">
                                    <Button
                                        type="primary"
                                        icon={<CheckOutlined />}
                                        onClick={() => handleOrderAction(item.orderId, 'accept')}
                                        disabled={item.status !== 1}
                                    >
                                        {item.status === 1 ? '接受订单' : '不可操作'}
                                    </Button>
                                    <Button
                                        danger
                                        icon={<CloseOutlined />}
                                        onClick={() => handleOrderAction(item.orderId, 'reject')}
                                        disabled={item.status !== 1}
                                    >
                                        {item.status === 1 ? '拒绝订单' : '不可操作'}
                                    </Button>
                                </div>
                            </Descriptions.Item>
                        </Descriptions>
                    </List.Item>
                )}
            />
            <NewOrderModal
                visible={modalVisible}
                order={currentOrder} // 改为传递当前订单
                onConfirm={handleConfirmNewOrder}
                onCancel={handleCancelNewOrder}
            />
        </div>
    );
};

export default MerchantOrder;