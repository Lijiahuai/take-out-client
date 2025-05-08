// src/pages/Auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [role, setRole] = useState('user');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await fetch('http://localhost:8080/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role })
            });
            const result = await res.text();
            if (result==='success') {
                navigate(role === 'user' ? '/user/home' : '/admin');
            } else {
                console.log(result);
                alert('登录失败，请检查账号密码');
            }
        } catch (e) {
            console.error(e);
            alert('网络错误');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '100px auto' }}>
            <h2>登录</h2>
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
                    placeholder="账号"
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
                <button onClick={handleLogin} style={{ marginTop: 20 }}>登录</button>
                <div style={{ marginTop: 10 }}>
                    没有账号？
                    <button onClick={() => navigate('/register')} style={{ marginLeft: 10 }}>
                        去注册
                    </button>
                </div>

            </div>
        </div>
    );
}
