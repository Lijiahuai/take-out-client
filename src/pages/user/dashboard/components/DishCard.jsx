// src/components/DishCard.jsx
import React from 'react';
import { Card, Tag, Tooltip, message } from 'antd';
import { useCart } from '../../context/CartContext';
import { PhoneOutlined, HeartOutlined, ShareAltOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import './DishCard.css';

const DEFAULT_DISH_IMAGE = 'https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141352.jpg';
const DEFAULT_SHOP_IMAGE = 'https://img.freepik.com/free-vector/restaurant-mural-wallpaper_23-2148703851.jpg';

const DishCard = ({ dish }) => {
    const { cart, addToCart } = useCart();

    // 根据后端数据结构调整字段访问
    const dishId = dish.dish_id;
    const dishName = dish.dish_name;
    const dishDescription = dish.dish_description;
    const dishPrice = dish.price;
    const shopName = dish.shop_name;
    const shopPhone = dish.phone;
    const category = dish.category;
    const distance = dish.distance;

    // 判断当前菜品是否已经在购物车中
    const isInCart = cart.some(item => item.dish.dish_id === dishId);

    const handleAddToCart = () => {
        if (isInCart) {
            message.warning(`${dishName} 已在购物车中`);
            return;
        }

        addToCart({
            dish: {
                id: dishId,        // 保持与现有购物车逻辑兼容
                dish_id: dishId,   // 添加后端使用的字段
                name: dishName,
                price: dishPrice,
                // 其他可能需要用到的字段...
            },
            quantity: 1
        });
        message.success(`${dishName} 已加入购物车`);
    };

    const formatDistance = (distance) => {
        if (!distance) return null;
        return distance < 1000 ? `${distance}m` : `${(distance / 1000).toFixed(1)}km`;
    };

    const handlePhoneClick = () => {
        if (shopPhone) {
            window.location.href = `tel:${shopPhone}`;
        }
    };

    return (
        <Card
            hoverable
            className="dish-card"
            cover={
                <div className="image-container">
                    <img
                        alt={dishName}
                        src={dish.image || DEFAULT_DISH_IMAGE}
                        className="dish-image"
                    />
                    {distance && <span className="distance-badge">{formatDistance(distance)}</span>}
                </div>
            }
            actions={[
                <Tooltip title="联系商家" key="call">
                    <PhoneOutlined onClick={handlePhoneClick} />
                </Tooltip>,
                <Tooltip title="收藏" key="favorite">
                    <HeartOutlined />
                </Tooltip>,
                <Tooltip title="分享" key="share">
                    <ShareAltOutlined />
                </Tooltip>,
                <Tooltip title={isInCart ? `${dishName} 已在购物车中` : "加入购物车"} key="addCart">
                    <ShoppingCartOutlined
                        onClick={handleAddToCart}
                        style={{ color: isInCart ? 'gray' : 'black' }}
                    />
                </Tooltip>
            ]}
        >
            <div className="shop-info">
                <img src={DEFAULT_SHOP_IMAGE} alt={shopName} className="shop-image" />
                <div className="shop-details">
                    <h4 className="shop-name">{shopName || '未知商家'}</h4>
                    {shopPhone && <div className="shop-phone">{shopPhone}</div>}
                </div>
            </div>

            <div className="dish-info">
                <div className="dish-header">
                    <h3 className="dish-name">{dishName}</h3>
                    <span className="dish-price">¥{dishPrice?.toFixed(2) || '0.00'}</span>
                </div>

                <div className="dish-meta">
                    {category && (
                        <Tag color="orange" className="dish-category">
                            {category}
                        </Tag>
                    )}
                </div>

                {dishDescription && (
                    <Tooltip title={dishDescription} placement="bottom">
                        <div className="dish-description">
                            {dishDescription.length > 25
                                ? `${dishDescription.substring(0, 25)}...`
                                : dishDescription}
                        </div>
                    </Tooltip>
                )}
            </div>
        </Card>
    );
};

export default DishCard;