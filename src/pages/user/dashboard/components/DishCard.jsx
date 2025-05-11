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

    // 判断当前菜品是否已经在购物车中
    const isInCart = cart.some(item => item.dish.id === dish.id);

    const handleAddToCart = () => {
        if (isInCart) {
            message.warning(`${dish.name} 已在购物车中`);
            return;  // 商品已经存在，不允许再次添加
        }

        addToCart(dish);
        message.success(`${dish.name} 已加入购物车`);
    };

    const formatDistance = (distance) => {
        if (!distance) return null;
        return distance < 1000 ? `${distance}m` : `${(distance / 1000).toFixed(1)}km`;
    };

    const handlePhoneClick = () => {
        if (dish.phone) {
            window.location.href = `tel:${dish.phone}`;
        }
    };

    return (
        <Card
            hoverable
            className="dish-card"
            cover={
                <div className="image-container">
                    <img
                        alt={dish.name}
                        src={dish.image || DEFAULT_DISH_IMAGE}
                        className="dish-image"
                    />
                    {dish.distance && <span className="distance-badge">{formatDistance(dish.distance)}</span>}
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
                <Tooltip title={isInCart ? `${dish.name} 已在购物车中` : "加入购物车"} key="addCart">
                    <ShoppingCartOutlined
                        onClick={handleAddToCart}
                        style={{ color: isInCart ? 'gray' : 'black' }} // 如果商品在购物车中，设置为灰色
                    />
                </Tooltip>

            ]}
        >
            <div className="shop-info">
                <img src={DEFAULT_SHOP_IMAGE} alt={dish.shop_name} className="shop-image" />
                <div className="shop-details">
                    <h4 className="shop-name">{dish.shop_name || '未知商家'}</h4>
                    {dish.phone && <div className="shop-phone">{dish.phone}</div>}
                </div>
            </div>

            <div className="dish-info">
                <div className="dish-header">
                    <h3 className="dish-name">{dish.name}</h3>
                    <span className="dish-price">¥{dish.price?.toFixed(2) || '0.00'}</span>
                </div>

                <div className="dish-meta">
                    {dish.category && (
                        <Tag color="orange" className="dish-category">
                            {dish.category}
                        </Tag>
                    )}
                </div>

                {dish.description && (
                    <Tooltip title={dish.description} placement="bottom">
                        <div className="dish-description">
                            {dish.description.length > 25
                                ? `${dish.description.substring(0, 25)}...`
                                : dish.description}
                        </div>
                    </Tooltip>
                )}
            </div>
        </Card>
    );
};

export default DishCard;
