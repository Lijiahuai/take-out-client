import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { createDish, updateDish } from './DishApi';
import './DishForm.css'; // Import the CSS file

const DishForm = ({ visible, onCancel, onSuccess, dish }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (dish) {
            form.setFieldsValue(dish);
        } else {
            form.resetFields();
        }
    }, [dish, form]);

    const handleFinish = async (values) => {
        try {
            if (dish) {
                await updateDish({ ...dish, ...values });
                message.success('更新成功');
            } else {
                await createDish(values);
                message.success('添加成功');
            }
            onSuccess();
        } catch (error) {
            message.error('操作失败');
        }
    };

    return (
        <Modal
            className="dish-form-modal" // Add class name for modal
            visible={visible}
            title={dish ? '编辑菜品' : '新增菜品'}
            onCancel={onCancel}
            onOk={() => form.submit()}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Form.Item
                    className="dish-form-item" // Add class name for form items
                    name="dish_name"
                    label="菜品名称"
                    rules={[{ required: true, message: '请输入菜品名称' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    className="dish-form-item"
                    name="price"
                    label="价格"
                    rules={[{ required: true, message: '请输入价格' }]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>

                <Form.Item
                    className="dish-form-item"
                    name="dish_description"
                    label="描述"
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item
                    className="dish-form-item"
                    name="category"
                    label="分类"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    className="dish-form-item"
                    name="status"
                    label="状态"
                    rules={[{ required: true, message: '请选择状态' }]}
                >
                    <Select>
                        <Select.Option value={1}>上架</Select.Option>
                        <Select.Option value={0}>下架</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DishForm;