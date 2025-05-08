const API_BASE = 'http://localhost:8080/admin/dishes';

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '请求失败');
    }
    return response.json();
};

export const getAllDish = async (params = {}) => {
    try {
        const username = localStorage.getItem('username');
        const res = await fetch(`http://localhost:8080/admin/dish/getAllDish?username=${username}`);

        if (!res.ok) throw new Error('请求失败');

        const list = await res.json(); // 直接获取数组

        return {
            data: {
                list,          // 直接使用返回的数组
                total: list.length, // 前端分页时计算总数
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
    // 获取本地存储的用户名
    const username = localStorage.getItem('username'); // 获取存储的用户名
    const response = await fetch(`http://localhost:8080/admin/dish/addDish?username=${encodeURIComponent(username)}`, {
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


export const getDishById = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`);
    return handleResponse(response);
};

export const deleteDish = async (dishId) => {
    const response = await fetch(`http://localhost:8080/admin/dish/deleteDish?id=${dishId}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
};



export const toggleDishStatus = async (id, status) => {
    const response = await fetch(`${API_BASE}/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
};