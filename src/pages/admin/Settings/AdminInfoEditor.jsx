import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Upload, Descriptions, Tag, Space } from 'antd';
import { UploadOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { getAdminInfo, updateAdminInfo } from './Api';
import { showNotification } from '../../../components/ui/Notification';
import './css.css';

const AdminInfoEditor = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState(null);

  // 初始化时从 localStorage 获取 adminId
  useEffect(() => {
    const storedAdminId = localStorage.getItem('id');
    if (storedAdminId) {
      setAdminId(parseInt(storedAdminId));
    } else {
      showNotification('未找到商家ID，请重新登录', 'error');
    }
  }, []);

  // 获取商家数据
  useEffect(() => {
    const fetchAdminData = async () => {
      if (!adminId) return;

      try {
        const data = await getAdminInfo(adminId);
        setAdminData(data);
        form.setFieldsValue(data);

        if (data.logo_url) {
          setFileList([{
            uid: '-1',
            name: 'logo',
            status: 'done',
            url: data.logo_url,
          }]);
        }
      } catch (error) {
        showNotification('获取商家数据失败', 'error');
      }
    };

    fetchAdminData();
  }, [adminId, form]);

  const handleUpload = async (file) => {
    // 文件上传逻辑
    // 返回上传后的URL
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.setFieldsValue(adminData); // 重置表单
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      let logoUrl = values.logo_url;

      if (fileList.length > 0 && fileList[0].originFileObj) {
        logoUrl = await handleUpload(fileList[0].originFileObj);
      }

      const updatedData = {
        ...values,
        logo_url: logoUrl,
        update_time: new Date().toISOString()
      };

      const res = await updateAdminInfo(adminId, updatedData);
      if (res) {
        setAdminData(updatedData);
        showNotification('商家信息更新成功', 'success');
        setIsEditing(false);
        onSuccess?.();
      } else {
        showNotification('商家信息更新失败,请检查是否设置了不合理的数据', 'error');
      }

    } catch (error) {
      showNotification('更新失败: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!adminData) {
    return <div>加载商家信息中...</div>;
  }

  return (
    <div className="admin-info-editor">
      <div className="header-section">
        <h2 className="editor-title">店铺信息</h2>
        <div className="last-update">
          最后更新时间: <Tag color="blue">{adminData.update_time}</Tag>
        </div>
      </div>

      {!isEditing ? (
        <div className="display-mode">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="店铺名称">{adminData.shop_name || '未设置'}</Descriptions.Item>
            <Descriptions.Item label="坐标位置">
              X: {adminData.x_coord}, Y: {adminData.y_coord}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">{adminData.phone || '未设置'}</Descriptions.Item>
            <Descriptions.Item label="店铺描述">{adminData.description || '未设置'}</Descriptions.Item>
            <Descriptions.Item label="店铺Logo" span={2}>
              {adminData.logo_url ? (
                <img
                  src={adminData.logo_url}
                  alt="店铺Logo"
                  style={{ maxWidth: 200, maxHeight: 200 }}
                />
              ) : '未设置'}
            </Descriptions.Item>
          </Descriptions>

          <div className="action-buttons" style={{ marginTop: 24 }}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
            >
              编辑信息
            </Button>
          </div>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={adminData}
          className="admin-form"
        >
          <Form.Item
            name="shop_name"
            label="店铺名称"
            rules={[{ required: true, message: '请输入店铺名称' }]}
          >
            <Input maxLength={100} placeholder="请输入店铺名称" />
          </Form.Item>

          <Form.Item label="坐标位置" style={{ marginBottom: 0 }}>
            <Form.Item
              name="x_coord"
              label="X坐标"
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <InputNumber className="coord-input" />
            </Form.Item>
            <Form.Item
              name="y_coord"
              label="Y坐标"
              style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: '16px' }}
            >
              <InputNumber className="coord-input" />
            </Form.Item>
          </Form.Item>

          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ pattern: /^[0-9+\- ]+$/, message: '请输入有效的电话号码' }]}
          >
            <Input maxLength={20} placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            name="description"
            label="店铺描述"
          >
            <Input.TextArea rows={4} placeholder="请输入店铺描述信息" />
          </Form.Item>

          <Form.Item
            name="logo_url"
            label="店铺Logo"
          >
            <Upload
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              beforeUpload={() => false}
              listType="picture"
              maxCount={1}
              className="logo-upload"
            >
              <Button icon={<UploadOutlined />}>上传Logo (最大255字符URL)</Button>
            </Upload>
          </Form.Item>

          <Form.Item className="submit-btn-container">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
              >
                保存更改
              </Button>
              <Button
                onClick={handleCancel}
                icon={<CloseOutlined />}
              >
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default AdminInfoEditor;