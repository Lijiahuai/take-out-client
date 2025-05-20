const baseUrl = 'http://localhost:8080';

export const getUserOrders = async () => {
  try {
    const userInfoStr = localStorage.getItem('userInfo');
    if (!userInfoStr) throw new Error('用户信息缺失');

    const userInfo = JSON.parse(userInfoStr);
    const userId = userInfo?.data?.userId;

    if (!userId || typeof userId !== 'number') {
      throw new Error(`无效的 userId：${userId}`);
    }

    const url = new URL(`${baseUrl}/order/user/getAllOrder`);
    url.searchParams.append('userId', userId);

    const response = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('获取订单错误:', { status: response.status, errorData });
      throw new Error(`请求失败: ${response.status}`);
    }

    const result = await response.json();
    console.log('获取订单:', result); // ✅ 正确打印订单列表
    return result;

  } catch (error) {
    console.error('获取用户订单失败:', error.message || error);
    return [];
  }
};


export const submitReview = async (orderId, reviewData) => {
  try {
    console.log('提交的评论数据:', {
      order_id: orderId,
      rating: reviewData.score,
      content: reviewData.comment
    });
    const response = await fetch(`${baseUrl}/order/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        rating: reviewData.score,
        content: reviewData.comment
      }),
    });


    if (!response.ok) {
      throw new Error('服务器响应错误');
    }

    return await response.json(); // 可选：如果后端有返回内容
  } catch (error) {
    console.error('提交评论失败:', error);
    throw error;
  }
};
