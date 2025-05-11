import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Select, InputNumber, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getDishById, createDish, updateDish } from './DishApi';

const { TextArea } = Input;
const { Option } = Select;

const DishForm = ({ initialValues, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const isEdit = !!initialValues?.id;

  useEffect(() => {
    if (initialValues) {
      console.log(initialValues);
      form.setFieldsValue(initialValues);
      setImageUrl(initialValues.image);
    } else {
      form.resetFields();
      setImageUrl('');
    }
  }, [initialValues, form]);

  const handleUpload = async (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
      return false;
    }

    setUploading(true);

    // 这里应该是实际上传逻辑，模拟上传成功
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      form.setFieldsValue({ image: url });
      setUploading(false);
      message.success('上传成功');
    }, 1000);

    return false;
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // 确保 image 字段不是 undefined
      const safeValues = {
        ...values,
        image: values.image || null, // 或者 null，根据后端接受什么
      };

      const username = localStorage.getItem('username'); // 从本地获取用户名
      if (!username) {
        message.error('无法获取管理员身份，请重新登录');
        return;
      }

      if (isEdit) {
        await updateDish({ ...safeValues, id: initialValues.id });
        message.success('更新成功');
      } else {
        await createDish(safeValues, username); // 传 username 给后端
        message.success('创建成功');
      }

      onSuccess();
    } catch (error) {
      message.error(isEdit ? '更新失败' : '创建失败');
    } finally {
      setLoading(false);
    }
  };



  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: 1, ...initialValues }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Form.Item
              label="菜品名称"
              name="name"
              rules={[{ required: true, message: '请输入菜品名称' }]}
            >
              <Input placeholder="请输入菜品名称" />
            </Form.Item>

            <Form.Item
              label="价格"
              name="price"
              rules={[{ required: true, message: '请输入价格' }]}
            >
              <InputNumber
                min={0}
                precision={2}
                style={{ width: '100%' }}
                placeholder="请输入价格"
              />
            </Form.Item>
            <Form.Item
              label="菜品类别"
              name="category"
              rules={[{ required: true, message: '请输入类别' }]}
            >
              <Input placeholder="请输入菜品类别" />
            </Form.Item>

            <Form.Item
              label="状态"
              name="status"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                <Option value={1}>上架</Option>
                <Option value={0}>下架</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="菜品描述"
              name="description"
            >
              <TextArea rows={4} placeholder="请输入菜品描述" />
            </Form.Item>
          </div>

          <div>
            <Form.Item
              label="菜品图片"
              name="image"
              rules={[{ message: '请上传菜品图片' }]}
            >
              <Upload
                name="image"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={handleUpload}
                accept="image/*"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="菜品图片"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div>
                    {uploading ? (
                      <Spin />
                    ) : (
                      <>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>上传图片</div>
                      </>
                    )}
                  </div>
                )}
              </Upload>
            </Form.Item>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button onClick={onCancel}>
            取消
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? '更新菜品' : '添加菜品'}
          </Button>
        </div>
      </Form>
    </Spin>
  );
};

export default DishForm;