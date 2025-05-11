import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Spin, message,Button, Popover, Slider,Carousel} from 'antd';
import { getNearByShops } from './api';
import './SimulatedMap.css';
import ShopCard from './cmponent/ShopCard';
import ShopMarker from './cmponent/ShopMarker';

const DEFAULT_DISTANCE = 500; // 默认筛选距离2公里
const SCREEN_CENTER = 500; // 屏幕中心坐标(px)

const SimulatedMap = () => {
  const location = useLocation();
  const { user } = location.state || {}; // 从路由 state 获取
  const [userLocation] = useState(user.location);

  // // 调试输出
  // console.log('路由 state:', location.state);
  // console.log('使用的 user:', user);

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState(DEFAULT_DISTANCE);
  const [showFilter, setShowFilter] = useState(false);
  const [shopGroups, setShopGroups] = useState([]);

  // 将商家数据分组，每组5个
  const groupShops = (shops) => {
    const groups = [];
    for (let i = 0; i < shops.length; i += 5) {
      groups.push(shops.slice(i, i + 5));
    }
    return groups;
  };

  const fetchNearbyShops = useCallback(async () => {
    if (!userLocation) return;

    try {
      setLoading(true);
      const nearbyShops = await getNearByShops(
        userLocation.x,
        userLocation.y,
        distance
      );
      console.log('附近商家:', nearbyShops);
      if (!nearbyShops || nearbyShops.length === 0) {
        message.info('当前范围内没有找到商家');
        setShops([]);
        setShopGroups([]);
        return;
      }

      // 1. 随机截取部分商家（例如最多100家）
      const MAX_DISPLAY = 100;
      const randomlySelected = nearbyShops.length > MAX_DISPLAY
        ? [...nearbyShops]
          .sort(() => 0.5 - Math.random()) // 随机打乱
          .slice(0, MAX_DISPLAY)           // 截取前100家
        : nearbyShops;

      // 2. 计算距离并排序
      const shopsWithDistance = randomlySelected.map(shop => {
        const dist = Math.sqrt(
          Math.pow(shop.x - userLocation.x, 2) +
          Math.pow(shop.y - userLocation.y, 2)
        );
        return {
          ...shop,
          distance: dist,
          color: dist < 1000 ? '#52c41a' : '#faad14'
        };
      }).sort((a, b) => a.distance - b.distance); // 按距离升序排序

      setShops(shopsWithDistance);
      setShopGroups(groupShops(shopsWithDistance));

      // 3. 提示信息
      if (nearbyShops.length > MAX_DISPLAY) {
        message.info(`已随机展示${MAX_DISPLAY}家商家（共${nearbyShops.length}家）`);
      }

    } catch (error) {
      message.error('加载商家数据失败');
      setShops([]);
      setShopGroups([]);
    } finally {
      setLoading(false);
    }
  }, [userLocation, distance]);


  // 当用户位置或距离变化时重新获取商家
  useEffect(() => {
    if (userLocation) {
      fetchNearbyShops();
    }
  }, [userLocation, distance, fetchNearbyShops]);

  // 坐标转换函数
  const transformCoordinate = (coord) => {
    if (!userLocation) return { x: SCREEN_CENTER, y: SCREEN_CENTER };

    const offsetX = coord.x - userLocation.x;
    const offsetY = coord.y - userLocation.y;

    // 动态计算缩放比例，使筛选距离刚好填满屏幕
    const scale = SCREEN_CENTER / distance;

    return {
      x: offsetX * scale + SCREEN_CENTER,
      y: offsetY * scale + SCREEN_CENTER
    };
  };

  // 筛选器内容
  const filterContent = (
    <div style={{ width: 260, padding: '10px 0' }}>
      <h4 style={{ marginBottom: 16 }}>配送范围筛选</h4>
      <Slider
        min={500}
        max={5000}
        step={100}
        value={distance}
        onChange={value => setDistance(value)}
        marks={{
          500: '500m',
          1000: '1km',
          2000: '2km',
          3000: '3km',
          5000: '5km',

        }}
      />
      <div style={{ marginTop: 24, textAlign: 'right' }}>
        <Button
          type="primary"
          size="small"
          onClick={() => setShowFilter(false)}
        >
          确定
        </Button>
      </div>
    </div>
  );

  return (
    <div className="simulated-map-container">
      {loading ? (
        <div className="loading-overlay">
          <Spin size="large" tip="地图加载中..." />
        </div>
      ) : (
        <div className="simulated-map">
          {/* 地图区域 */}
          <div className="map-background">
            {/* 添加网格线 - 水平线 */}
            {Array.from({ length: 21 }).map((_, i) => (
              <div
                key={`h-${i}`}
                className="grid-line horizontal"
                style={{ top: `${i * 5}%` }}
              />
            ))}

            {/* 添加网格线 - 垂直线 */}
            {Array.from({ length: 21 }).map((_, i) => (
              <div
                key={`v-${i}`}
                className="grid-line vertical"
                style={{ left: `${i * 5}%` }}
              />
            ))}

            {/* 用户位置标记（始终在中心） */}
            <div
              className="user-marker"
              style={{
                left: SCREEN_CENTER,
                top: SCREEN_CENTER,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="pulse-effect"></div>
              <div className="marker-icon">📍</div>
            </div>

            {/* 商家标记 */}
            {shops.map((shop) => {
              const screenCoord = transformCoordinate(shop);
              return (
                <ShopMarker
                  key={shop.id}
                  shop={shop}
                  screenCoord={screenCoord}
                />
              );
            })}
          </div>
          {/* 商家列表区域 */}
          <div className="shop-list">
            <div className="shop-list-header">
              <h3>附近商家 ({shops.length})</h3>
              <Popover
                content={filterContent}
                title={null}
                trigger="click"
                open={showFilter}
                onOpenChange={visible => setShowFilter(visible)}
                placement="bottomRight"
              >
                <Button
                  type="primary"
                  size="small"
                  icon={<i className="icon-filter" />}
                >
                  筛选
                </Button>
              </Popover>
            </div>

            <div className="current-distance-tag">
              当前范围: {distance >= 1000 ? `${(distance / 1000).toFixed(1)}公里` : `${distance}米`}
            </div>

            <Carousel autoplay dots={true}>
              {shopGroups.map((group, index) => (
                <div key={index} className="shop-group">
                  {group.map(shop => (
                    <ShopCard key={shop.id || `${shop.name}-${shop.x}-${shop.y}`} shop={shop} />
                  ))}
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulatedMap;