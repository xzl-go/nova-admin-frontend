import React, { useEffect, useState } from 'react';
import { 
  Table, Button, Modal, Form, Input, message, Popconfirm, Space, 
  Select, Tag, Tooltip, Card, Row, Col, Badge, Typography, Divider, 
  Switch, Avatar
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  TeamOutlined, FilterOutlined, SettingOutlined,
  CheckCircleOutlined, CloseCircleOutlined, 
  SafetyCertificateOutlined, SearchOutlined
} from '@ant-design/icons';
import { fetchRoles, createRole, updateRole, deleteRole } from '../../services/role';
import { fetchDepts } from '../../services/dept';
import { fetchDictItems } from '../../services/dict';
import AssignPermsModal from './AssignPermsModal';

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form] = Form.useForm();
  const [orgList, setOrgList] = useState([]);
  const [selectedDom, setSelectedDom] = useState('');
  const [statusOptions, setStatusOptions] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [permsModalRole, setPermsModalRole] = useState(null);

  const loadOrgs = async () => {
    try {
      const res = await fetchDepts();
      setOrgList(res.filter(item => item.serial));
    } catch (e) {
      message.error('获取组织列表失败');
    }
  };

  const loadRoles = async (dom) => {
    setLoading(true);
    try {
      const params = {};
      if (dom) params.dom = dom;
      if (searchValue) params.search = searchValue;
      
      const res = await fetchRoles(params);
      if (Array.isArray(res)) {
        setRoles(res);
      } else if (res && res.data) {
        setRoles(res.data);
      } else {
        setRoles([]);
      }
    } catch (e) {
      message.error('获取角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrgs();
    loadRoles(selectedDom);
    fetchDictItems({ dictType: 'status' }).then(setStatusOptions);
  }, [selectedDom, searchValue]);

  const showModal = (role = null) => {
    setEditingRole(role);
    setModalVisible(true);
    if (role) {
      form.setFieldsValue(role);
    } else {
      form.resetFields();
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRole) {
        const res = await updateRole({ ...editingRole, ...values });
        if (res.code === 0) {
          message.success('角色更新成功');
          setModalVisible(false);
          loadRoles(selectedDom);
        } else {
          message.error(res.msg || '更新失败');
        }
      } else {
        const res = await createRole(values);
        if (res.code === 0) {
          message.success('角色创建成功');
          setModalVisible(false);
          loadRoles(selectedDom);
        } else {
          message.error(res.msg || '创建失败');
        }
      }
    } catch (e) {
      message.error('操作失败，请重试');
    }
  };

  const handleDelete = async (role) => {
    try {
      const res = await deleteRole({ id: role.id });
      if (res.code === 0) {
        message.success('角色删除成功');
        loadRoles(selectedDom);
      } else {
        message.error(res.msg || '删除失败');
      }
    } catch (e) {
      message.error('删除失败');
    }
  };

  const statusTag = (status) => {
    const opt = statusOptions.find(opt => Number(opt.dictValue) === status);
    if (status === 1) {
      return <Tag icon={<CheckCircleOutlined />} color="success">{opt?.dictLabel || '启用'}</Tag>;
    }
    return <Tag icon={<CloseCircleOutlined />} color="error">{opt?.dictLabel || '禁用'}</Tag>;
  };

  const filteredRoles = roles.filter(role => {
    if (activeTab === 'enabled' && role.status !== 1) return false;
    if (activeTab === 'disabled' && role.status !== 0) return false;
    
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      return (
        role.name.toLowerCase().includes(searchLower) ||
        role.serial.toLowerCase().includes(searchLower) ||
        role.dom.toLowerCase().includes(searchLower) ||
        (role.description && role.description.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  const columns = [
    {
      title: '角色信息',
      dataIndex: 'name',
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Space>
            <Avatar 
              size="small" 
              icon={<SafetyCertificateOutlined />} 
              style={{ 
                backgroundColor: record.name.includes('管理员') ? '#ff4d4f' : '#1890ff',
                verticalAlign: 'middle'
              }} 
            />
            <Typography.Text strong>{record.name}</Typography.Text>
            {record.name === '超级管理员' && (
              <Tag color="red">系统内置</Tag>
            )}
          </Space>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {record.description || '暂无描述'}
          </Typography.Text>
        </Space>
      )
    },
    {
      title: '角色编号',
      dataIndex: 'serial',
      align: 'center',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: '所属组织',
      dataIndex: ['dept', 'name'],
      align: 'center'
    },
    {
      title: '组织编号',
      dataIndex: 'dom',
      align: 'center'
    },
    {
      title: '关联用户',
      dataIndex: 'userCount',
      align: 'center',
      render: (count) => (
        <Badge 
          count={count} 
          showZero 
          style={{ backgroundColor: count > 0 ? '#52c41a' : '#d9d9d9' }} 
        />
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (status) => statusTag(status)
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => {
        const isSystem = record.serial === 'RNO-888' || record.name === '超级管理员';
        return (
          <Space>
            <Tooltip title={isSystem ? '系统内置角色不可编辑' : '编辑角色'}>
              <Button 
                icon={<EditOutlined />} 
                onClick={() => showModal(record)}
                disabled={isSystem}
              />
            </Tooltip>
            <Tooltip title={isSystem ? '系统内置角色不可删除' : '删除角色'}>
              <Popconfirm 
                title="确定删除该角色吗？" 
                onConfirm={() => handleDelete(record)} 
                disabled={isSystem}
              >
                <Button 
                  icon={<DeleteOutlined />} 
                  danger
                  disabled={isSystem}
                />
              </Popconfirm>
            </Tooltip>
            <Tooltip title={isSystem ? '系统内置角色不可分配权限' : '分配权限'}>
              <Button 
                icon={<SettingOutlined />} 
                type="primary"
                disabled={isSystem}
                onClick={() => setPermsModalRole(record)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card 
        title="角色管理" 
        variant="outlined"
        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
          >
            新增角色
          </Button>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={16} md={12}>
            <Input
              placeholder="搜索角色名称、编号或描述..."
              prefix={<SearchOutlined />}
              allowClear
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Select
              style={{ width: '100%' }}
              allowClear
              placeholder="按组织筛选"
              value={selectedDom || undefined}
              onChange={setSelectedDom}
              suffixIcon={<FilterOutlined />}
            >
              {orgList.map(org => (
                <Select.Option key={org.serial} value={org.serial}>
                  {org.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Space>
              <Button 
                type={activeTab === 'all' ? 'primary' : 'default'} 
                onClick={() => setActiveTab('all')}
              >
                全部角色
              </Button>
              <Button 
                type={activeTab === 'enabled' ? 'primary' : 'default'} 
                onClick={() => setActiveTab('enabled')}
              >
                启用
              </Button>
              <Button 
                type={activeTab === 'disabled' ? 'primary' : 'default'} 
                onClick={() => setActiveTab('disabled')}
              >
                禁用
              </Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card 
              bordered={false}
              bodyStyle={{ 
                padding: 16,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Avatar 
                size={48} 
                icon={<TeamOutlined />} 
                style={{ 
                  backgroundColor: '#e6f7ff',
                  color: '#1890ff',
                  marginRight: 16
                }} 
              />
              <div>
                <Typography.Text type="secondary">角色总数</Typography.Text>
                <Typography.Title level={3} style={{ margin: 0 }}>
                  {roles.length}
                </Typography.Title>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card 
              bordered={false}
              bodyStyle={{ 
                padding: 16,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Avatar 
                size={48} 
                icon={<CheckCircleOutlined />} 
                style={{ 
                  backgroundColor: '#f6ffed',
                  color: '#52c41a',
                  marginRight: 16
                }} 
              />
              <div>
                <Typography.Text type="secondary">启用角色</Typography.Text>
                <Typography.Title level={3} style={{ margin: 0 }}>
                  {roles.filter(r => r.status === 1).length}
                </Typography.Title>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card 
              bordered={false}
              bodyStyle={{ 
                padding: 16,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Avatar 
                size={48} 
                icon={<CloseCircleOutlined />} 
                style={{ 
                  backgroundColor: '#fff2f0',
                  color: '#ff4d4f',
                  marginRight: 16
                }} 
              />
              <div>
                <Typography.Text type="secondary">禁用角色</Typography.Text>
                <Typography.Title level={3} style={{ margin: 0 }}>
                  {roles.filter(r => r.status === 0).length}
                </Typography.Title>
              </div>
            </Card>
          </Col>
        </Row>

        <Table
          dataSource={filteredRoles}
          rowKey="id"
          columns={columns}
          loading={loading}
          pagination={{
            position: ['bottomRight'],
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: total => `共 ${total} 个角色`
          }}
          scroll={{ x: true }}
          rowClassName={(record) => record.name === '超级管理员' ? 'super-admin-row' : ''}
        />
      </Card>

      <Modal
        title={editingRole ? `编辑角色 - ${editingRole?.name}` : '新增角色'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnHidden
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {editingRole ? '更新角色' : '创建角色'}
          </Button>
        ]}
      >
        <Form 
          form={form} 
          layout="vertical"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item 
            name="name" 
            label="角色名称" 
            rules={[{ required: true, message: '请输入角色名称' }]} 
          >
            <Input placeholder="例如：管理员、开发工程师等" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="serial" 
                label="角色编号" 
                rules={[{ required: true, message: '请输入角色编号' }]} 
              >
                <Input placeholder="例如：RNO-001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="status" 
                label="状态" 
                rules={[{ required: true, message: '请选择状态' }]} 
                initialValue={1}
              >
                <Select placeholder="请选择状态">
                  {statusOptions.map(opt => (
                    <Select.Option key={opt.dictValue} value={Number(opt.dictValue)}>
                      {opt.dictLabel}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item 
            name="dom" 
            label="所属组织" 
            rules={[{ required: true, message: '请选择组织' }]} 
          >
            <Select 
              placeholder="请选择组织"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {orgList.map(org => (
                <Select.Option key={org.serial} value={org.serial}>
                  {org.name} ({org.serial})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="description" 
            label="角色描述"
          >
            <Input.TextArea 
              placeholder="请输入角色描述信息" 
              rows={3} 
            />
          </Form.Item>
        </Form>
      </Modal>

      <AssignPermsModal
        visible={!!permsModalRole}
        role={permsModalRole}
        onCancel={() => setPermsModalRole(null)}
        onOk={() => {
          setPermsModalRole(null);
          loadRoles(selectedDom);
        }}
      />

      <style jsx global>{`
        .super-admin-row {
          background-color: #fffaf0 !important;
        }
        .super-admin-row:hover td {
          background-color: #fff1e6 !important;
        }
        .ant-table-thead > tr > th {
          background-color: #fafafa;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default RoleList;