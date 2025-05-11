import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Tag, Image, Popconfirm, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllDish, deleteDish } from './DishApi';
import DishForm from './DishForm';
import { showNotification } from '../../../components/ui/Notification';

const DishList = () => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [currentDish, setCurrentDish] = useState(null);

    const fetchDishes = async (params = {}) => {
        setLoading(true);
        try {
            const { data } = await getAllDish({
                page: params.pagination?.current || pagination.current,
                pageSize: params.pagination?.pageSize || pagination.pageSize,
            });

            setDishes(data.list);
            setPagination({
                ...pagination,
                total: data.total,
                current: data.page,
            });
        } catch (error) {
            showNotification('获取菜品列表失败: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDishes();
    }, []);

    const handleTableChange = (newPagination) => {
        fetchDishes({
            pagination: newPagination,
        });
    };

    const handleDelete = async (id) => {
        try {
            const result = await deleteDish(id);
            if (result === true) {
                showNotification('删除成功', 'success');
                fetchDishes();
            } else {
                showNotification('删除失败', 'error');
            }
        } catch (error) {
            showNotification(error?.message || '删除出错', 'error');
        }
    };

    const showModal = (dish = null) => {
        setCurrentDish(dish);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setCurrentDish(null);
    };

    const handleFormSuccess = () => {
        handleModalClose();
        fetchDishes();
        showNotification(currentDish ? '菜品更新成功' : '菜品添加成功', 'success');
    };
    const columns = [
        {
            title: '序号',
            key: 'index',
            width: 80,
            render: (text, record, index) => {
                const { current, pageSize } = pagination;
                return (current - 1) * pageSize + index + 1;
            }
        },
        {
            title: '菜品名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '菜品图片',
            dataIndex: 'image',
            key: 'image',
            render: (image) => (
                <Image
                    src={image || 'https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141352.jpg'}
                    width={80}
                    height={60}
                    style={{ objectFit: 'cover' }}
                    fallback="https://via.placeholder.com/80x60?text=No+Image"
                    preview={!!image}
                />
            ),
        },
        // 新增的分类字段
        {
            title: '菜品分类',
            dataIndex: 'category',
            key: 'category',
            render: (category) => category || '未分类', // 处理空值情况
            width: 120, // 可选：设置列宽
            filters: [ // 可选：添加筛选功能
                { text: '中式', value: '中式' },
                { text: '西式', value: '西式' },
                { text: '日式', value: '日式' },
            ],
            onFilter: (value, record) => record.category === value,
        },
        {
            title: '价格(元)',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `¥${price}`,
        },
        {
            title: '菜品描述',
            dataIndex: 'description',
            key: 'description',
            width: 200
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 1 ? 'green' : 'red'}>
                    {status === 1 ? '上架中' : '已下架'}
                </Tag>
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
            render: (time) => new Date(time).toLocaleString(),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定要删除这个菜品吗？"
                        onConfirm={() => handleDelete(record.id)}
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
                <h2 className="text-xl font-semibold">菜品管理</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                >
                    添加菜品
                </Button>
            </div>

            <Table
                columns={columns}
                rowKey="id"
                dataSource={dishes}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ x: 1200 }}
            />

            <Modal
                title={currentDish ? '编辑菜品' : '添加菜品'}
                visible={modalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={800}
                destroyOnClose
            >
                <DishForm
                    initialValues={currentDish}
                    onSuccess={handleFormSuccess}
                    onCancel={handleModalClose}
                />
            </Modal>
        </div>
    );
};

export default DishList;