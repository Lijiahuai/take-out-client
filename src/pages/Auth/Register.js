import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '../../components/ui/Notification';
import './css/register.css'

export default function Register() {
    const [role, setRole] = useState('user');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!username || !password) {
            showNotification('请填写用户名和密码', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const requestBody = { username, password, role };

            const res = await fetch('http://localhost:8080/Auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            const result = await res.text();

            if (result === "success") {
                showNotification('注册成功，请登录', 'success');
                navigate('/login');
            } else {
                showNotification('注册失败，用户名可能已存在', 'error');
            }
        } catch (e) {
            showNotification('网络错误', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">用户注册</h2>

                <div className="role-selector">
                    <label className={`role-option ${role === 'user' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            value="user"
                            checked={role === 'user'}
                            onChange={() => setRole('user')}
                            className="radio-input"
                        />
                        我是用户
                    </label>
                    <label className={`role-option ${role === 'admin' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            value="admin"
                            checked={role === 'admin'}
                            onChange={() => setRole('admin')}
                            className="radio-input"
                        />
                        我是商家
                    </label>
                </div>

                <div className="input-group">
                    <input
                        className="register-input"
                        placeholder="请输入用户名"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        className="register-input"
                        type="password"
                        placeholder="请输入密码"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <button
                    className="register-button"
                    onClick={handleRegister}
                    disabled={isLoading}
                >
                    {isLoading ? '注册中...' : '立即注册'}
                </button>

                <div className="login-prompt">
                    已有账号？
                    <button
                        className="login-button"
                        onClick={() => navigate('/login')}
                    >
                        去登录
                    </button>
                </div>
            </div>
        </div>
    );
}