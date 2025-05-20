export const settlement = async (cartData) => {
    try {
        // 从localStorage获取用户信息
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.data) {
            throw new Error('用户信息缺失，请重新登录');
        }
        console.log("用户信息", userInfo.data)
        const response = await fetch('http://localhost:8080/user/cart/settlement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: cartData,
                user: userInfo.data
            })
        });
        console.log("结算请求发送:", {
            data: cartData,
            user: userInfo.data
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('结算错误详情:', {
                status: response.status,
                statusText: response.statusText,
                errorData
            });
            throw new Error(errorData?.message || '结算请求失败');
        }

        return await response.json();

    } catch (error) {
        console.error('结算过程中出错:', error);
        throw error; // 继续抛出错误由调用方处理
    }
};
// components/api.js
export const getDishDetailsByIds = async (cart) => {
    try {
        const res = await fetch('http://localhost:8080/user/cart/getDishDetailsByIds', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cart)

        });

        if (!res.ok) {
            throw new Error('请求失败');
        }

        return res.json();
    } catch (error) {
        console.error('获取菜品详情失败:', error);
        throw error;
    }

};
