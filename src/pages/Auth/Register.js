import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [role, setRole] = useState('user');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [shopName, setShopName] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!username || !password) {
            alert("请填写用户名和密码");
            return;
        }

        if (role === 'admin' && (!shopName || !phone)) {
            alert("请填写商家名称和联系电话");
            return;
        }

        try {
            const requestBody = role === 'user'
                ? { username, password, role }
                : { username, password, role, shopName, phone };

            const res = await fetch('http://localhost:8080/Auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            const result = await res.text();  // 改为text()接收响应

            if (result === "success") {
                alert("注册成功，请登录");
                navigate('/login');
            } else {
                console.log(result);
                alert('注册失败，用户名可能已存在');
            }
        } catch (e) {
            alert('网络错误');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '100px auto' }}>
            <h2>注册</h2>
            <div>
                <label>
                    <input
                        type="radio"
                        value="user"
                        checked={role === 'user'}
                        onChange={() => setRole('user')}
                    />
                    我是用户
                </label>
                <label style={{ marginLeft: 20 }}>
                    <input
                        type="radio"
                        value="admin"
                        checked={role === 'admin'}
                        onChange={() => setRole('admin')}
                    />
                    我是商家
                </label>
            </div>
            <div style={{ marginTop: 20 }}>
                <input
                    placeholder="用户名"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                /><br />
                <input
                    type="password"
                    placeholder="密码"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ marginTop: 10 }}
                /><br />

                {/* 商家专属字段 */}
                {role === 'admin' && (
                    <>
                        <input
                            placeholder="商家/店铺名"
                            value={shopName}
                            onChange={e => setShopName(e.target.value)}
                            style={{ marginTop: 10 }}
                        /><br />
                        <input
                            placeholder="联系电话"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            style={{ marginTop: 10 }}
                        /><br />
                    </>
                )}

                <button onClick={handleRegister} style={{ marginTop: 20 }}>注册</button>
                <div style={{ marginTop: 10 }}>
                    已有账号？<a href="/login">去登录</a>
                </div>
            </div>
        </div>
    );
}