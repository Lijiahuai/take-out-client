import React from 'react';
import { Card, Avatar } from 'antd';
import './ShopCard.css';

const ShopCard = ({ shop, onClick }) => {
  const {
    name,
    phone,
    logoUrl,
    description,
    distance,
    color
  } = shop;

  return (
    <Card
      className="shop-card"
      hoverable
      style={{ borderLeft: `3px solid ${color || '#1890ff'}` }}
      onClick={() => onClick(shop.id)}
    >
      <div className="shop-card-header">
        {logoUrl ? (
          <Avatar src={logoUrl} size="large" />
        ) : (
          <Avatar size="large">
            {name ? name.charAt(0) : '?'}
          </Avatar>
        )}
        <div className="shop-info">
          <h4>{name || '未命名商家'}</h4>
          <span className="distance" style={{ color: color || '#1890ff' }}>
            {(distance / 1000).toFixed(2)} 公里
          </span>
        </div>
      </div>
      <div className="shop-card-body">
        <p><span className="label">电话:</span> {phone || '暂无'}</p>
        <p className="description">{description || '暂无描述'}</p>
      </div>
    </Card>
  );
};

export default ShopCard;