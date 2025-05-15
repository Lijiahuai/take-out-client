import React from 'react';
import { Drawer, List, Avatar, Button, Divider, Typography, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { settlement } from './api';
import { showNotification } from '../../../components/ui/Notification'; // 导入自定义通知组件

const CartDrawer = ({ visible, onClose }) => {
  const { cart, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce((total, item) => total + item.dish.price, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showNotification("购物车为空", "warning");
      return;
    }

    try {
      const result = await settlement(cart);
      showNotification("结算成功！", "success");
      clearCart();
      onClose(); // 可选：关闭购物车抽屉
    } catch (err) {
      showNotification("结算失败，请稍后重试", "error");
      console.error(err);
    }
  };

  return (
    <Drawer
      title="购物车"
      placement="right"
      closable={true}
      onClose={onClose}
      open={visible}
      width={460}
    >
      {cart.length === 0 ? (
        <Typography.Text>您的购物车是空的。</Typography.Text>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={cart}
            renderItem={(item) => (
              <List.Item
                actions={[<DeleteOutlined key="delete" onClick={() => removeFromCart(item.dish.id)} />]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.dish.image} />}
                  title={item.dish.name}
                  description={`¥${item.dish.price.toFixed(2)}`}
                />
              </List.Item>
            )}
          />
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <strong>总计：</strong>
            <span>¥${totalPrice.toFixed(2)}</span>
          </div>
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button danger onClick={clearCart}>
              清空
            </Button>
            <Button type="primary" onClick={handleCheckout}>
              去结算
            </Button>
          </Space>
        </>
      )}
    </Drawer>
  );
};

export default CartDrawer;