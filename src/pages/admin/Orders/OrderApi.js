const adminInfoRaw = localStorage.getItem('adminInfo');
let adminId = null;

if (adminInfoRaw) {
    try {
        const adminInfo = JSON.parse(adminInfoRaw);
        adminId = adminInfo?.data?.adminId;
    } catch (e) {
        console.error("adminInfo 解析失败", e);
    }
}
export const getOrders = async () => {
    if (!adminId) throw new Error('请重新登录');
    const response = await fetch(`http://localhost:8080/order/admin/getAllOrder?adminId=${adminId}`);
    if (!response.ok) {
        throw new Error('获取订单列表失败');
    }
    return response.json();
};

export const getPendingOrders = async () => {
    if (!adminId) throw new Error('请重新登录');
    const response = await fetch(`http://localhost:8080/order/admin/getNewOrders?adminId=${adminId}`);
    if (!response.ok) {
        throw new Error('获取待处理订单列表失败');
    }
    return response.json();

};

export const acceptOrder = async (orderId) => {
    const response = await fetch(`http://localhost:8080/order/admin/acceptOrder/${orderId}`, {
        method: 'PUT',
    });

    if (!response.ok) {
        throw new Error('接单失败');
    }
    return response.json();
};

export const rejectOrder = async (orderId) => {
    const response = await fetch(`http://localhost:8080/order/admin/rejectOrder/${orderId}`, {
        method: 'PUT',
    });

    if (!response.ok) {
        throw new Error('接单失败');
    }
    return response.json();

};