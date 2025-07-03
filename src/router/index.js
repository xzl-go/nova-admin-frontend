import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, theme, Spin, Avatar, Dropdown, Space, Badge } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  TeamOutlined, 
  ApartmentOutlined, 
  MenuOutlined, 
  FileTextOutlined, 
  BookOutlined,
  SettingOutlined,
  LogoutOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import Logo from '../components/Logo';

// 使用React.lazy进行代码分割
const Login = React.lazy(() => import('../pages/Login'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const UserList = React.lazy(() => import('../pages/User/UserList'));
const RoleList = React.lazy(() => import('../pages/Role/RoleList'));
const DeptTree = React.lazy(() => import('../pages/Dept/DeptTree'));
const MenuTree = React.lazy(() => import('../pages/Menu/MenuTree'));
const OperationLogList = React.lazy(() => import('../pages/OperationLogList'));
const DictTypeList = React.lazy(() => import('../pages/Dict/DictTypeList'));
const DictItemList = React.lazy(() => import('../pages/Dict/DictItemList'));

const { Header, Sider, Content, Footer } = Layout;

// 加载中组件
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <Spin size="large" />
  </div>
);

// 菜单配置
const menuItems = [
  { 
    key: '/', 
    icon: <DashboardOutlined />, 
    label: '控制面板'
  },
  { 
    key: '/user', 
    icon: <UserOutlined />, 
    label: '用户管理'
  },
  { 
    key: '/role', 
    icon: <TeamOutlined />, 
    label: '角色管理'
  },
  { 
    key: '/dept', 
    icon: <ApartmentOutlined />, 
    label: '组织管理'
  },
  { 
    key: '/operation-log', 
    icon: <FileTextOutlined />, 
    label: '操作日志'
  },
  {
    key: '/dict',
    icon: <BookOutlined />,
    label: '字典管理',
    children: [
      { key: '/dict/type', label: '字典类型' },
      { key: '/dict/item', label: '字典项' },
    ]
  },
];

// 用户下拉菜单
const userMenuItems = [
  {
    key: 'profile',
    label: '个人中心',
    icon: <UserOutlined />
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: <SettingOutlined />
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    label: '退出登录',
    icon: <LogoutOutlined />,
    danger: true
  }
];

function MainLayout({ children }) {
  const isLogin = !!localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, colorTextBase },
  } = theme.useToken();
  
  if (!isLogin) {
    return <Navigate to="/login" />;
  }

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  // 获取当前选中的菜单项和展开的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname;
    return [path];
  };

  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/dict')) {
      return ['/dict'];
    }
    return [];
  };

  return (
    <Layout style={{ minHeight: '100vh' }} className="admin-layout">
      {/* 侧边栏导航 */}
      <Sider 
        width={220} 
        theme="dark"
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100
        }}
      >
        <div className="logo-container">
          <Logo />
          <div className="app-name">Nova Admin</div>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          onClick={handleMenuClick}
          items={menuItems}
          style={{ marginTop: 16 }}
        />
      </Sider>
      
      <Layout style={{ marginLeft: 220 }}>
        {/* 顶部导航栏 */}
        <Header 
          style={{ 
            background: colorBgContainer,
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 99,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
          }}
        >
          <div className="page-title">
            {menuItems.find(item => item.key === location.pathname)?.label || 
             menuItems.flatMap(item => item.children || []).find(child => child.key === location.pathname)?.label ||
             '控制面板'}
          </div>
          
          <Space size="large">
            <Badge count={5} size="small" offset={[-5, 5]}>
              <NotificationOutlined 
                style={{ fontSize: 18, color: colorTextBase, cursor: 'pointer' }} 
              />
            </Badge>
            
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} trigger={['click']}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Avatar 
                  size="default" 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: '#1890ff' }}
                />
                <span style={{ marginLeft: 8, fontWeight: 500 }}>管理员</span>
              </div>
            </Dropdown>
          </Space>
        </Header>
        
        {/* 主内容区域 */}
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
          <Suspense fallback={<Spin size="large" style={{ display: 'block', margin: '100px auto' }} />}>
            {children}
          </Suspense>
        </Content>
        
        {/* 底部信息 */}
        <Footer style={{ textAlign: 'center', padding: '16px 24px', background: colorBgContainer }}>
          Nova Admin © {new Date().getFullYear()} - 企业级后台管理系统
        </Footer>
      </Layout>
    </Layout>
  );
}

export default function Router() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          
          <Route path="/user" element={
            <MainLayout>
              <UserList />
            </MainLayout>
          } />
          
          <Route path="/role" element={
            <MainLayout>
              <RoleList />
            </MainLayout>
          } />
          
          <Route path="/dept" element={
            <MainLayout>
              <DeptTree />
            </MainLayout>
          } />
          
          <Route path="/operation-log" element={
            <MainLayout>
              <OperationLogList />
            </MainLayout>
          } />
          
          <Route path="/dict/type" element={
            <MainLayout>
              <DictTypeList />
            </MainLayout>
          } />
          
          <Route path="/dict/item" element={
            <MainLayout>
              <DictItemList />
            </MainLayout>
          } />
          
          {/* 404 页面重定向 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// 添加全局样式
const styles = `
.admin-layout {
  background-color: #f5f7fa;
}

.logo-container {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.app-name {
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-left: 12px;
  white-space: nowrap;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.ant-layout-sider {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
}

.ant-layout-content {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

@media (max-width: 991px) {
  .admin-layout .ant-layout-sider {
    position: fixed;
    height: 100vh;
    z-index: 100;
  }
  
  .admin-layout .ant-layout {
    margin-left: 0 !important;
  }
  
  .ant-layout-header {
    padding: 0 16px !important;
  }
}
`;

// 将样式注入到文档头部
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);