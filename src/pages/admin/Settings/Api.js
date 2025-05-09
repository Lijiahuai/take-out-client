// api.js - 管理员相关API接口
const API_BASE_URL = 'http://localhost:8080';

/**
 * 获取管理员详细信息
 * @param {number} adminId 
 * @returns {Promise<{
 *   id: number,
 *   admin_id: number,
 *   shop_name: string,
 *   x_coord: number,
 *   y_coord: number,
 *   phone: string,
 *   description: string,
 *   logo_url: string,
 *   update_time: string
 * }>}*/
export const getAdminInfo = async (adminId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/info/getInfo?adminId=${adminId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log(res);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || '请求失败');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('获取管理员信息失败:', error);
    throw error;
  }
};

/**
 * 更新管理员信息
 * @param {number} adminId 
 * @param {{
*   shop_name?: string,
*   x_coord?: number,
*   y_coord?: number,
*   phone?: string,
*   description?: string,
*   logo_url?: string,
*   update_time?: string
* }} data 
* @returns {Promise<{ success: boolean }>}
*/
export const updateAdminInfo = async (adminId, data) => {
  try {
    // 构造符合后端AdminInfo对象结构的请求体
    const requestBody = {
      admin_id: adminId,  // 确保包含admin_id字段
      ...data
    };

    const res = await fetch(`${API_BASE_URL}/admin/info/updateInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)  // 传递完整对象
    });

    // 增强错误处理
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `更新失败，状态码: ${res.status}`);
    }

    // 检查响应内容类型
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return { success: true };  // 假设无响应体时表示成功
    }

    return await res.json();
  } catch (error) {
    console.error('更新管理员信息失败:', error);
    throw new Error(`更新失败: ${error.message}`);
  }
};

