import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  message, 
  Space, 
  Popconfirm, 
  Tag, 
  Select, 
  Tooltip,
  Card,
  Row,
  Col,
  Typography,
  InputNumber
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { fetchDictTypes, createDictType, updateDictType, deleteDictType, fetchDictItems } from '../../services/dict';

const { Title } = Typography;

const DictTypeList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [statusOptions, setStatusOptions] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredList, setFilteredList] = useState([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchDictTypes();
      setList(res);
      setFilteredList(res);
    } catch {
      setList([]);
      setFilteredList([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    fetchDictItems({ dictType: 'status' }).then(setStatusOptions);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);
    
    if (!value) {
      setFilteredList(list);
      return;
    }
    
    const filtered = list.filter(item => 
      item.dictType.toLowerCase().includes(value) || 
      item.dictName.toLowerCase().includes(value) ||
      (item.remark && item.remark.toLowerCase().includes(value))
    );
    
    setFilteredList(filtered);
  };

  const showModal = (record = null) => {
    setEditing(record);
    setModalVisible(true);
  };

  useEffect(() => {
    if (modalVisible) {
      if (editing) {
        form.setFieldsValue({
          ...editing,
          status: editing.status,
          dictType: editing.dictType || '',
          dictName: editing.dictName || '',
          remark: editing.remark || ''
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: 1,
          dictType: '',
          dictName: '',
          remark: ''
        });
      }
    }
  }, [modalVisible, editing, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      if (editing) {
        await updateDictType({ ...editing, ...values });
        message.success('字典类型更新成功');
      } else {
        await createDictType(values);
        message.success('字典类型创建成功');
      }
      
      setModalVisible(false);
      loadData();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await deleteDictType(record.id);
      message.success('字典类型删除成功');
      loadData();
    } catch (error) {
      message.error('删除失败');
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadData();
    setSearchValue('');
  };

  return (
    <div className="dict-type-container">
      <Card 
        title={<Title level={4} style={{ margin: 0 }}>字典类型管理</Title>}
        bordered={false}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
          >
            新增字典类型
          </Button>
        }
      >
        <Row gutter={[16, 16]} className="toolbar">
          <Col span={24} md={16}>
            <Input
              placeholder="搜索类型标识、名称或备注"
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={handleSearch}
              allowClear
              style={{ maxWidth: 400 }}
            />
          </Col>
          
          <Col span={24} md={8} style={{ textAlign: 'right' }}>
            <Button 
              icon={<SyncOutlined />} 
              onClick={refreshData}
              loading={loading}
            >
              刷新数据
            </Button>
          </Col>
        </Row>

        <Table
          className="dict-table"
          rowKey="id"
          dataSource={filteredList}
          loading={loading}
          columns={[
            { 
              title: '类型标识', 
              dataIndex: 'dictType', 
              align: 'center',
              render: (text) => <Tag color="blue">{text}</Tag>
            },
            { 
              title: '类型名称', 
              dataIndex: 'dictName', 
              align: 'center',
              render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
            },
            { 
              title: '状态', 
              dataIndex: 'status', 
              align: 'center', 
              render: v => {
                const opt = statusOptions.find(opt => Number(opt.dictValue) === v);
                return opt ? (
                  <Tag color={v === 1 ? 'green' : 'red'} icon={v === 1 ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
                    {opt.dictLabel}
                  </Tag>
                ) : v;
              } 
            },
            { 
              title: '备注', 
              dataIndex: 'remark', 
              align: 'center',
              render: (text) => text || <span style={{ color: '#bfbfbf' }}>无备注</span>
            },
            { 
              title: '创建时间', 
              dataIndex: 'createdAt', 
              align: 'center',
              render: (text) => <span style={{ color: '#8c8c8c' }}>{text}</span>
            },
            {
              title: '操作',
              align: 'center',
              fixed: 'right',
              width: 150,
              render: (_, record) => {
                const isSystem = record.remark && record.remark.includes('系统内置');
                return (
                  <Space>
                    <Tooltip title={isSystem ? '系统内置，禁止编辑' : '编辑'}>
                      <Button 
                        type="primary" 
                        size="small" 
                        icon={<EditOutlined />} 
                        onClick={() => showModal(record)} 
                        disabled={isSystem}
                      />
                    </Tooltip>
                    <Tooltip title={isSystem ? '系统内置，禁止删除' : '删除'}>
                      <Popconfirm 
                        title="确定删除该字典类型吗？" 
                        description="删除后将无法恢复"
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
          ]}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: false,
            showTotal: total => `共 ${total} 项`
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title={
          <div className="modal-header">
            {editing ? (
              <>
                <EditOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                <span>编辑字典类型</span>
              </>
            ) : (
              <>
                <PlusOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                <span>新增字典类型</span>
              </>
            )}
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleOk}
        confirmLoading={loading}
        destroyOnClose
        width={600}
      >
        <Form 
          form={form} 
          layout="vertical"
          className="dict-form"
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="dictType" 
                label="类型标识" 
                rules={[{ required: true, message: '请输入类型标识' }]}
              >
                <Input 
                  placeholder="如：status, gender" 
                  disabled={!!editing}
                />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item 
                name="dictName" 
                label="类型名称" 
                rules={[{ required: true, message: '请输入类型名称' }]}
              >
                <Input placeholder="如：状态, 性别" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
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
            </Col>
            
            <Col span={12}>
              <Form.Item 
                name="sort" 
                label="排序" 
                initialValue={0}
              >
                <InputNumber 
                  min={0} 
                  max={999} 
                  style={{ width: '100%' }} 
                  placeholder="排序值"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item name="remark" label="备注">
            <Input.TextArea placeholder="请输入备注信息" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
      
      <style jsx global>{`
        .dict-type-container {
          padding: 20px;
          background: #f0f2f5;
          min-height: 100vh;
        }
        
        .ant-card {
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        
        .toolbar {
          margin-bottom: 20px;
        }
        
        .dict-table .ant-table-thead > tr > th {
          background-color: #fafafa;
          font-weight: 600;
        }
        
        .dict-table .ant-table-tbody > tr:hover > td {
          background-color: #f9f9f9 !important;
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 16px;
        }
        
        .dict-form .ant-form-item {
          margin-bottom: 16px;
        }
        
        .dict-form .ant-form-item-label > label {
          font-weight: 500;
        }
        
        .dict-table .ant-tag {
          border-radius: 12px;
          padding: 0 10px;
          font-size: 13px;
        }
        
        .action-buttons {
          display: flex;
          justify-content: flex-end;
          margin-top: 24px;
          gap: 8px;
        }
        
        @media (max-width: 768px) {
          .toolbar .ant-col {
            margin-bottom: 12px;
          }
          
          .ant-card-extra {
            margin-top: 16px;
            width: 100%;
            text-align: left;
          }
          
          .dict-table .ant-table-cell {
            padding: 12px 8px !important;
          }
          
          .dict-form .ant-row > .ant-col {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DictTypeList;