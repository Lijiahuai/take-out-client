import React from 'react';
import { Tooltip, Tag } from 'antd';
import './ShopMarker.css';

const ShopMarker = ({ shop, screenCoord, onClick }) => {
  // 变量定义在组件开头
  const { 
    adminId, 
    shopName = '未命名店铺', 
    x = 0, 
    y = 0 
  } = shop || {};

  return (
    <div
      className="modern-marker"
      style={{
        left: `${screenCoord.x}px`,
        top: `${screenCoord.y}px`,
      }}
      onClick={() => onClick(adminId)}
    >
      <Tooltip
        title={
          <div className="rich-tooltip">
            <h4 className="shop-name">{shopName}</h4>
            <div className="tooltip-row">
              <span className="label">ID：</span>
              <Tag color="blue">{adminId || '未知ID'}</Tag>
            </div>
            <div className="tooltip-row">
              <span className="label">坐标：</span>
              {x}, {y}
            </div>
          </div>
        }
        placement="top"
        overlayClassName="custom-tooltip"
        color="#fff"
      >
        <div className="marker-icon">
          <div className="pulsar-effect" />
          <div className="marker-main">
            🏬
          </div>
        </div>
      </Tooltip>
    </div>
  );
};

export default ShopMarker;