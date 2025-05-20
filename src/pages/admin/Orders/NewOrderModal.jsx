import React from 'react';
import { Modal, Descriptions, Button } from 'antd';

const statusTagMap = {
    0: { text: '待支付', color: 'orange' },
    1: { text: '已支付', color: 'blue' },
    2: { text: '配送中', color: 'geekblue' },
    3: { text: '已完成', color: 'green' },
    4: { text: '已取消', color: 'red' },
};

const NewOrderModal = ({ visible, order, onConfirm, onCancel }) => {// 修复点4: 添加调试日志
    console.log('弹窗状态:', visible, '订单数据:', order);
    if (!order) return null;

    return (
        <Modal
            visible={visible}
            title={`新订单 #${order.orderId}`}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    关闭
                </Button>,
                <Button key="confirm" type="primary" onClick={() => onConfirm(order)}>
                    确认订单
                </Button>,
            ]}
        >
            <Descriptions bordered column={1}>
                <Descriptions.Item label="订单号">#{order.orderId}</Descriptions.Item>
                <Descriptions.Item label="客户姓名">{order.realName || '未知'}</Descriptions.Item>
                <Descriptions.Item label="联系电话">{order.phone || '未知'}</Descriptions.Item>
                <Descriptions.Item label="菜品名称">{order.dishName || '未知菜品'}</Descriptions.Item>
                <Descriptions.Item label="价格">{order.price ? `¥${order.price}` : '待确认'}</Descriptions.Item>
                <Descriptions.Item label="配送坐标">
                    ({order.x}, {order.y})
                </Descriptions.Item>
                <Descriptions.Item label="备注">{order.remark || '无'}</Descriptions.Item>
                <Descriptions.Item label="订单状态">
                    {statusTagMap[order.status]?.text || '未知状态'}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default NewOrderModal;
