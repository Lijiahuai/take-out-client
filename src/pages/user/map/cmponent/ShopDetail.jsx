import React, { useEffect, useState } from 'react';
import { Card, Button, Tag, Divider, Spin, message, Row, Col } from 'antd';
import { ShoppingCartOutlined, StarOutlined } from '@ant-design/icons';
import './ShopDetail.css';
import { getShopDetail } from '../api';
import { useCart } from '../../context/CartContext';
import { showNotification } from '../../../../components/ui/Notification';

// ✅ DishCard 组件
const DishCard = ({ dish }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(dish.dish_id);
    showNotification(`已添加 ${dish.dish_name} 到购物车`, 'success');
  };

  return (
    <Card className="dish-card" hoverable>
      <div className="dish-content">
        <div className="dish-info">
          <h3>{dish.dish_name}</h3>
          <p className="price">¥{dish.price.toFixed(2)}</p>
          {dish.dish_description && (
            <p className="description">{dish.dish_description}</p>
          )}
          {dish.category && (
            <Tag color="geekblue">{dish.category}</Tag>
          )}
        </div>
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          className="add-to-cart-btn"
        >
          加入购物车
        </Button>
      </div>
    </Card>
  );
};

// ✅ ShopDetail 主组件
const ShopDetail = ({ shopId }) => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchShopDetail = async () => {
      try {
        setLoading(true);
        const shopData = await getShopDetail(shopId);
        setShop(shopData);

        if (shopData.dishes && shopData.dishes.length > 0) {
          const categories = [...new Set(shopData.dishes.map(d => d.category))];
          setActiveCategory(categories[0]);
        }
      } catch (error) {
        message.error('获取商家详情失败');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetail();
  }, [shopId]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!shop) {
    return <div className="error-container">商家信息加载失败</div>;
  }

  const categories = shop.dishes
    ? [...new Set(shop.dishes.map(dish => dish.category))].filter(Boolean)
    : [];

  const filteredDishes = shop.dishes
    ? shop.dishes.filter(dish => dish.category === activeCategory)
    : [];

  const chunkedCategories = [];
  const chunkSize = 10;
  for (let i = 0; i < categories.length; i += chunkSize) {
    chunkedCategories.push(categories.slice(i, i + chunkSize));
  }

  return (
    <div className="shop-detail-container">
      <div className="shop-header">
        <div className="shop-basic-info">
          <img
            src={shop.logoUrl || 'https://img.freepik.com/free-photo/restaurant-interior_1127-3394.jpg'}
            alt={shop.name}
            className="shop-logo"
          />
          <div className="shop-info">
            <h1>{shop.name}</h1>
            <div className="rating">
              <StarOutlined style={{ color: '#ffc107' }} />
              <span>{shop.rating || '4.5'}</span>
            </div>
            {shop.description && (
              <p className="description">{shop.description}</p>
            )}
            <div className="meta-info">
              <div className="meta-info-row">
                {shop.phone && <span className="meta-info-item">电话: {shop.phone}</span>}
                {shop.businessHours && <span className="meta-info-item">营业时间: {shop.businessHours}</span>}
              </div>
              <div className="meta-info-row">
                {shop.deliveryFee && <span className="meta-info-item">配送费: {shop.deliveryFee}</span>}
                {shop.minOrder && <span className="meta-info-item">起送价: {shop.minOrder}</span>}
              </div>
              {shop.address && (
                <div className="meta-info-row">
                  <span className="meta-info-item">地址: {shop.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <div className="category-tabs-container">
        {chunkedCategories.map((categoryRow, rowIndex) => (
          <div key={`row-${rowIndex}`} className="category-tabs-row">
            {categoryRow.map(category => (
              <Button
                key={category}
                type={activeCategory === category ? 'primary' : 'default'}
                onClick={() => setActiveCategory(category)}
                className="category-tab"
              >
                {category}
              </Button>
            ))}
          </div>
        ))}
      </div>

      <div className="dishes-container">
        {filteredDishes.length > 0 ? (
          <Row gutter={[16, 16]}>
            {filteredDishes.map(dish => (
              <Col key={dish.dish_id} xs={24} sm={12} md={8} lg={6}>
                <DishCard dish={dish} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="empty-dishes">
            <p>该分类下暂无菜品</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetail;
