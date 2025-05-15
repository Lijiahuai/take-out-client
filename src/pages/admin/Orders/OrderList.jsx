import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Popconfirm, message, Badge, Input } from 'antd';
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getOrders, deleteOrder } from './OrderApi';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await getOrders({
        page: params.pagination?.current || pagination.current,
        pageSize: params.pagination?.pageSize || pagination.pageSize,
        search: searchText,
        ...params,
      });
      setOrders(data.list);
      setPagination({
        ...pagination,
        total: data.total,
        current: data.page,
      });
    } catch (error) {
      message.error('获取订单列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchText]);

  const handleTableChange = (newPagination, filters, sorter) => {
    fetchOrders({
      pagination: newPagination,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      message.success('删除成功');
      fetchOrders();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const getStatusTag = (status) => {
    const statusMap = {
      0: { text: '待支付', color: 'orange' },
      1: { text: '已支付', color: 'blue' },
      2: { text: '配送中', color: 'geekblue' },
      3: { text: '已完成', color: 'green' },
      4: { text: '已取消', color: 'red' },
    };
    return <Tag color={statusMap[status]?.color || 'default'}>{statusMap[status]?.text || '未知'}</Tag>;
  };

  const columns = [
    {
      title: '订单ID',
      dataIndex: 'order_id',
      key: 'order_id',
      width: 100,
      sorter: true,
    },
    {
      title: '用户信息',
      key: 'user_info',
      render: (_, record) => (
        <div>
          <div>{record.real_name}</div>
          <div>{record.phone}</div>
        </div>
      ),
    },
    {
      title: '配送地址',
      key: 'address',
      render: (_, record) => (
        <div>
          <div>坐标: ({record.x}, {record.y})</div>
          {record.remark && <div>备注: {record.remark}</div>}
        </div>
      ),
    },
    {
      title: '用户ID',
      dataIndex: 'user_id',
      key: 'user_id',
      width: 100,
    },
    {
      title: '总金额',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (price) => `¥${price?.toFixed(2) || '0.00'}`,
      sorter: (a, b) => (a.total_price || 0) - (b.total_price || 0),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
      filters: [
        { text: '待支付', value: 0 },
        { text: '已支付', value: 1 },
        { text: '配送中', value: 2 },
        { text: '已完成', value: 3 },
        { text: '已取消', value: 4 },
      ],
      filterMultiple: false,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (time) => time ? new Date(time).toLocaleString() : '-',
      sorter: (a, b) => new Date(a.create_time || 0) - new Date(b.create_time || 0),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/orders/detail/${record.order_id}`)}
          >
            详情
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/orders/edit/${record.order_id}`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除此订单吗？"
            onConfirm={() => handleDelete(record.order_id)}
            okText="确定"
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">订单管理</h2>
        <div className="flex space-x-4">
          <Input
            placeholder="搜索订单ID、用户ID或姓名"
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Button type="primary" onClick={() => navigate('/admin/orders/create')}>
            创建订单
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        rowKey="order_id"
        dataSource={orders}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 1500 }}
        bordered
      />
    </div>
  );
};

export default OrderList;