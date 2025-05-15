export const settlement = async (cartData) => {
    try {
        // 从localStorage获取用户信息
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.data) {
            throw new Error('用户信息缺失，请重新登录');
        }

        // 注意：根据您之前的说明，用户ID存储在 userInfo.data.user_id
        const userId = userInfo.data.user_id;
        
        const payload = {
            user: {
                user_id: userId,  // 使用从userInfo中提取的正确ID
            },
            dishes: cartData.map(item => ({
                dish_id: item.dish.id,
            }))
        };

        const response = await fetch('http://localhost:8080/user/cart/settlement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

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