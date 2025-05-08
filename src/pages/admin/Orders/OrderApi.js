const API_BASE = 'http://localhost:8080/admin/orders';

export const getOrders = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}?${queryString}`);
    if (!response.ok) {
        throw new Error('获取订单列表失败');
    }
    return response.json();
};

export const getOrderById = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
        throw new Error('获取订单详情失败');
    }
    return response.json();
};

export const createOrder = async (orderData) => {
    const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });
    if (!response.ok) {
        throw new Error('创建订单失败');
    }
    return response.json();
};

export const updateOrder = async (id, orderData) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });
    if (!response.ok) {
        throw new Error('更新订单失败');
    }
    return response.json();
};

export const deleteOrder = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('删除订单失败');
    }
    return response.json();
};