const baseUrl = 'http://localhost:8080';
export const getRecommendDish = async () => {
  try {
    const url = new URL(`${baseUrl}/user/dashboard/getRecommendDishCard`);
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

export const likeDish = async (dishId) => {
  try {
    const response = await fetch('http://localhost:8080/dish/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dishId }),
    });

    if (!response.ok) {
      throw new Error('点赞失败');
    }

    return await response.json();
  } catch (error) {
    console.error('点赞请求出错:', error);
    throw error;
  }
};
export const favoriteDish = async (dishId) => {
  try {
    const response = await fetch('http://localhost:8080/dish/favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dishId }),
    });

    if (!response.ok) {
      throw new Error('收藏失败');
    }

    return await response.json();
  } catch (error) {
    console.error('收藏请求出错:', error);
    throw error;
  }
};
