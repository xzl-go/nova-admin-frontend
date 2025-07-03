import React, { useEffect, useState } from 'react';
import { 
  Table, Button, Modal, Form, Input, Select, message, Popconfirm, Space, 
  TreeSelect, Tooltip, Tag, Card, Row, Col, Avatar, Switch, Badge, Divider 
} from 'antd';
import { 
  UserOutlined, EditOutlined, DeleteOutlined, SearchOutlined, 
  PlusOutlined, FilterOutlined, SyncOutlined, TeamOutlined,
  CheckCircleOutlined, CloseCircleOutlined, SettingOutlined
} from '@ant-design/icons';
import { fetchUsers, createUser, updateUser, deleteUser, fetchRoles, fetchDepts } from '../../services/user';
import { fetchDictItems } from '../../services/dict';

function toTreeData(list) {
  const map = {};
  list.forEach(item => (map[item.id] = { ...item, key: item.id, value: item.id, title: item.name, children: [] }));
  const tree = [];
  list.forEach(item => {
    if (item.parentId && map[item.parentId]) {
      map[item.parentId].children.push(map[item.id]);
    } else {
      tree.push(map[item.id]);
    }
  });
  return tree;
}

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [depts, setDepts] = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [selectedDom, setSelectedDom] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [searchParams, setSearchParams] = useState({});
  const [statusOptions, setStatusOptions] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 获取当前登录用户
  const currentUser = {
    id: 1,
    roles: [{ id: 1, name: '管理员' }]
  };

  // 获取用户列表
  const loadUsers = async (params) => {
    setLoading(true);
    try {
      const res = await fetchUsers();
      setUsers(res);
    } catch (e) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 拉取角色列表
  const loadRoles = async () => {
    try {
      const res = await fetchRoles();
      setRoles(res);
    } catch (e) {
      message.error('获取角色列表失败');
    }
  };

  // 获取组织列表
  const loadDepts = async () => {
    try {
      const res = await fetchDepts();
      setDepts(toTreeData(res));
      setDeptList(res);
    } catch (e) {
      message.error('获取组织列表失败');
    }
  };

  useEffect(() => {
    loadDepts();
    loadRoles();
    loadUsers({});
    fetchDictItems({ dictType: 'status' }).then(setStatusOptions);
  }, []);

  // 打开新增/编辑弹窗
  const showModal = (user = null) => {
    setEditingUser(user);
    setModalVisible(true);
    if (user) {
      form.setFieldsValue({
        ...user,
        roleIds: user.roles ? user.roles.map(r => r.id) : [],
        deptId: user.deptId || user.dept?.id
      });
    } else {
      form.resetFields();
    }
  };

  // 提交新增/编辑
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await updateUser({ ...editingUser, ...values });
        message.success('用户更新成功');
      } else {
        await createUser(values);
        message.success('用户创建成功');
      }
      setModalVisible(false);
      loadUsers(searchParams);
    } catch (e) {
      message.error('操作失败，请重试');
    }
  };

  // 删除用户
  const handleDelete = async (user) => {
    try {
      await deleteUser(user.id);
      message.success('用户删除成功');
      loadUsers(searchParams);
    } catch (e) {
      message.error('删除失败');
    }
  };

  // 搜索
  const onSearch = (values) => {
    loadUsers(values);
  };

  // 重置搜索
  const onReset = () => {
    searchForm.resetFields();
    loadUsers({});
  };

  // 状态切换
  const handleStatusChange = async (user, checked) => {
    try {
      // 只传deptId
      let deptId = user.deptId || (user.dept && user.dept.id);
      await updateUser({ id: user.id, status: checked ? 1 : 0, deptId });
      message.success('状态更新成功');
      loadUsers(searchParams);
    } catch (e) {
      message.error('状态更新失败');
    }
  };

  // 角色标签颜色映射
  const roleColors = {
    '超级管理员': 'red',
    '产品经理': 'blue',
    '项目负责人': 'cyan',
    '开发工程师': 'green',
    '测试工程师': 'orange',
    '质量保障': 'purple'
  };

  // 用户状态标签
  const statusTag = (status) => {
    const opt = statusOptions.find(opt => Number(opt.dictValue) === status);
    if (status === 1) {
      return <Tag icon={<CheckCircleOutlined />} color="success">{opt?.dictLabel || '启用'}</Tag>;
    }
    return <Tag icon={<CloseCircleOutlined />} color="error">{opt?.dictLabel || '禁用'}</Tag>;
  };

  // 列定义
  const columns = [
    {
      title: '用户信息',
      dataIndex: 'name',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            size="large" 
            src={record.avatar} 
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1890ff', marginRight: 12 }}
          />
          <div>
            <div style={{ fontWeight: 600 }}>{record.name}</div>
            <div style={{ color: '#8c8c8c', fontSize: 12 }}>@{record.username}</div>
          </div>
        </div>
      )
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      render: (_, record) => (
        <div>
          <div>{record.phone}</div>
          <div style={{ color: '#8c8c8c', fontSize: 12 }}>{record.email}</div>
        </div>
      )
    },
    {
      title: '角色',
      dataIndex: 'roles',
      render: (roles) => (
        <div style={{ maxWidth: 300 }}>
          {roles && roles.length > 0 ? (
            roles.map(role => (
              <Tag 
                key={role.id} 
                color={roleColors[role.name] || 'default'}
                style={{ marginBottom: 4 }}
              >
                {role.name}
              </Tag>
            ))
          ) : '-'}
        </div>
      )
    },
    {
      title: '部门',
      dataIndex: ['dept', 'name'],
      render: (deptName) => <span>{deptName || '-'}</span>
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => statusTag(status)
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      render: (date) => <span>{date || '从未登录'}</span>
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => {
        const isSelf = record.id === currentUser.id;
        const disabled = isSelf;
        let tip = isSelf ? '不能操作自己' : '';
        
        return (
          <Space>
            <Tooltip title="编辑">
              <Button 
                type="link" 
                icon={<EditOutlined />} 
                onClick={() => showModal(record)}
                disabled={disabled}
              />
            </Tooltip>
            <Tooltip title="分配角色">
              <Button 
                type="link" 
                icon={<TeamOutlined />} 
                disabled={disabled}
                onClick={() => showModal(record)}
              />
            </Tooltip>
            <Tooltip title={disabled ? tip : ''}>
              <Popconfirm
                title="确定删除该用户吗？"
                onConfirm={() => handleDelete(record)}
                disabled={disabled}
              >
                <Button 
                  type="link" 
                  icon={<DeleteOutlined />} 
                  danger
                  disabled={disabled}
                />
              </Popconfirm>
            </Tooltip>
            <Popconfirm
              title={`确定要${record.status === 1 ? '禁用' : '启用'}该用户吗？`}
              onConfirm={() => handleStatusChange(record, !(record.status === 1))}
              okText="确定"
              cancelText="取消"
              disabled={disabled}
            >
              <Switch
                checked={record.status === 1}
                checkedChildren="启用"
                unCheckedChildren="禁用"
                disabled={disabled}
              />
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card 
        title="用户管理" 
        bordered={false}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
          >
            新增用户
          </Button>
        }
        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
      >
        {/* 搜索区域 */}
        <Card 
          bordered={false}
          style={{ marginBottom: 24, background: '#f9f9f9' }}
          bodyStyle={{ padding: 16 }}
        >
          <Form form={searchForm} layout="inline" onFinish={onSearch}>
            <Row gutter={[16, 16]} style={{ width: '100%' }}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="username">
                  <Input 
                    placeholder="搜索用户名" 
                    prefix={<SearchOutlined />}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="phone">
                  <Input 
                    placeholder="搜索手机号" 
                    prefix={<SearchOutlined />}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="email">
                  <Input 
                    placeholder="搜索邮箱" 
                    prefix={<SearchOutlined />}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="roleIds">
                  <Select 
                    placeholder="选择角色" 
                    allowClear
                    suffixIcon={<FilterOutlined />}
                  >
                    {roles.map(role => (
                      <Select.Option key={role.id} value={role.id}>
                        {role.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={16} lg={12}>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    搜索
                  </Button>
                  <Button onClick={onReset} icon={<SyncOutlined />}>
                    重置
                  </Button>
                  <Button type="link" icon={<SettingOutlined />}>
                    高级搜索
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* 用户统计与操作 */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <span style={{ marginRight: 16 }}>
              <Badge color="green" text={`启用用户: ${users.filter(u => u.status === 1).length}`} />
            </span>
            <span>
              <Badge color="red" text={`禁用用户: ${users.filter(u => u.status === 0).length}`} />
            </span>
          </div>
          <div>
            <Button 
              type={activeTab === 'all' ? 'primary' : 'default'} 
              onClick={() => setActiveTab('all')}
              style={{ marginRight: 8 }}
            >
              全部用户
            </Button>
            <Button 
              type={activeTab === 'enabled' ? 'primary' : 'default'} 
              onClick={() => setActiveTab('enabled')}
              style={{ marginRight: 8 }}
            >
              启用用户
            </Button>
            <Button 
              type={activeTab === 'disabled' ? 'primary' : 'default'} 
              onClick={() => setActiveTab('disabled')}
            >
              禁用用户
            </Button>
          </div>
        </div>

        {/* 用户表格 */}
        <Table
          dataSource={users}
          rowKey="id"
          columns={columns}
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            selections: [
              Table.SELECTION_ALL,
              Table.SELECTION_INVERT,
              Table.SELECTION_NONE,
            ],
          }}
          pagination={{
            position: ['bottomRight'],
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: total => `共 ${total} 条记录`
          }}
          scroll={{ x: true }}
        />
      </Card>

      {/* 用户编辑弹窗 */}
      <Modal
        title={editingUser ? `编辑用户 - ${editingUser.name}` : '新增用户'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        width={700}
        destroyOnHidden
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {editingUser ? '更新用户' : '创建用户'}
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={24}>
            <Col span={12} xs={24} sm={12}>
              <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}> 
                <Input placeholder="请输入用户名" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            {/* <Col span={12} xs={24} sm={12}>
              <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}> 
                <Input placeholder="请输入姓名" style={{ width: '100%' }} />
              </Form.Item>
            </Col> */}
          </Row>
          {!editingUser && (
            <Row gutter={24}>
              <Col span={12} xs={24} sm={12}>
                <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}> 
                  <Input.Password placeholder="请输入密码" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12} xs={24} sm={12}>
                <Form.Item name="confirmPassword" label="确认密码" dependencies={['password']} rules={[{ required: true, message: '请确认密码' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject(new Error('两次输入的密码不一致')); }, }),]}> 
                  <Input.Password placeholder="请确认密码" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row gutter={24}>
            <Col span={12} xs={24} sm={12}>
              <Form.Item name="deptId" label="所属部门" rules={[{ required: true, message: '请选择部门' }]}> 
                <TreeSelect treeData={depts} placeholder="请选择部门" treeDefaultExpandAll allowClear style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12} xs={24} sm={12}>
              <Form.Item name="roleIds" label="用户角色" rules={[{ required: true, message: '请选择角色' }]}> 
                <Select mode="multiple" placeholder="请选择角色" style={{ width: '100%' }}>
                  {roles.map(role => (
                    <Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12} xs={24} sm={12}>
              <Form.Item name="phone" label="手机号" rules={[{ required: true, message: '请输入手机号' }, { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }]}> 
                <Input placeholder="请输入手机号" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12} xs={24} sm={12}>
              <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }]}> 
                <Input placeholder="请输入邮箱" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12} xs={24} sm={12}>
              <Form.Item name="status" label="用户状态" initialValue={1} rules={[{ required: true, message: '请选择状态' }]}> 
                <Select placeholder="请选择状态" style={{ width: '100%' }}>
                  {statusOptions.map(opt => (
                    <Select.Option key={opt.dictValue} value={Number(opt.dictValue)}>{opt.dictLabel}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;