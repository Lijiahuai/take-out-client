import React from 'react';
import { Drawer, List, Avatar, Button, Divider, Typography, Space, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ visible, onClose }) => {
  const { cart, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce((total, item) => total + item.dish.price, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      message.warning("购物车为空");
      return;
    }
    message.success("跳转到结算页（或进行支付流程）");
  };

  return (
    <Drawer
      title="购物车"
      placement="right"
      closable={true}
      onClose={onClose}
      open={visible}
      width={360}
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
            <span>¥{totalPrice.toFixed(2)}</span>
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
