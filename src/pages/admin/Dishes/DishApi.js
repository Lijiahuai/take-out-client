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
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.username) throw new Error('用户未登录');

        const res = await fetch(`http://localhost:8080/admin/dish/getAllDish?username=${userInfo.username}`);

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