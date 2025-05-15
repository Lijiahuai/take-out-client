import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Spin, message, Button, Popover, Slider, Carousel } from 'antd';
import { getNearByShops } from './api';
import './SimulatedMap.css';
import ShopCard from './cmponent/ShopCard';
import ShopMarker from './cmponent/ShopMarker';
import ShopDetail from './cmponent/ShopDetail';

const DEFAULT_DISTANCE = 500;
const DEFAULT_NEARBY_SHOP_COUNT = 4;
const MAX_DISPLAY = 50;
const DEFAULT_MAP_SIZE = { width: 1000, height: 1000 };

const SimulatedMap = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [userLocation] = useState({ x: userInfo.data.x, y: userInfo.data.y });

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState(DEFAULT_DISTANCE);
  const [showFilter, setShowFilter] = useState(false);
  const [shopGroups, setShopGroups] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const mapRef = useRef(null);
  const [mapSize, setMapSize] = useState(DEFAULT_MAP_SIZE);

  const [selectedShopId, setSelectedShopId] = useState(null);

  const handleShopClick = (shopId) => {
    setSelectedShopId(shopId);
    console.log(selectedShopId);
  };


  const groupShops = (shops) => {
    const groups = [];
    for (let i = 0; i < shops.length; i += DEFAULT_NEARBY_SHOP_COUNT) {
      groups.push(shops.slice(i, i + DEFAULT_NEARBY_SHOP_COUNT));
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

      if (!nearbyShops || nearbyShops.length === 0) {
        message.info('当前范围内没有找到商家');
        setShops([]);
        setShopGroups([]);
        return;
      }

      const randomlySelected = nearbyShops.length > MAX_DISPLAY
        ? [...nearbyShops].sort(() => 0.5 - Math.random()).slice(0, MAX_DISPLAY)
        : nearbyShops;

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
      }).sort((a, b) => a.distance - b.distance);

      setShops(shopsWithDistance);
      setShopGroups(groupShops(shopsWithDistance));
      setSearchResult(null);

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

  useEffect(() => {
    if (userLocation) {
      fetchNearbyShops();
    }
  }, [userLocation, distance, fetchNearbyShops]);

  useEffect(() => {
    if (mapRef.current) {
      const { offsetWidth, offsetHeight } = mapRef.current;
      setMapSize({ width: offsetWidth, height: offsetHeight });
    }
  }, [distance]);

  const transformCoordinate = (coord) => {
    if (!userLocation) return { x: 0, y: 0 };

    const offsetX = coord.x - userLocation.x;
    const offsetY = coord.y - userLocation.y;

    const scaleX = mapSize.width / (2 * distance);
    const scaleY = mapSize.height / (2 * distance);

    return {
      x: offsetX * scaleX + mapSize.width / 2,
      y: offsetY * scaleY + mapSize.height / 2
    };
  };

  const renderGridLines = () => {
    const stepMeter = 200;
    const scaleX = mapSize.width / (2 * distance);
    const scaleY = mapSize.height / (2 * distance);
    const lines = [];

    for (let i = -distance; i <= distance; i += stepMeter) {
      const x = mapSize.width / 2 + i * scaleX;
      lines.push(<div key={`v-${i}`} className="grid-line vertical" style={{ left: `${x}px`, height: '100%' }} />);
    }

    for (let i = -distance; i <= distance; i += stepMeter) {
      const y = mapSize.height / 2 + i * scaleY;
      lines.push(<div key={`h-${i}`} className="grid-line horizontal" style={{ top: `${y}px`, width: '100%' }} />);
    }

    return lines;
  };

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
    </div>
  );

  // Automatically search whenever the searchQuery changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResult(null);
      return;
    }

    const found = shops.filter(shop =>
      shop.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (found.length > 0) {
      setSearchResult(found);
    } else {
      setSearchResult(null);
      message.warning('未找到相关商家');
    }
  }, [searchQuery, shops]);

  return (
    <div className="simulated-map-container">
      {loading ? (
        <div className="loading-overlay">
          <Spin size="large" tip="地图加载中..." />
        </div>
      ) : (
        <div className="simulated-map">
          {/* 地图部分 */}
          <div className="map-background" ref={mapRef}>
            {renderGridLines()}

            <div
              className="user-marker"
              style={{
                left: `${mapSize.width / 2}px`,
                top: `${mapSize.height / 2}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="pulse-effect"></div>
              <div className="marker-icon">📍</div>
            </div>

            {/* 商家标记 */}
            {searchResult && searchResult.length > 0 ? (
              searchResult.map((shop) => (
                <ShopMarker
                  key={shop.id}
                  shop={shop}
                  screenCoord={transformCoordinate(shop)}
                  onClick={() => handleShopClick(shop.id)}
                />
              ))
            ) : (
              shops.map((shop) => {
                const screenCoord = transformCoordinate(shop);
                return (
                  <ShopMarker
                    key={shop.id}
                    shop={shop}
                    screenCoord={screenCoord}
                    onClick={() => handleShopClick(shop.id)}
                  />
                );
              })
            )}
          </div>

          {/* 商家列表部分 */}
          <div className="shop-list">
            <div className="shop-list-header">
              <h3>附近商家 ({shops.length})</h3>
            </div>

            {/* 搜索和筛选区域 */}
            <div className="search-filter-container">
              <input
                type="text"
                placeholder="搜索商家名称"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="shop-search-input"
              />

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
                  className="filter-button"
                >
                  筛选
                </Button>
              </Popover>
            </div>

            <div className="current-distance-tag">
              当前范围: {distance >= 1000 ? `${(distance / 1000).toFixed(1)}公里` : `${distance}米`}
            </div>

            {/* 商家卡片轮播 */}
            <Carousel autoplay dots={true}>
              {searchResult ? (
                <div className="shop-group">
                  {searchResult.map(shop => (
                    <ShopCard
                      key={shop.id || `${shop.name}-${shop.x}-${shop.y}`}
                      shop={shop}
                      onClick={() => handleShopClick(shop.id)}
                    />
                  ))}
                </div>
              ) : (
                shopGroups.map((group, index) => (
                  <div key={index} className="shop-group">
                    {group.map(shop => (
                      <ShopCard
                        key={shop.id || `${shop.name}-${shop.x}-${shop.y}`}
                        shop={shop}
                        onClick={() => handleShopClick(shop.id)}
                      />
                    ))}
                  </div>
                ))
              )}
            </Carousel>
          </div>

          {/* 新增的商家详情区域 */}
          {selectedShopId && (
            <div className="shop-detail-panel">
              <Button
                type="text"
                onClick={() => setSelectedShopId(null)}
                className="close-detail-button"
              >
                ×
              </Button>
              <ShopDetail shopId={selectedShopId} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimulatedMap;
