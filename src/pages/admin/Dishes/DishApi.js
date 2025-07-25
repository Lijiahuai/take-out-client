
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '请求失败');
    }
    return response.json();
};

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


export const getAllDish = async (params = {}) => {
    try {
        if (!adminId) throw new Error('请重新登录');

        const res = await fetch(`http://localhost:8080/admin/dish/getAllDish?admin_id=${adminId}`);

        if (!res.ok) throw new Error('请求失败');

        const list = await res.json();

        return {
            data: {
                list,
                total: list.length,
                page: params.page || 1,
                pageSize: params.pageSize || 10
            }
        };
    } catch (error) {
        console.error('获取菜品失败:', error);
        throw error;
    }
};


export const updateDish = async (dishData) => {
    console.log('需要更新的dishData', dishData);
    const response = await fetch(`http://localhost:8080/admin/dish/updateDish`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dishData),
    });

    return handleResponse(response);
};

export const createDish = async (dishData) => {
    console.log('dishData', dishData);
    if (!adminId) throw new Error('请重新登录');
    const response = await fetch(`http://localhost:8080/admin/dish/addDish?admin_id=${adminId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...dishData,   // 包括所有的菜品数据
        }),
    });
    return handleResponse(response);
};

