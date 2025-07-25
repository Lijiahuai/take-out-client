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
            // 根据角色选择不同的API端点
            const endpoint = role === 'user' 
                ? 'http://localhost:8080/api/auth/login' 
                : 'http://localhost:8080/api/auth/merchant/login';
            
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await res.json();

            // 检查请求是否成功
            if (result.code === 200 && result.data) {
                // 保存token
                localStorage.setItem('token', result.data.token);
                            
                showNotification('登录成功', 'success');
                navigate(role === 'user' ? '/user' : '/merchant');
            } else {
                showNotification(result.message || '登录失败', 'error');
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
                    <label className={`role-option ${role === 'merchant' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            value="merchant"
                            checked={role === 'merchant'}
                            onChange={() => setRole('merchant')}
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