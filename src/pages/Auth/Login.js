import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '../../components/ui/Notification'; // 导入通知组件
import './css/login.css'

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
                // 保存信息
                localStorage.setItem('username', result.username);
                localStorage.setItem('role', result.role);
                localStorage.setItem('id', result.id);
                
                showNotification('登录成功', 'success');
                // 跳转页面
                navigate(result.role === 'user' ? '/user/home' : '/admin');
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