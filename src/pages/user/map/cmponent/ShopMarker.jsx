import React from 'react';
import './ShopMarker.css';
import { Tooltip } from 'antd';

const ShopMarker = ({ shop, screenCoord }) => {
  return (
    <div
      className="shop-marker"
      style={{
        left: `${screenCoord.x}px`,
        top: `${screenCoord.y}px`,
      }}
    >
      <Tooltip
        title={
          <div className="shop-tooltip">
            <strong>{shop.name}</strong>
            <div>类型: {shop.category || '未知'}</div>
            <div>距离: {(shop.distance / 1000).toFixed(2)} km</div>
          </div>
        }
        placement="top"
        arrow={true}
      >
        <div
          className="marker-icon"
          style={{ borderColor: shop.color }}
        >
          🏪
        </div>
      </Tooltip>
    </div>
  );
};

export default ShopMarker;
