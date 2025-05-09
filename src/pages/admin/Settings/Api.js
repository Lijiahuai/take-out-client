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
 * }>}
 */
export const getAdminDetail = async (adminId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/detail/${adminId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!res.ok) throw new Error('请求失败');
    return await res.json();
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
 *   logo_url?: string
 * }} data 
 * @returns {Promise<{ success: boolean }>}
 */
export const updateAdminDetail = async (adminId, data) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/detail/${adminId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('更新失败');
    return await res.json();
  } catch (error) {
    console.error('更新管理员信息失败:', error);
    throw error;
  }
};


