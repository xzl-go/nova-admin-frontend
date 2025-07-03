import { fetchUserStats, fetchRoleStats, fetchDeptStats } from '../services/auth';
import React from 'react';
import { 
  Button, 
  Layout, 
  Avatar, 
  Dropdown, 
  Menu, 
  Card, 
  Row, 
  Col, 
  Statistic,
  Typography,
  Grid,
  Progress,
  Space
} from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  ApartmentOutlined, 
  PlusOutlined, 
  SettingOutlined, 
  FileSearchOutlined,
  LineChartOutlined,
  LoginOutlined,
  DashboardOutlined,
  LogoutOutlined,
  BellOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOnlineUserStats } from '../services/auth';

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;
const { Header, Content } = Layout;

export default function Dashboard({ onLogout }) {
  const [userCount, setUserCount] = useState(0);
  const [roleCount, setRoleCount] = useState(0);
  const [deptCount, setDeptCount] = useState(0);
  const [onlineUserCount, setOnlineUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const screens = useBreakpoint();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [users, roles, depts, online] = await Promise.all([
          fetchUserStats(),
          fetchRoleStats(),
          fetchDeptStats(),
          fetchOnlineUserStats()
        ]);
        
        setUserCount(users.count || 0);
        setRoleCount(roles.count || 0);
        setDeptCount(depts.count || 0);
        setOnlineUserCount(online.count || 0);
      } catch (error) {
        console.error("获取数据失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        个人中心
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        系统设置
      </Menu.Item>
      <Menu.Item key="notifications" icon={<BellOutlined />}>
        通知中心
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="logout" 
        icon={<LogoutOutlined />} 
        onClick={onLogout}
        danger
      >
        退出登录
      </Menu.Item>
    </Menu>
  );

  // 统计卡片数据
  const stats = [
    { 
      title: '用户总数', 
      value: userCount, 
      icon: <UserOutlined />, 
      color: '#1890ff',
      suffix: '人',
      progress: Math.min(100, (userCount / 100) * 100)
    },
    { 
      title: '角色数', 
      value: roleCount, 
      icon: <TeamOutlined />, 
      color: '#52c41a',
      suffix: '个',
      progress: Math.min(100, (roleCount / 20) * 100)
    },
    { 
      title: '组织数', 
      value: deptCount, 
      icon: <ApartmentOutlined />, 
      color: '#722ed1',
      suffix: '个',
      progress: Math.min(100, (deptCount / 10) * 100)
    },
    { 
      title: '当前在线用户', 
      value: onlineUserCount, 
      icon: <LoginOutlined />, 
      color: '#fa8c16',
      suffix: '人',
      progress: Math.min(100, (onlineUserCount / 50) * 100)
    }
  ];

  // 快捷操作按钮
  const quickActions = [
    { 
      label: '新增用户', 
      icon: <PlusOutlined />, 
      onClick: () => navigate('/user?create=1'),
      type: 'primary'
    },
    { 
      label: '角色分配', 
      icon: <SettingOutlined />, 
      onClick: () => navigate('/user?assignRole=1')
    },
    { 
      label: '系统操作日志', 
      icon: <FileSearchOutlined />, 
      onClick: () => navigate('/operation-log')
    },
    { 
      label: '数据统计', 
      icon: <LineChartOutlined />, 
      onClick: () => navigate('/statistics')
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        padding: screens.xs ? '0 15px' : '0 40px',
        height: 64,
        zIndex: 10
      }}>
        <Space align="center">
          <DashboardOutlined style={{ fontSize: 24, color: '#1890ff', marginRight: 8 }} />
          <Title 
            level={3} 
            style={{ 
              margin: 0,
              color: '#1890ff',
              fontWeight: 700,
              fontSize: screens.xs ? 16 : 20
            }}
          >
            nova-admin 管理系统
          </Title>
        </Space>
        
        <Space size="middle" align="center">
          <Button 
            type="text" 
            icon={<BellOutlined style={{ fontSize: 18 }} />} 
            style={{ color: '#595959' }}
          />
          <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
            <Space style={{ cursor: 'pointer', padding: '8px 12px', borderRadius: 4, ':hover': { background: '#f5f5f5' }}}>
              <Avatar 
                style={{ 
                  backgroundColor: '#1890ff',
                  verticalAlign: 'middle'
                }}
              >
                A
              </Avatar>
              <Text strong style={{ marginLeft: 8, display: screens.xs ? 'none' : 'inline-block' }}>
                管理员
              </Text>
            </Space>
          </Dropdown>
        </Space>
      </Header>
      
      <Content style={{ 
        padding: screens.xs ? '20px 15px' : '30px 40px',
        marginTop: 16
      }}>
        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
          {stats.map((stat, index) => (
            <Col key={index} xs={24} sm={12} lg={6}>
              <Card 
                bordered={false} 
                style={{ 
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  height: '100%',
                  transition: 'all 0.3s',
                  ':hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)'
                  }
                }}
                bodyStyle={{ padding: '20px 24px' }}
              >
                <Statistic 
                  title={stat.title}
                  value={stat.value}
                  prefix={
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: `${stat.color}1a`,
                      marginRight: 12
                    }}>
                      {React.cloneElement(stat.icon, { 
                        style: { 
                          fontSize: 24, 
                          color: stat.color 
                        } 
                      })}
                    </div>
                  }
                  suffix={stat.suffix}
                  valueStyle={{ 
                    fontSize: 28,
                    fontWeight: 600,
                    marginTop: 8,
                    color: '#1f1f1f'
                  }}
                  loading={loading}
                />
                <Progress
                  percent={stat.progress}
                  showInfo={false}
                  strokeColor={stat.color}
                  trailColor="#f0f0f0"
                  style={{ marginTop: 16 }}
                />
                <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                  较上月增长 {Math.floor(Math.random() * 20) + 5}%
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
        
        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
          <Col span={24}>
            <Card 
              bordered={false}
              style={{ 
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <Title level={5} style={{ marginBottom: 20 }}>快捷操作</Title>
              <Space 
                wrap 
                size={screens.xs ? 8 : 16} 
                style={{ width: '100%', justifyContent: screens.xs ? 'space-between' : 'flex-start' }}
              >
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    type={action.type || 'default'}
                    icon={action.icon}
                    size="large"
                    onClick={action.onClick}
                    style={{
                      minWidth: screens.xs ? '45%' : 140,
                      marginBottom: screens.xs ? 8 : 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card 
              bordered={false}
              style={{ 
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                height: '100%',
                background: 'linear-gradient(135deg, #f6faff, #e6f4ff)'
              }}
              bodyStyle={{ 
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <div style={{ maxWidth: 600 }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: '#1890ff1a',
                  marginBottom: 24
                }}>
                  <DashboardOutlined style={{ fontSize: 40, color: '#1890ff' }} />
                </div>
                <Title level={3} style={{ marginBottom: 16 }}>
                  欢迎使用 nova-admin 管理系统！
                </Title>
                <Text style={{ 
                  fontSize: 16,
                  color: '#595959',
                  marginBottom: 32,
                  display: 'block'
                }}>
                  这是您的管理后台首页，您可以在这里快速查看系统概况、管理用户和组织结构。
                  后续可在此展示数据统计图表、待办事项等更多内容。
                </Text>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => navigate('/user')}
                >
                  开始管理用户
                </Button>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card 
              bordered={false}
              style={{ 
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                height: '100%'
              }}
              bodyStyle={{ padding: '24px' }}
              title={<Text strong>系统公告</Text>}
            >
              <div style={{ 
                background: '#fffbe6', 
                borderRadius: 8, 
                padding: 16, 
                marginBottom: 16,
                borderLeft: '3px solid #faad14'
              }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  系统维护通知
                </Text>
                <Text type="secondary">
                  计划于本周六凌晨2:00-4:00进行系统维护，期间可能短暂影响服务...
                </Text>
              </div>
              <div style={{ 
                background: '#e6f7ff', 
                borderRadius: 8, 
                padding: 16,
                borderLeft: '3px solid #1890ff'
              }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  新功能发布
                </Text>
                <Text type="secondary">
                  用户行为分析模块已上线，您可以在"数据统计"页面查看详细分析...
                </Text>
              </div>
              <Button 
                type="link" 
                style={{ marginTop: 16, padding: 0 }}
                onClick={() => navigate('/announcements')}
              >
                查看全部公告
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}