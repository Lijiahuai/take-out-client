export const getOrders = async (admin_id) => {
    const response = await fetch(`http://localhost:8080/order/admin/getAllOrder?adminId=${admin_id}`);
    if (!response.ok) {
        throw new Error('获取订单列表失败');
    }
    return response.json();
};