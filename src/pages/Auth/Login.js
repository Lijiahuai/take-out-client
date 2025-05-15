import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '../../components/ui/Notification';
import './css/login.css';

export default function Login() {
    const [role, setRole] = useState('user');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            showNotification('请输入账号和密码', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:8080/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role })
            });

            const result = await res.json();

            if (result.status) {
                const userInfo = {
                    role: result.role,
                    data: result.role === 'admin' ? result.admin : result.user  // ✅ 存储完整对象
                };

                // 存储在 localStorage 中
                localStorage.setItem('userInfo', JSON.stringify(userInfo));

                console.log(userInfo);
                showNotification('登录成功', 'success');
                navigate(result.role === 'user' ? '/user' : '/admin');
            } else {
                showNotification(result.error || '登录失败', 'error');
            }
        } catch (e) {
            console.error(e);
            showNotification('网络错误', 'error');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="login-container">
            {/* Background image with blur effect */}
            <div className="background-image"></div>

            {/* Login card */}
            <div className="login-card">
                <h2 className="login-title">欢迎登录</h2>

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
                        className="login-input"
                        placeholder="请输入账号"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="请输入密码"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <button
                    className="login-button"
                    onClick={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? '登录中...' : '登录'}
                </button>

                <div className="register-prompt">
                    没有账号？
                    <button
                        className="register-button"
                        onClick={() => navigate('/register')}
                    >
                        去注册
                    </button>
                </div>
            </div>
        </div>
    );
}