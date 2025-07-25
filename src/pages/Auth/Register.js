import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '../../components/ui/Notification';
import './css/register.css';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!username || !password || !phone || !email) {
            showNotification('请填写所有注册信息', 'error');
            return;
        }

        // 简单的邮箱和手机号格式校验
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            showNotification('请输入有效的邮箱地址', 'error');
            return;
        }
        if (!/^\d{11}$/.test(phone)) {
            showNotification('请输入11位手机号码', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const requestBody = { username, password, phone, email };

            const res = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            const result = await res.json();

            if (result.code === 200) {
                showNotification('注册成功，请登录', 'success');
                navigate('/login');
            } else {
                showNotification(result.message || '注册失败，用户名可能已存在', 'error');
            }
        } catch (e) {
            console.error(e);
            showNotification('网络错误', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            {/* Background image with blur effect */}
            <div className="background-image"></div>
            
            {/* Registration card */}
            <div className="register-card">
                <h2 className="register-title">用户注册</h2>
                
                {/* 商家注册暂时禁用 */}
                <div style={{textAlign: 'center', marginBottom: '1.5rem', color: '#888'}}>
                    商家注册请联系平台管理员
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
                    <input
                        className="register-input"
                        placeholder="请输入手机号"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                    />
                    <input
                        className="register-input"
                        type="email"
                        placeholder="请输入邮箱"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
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