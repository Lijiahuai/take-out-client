import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, message } from 'antd';
import moment from 'moment';
import { getUserInfo, updateUserInfo } from './api';

const { Option } = Select;

const UserProfile = () => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const userData = await getUserInfo();
                console.log('用户信息:', userData);
                
                // 转换数据格式
                const formData = {
                    ...userData,
                    createTime: moment(userData.create_time),
                    update_time: moment(userData.update_time)
                };
                
                setInitialValues(formData);
                form.setFieldsValue(formData);
            } catch (error) {
                message.error(`获取用户信息失败: ${error.message}`);
                // 降级处理
                form.setFieldsValue({
                    username: 'guest',
                    real_name: '访客用户',
                    gender: 'M',
                    phone: '',
                    x: 0,
                    y: 0,
                    remark: ''
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        // 重置密码字段，避免直接修改原密码
        form.setFieldsValue({ password: '' });
    };

    const handleCancel = () => {
        setIsEditing(false);
        form.setFieldsValue(initialValues);
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // 准备提交数据（过滤掉不允许修改的字段）
            const submitData = {
                real_name: values.real_name,
                phone: values.phone,
                gender: values.gender,
                x: values.x,
                y: values.y,
                remark: values.remark,
                // 只有密码字段有值时才更新密码
                ...(values.password && { password: values.password })
            };
            
            console.log('提交的数据:', submitData);
            await updateUserInfo(submitData);
            
            message.success('个人信息更新成功');
            setIsEditing(false);
            // 刷新数据
            const newData = await getUserInfo();
            form.setFieldsValue({
                ...newData,
                createTime: moment(newData.create_time),
                update_time: moment(newData.update_time)
            });
        } catch (error) {
            message.error(`更新失败: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-profile-container" style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
            <h2 style={{ marginBottom: 24 }}>个人信息</h2>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                        <Form.Item label="用户名" name="username">
                            <Input disabled />
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={isEditing ? [
                                { min: 6, message: '密码至少6位' },
                                { max: 20, message: '密码最多20位' }
                            ] : []}
                        >
                            <Input.Password 
                                placeholder={isEditing ? '输入新密码（留空不修改）' : '******'} 
                                disabled={!isEditing}
                            />
                        </Form.Item>

                        <Form.Item 
                            label="真实姓名" 
                            name="real_name"
                            rules={[{ required: true, message: '请输入真实姓名' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="手机号"
                            name="phone"
                            rules={[
                                { required: true, message: '请输入手机号' },
                                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </div>

                    <div style={{ flex: 1 }}>
                        <Form.Item 
                            label="性别" 
                            name="gender"
                            rules={[{ required: true, message: '请选择性别' }]}
                        >
                            <Select>
                                <Option value="M">男</Option>
                                <Option value="F">女</Option>
                                <Option value="O">其他</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item 
                            label="经度(X)" 
                            name="x"
                            rules={[{ required: true, message: '请输入经度' }]}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item 
                            label="纬度(Y)" 
                            name="y"
                            rules={[{ required: true, message: '请输入纬度' }]}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item label="备注" name="remark">
                            <Input.TextArea rows={2} />
                        </Form.Item>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                    <div>
                        <Form.Item label="创建时间" name="createTime">
                            <DatePicker showTime disabled style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label="更新时间" name="update_time">
                            <DatePicker showTime disabled style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    <div style={{ alignSelf: 'flex-end' }}>
                        {!isEditing ? (
                            <Button type="primary" onClick={handleEdit}>
                                编辑信息
                            </Button>
                        ) : (
                            <>
                                <Button style={{ marginRight: 8 }} onClick={handleCancel}>
                                    取消
                                </Button>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    保存
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default UserProfile;