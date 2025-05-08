import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './Notification.css'; // 单独CSS文件

// 精简版通知组件
const Notification = ({ message, type = 'success' }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const container = document.getElementById('notification-root');
      container?.remove();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`notification ${type}`}>
      <div className="icon">{getIcon(type)}</div>
      <span className="message">{message}</span>
    </div>
  );
};

// 图标配置
const getIcon = (type) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ⓘ'
  };
  return icons[type] || icons.success;
};

// 全局调用方法
export const showNotification = (message, type = 'success') => {
  let container = document.getElementById('notification-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-root';
    document.body.appendChild(container);
  }
  
  const root = createRoot(container);
  root.render(<Notification message={message} type={type} />);
};