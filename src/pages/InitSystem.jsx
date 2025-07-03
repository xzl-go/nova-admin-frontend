import React from 'react';
import { Form, Input, Button, Card, Space, message } from 'antd';
import { initSystem } from '../services/auth';

export default function InitSystem({ onBack, onSuccess }) {
  const onFinish = async (values) => {
    try {
      message.loading({ content: '正在初始化系统...', key: 'init' });
      const response = await initSystem(values);
      message.success({ content: '系统初始化成功！', key: 'init', duration: 2 });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error({ content: error.message || '系统初始化失败', key: 'init', duration: 3 });
    }
  };

  const onTestConnection = () => {
    // TODO: 调用后端测试数据库连接接口
    message.loading({ content: '正在测试连接...', key: 'db_test' });
    setTimeout(() => {
        message.success({ content: '数据库连接成功！', key: 'db_test', duration: 2 });
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #e0e7ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 0'
    }}>
      <Card
        style={{ width: 350, boxShadow: '0 4px 24px #0001', borderRadius: 12 }}
        bordered={false}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="/logo.svg" alt="logo" style={{ width: 48, marginBottom: 8 }} />
          <h2 style={{ margin: 0, fontWeight: 700 }}>系统初始化</h2>
        </div>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item name="admin" rules={[{ required: true, message: '请输入超级管理员用户名' }]}> 
            <Input placeholder="超级管理员用户名" />
          </Form.Item>
          <Form.Item name="adminPwd" rules={[{ required: true, message: '请输入密码' }]}> 
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item name="dbHost" rules={[{ required: true, message: '请输入数据库主机' }]}> 
            <Input placeholder="数据库主机 (如：127.0.0.1)" />
          </Form.Item>
          <Form.Item name="dbPort" rules={[{ required: true, message: '请输入数据库端口' }]}> 
            <Input placeholder="数据库端口 (如：3306)" />
          </Form.Item>
          <Form.Item name="dbName" rules={[{ required: true, message: '请输入数据库名称' }]}> 
            <Input placeholder="数据库名称" />
          </Form.Item>
          <Form.Item name="dbUser" rules={[{ required: true, message: '请输入数据库账号' }]}> 
            <Input placeholder="数据库账号" />
          </Form.Item>
          <Form.Item required>
            <Space.Compact block>
              <Form.Item name="dbPwd" noStyle rules={[{ required: true, message: '请输入数据库密码' }]}> 
                <Input.Password placeholder="数据库密码" />
              </Form.Item>
              <Button onClick={onTestConnection}>测试连接</Button>
            </Space.Compact>
          </Form.Item>
          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block size="large">初始化系统</Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" block onClick={onBack}>返回登录</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 