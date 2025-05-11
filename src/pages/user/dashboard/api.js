const baseUrl = 'http://localhost:8080';
export const getRecommendDish = async (x, y, radius) => {
  try {
    const url = new URL(`${baseUrl}/user/dashboard/getRecommendDish`);
    url.searchParams.append('x', x);
    url.searchParams.append('y', y);
    url.searchParams.append('radius', radius);

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API错误详情:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`请求失败: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('获取推荐菜品失败:', error);
    return []; // 降级处理
  }
};