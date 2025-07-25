import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 创建用户上下文
export const UserContext = createContext();

// 创建全局用户信息
let globalUser = null;
let globalUserInfo = {};

// 用户信息提供者组件
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 获取用户信息的方法
  const fetchUserInfo = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('http://localhost:8080/api/user/info', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (result.code === 200) {
          setUser(result.data);
          // 设置全局用户信息 - 保存完整的用户数据
          globalUser = result.data;
          // 格式化的用户信息，用于UI显示
          globalUserInfo = {
            id: result.data.id,
            userId: result.data.userId,
            name: result.data.realName || result.data.nickname,
            realName: result.data.realName,
            nickname: result.data.nickname,
            gender: result.data.gender,
            phone: result.data.phone,
            avatar: result.data.avatar || 'https://randomuser.me/api/portraits/men/1.jpg',
            balance: result.data.balance,
            birthday: result.data.birthday,
            address: result.data.address,
            unreadMessages: 3, // 示例数据
            unreadNotifications: 5, // 示例数据
            location: {
              x: result.data.x,
              y: result.data.y,
            },
            x: result.data.x,
            y: result.data.y,
            remark: result.data.remark,
            createTime: result.data.createTime,
            updateTime: result.data.updateTime
          };
        } else {
          // token失效或错误，清除旧数据并跳转到登录页
          localStorage.removeItem('token');
          globalUser = null;
          globalUserInfo = {};
          navigate('/login');
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        globalUser = null;
        globalUserInfo = {};
        navigate('/login');
      }
    } else {
      globalUser = null;
      globalUserInfo = {};
      navigate('/login');
    }
    setLoading(false);
  };

  // 更新用户信息的方法
  const updateUserInfo = async (updatedInfo) => {
    const token = localStorage.getItem('token');
    if (token && user) {
      try {
        const response = await fetch('http://localhost:8080/api/user/info', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedInfo)
        });
        const result = await response.json();
        if (result.code === 200) {
          // 更新成功后重新获取用户信息
          fetchUserInfo();
          return true;
        }
        return false;
      } catch (error) {
        console.error('更新用户信息失败:', error);
        return false;
      }
    }
    return false;
  };

  // 退出登录方法
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    globalUser = null;
    globalUserInfo = {};
    navigate('/login');
  };

  // 组件挂载时获取用户信息
  useEffect(() => {
    // 如果已经有全局用户信息，直接使用
    if (globalUser) {
      setUser(globalUser);
      setLoading(false);
    } else {
      fetchUserInfo();
    }
  }, []);

  // 提供用户上下文
  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      fetchUserInfo, 
      updateUserInfo, 
      logout,
      // 完整的格式化用户信息，包含所有字段
      userInfo: user ? {
        id: user.id,
        userId: user.userId,
        name: user.realName || user.nickname,
        realName: user.realName,
        nickname: user.nickname,
        gender: user.gender,
        phone: user.phone,
        avatar: user.avatar || 'https://randomuser.me/api/portraits/men/1.jpg',
        balance: user.balance,
        birthday: user.birthday,
        address: user.address,
        unreadMessages: 3, // 示例数据
        unreadNotifications: 5, // 示例数据
        location: {
          x: user.x,
          y: user.y,
        },
        x: user.x,
        y: user.y,
        remark: user.remark,
        createTime: user.createTime,
        updateTime: user.updateTime
      } : {}
    }}>
      {children}
    </UserContext.Provider>
  );
};

// 自定义Hook，方便组件使用用户上下文
export const useUser = () => useContext(UserContext);

// 导出全局用户信息，可以在任何地方使用
export const getGlobalUser = () => globalUser;
export const getGlobalUserInfo = () => globalUserInfo; 