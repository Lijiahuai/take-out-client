import React, { useEffect, useState } from 'react';
import { Card, Button, Tag, Divider, Spin, message, Row, Col, Rate } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import './ShopDetail.css';
import { getShopDetail } from '../api';
import { useCart } from '../../context/CartContext';
import { showNotification } from '../../../../components/ui/Notification';

const DishCard = ({ dish }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(dish.dishId);
    showNotification(`已添加 ${dish.dishName} 到购物车`, 'success');
  };

  return (
    <Card className="dish-card" hoverable>
      <div className="dish-content">
        {/* 顶部信息区块 */}
        <div className="dish-header">
          <h3 className="dish-title">{dish.dishName}</h3>
          <Tag className="dish-category" color="geekblue">{dish.category}</Tag>
        </div>

        {/* 描述信息 */}
        {dish.dishDescription && (
          <p className="dish-description">{dish.dishDescription}</p>
        )}

        {/* 底部操作区 */}
        <div className="dish-footer">
          <div className="price-wrapper">
            <span className="price-label">价格</span>
            <span className="price">¥{dish.price.toFixed(2)}</span>
          </div>
          <Button
            type="primary"
            shape="round"
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
            className="add-to-cart-btn"
          >
            加入购物车
          </Button>
        </div>
      </div>
    </Card>
  );
};

// ✅ 主组件
const ShopDetail = ({ shopId }) => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const data = await getShopDetail(shopId);
        setShop(data);

        if (data.dishes?.length) {
          const categories = [...new Set(data.dishes.map(d => d.category))];
          setActiveCategory(categories[0]);
        }
      } catch (err) {
        message.error('商家信息获取失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [shopId]);

  if (loading) {
    return <div className="loading-container"><Spin size="large" /></div>;
  }

  if (!shop) {
    return <div className="error-container">无法加载商家信息</div>;
  }

  const categories = [...new Set(shop.dishes.map(d => d.category))].filter(Boolean);
  const filteredDishes = shop.dishes.filter(d => d.category === activeCategory);

  return (
    <div className="shop-detail-container">
      <div className="shop-header">
        <div className="shop-basic-info">
          <img
            src={shop.logoUrl || 'https://img.freepik.com/free-photo/restaurant-interior_1127-3394.jpg'}
            alt={shop.shopName}
            className="shop-logo"
          />
          <div className="shop-info">
            <h1>{shop.shopName}</h1>

            <div className="rating-section">
              <div className="rating">
                <Rate allowHalf disabled value={shop.rating || 4.5} />
                <span className="rating-text">{shop.rating || 4.5}</span>
              </div>
              {shop.monthSales && <span className="sales">月售{shop.monthSales}单</span>}
            </div>

            {shop.shopDescription && (
              <p className="shop-description">
                {shop.shopDescription}
              </p>
            )}

            <div className="contact-info">
              {shop.phone && (
                <div className="contact-item">
                  <span className="icon">📞</span>
                  <a href={`tel:${shop.phone}`}>{shop.phone}</a>
                </div>
              )}

              <div className="contact-item">
                <span className="icon">📍</span>
                <span className="coordinates">
                  {shop.address || `坐标 (${shop.x}, ${shop.y})`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider>菜品分类</Divider>

      <div className="category-tabs">
        {categories.map(cat => (
          <Button
            key={cat}
            type={activeCategory === cat ? 'primary' : 'default'}
            onClick={() => setActiveCategory(cat)}
            style={{ margin: '0 8px 8px 0' }}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="dishes-container">
        {filteredDishes.length ? (
          <Row gutter={[16, 16]}>
            {filteredDishes.map(dish => (
              <Col key={dish.dishId} xs={24} sm={12} md={8} lg={6}>
                <DishCard dish={dish} />
              </Col>
            ))}
          </Row>
        ) : (
          <p className="empty-text">该分类下暂无菜品</p>
        )}
      </div>

      {shop.comments?.length > 0 && (
        <>
          <Divider>用户评论</Divider>
          <ul className="comment-list">
            {shop.comments.map((c, idx) => (
              <li key={idx} className="comment-item">💬 {c}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ShopDetail;
