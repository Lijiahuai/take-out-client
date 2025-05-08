## 📂 目录结构总览

```
src/
├── assets/                   # 静态资源（logo、图片、字体等）
│
├── components/               # 公共组件（全局通用）
│   ├── Button/
│   ├── Modal/
│   ├── ProductCard/
│   └── ...
│
├── layouts/                  # 各端布局
│   ├── UserLayout.jsx        # 用户端：顶部 + 底部 + 主体内容
│   └── AdminLayout.jsx       # 商家端：侧边栏 + 顶部栏 + 内容区域
│
├── pages/                    # 页面模块（按角色拆分）
│   ├── user/                 # 用户端页面
│   │   ├── Home/             # 首页
│   │   │   └── index.jsx
│   │   ├── Product/          # 商品详情
│   │   ├── Cart/             # 购物车
│   │   ├── Order/            # 下单、订单详情、支付
│   │   ├── Profile/          # 个人中心、地址管理
│   │   
│   │
│   └── admin/                # 商家端页面
│       ├── Dashboard/        # 商家首页统计
│       ├── Dishes/           # 菜品管理
│       ├── Orders/           # 订单管理
│       ├── Reports/          # 报表页
│       
│
├── router/                   # 路由管理
│   ├── userRoutes.jsx
│   ├── adminRoutes.jsx
│   └── index.jsx             # 路由整合和权限处理
│
├── context/                  # 全局状态管理
│   ├── CartContext.jsx       # 用户购物车
│   ├── AuthContext.jsx       # 登录状态（通用）
│   └── AdminContext.jsx      # 商家状态
│
├── services/                 # 接口请求
│   ├── http.js               # axios 封装
│   ├── user/
│   │   ├── product.js
│   │   ├── cart.js
│   │   ├── order.js
│   │   └── auth.js
│   └── admin/
│       ├── dishes.js
│       ├── orders.js
│       ├── reports.js
│       └── auth.js
│
├── hooks/                    # 自定义 Hook
│   ├── useAuth.js
│   ├── useCart.js
│   └── useAdminData.js
│
├── utils/                    # 工具函数
│   ├── formatPrice.js
│   ├── formatTime.js
│   └── validators.js
│
├── config/                   # 常量、配置项
│   ├── apiConfig.js
│   └── routeWhitelist.js
│
├── App.jsx                   # 根组件（路由容器）
├── main.jsx                  # 应用入口
└── index.css                 # 全局样式
```

---

## ✅ 各部分职责说明

### `components/` 公共组件

| 组件            | 功能说明       |
| ------------- | ---------- |
| `ProductCard` | 商品卡片（用户首页） |
| `Modal`       | 弹窗组件（通用）   |
| `Button`      | 通用按钮组件     |
| `Pagination`  | 分页组件       |
| `Loading`     | 加载中状态组件    |

---

### `layouts/` 页面布局

* `UserLayout.jsx`：包含顶部导航栏、底部导航栏和主内容区域。
* `AdminLayout.jsx`：左侧菜单栏 + 顶部面包屑 + 内容主体。

---

### `pages/user/` 用户端页面结构

| 页面目录       | 功能说明            |
| ---------- | --------------- |
| `Home/`    | 首页（推荐菜品、分类导航）   |
| `Product/` | 商品详情页（加入购物车）    |
| `Cart/`    | 查看购物车、修改数量、下单按钮 |
| `Order/`   | 订单列表、订单详情、支付流程  |
| `Profile/` | 用户信息、地址管理、修改密码  |
| `Auth/`    | 用户登录、注册、找回密码    |

---

### `pages/admin/` 商家端页面结构

| 页面目录         | 功能说明              |
| ------------ | ----------------- |
| `Dashboard/` | 商家后台首页（订单概览、今日营收） |
| `Dishes/`    | 商品管理（增删改查、上下架）    |
| `Orders/`    | 订单管理（查看、处理）       |
| `Reports/`   | 数据报表（图表展示）        |
| `Auth/`      | 商家登录、注册、身份审核页面    |

---

### `router/` 路由结构（拆分）

* `userRoutes.jsx`：用户端路由配置。
* `adminRoutes.jsx`：商家端路由配置。
* `index.jsx`：根据用户角色统一挂载路由，同时做权限校验（如登录态判断、角色重定向等）。

---

### `context/` 状态管理

* 用 React Context 管理全局状态，如用户信息、购物车内容、商家身份等。
* 若项目复杂度增加，可引入 Redux Toolkit 替代。

---

### `services/` API 请求封装

* 用户端和商家端请求分别管理，模块清晰，职责单一。
* 每个模块单独一个文件，便于维护。

---

## 🧩 补充

* 所有页面组件都只负责页面展示和交互，业务逻辑应尽可能下沉到 `hooks/` 和 `services/`。
* UI 统一采用 Ant Design + Tailwind CSS 结合使用，既美观又灵活。

---

## 商家接口
| 功能     | 接口地址                 | 方法     | 描述       |
| ------ | -------------------- | ------ | -------- |
| 登录     | `/api/login`         | POST   | 登录校验     |
| 获取分类   | `/api/category/list` | GET    | 获取所有分类   |
| 添加分类   | `/api/category`      | POST   | 新增分类     |
| 更新分类   | `/api/category`      | PUT    | 编辑分类     |
| 删除分类   | `/api/category/{id}` | DELETE | 删除分类     |
| 获取菜品   | `/api/dish/list`     | GET    | 分页获取菜品   |
| 添加菜品   | `/api/dish`          | POST   | 新增菜品     |
| 更新菜品   | `/api/dish`          | PUT    | 编辑菜品     |
| 删除菜品   | `/api/dish/{id}`     | DELETE | 删除菜品     |
| 获取订单   | `/api/order/list`    | GET    | 获取订单列表   |
| 修改订单状态 | `/api/order/{id}`    | PUT    | 接单、发货、完成 |
| 数据统计   | `/api/report`        | GET    | 获取统计数据   |


