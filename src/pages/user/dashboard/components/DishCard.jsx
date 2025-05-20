import React from 'react';
import { Card, Tag, Tooltip, message } from 'antd';
import {
    HeartOutlined,
    ShareAltOutlined,
    ShoppingCartOutlined,
    LikeOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useCart } from '../../context/CartContext';
import './DishCard.css';
import { likeDish, favoriteDish } from '../api.js'; // 假设 API 方法放在 api.js 中

const DEFAULT_DISH_IMAGE = 'https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141352.jpg';
const DEFAULT_SHOP_IMAGE = 'https://img.freepik.com/free-vector/restaurant-mural-wallpaper_23-2148703851.jpg';

const DishCard = ({ dish }) => {
    const { cart, addToCart } = useCart();

    const dishInfo = dish.dishBasic;
    const shopInfo = dish.shopBasic;

    const dishId = dishInfo.dishId;
    const dishName = dishInfo.dishName;
    const dishDescription = dishInfo.dishDescription;
    const dishPrice = dishInfo.price;
    const category = dishInfo.category;
    const viewCount = dishInfo.viewCount;
    const favoriteCount = dishInfo.favoriteCount;
    const likeCount = dishInfo.likeCount;

    const shopName = shopInfo.shopName;

    const isInCart = cart.some(item => item.dishId === dishId);

    const handleAddToCart = () => {
        if (isInCart) {
            message.warning(`${dishName} 已在购物车中`);
            return;
        }
        addToCart(dishId);
        message.success(`${dishName} 已加入购物车`);
    };

    const handleLike = async () => {
        try {
            await likeDish(dishId);
            message.success('已点赞');
        } catch (err) {
            message.error('点赞失败');
        }
    };

    const handleFavorite = async () => {
        try {
            await favoriteDish(dishId);
            message.success('已收藏');
        } catch (err) {
            message.error('收藏失败');
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
                        src={dishInfo.image || DEFAULT_DISH_IMAGE}
                        className="dish-image"
                    />
                </div>
            }
            actions={[
                <Tooltip title="点赞" key="like">
                    <LikeOutlined onClick={handleLike} />
                </Tooltip>,
                <Tooltip title="收藏" key="favorite">
                    <HeartOutlined onClick={handleFavorite} />
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
                    <div className="dish-stats">
                        <Tooltip title="浏览量"><EyeOutlined /> {viewCount}</Tooltip>
                        <Tooltip title="收藏"><HeartOutlined /> {favoriteCount}</Tooltip>
                        <Tooltip title="点赞"><LikeOutlined /> {likeCount}</Tooltip>
                    </div>
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
