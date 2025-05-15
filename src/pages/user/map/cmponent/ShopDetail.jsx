import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from 'antd';
import './ShopDetail.css'; // 确保有对应的样式文件

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);

  useEffect(() => {
    // 使用模拟数据代替API调用
    const mockShopData = {
      id: id,
      name: '示例商家',
      image: 'https://img.freepik.com/free-photo/restaurant-interior_1127-3394.jpg',
      phone: '13800138000',
      address: '北京市朝阳区示例街道123号',
      description: '这是一家提供优质服务的示例商家，专注于提供最好的用户体验。',
      rating: 4.5,
      businessHours: '09:00-21:00',
      deliveryFee: '¥5',
      minOrder: '¥20'
    };
    
    setShop(mockShopData);
  }, [id]);

  const handleClose = () => {
    navigate(-1);
  };

  if (!shop) return <div>加载中...</div>;

  return (
    <div className="shop-detail-overlay">
      <div className="shop-detail-content">
        {/* <Button 
          type="text" 
          onClick={handleClose}
          className="close-button"
        >
          ×
        </Button> */}
        <Card
          title={shop.name}
          cover={<img src={shop.image} alt={shop.name} />}
        >
          <p><strong>电话:</strong> {shop.phone}</p>
          <p><strong>地址:</strong> {shop.address}</p>
          <p><strong>营业时间:</strong> {shop.businessHours}</p>
          <p><strong>配送费:</strong> {shop.deliveryFee}</p>
          <p><strong>起送价:</strong> {shop.minOrder}</p>
          <p><strong>描述:</strong> {shop.description}</p>
          <p><strong>评分:</strong> {shop.rating} ★</p>
        </Card>
      </div>
    </div>
  );
};

export default ShopDetail;