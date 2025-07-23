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
export const getAdminInfo = async () => {
  try {
    const res = await fetch(`http://localhost:8080/admin/info/getInfo?adminId=${adminId}`, {
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

export const updateAdminInfo = async (data) => {
  try {
    console.log("更新管理员信息请求体:",data);

    const res = await fetch(`http://localhost:8080/admin/info/updateInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)  // 传递完整对象
    });
    console.log(res);
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

