const baseUrl = 'http://localhost:8080';

export const getUserInfo = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const response = await fetch(`${baseUrl}/user/info/getUserInfo?id=${userInfo.data.user_id}`, {
        headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('获取用户信息失败');
    return await response.json();
};

export const updateUserInfo = async (data) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const response = await fetch(`${baseUrl}/user/info/updateInfo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            ...data,
            user_id: userInfo.data.user_id
        })
    });
    if (!response.ok) throw new Error('更新用户信息失败');
    return await response.json();
};