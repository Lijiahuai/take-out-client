import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { settlement, getDishDetailsByIds } from './api';
import { showNotification } from '../../../components/ui/Notification';
import './CartDrawer.css'
import { Drawer, Spin, Empty, List, Tag, Typography, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;


const CartDrawer = ({ visible, onClose }) => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!visible || cart.length === 0) {
        setDishes([]);
        return;
      }
      setLoading(true);
      try {
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

  const totalPrice = dishes.reduce((total, item) => total + item.price, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showNotification("购物车为空", "warning");
      return;
    }
    try {
      await settlement(cart);
      showNotification("结算成功！", "success");
      clearCart();
      onClose();
    } catch {
      showNotification("结算失败，请稍后重试", "error");
    }
  };

  return (
    <Drawer
      title="购物车"
      placement="right"
      onClose={onClose}
      visible={visible}
      width={480}
      className="cart-drawer"
      bodyStyle={{ padding: '0 24px 24px' }}
    >
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {dishes.length === 0 ? (
            <div className="empty-cart">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="购物车空空如也" />
            </div>
          ) : (
            <>
              <List
                itemLayout="horizontal"
                dataSource={dishes}
                renderItem={item => (
                  <List.Item className="cart-item">
                    <div className="dish-content">
                      <div className="dish-image" />
                      <div className="dish-info">
                        <Typography.Text strong>{item.dish_name}</Typography.Text>
                        <Typography.Text type="secondary" className="dish-desc">
                          {item.dish_description}
                        </Typography.Text>
                        <div className="dish-meta">
                          <Tag color="blue">{item.category}</Tag>
                          <Typography.Text type="danger" strong>
                            ¥{item.price.toFixed(2)}
                          </Typography.Text>
                        </div>
                      </div>
                    </div>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeFromCart(item.dish_id)}
                    />
                  </List.Item>
                )}
              />
              <div className="cart-footer">
                <div className="total-price">
                  总计：
                  <Typography.Text strong type="danger" style={{ fontSize: 20 }}>
                    ¥{totalPrice.toFixed(2)}
                  </Typography.Text>
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleCheckout}
                  style={{ marginTop: 16 }}
                >
                  立即结算
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </Drawer>
  );
};

export default CartDrawer;