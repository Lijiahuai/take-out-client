import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Button, Spin, message } from 'antd';
import { FireOutlined, SyncOutlined } from '@ant-design/icons';
import './UserDashboard.css';
import { getRecommendDish } from './api.js';
import DishCard from './components/DishCard.jsx';

const ITEMS_PER_PAGE = 3; // 每批显示的菜品数量

const UserDashboard = () => {
  const [featuredDishes, setFeaturedDishes] = useState([]);
  const [displayDishes, setDisplayDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  // 获取推荐菜品（无需传参数）
  const fetchFeaturedDishes = async () => {
    try {
      setLoading(true);
      const response = await getRecommendDish(); // 后端已基于热度推荐
      console.log('推荐菜品:', response);
      const validDishes = Array.isArray(response) ? response : [];
      setFeaturedDishes(validDishes);
      updateDisplayDishes(validDishes);
    } catch (error) {
      console.error('获取推荐菜品失败:', error);
      message.error('获取推荐菜品失败');
      setFeaturedDishes([]);
      setDisplayDishes([]);
    } finally {
      setLoading(false);
    }
  };

  // 更新显示菜品（随机选取一批）
  const updateDisplayDishes = (allDishes) => {
    if (allDishes.length <= ITEMS_PER_PAGE) {
      setDisplayDishes(allDishes);
    } else {
      const shuffled = [...allDishes].sort(() => 0.5 - Math.random());
      setDisplayDishes(shuffled.slice(0, ITEMS_PER_PAGE));
    }
  };

  const handleRefresh = () => {
    if (featuredDishes.length > ITEMS_PER_PAGE) {
      updateDisplayDishes(featuredDishes);
      carouselRef.current?.goTo(0);
    }
  };

  useEffect(() => {
    fetchFeaturedDishes();
  }, []);

  // 响应式计算每页显示数量
  const calculateItemsPerPage = () => {
    if (typeof window === 'undefined') return 4;
    const width = window.innerWidth;
    if (width < 768) return 2;
    if (width < 1024) return 4;
    return 6;
  };

  return (
    <div className="user-dashboard">
      <div className="section-header">
        <h2>
          <FireOutlined className="section-icon" />
          今日推荐菜品
        </h2>
        <Button 
          type="text" 
          icon={<SyncOutlined />} 
          onClick={handleRefresh}
          disabled={loading || featuredDishes.length <= ITEMS_PER_PAGE}
        >
          换一批
        </Button>
      </div>

      {loading ? (
        <Spin tip="加载中..." size="large" className="loading-spinner" />
      ) : displayDishes.length > 0 ? (
        <Carousel
          ref={carouselRef}
          autoplay
          dots={{ className: 'custom-dots' }}
          className="dishes-carousel"
        >
          {Array.from({ length: Math.ceil(displayDishes.length / calculateItemsPerPage()) }).map((_, pageIndex) => (
            <div key={pageIndex} className="dish-page">
              <div className="dish-row">
                {displayDishes
                  .slice(
                    pageIndex * calculateItemsPerPage(),
                    (pageIndex + 1) * calculateItemsPerPage()
                  )
                  .map(dish => (
                    <div key={dish?.dishBasic?.dishId || dish?.id} className="dish-col">
                      <DishCard dish={dish} />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </Carousel>
      ) : (
        <div className="empty-state">
          <p>暂无推荐菜品</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
