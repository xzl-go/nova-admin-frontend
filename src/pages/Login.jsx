/*
 * @Author: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @Date: 2025-06-24 16:07:38
 * @LastEditors: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @LastEditTime: 2025-07-01 17:48:54
 * @FilePath: /nova-admin/frontend/src/pages/Login.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { login } from '../services/auth';
import InitSystem from './InitSystem';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showInit, setShowInit] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await login(values);
      // 兼容后端 data 结构
      const token = response.token || (response.data && response.data.token);
      const user = response.user || (response.data && response.data.user);
      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      message.success('登录成功！');
      // 登录成功后跳转到首页
      navigate('/');
    } catch (error) {
      message.error(error.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  if (showInit) {
    return (
      <InitSystem 
        onBack={() => setShowInit(false)}
        onSuccess={() => {
          setShowInit(false);
          message.success('系统初始化成功，请重新登录');
        }}
      />
    );
  }

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
          <h2 style={{ margin: 0, fontWeight: 700 }}>Nova Admin</h2>
        </div>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}> 
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}> 
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>登录</Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" block onClick={() => setShowInit(true)}>系统初始化</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 