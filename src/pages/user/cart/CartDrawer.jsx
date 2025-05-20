import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { settlement, getDishDetailsByIds } from './api';
import { showNotification } from '../../../components/ui/Notification';
import './CartDrawer.css';
import { Drawer, Spin, Empty, List, Tag, Typography, Button, Popconfirm } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const CartDrawer = ({ visible, onClose }) => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);

  // 获取菜品详情
  useEffect(() => {
    const fetchDetails = async () => {
      if (!visible || cart.length === 0) {
        setDishes([]);
        return;
      }

      try {
        setLoading(true);
        const data = await getDishDetailsByIds(cart);
        setDishes(data);
      } catch (error) {
        showNotification('加载商品信息失败', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [visible, cart]);

  // 计算总价
  const totalPrice = dishes.reduce((total, item) => total + item.price, 0);

  // 结算处理
  const handleCheckout = async () => {
    try {
      await settlement(cart);
      showNotification(`成功结算 ${dishes.length} 件商品`, "success");
      clearCart();
      onClose();
    } catch {
      showNotification("结算失败，请稍后重试", "error");
    }
  };

  return (
    <Drawer
      title={
        <div className="drawer-header">
          <ShoppingCartOutlined />
          <span style={{ marginLeft: 8 }}>我的购物车</span>
          <Tag color="blue" style={{ marginLeft: 12 }}>{dishes.length} 件商品</Tag>
        </div>
      }
      placement="right"
      onClose={onClose}
      visible={visible}
      width={480}
      className="cart-drawer"
      bodyStyle={{ padding: '16px' }}
    >
      {/* 加载状态 */}
      {loading && (
        <div className="loading-wrapper">
          <Spin tip="加载中..." size="large" />
        </div>
      )}

      {/* 空状态 */}
      {!loading && dishes.length === 0 && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary" style={{ marginTop: 8 }}>
              还没有添加任何商品哦
            </Text>
          }
          className="empty-cart"
        />
      )}

      {/* 商品列表 */}
      {!loading && dishes.length > 0 && (
        <div className="cart-content">
          <List
            dataSource={dishes}
            renderItem={item => (
              <List.Item className="cart-item">
                <div className="item-content">
                  <img
                    src={item.image || 'https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141352.jpg'}
                    alt={item.dishName}
                    className="dish-image"
                  />

                  <div className="item-info">
                    <div className="item-header">
                      <Text strong ellipsis>{item.dishName}</Text>
                      <Text type="danger" strong>¥{item.price.toFixed(2)}</Text>
                    </div>

                    <div className="item-meta">
                      <Tag color="geekblue">{item.category}</Tag>
                      <Popconfirm
                        title="确定要移出购物车吗？"
                        onConfirm={() => removeFromCart(item.dishId)}
                      >
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          className="delete-btn"
                        />
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />

          {/* 结算区域 */}
          <div className="checkout-section">
            <div className="total-row">
              <Text>商品合计：</Text>
              <Title level={4} type="danger">¥{totalPrice.toFixed(2)}</Title>
            </div>

            <Button
              type="primary"
              block
              size="large"
              onClick={handleCheckout}
              className="checkout-btn"
            >
              去结算
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default CartDrawer;