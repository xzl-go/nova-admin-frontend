import React, { useEffect, useState } from 'react';
import { Tree, Button, Modal, Form, Input, message, Popconfirm, Space, Select, Table, Radio, Tag, Tooltip, Card } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ApartmentOutlined, 
  UnorderedListOutlined 
} from '@ant-design/icons';
import { fetchDepts, createDept, updateDept, deleteDept } from '../../services/dept';
import { fetchDictItems } from '../../services/dict';

function toTreeData(list) {
  const map = {};
  list.forEach(item => (map[item.id] = { ...item, key: item.id, title: item.name, children: [] }));
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

const DeptTree = () => {
  const [depts, setDepts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [form] = Form.useForm();
  const [viewMode, setViewMode] = useState('tree'); // 默认树状视图
  const [statusOptions, setStatusOptions] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDepts = async () => {
    setLoading(true);
    try {
      const res = await fetchDepts();
      setDepts(res);
      // 默认展开第一级节点
      if (res.length > 0) {
        const firstLevelIds = res.filter(d => !d.parentId).map(d => d.id);
        setExpandedKeys(firstLevelIds);
      }
    } catch (e) {
      message.error('获取部门失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepts();
    fetchDictItems({ dictType: 'status' }).then(setStatusOptions);
  }, []);

  const showModal = (dept = null) => {
    setEditingDept(dept);
    setModalVisible(true);
    form.setFieldsValue({
      ...dept,
      parentId: dept?.parentId || null
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      if (editingDept) {
        await updateDept({ ...editingDept, ...values });
        message.success('部门更新成功');
      } else {
        await createDept(values);
        message.success('部门创建成功');
      }
      
      setModalVisible(false);
      loadDepts();
    } catch (e) {
      setLoading(false);
    }
  };

  const handleDelete = async (dept) => {
    try {
      setLoading(true);
      await deleteDept({ id: dept.id });
      message.success('部门删除成功');
      loadDepts();
    } catch (e) {
      message.error('删除失败');
      setLoading(false);
    }
  };

  const handleExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
  };

  const renderTreeTitle = (node) => (
    <div className="tree-node-content">
      <span className="tree-node-title">{node.name}</span>
      <span className="tree-node-serial">{node.serial}</span>
      <Tag color={node.status === 1 ? 'success' : 'error'} className="status-tag">
        {statusOptions.find(opt => Number(opt.dictValue) === node.status)?.dictLabel || '未知'}
      </Tag>
    </div>
  );

  // 列表视图 columns
  const columns = [
    { 
      title: '组织名称', 
      dataIndex: 'name', 
      align: 'center',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ApartmentOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          <span>{text}</span>
        </div>
      )
    },
    { title: '组织编号', dataIndex: 'serial', align: 'center' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      align: 'center', 
      render: v => {
        const opt = statusOptions.find(opt => Number(opt.dictValue) === v);
        return opt ? <Tag color={v === 1 ? 'green' : 'red'}>{opt.dictLabel}</Tag> : v;
      } 
    },
    {
      title: '上级组织',
      dataIndex: 'parentId',
      align: 'center',
      render: (parentId) => {
        const parent = depts.find(d => d.id === parentId);
        return parent ? (
          <Tag color="blue">{parent.name}</Tag>
        ) : (
          <Tag color="default">无上级</Tag>
        );
      }
    },
    {
      title: '操作', 
      align: 'center',
      fixed: 'right',
      width: 150,
      render: (_, record) => {
        const isSystem = record.serial === 'DNO-888' || record.name === '总部';
        return (
          <Space>
            <Tooltip title={isSystem ? '系统内置，禁止编辑' : '编辑'}>
              <Button 
                size="small" 
                icon={<EditOutlined />} 
                onClick={() => showModal(record)} 
                disabled={isSystem}
              />
            </Tooltip>
            <Tooltip title={isSystem ? '系统内置，禁止删除' : '删除'}>
              <Popconfirm 
                title="确定删除该组织吗？" 
                onConfirm={() => handleDelete(record)} 
                disabled={isSystem}
                placement="topRight"
              >
                <Button 
                  size="small" 
                  icon={<DeleteOutlined />} 
                  danger 
                  disabled={isSystem}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      }
    }
  ];

  return (
    <Card 
      title="组织架构管理" 
      variant="outlined"
      style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
      extra={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Radio.Group
            value={viewMode}
            onChange={e => setViewMode(e.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="tree">
              <ApartmentOutlined /> 树状视图
            </Radio.Button>
            <Radio.Button value="list">
              <UnorderedListOutlined /> 列表视图
            </Radio.Button>
          </Radio.Group>
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
            style={{ marginLeft: 16 }}
          >
            新增组织
          </Button>
        </div>
      }
    >
      <div className="dept-container">
        {viewMode === 'tree' ? (
          <div className="tree-view">
            <Tree
              treeData={toTreeData(depts).map(node => ({ 
                ...node, 
                title: renderTreeTitle(node) 
              }))}
              expandedKeys={expandedKeys}
              onExpand={handleExpand}
              onSelect={(_, { node }) => setSelected(node)}
              selectedKeys={selected ? [selected.id] : []}
              showLine={{ showLeafIcon: false }}
              showIcon={false}
              className="organization-tree"
              loading={loading}
            />
          </div>
        ) : (
          <Table
            dataSource={depts}
            rowKey="id"
            columns={columns}
            pagination={false}
            loading={loading}
            rowClassName={(record) => record.parentId ? '' : 'top-level-row'}
            scroll={{ x: 800 }}
          />
        )}
      </div>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {editingDept ? <EditOutlined /> : <PlusOutlined />}
            <span style={{ marginLeft: 8 }}>
              {editingDept ? '编辑组织' : '新增组织'}
            </span>
          </div>
        }
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        destroyOnHidden
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" className="dept-form">
          <Form.Item 
            name="name" 
            label="组织名称" 
            rules={[{ required: true, message: '请输入组织名称' }]}
          >
            <Input placeholder="请输入组织名称" />
          </Form.Item>
          
          <Form.Item 
            name="serial" 
            label="组织编号" 
            rules={[{ required: true, message: '请输入组织编号' }]}
          >
            <Input placeholder="请输入组织编号（如 DNO-888）" />
          </Form.Item>
          
          <Form.Item 
            name="status" 
            label="状态" 
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              {statusOptions.map(opt => (
                <Select.Option key={opt.dictValue} value={Number(opt.dictValue)}>
                  {opt.dictLabel}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="parentId" label="上级组织">
            <Select 
              allowClear 
              placeholder="请选择上级组织"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Select.Option value={null}>无上级组织</Select.Option>
              {depts
                .filter(d => !editingDept || d.id !== editingDept.id)
                .map(d => (
                  <Select.Option key={d.id} value={d.id}>
                    {d.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      
      <style jsx global>{`
        .dept-container {
          min-height: 500px;
          border-radius: 8px;
          background: #fff;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .tree-view {
          border: 1px solid #f0f0f0;
          border-radius: 4px;
          padding: 16px;
          max-height: 600px;
          overflow-y: auto;
        }
        
        .tree-node-content {
          display: flex;
          align-items: center;
          width: 100%;
        }
        
        .tree-node-title {
          font-weight: 500;
          margin-right: 12px;
        }
        
        .tree-node-serial {
          color: #666;
          font-size: 12px;
          margin-right: 8px;
        }
        
        .status-tag {
          margin-left: auto;
        }
        
        .dept-form .ant-form-item {
          margin-bottom: 16px;
        }
        
        .organization-tree .ant-tree-node-content-wrapper {
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.3s;
        }
        
        .organization-tree .ant-tree-node-content-wrapper:hover {
          background-color: #e6f7ff;
        }
        
        .organization-tree .ant-tree-node-selected {
          background-color: #bae7ff !important;
        }
        
        .top-level-row {
          background-color: #fafafa;
          font-weight: 500;
        }
      `}</style>
    </Card>
  );
};

export default DeptTree;