// ShopCard.jsx
import React from 'react';
import { Card, Avatar, Tag } from 'antd';
import './ShopCard.css';

const ShopCard = ({ shop, onClick }) => {
  const {
    adminId,
    shopName,
    phone,
    shopDescription,
    x,
    y
  } = shop;

  return (
    <Card
      className="modern-shop-card"
      hoverable
      onClick={() => onClick(adminId)}
    >
      <div className="shop-header">
        <Avatar 
          size={64}
          className="shop-avatar"
          style={{ backgroundColor: '#1890ff' }}
        >
          {shopName?.charAt(0) || '?'}
        </Avatar>
        
        <div className="shop-meta">
          <h3 className="shop-title">{shopName || '未命名店铺'}</h3>
          <div className="location-tag">
            <Tag color="geekblue">坐标</Tag>
            <span>{x}, {y}</span>
          </div>
        </div>
      </div>

      <div className="shop-body">
        <div className="info-row">
          <label>联系方式：</label>
          <span>{phone || '暂无'}</span>
        </div>
        
        <div className="description-box">
          <p>{shopDescription || '该店铺暂无描述信息'}</p>
        </div>
      </div>
    </Card>
  );
};

export default ShopCard;