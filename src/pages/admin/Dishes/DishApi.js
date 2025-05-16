
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
        if (!userInfo) throw new Error('请重新登录');

        const res = await fetch(`http://localhost:8080/admin/dish/getAllDish?admin_id=${userInfo.data.admin_id}`);

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
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) throw new Error('请重新登录');
    const response = await fetch(`http://localhost:8080/admin/dish/addDish?admin_id=${userInfo.data.admin_id}`, {
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

