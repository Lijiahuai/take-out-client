import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Spin, message, Button, Popover, Slider, Carousel, Modal } from 'antd';
import { getNearByShops, searchShops } from './api';
import './SimulatedMap.css';
import ShopCard from './cmponent/ShopCard';
import ShopMarker from './cmponent/ShopMarker';
import ShopDetail from './cmponent/ShopDetail';

const DEFAULT_DISTANCE = 500;
const DEFAULT_NEARBY_SHOP_COUNT = 4;
const MAX_DISPLAY = 50;
const DEFAULT_MAP_SIZE = { width: 1000, height: 1000 };

const SimulatedMap = () => {
  // 从localStorage中获取用户信息
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  // 设置用户位置
  const [userLocation] = useState({ x: userInfo.data.x, y: userInfo.data.y });
  // 设置商家列表
  const [shops, setShops] = useState([]);
  // 设置加载状态
  const [loading, setLoading] = useState(true);
  // 设置距离
  const [distance, setDistance] = useState(DEFAULT_DISTANCE);
  // 设置是否显示筛选框
  const [showFilter, setShowFilter] = useState(false);
  // 设置商家分组
  const [shopGroups, setShopGroups] = useState([]);
  // 设置搜索查询
  const [searchQuery, setSearchQuery] = useState('');
  // 设置搜索结果
  const [searchResult, setSearchResult] = useState(null);
  // 设置地图引用
  const mapRef = useRef(null);
  // 设置地图大小
  const [mapSize, setMapSize] = useState(DEFAULT_MAP_SIZE);
  // 设置选中的商家ID
  const [selectedShopId, setSelectedShopId] = useState(null);
  // 设置是否正在搜索
  const [isSearching, setIsSearching] = useState(false);
  // 设置地图边界
  const [bounds, setBounds] = useState(null);

  // 设置是否显示商家详情
  const [shopDetailVisible, setShopDetailVisible] = useState(false);

  // 计算地图边界
  const calculateBounds = (shopsData) => {
    if (!shopsData || shopsData.length === 0) {
      return {
        minX: userLocation.x - distance,
        maxX: userLocation.x + distance,
        minY: userLocation.y - distance,
        maxY: userLocation.y + distance,
      };
    }

    const xs = shopsData.map(shop => shop.x);
    const ys = shopsData.map(shop => shop.y);

    return {
      minX: Math.min(...xs, userLocation.x) - 200,
      maxX: Math.max(...xs, userLocation.x) + 200,
      minY: Math.min(...ys, userLocation.y) - 200,
      maxY: Math.max(...ys, userLocation.y) + 200
    };
  };

  // 坐标转换函数
  const transformCoordinate = (coord) => {
    if (!bounds) return { x: 0, y: 0 };

    const xRange = bounds.maxX - bounds.minX;
    const yRange = bounds.maxY - bounds.minY;

    const xRatio = (coord.x - bounds.minX) / xRange;
    const yRatio = (coord.y - bounds.minY) / yRange;

    return {
      x: xRatio * mapSize.width,
      y: yRatio * mapSize.height
    };
  };

  // 渲染网格线
  const renderGridLines = () => {
    if (!bounds) return null;

    const gridSize = 200; // 每200米一个网格
    const xRange = bounds.maxX - bounds.minX;
    const yRange = bounds.maxY - bounds.minY;

    const xLines = Math.ceil(xRange / gridSize);
    const yLines = Math.ceil(yRange / gridSize);

    const lines = [];

    // 垂直网格线
    for (let i = 0; i <= xLines; i++) {
      const x = (i * gridSize / xRange) * mapSize.width;
      lines.push(
        <div
          key={`v-${i}`}
          className="grid-line vertical"
          style={{ left: `${x}px` }}
        />
      );
    }

    // 水平网格线
    for (let i = 0; i <= yLines; i++) {
      const y = (i * gridSize / yRange) * mapSize.height;
      lines.push(
        <div
          key={`h-${i}`}
          className="grid-line horizontal"
          style={{ top: `${y}px` }}
        />
      );
    }

    return lines;
  };

  // 处理商家点击事件
  const handleShopClick = (shopId) => {
    setSelectedShopId(shopId);
    setShopDetailVisible(true);
  };


  // 将商家分组
  const groupShops = (shops) => {
    const groups = [];
    for (let i = 0; i < shops.length; i += DEFAULT_NEARBY_SHOP_COUNT) {
      groups.push(shops.slice(i, i + DEFAULT_NEARBY_SHOP_COUNT));
    }
    return groups;
  };

  const fetchNearbyShops = useCallback(async () => {
    try {
      setLoading(true);
      const nearbyShops = await getNearByShops(userLocation.x, userLocation.y, distance);
      console.log(nearbyShops);

      const processedShops = (nearbyShops || []).map(shop => ({
        adminId: shop.adminId,
        shopName: shop.shopName,
        phone: shop.phone,
        shopDescription: shop.shopDescription,
        x: shop.x,
        y: shop.y,
        distance: Math.sqrt(
          Math.pow(shop.x - userLocation.x, 2) +
          Math.pow(shop.y - userLocation.y, 2)
        )
      })).filter(shop => shop.distance <= distance)
        .sort((a, b) => a.distance - b.distance);

      const limitedShops = processedShops.length > MAX_DISPLAY
        ? processedShops.slice(0, MAX_DISPLAY)
        : processedShops;

      const shopsWithStyle = limitedShops.map(shop => ({
        ...shop,
        color: shop.distance < 1000 ? '#52c41a' : '#faad14'
      }));

      setBounds(calculateBounds(shopsWithStyle));
      setShops(shopsWithStyle);
      setShopGroups(groupShops(shopsWithStyle));

    } catch (error) {
      message.error('加载商家失败');
    } finally {
      setLoading(false);
    }
  }, [userLocation, distance]);

  const handleSearch = useCallback(async () => {
    try {
      const results = await searchShops(searchQuery);
      const processedResults = results.map(shop => ({
        adminId: shop.adminId,
        shopName: shop.shopName,
        phone: shop.phone,
        shopDescription: shop.shopDescription,
        x: shop.x,
        y: shop.y,
        distance: Math.sqrt(
          Math.pow(shop.x - userLocation.x, 2) +
          Math.pow(shop.y - userLocation.y, 2)
        )
      }));

      setShops(processedResults);
      setSearchResult(processedResults);

    } catch (error) {
      message.error('搜索失败');
    }
  }, [searchQuery, userLocation]);


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

  const filterContent = (
    <div style={{ width: 260, padding: '10px 0' }}>
      <h4 style={{ marginBottom: 16 }}>配送范围筛选</h4>
      <Slider
        min={500}
        max={5000}
        step={100}
        value={distance}
        onChange={setDistance}
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

  return (
    <div className="simulated-map-container">
      {loading ? (
        <div className="loading-overlay">
          <Spin size="large" tip="地图加载中..." />
        </div>
      ) : (
        <div className="simulated-map">
          <div className="map-background" ref={mapRef}>
            {bounds && renderGridLines()}

            {bounds && (
              <div
                className="user-marker"
                style={{
                  left: `${transformCoordinate(userLocation).x}px`,
                  top: `${transformCoordinate(userLocation).y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="pulse-effect"></div>
                <div className="marker-icon">📍</div>
              </div>
            )}

            {(searchResult || shops).map((shop) => {
              const screenCoord = transformCoordinate(shop);
              return (
                <ShopMarker
                  key={shop.adminId}  // 修改key
                  shop={shop}
                  screenCoord={screenCoord}
                  onClick={() => handleShopClick(shop.adminId)}  // 改为传递adminId
                />
              );
            })}
          </div>

          <div className="shop-list">
            <div className="shop-list-header">
              <h3>附近商家 ({shops.length})</h3>
            </div>

            <div className="search-filter-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="搜索商家名称"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="shop-search-input"
                />
                {isSearching && <Spin size="small" className="search-spinner" />}
              </div>

              <Button
                type="primary"
                onClick={handleSearch}
                loading={isSearching}
                className="search-button"
              >
                搜索
              </Button>

              <Popover
                content={filterContent}
                title={null}
                trigger="click"
                open={showFilter}
                onOpenChange={setShowFilter}
                placement="bottomRight"
              >
                <Button type="primary" size="small" className="filter-button">
                  筛选
                </Button>
              </Popover>
            </div>

            <div className="current-distance-tag">
              当前范围: {distance >= 1000 ? `${(distance / 1000).toFixed(1)}公里` : `${distance}米`}
            </div>

            <Carousel autoplay dots={true}>
              {searchResult ? (
                <div className="shop-group">
                  {searchResult.map(shop => (
                    <ShopCard
                      key={shop.adminId}  // 修改key
                      shop={shop}
                      onClick={() => handleShopClick(shop.adminId)}  // 改为传递adminId
                    />
                  ))}
                </div>
              ) : (
                shopGroups.map((group, index) => (
                  <div key={index} className="shop-group">
                    {group.map(shop => (
                      <ShopCard
                        key={shop.adminId}  // 修改key
                        shop={shop}
                        onClick={() => handleShopClick(shop.adminId)}  // 改为传递adminId
                      />
                    ))}
                  </div>
                ))
              )}
            </Carousel>
          </div>
          {/* 商家详情模态框 */}
          <Modal
            title="商家详情"
            visible={shopDetailVisible}
            onCancel={() => setShopDetailVisible(false)}
            footer={null}
            width="80%"
            style={{ top: 20 }}
            bodyStyle={{ padding: 0 }}
            destroyOnClose
            className="shop-detail-modal"
          >
            <ShopDetail shopId={selectedShopId} />
          </Modal>
        </div>
      )}
    </div>
  );
};

export default SimulatedMap;