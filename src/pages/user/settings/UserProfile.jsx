import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, message } from 'antd';
import moment from 'moment';
import { getUserInfo, updateUserInfo } from './api';
import { useUser, getGlobalUser } from '../context/UserContext'; // 导入用户上下文

const { Option } = Select;

const UserProfile = () => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState(null);
    
    // 使用全局用户上下文
    const { user: contextUser, updateUserInfo: contextUpdateUserInfo } = useUser();

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                // 优先使用上下文中的用户信息
                let userData = contextUser || getGlobalUser();
                
                // 如果上下文中没有用户信息，则从API获取
                if (!userData) {
                    userData = await getUserInfo();
                }
                
                console.log('用户信息:', userData);

                const formData = {
                    ...userData,
                    createTime: userData.createTime ? moment(userData.createTime) : null,
                    updateTime: userData.updateTime ? moment(userData.updateTime) : null
                };

                setInitialValues(formData);
                form.setFieldsValue(formData);
            } catch (error) {
                message.error(`获取用户信息失败: ${error.message}`);
                form.setFieldsValue({
                    username: 'guest',
                    realName: '访客用户',
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
    }, [contextUser]);

    const handleEdit = () => {
        setIsEditing(true);
        form.setFieldsValue({ password: '' });
    };

    const handleCancel = () => {
        setIsEditing(false);
        form.setFieldsValue(initialValues);
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const submitData = {
                realName: values.realName,
                phone: values.phone,
                gender: values.gender,
                x: values.x,
                y: values.y,
                remark: values.remark,
                ...(values.password && { password: values.password })
            };

            console.log('提交的数据:', submitData);
            
            // 优先使用上下文中的更新方法
            let success = false;
            if (contextUpdateUserInfo) {
                success = await contextUpdateUserInfo(submitData);
            } else {
                await updateUserInfo(submitData);
                success = true;
            }

            if (success) {
                message.success('个人信息更新成功');
                setIsEditing(false);

                // 如果使用的是API更新，则需要重新获取用户信息
                if (!contextUpdateUserInfo) {
                    const newData = await getUserInfo();
                    form.setFieldsValue({
                        ...newData,
                        createTime: moment(newData.createTime),
                        updateTime: moment(newData.updateTime)
                    });
                }
            }
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
                            name="realName"
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
                        <Form.Item label="更新时间" name="updateTime">
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
