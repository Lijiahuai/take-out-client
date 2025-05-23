const baseUrl = 'http://localhost:8080';
export const getNearByShops = async (x, y, radius) => {
  try {
    const url = new URL(`${baseUrl}/user/map/getNearByShops`);
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
    console.error('获取附近商家错误:', error);
    return []; // 降级处理
  }
};

// api.js
export const searchShops = async (query) => {
  try {
    const url = new URL(`${baseUrl}/user/map/searchShops`);
    url.searchParams.append('keyword', query);

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
    console.error('搜素商家错误:', error);
    return [];
  }
};
export const getShopDetail = async (shopId) => {
  try {
    console.log('获取商家详情:', shopId);
    const url = new URL(`${baseUrl}/user/map/getShopDetail`);
    url.searchParams.append('id', shopId);

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
    } return await response.json();
  } catch (error) {
    console.error('获取商家详情错误:', error);
    return {};
  }
}