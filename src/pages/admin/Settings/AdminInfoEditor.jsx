import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getAdminDetail, updateAdminDetail } from './Api';
import { showNotification } from '../../../components/ui/Notification';
import './css.css';

const AdminInfoEditor = ({ adminId, onSuccess }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const data = await getAdminDetail(adminId);
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
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      let logoUrl = values.logo_url;

      if (fileList.length > 0 && fileList[0].originFileObj) {
        logoUrl = await handleUpload(fileList[0].originFileObj);
      }

      await updateAdminDetail(adminId, {
        ...values,
        logo_url: logoUrl,
        update_time: new Date().toISOString()
      });

      showNotification('管理员信息更新成功', 'success');
      onSuccess?.();
    } catch (error) {
      showNotification('更新失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-info-editor">
      <h2 className="editor-title">店铺信息编辑</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ x_coord: 0, y_coord: 0 }}
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
          <Button type="primary" htmlType="submit" loading={loading} className="submit-btn">
            保存更改
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminInfoEditor;