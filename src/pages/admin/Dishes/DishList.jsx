import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, message } from 'antd';
import { getAllDish } from './DishApi';
import DishForm from './DishForm';
import './DishList.css'
import dayjs from 'dayjs';

const DishList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingDish, setEditingDish] = useState(null);
    const [formVisible, setFormVisible] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllDish();
            setData(res.data.list);
        } catch (error) {
            message.error('加载菜品失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { 
            title: '名称', 
            dataIndex: 'dish_name', 
            key: 'dish_name',
            ellipsis: true,
            width: '15%'
        },
        { 
            title: '价格', 
            dataIndex: 'price', 
            key: 'price', 
            render: (v) => `￥${v}`,
            width: '10%'
        },
        { 
            title: '描述', 
            dataIndex: 'dish_description', 
            key: 'dish_description',
            ellipsis: true,
            width: '25%'
        },
        { 
            title: '分类', 
            dataIndex: 'category', 
            key: 'category',
            width: '15%'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) =>
                status === 1 ? <Tag color="green">上架</Tag> : <Tag color="red">下架</Tag>,
            width: '10%'
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
            render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
            width: '15%'
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button 
                        type="link" 
                        onClick={() => {
                            setEditingDish(record);
                            setFormVisible(true);
                        }}
                        className="edit-btn"
                    >
                        编辑
                    </Button>
                </Space>
            ),
            width: '10%'
        },
    ];

    return (
        <div className="dish-list-container">
            <div className="header-section">
                <h2 className="page-title">菜品管理</h2>
                <Button 
                    type="primary" 
                    onClick={() => {
                        setEditingDish(null);
                        setFormVisible(true);
                    }} 
                    className="add-btn"
                >
                    新增菜品
                </Button>
            </div>
            
            <div className="table-container">
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="dish_id"
                    loading={loading}
                    pagination={{ 
                        pageSize: 10,
                        showSizeChanger: false,
                        showTotal: (total) => `共 ${total} 条`
                    }}
                    bordered
                    scroll={{ x: '100%' }}
                />
            </div>
            
            {formVisible && (
                <DishForm
                    visible={formVisible}
                    onCancel={() => setFormVisible(false)}
                    onSuccess={() => {
                        setFormVisible(false);
                        fetchData();
                    }}
                    dish={editingDish}
                />
            )}
        </div>
    );
};

export default DishList;
