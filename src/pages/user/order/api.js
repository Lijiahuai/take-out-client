const baseUrl = 'http://localhost:8080';

/**
 * 获取用户所有订单
 * @returns {Promise<Array>} 订单列表
 */
export const getUserOrders = async () => {
  try {
    // 从localStorage获取用户信息
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const url = new URL(`${baseUrl}/order/user/getAllOrder`);
    url.searchParams.append('userId', userInfo.data.user_id);

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        // 如果需要认证可以添加：
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('获取订单错误:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`请求失败: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('获取用户订单失败:', error);
    return []; // 降级处理，返回空数组
  }
};