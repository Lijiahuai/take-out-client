import React, { useState, useEffect } from 'react';
import {
    Table, Tag, Space, Button, message, Modal, Rate,
    Input
} from 'antd';
import { EyeOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getUserOrders, submitReview } from './api';
import './UserOrderList.css';

const UserOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reviewVisible, setReviewVisible] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [score, setScore] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });

    const navigate = useNavigate();

    const handleReviewSubmit = async () => {
        if (!currentOrder) return;
        if (score === 0) {
            message.warning('请先评分');
            return;
        }

        setSubmitting(true);
        try {
            await submitReview(currentOrder.orderId, { score, comment });
            console.log('评价提交成功');
            await fetchOrders();
            setReviewVisible(false);
            setScore(0);
            setComment('');
        } catch (error) {
            message.error('评价提交失败');
        } finally {
            setSubmitting(false);
        }
    };

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
            0: { text: '待支付', color: 'orange', icon: <ClockCircleOutlined /> },
            1: { text: '已支付', color: 'blue', icon: <ClockCircleOutlined /> },
            2: { text: '配送中', color: 'geekblue', icon: <ClockCircleOutlined /> },
            3: { text: '已完成', color: 'green', icon: <CheckCircleOutlined /> },
            4: { text: '已取消', color: 'red', icon: <CloseCircleOutlined /> },
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
                    <div className="order-id">订单号: {record.orderId}</div>
                    <div className="order-time">
                        创建时间: {new Date(record.createTime).toLocaleString()}
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
                    <div className="shop-name">{record.shopName}</div>
                    <div className="shop-phone">联系电话: {record.phone}</div>
                    <div className="shop-location">
                        位置: ({record.x}, {record.y})
                    </div>
                    {record.shopDescription && (
                        <div className="shop-description">{record.shopDescription}</div>
                    )}
                </div>
            ),
        },
        {
            title: '菜品信息',
            key: 'dish_info',
            render: (_, record) => (
                <div className="dish-info-block">
                    <div className="dish-name">{record.dishName}</div>
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
                        onClick={() => {
                            setCurrentOrder(record);
                            setReviewVisible(true);
                        }}
                        className="action-button"
                    >
                        评价
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

            {/* 评价弹窗 */}
            <Modal
                title="订单评价"
                visible={reviewVisible}
                onCancel={() => setReviewVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setReviewVisible(false)}>
                        取消
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={submitting}
                        onClick={handleReviewSubmit}
                    >
                        提交评价
                    </Button>,
                ]}
                width={600}
                destroyOnClose
            >
                {currentOrder && (
                    <div className="review-modal-content">
                        <div className="order-info">
                            <h4>订单号: {currentOrder.orderId}</h4>
                            <p>店铺名称: {currentOrder.shopName}</p>
                            <p>菜品: {currentOrder.dishName}</p>
                        </div>

                        <div className="rating-section">
                            <span style={{ marginRight: 8 }}>菜品评分：</span>
                            <Rate
                                value={score}
                                onChange={setScore}
                                allowHalf
                                style={{ fontSize: 24 }}
                            />
                            <span style={{ marginLeft: 16, color: '#1890ff' }}>
                                {score ? `${score} 星` : '请评分'}
                            </span>
                        </div>

                        <div style={{ marginTop: 20 }}>
                            <Input.TextArea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="请输入您的评价内容（可选）..."
                                rows={4}
                                maxLength={200}
                                showCount
                            />
                        </div>
                    </div>
                )}
            </Modal>

            {/* 订单表格 */}
            <Table
                columns={columns}
                rowKey="orderId"
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
