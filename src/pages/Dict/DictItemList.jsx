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
  InputNumber, 
  Tooltip,
  Card,
  Row,
  Col,
  Typography
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
import { fetchDictItems, createDictItem, updateDictItem, deleteDictItem, fetchDictTypes } from '../../services/dict';

const { Title, Text } = Typography;

const DictItemList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [dictTypes, setDictTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [statusOptions, setStatusOptions] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredList, setFilteredList] = useState([]);

  const loadTypes = async () => {
    try {
      const res = await fetchDictTypes();
      setDictTypes(res);
    } catch (error) {
      message.error('加载字典类型失败');
    }
  };

  const loadData = async (dictType) => {
    setLoading(true);
    try {
      const res = await fetchDictItems(dictType ? { dictType } : {});
      setList(res);
      setFilteredList(res);
    } catch {
      setList([]);
      setFilteredList([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTypes();
    loadData();
    fetchDictItems({ dictType: 'status' }).then(setStatusOptions);
  }, []);

  const handleTypeChange = (value) => {
    setSelectedType(value);
    loadData(value);
    setSearchValue('');
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
          dictType: editing.dictType || selectedType || '',
          dictLabel: editing.dictLabel || '',
          dictValue: editing.dictValue || '',
          sort: typeof editing.sort === 'number' ? editing.sort : 0,
          remark: editing.remark || '',
          status: editing.status
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: 1,
          dictType: selectedType || '',
          dictLabel: '',
          dictValue: '',
          sort: 0,
          remark: ''
        });
      }
    }
  }, [modalVisible, editing, form, selectedType]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);
    
    if (!value) {
      setFilteredList(list);
      return;
    }
    
    const filtered = list.filter(item => 
      item.dictLabel.toLowerCase().includes(value) || 
      item.dictValue.toLowerCase().includes(value) ||
      (item.remark && item.remark.toLowerCase().includes(value))
    );
    
    setFilteredList(filtered);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      if (editing) {
        await updateDictItem({ ...editing, ...values });
        message.success('字典项更新成功');
      } else {
        await createDictItem(values);
        message.success('字典项创建成功');
      }
      
      setModalVisible(false);
      loadData(selectedType);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await deleteDictItem(record.id);
      message.success('字典项删除成功');
      loadData(selectedType);
    } catch (error) {
      message.error('删除失败');
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadData(selectedType);
    setSearchValue('');
  };

  return (
    <div className="dict-item-container">
      <Card 
        title={<Title level={4} style={{ margin: 0 }}>字典项管理</Title>}
        variant="outlined"
        style={{ borderRadius: 8, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)' }}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
          >
            新增字典项
          </Button>
        }
      >
        <Row gutter={[16, 16]} className="toolbar">
          <Col span={24} md={8}>
            <Select
              placeholder="请选择字典类型"
              style={{ width: '100%' }}
              value={selectedType || undefined}
              onChange={handleTypeChange}
              allowClear
              suffixIcon={<SearchOutlined />}
            >
              {dictTypes.map(type => (
                <Select.Option key={type.dictType} value={type.dictType}>
                  {type.dictName} ({type.dictType})
                </Select.Option>
              ))}
            </Select>
          </Col>
          
          <Col span={24} md={8}>
            <Input
              placeholder="搜索字典项名称、值或备注"
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={handleSearch}
              allowClear
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
              title: '字典类型', 
              dataIndex: 'dictType', 
              align: 'center',
              render: (text) => <Tag color="blue">{text}</Tag>
            },
            { 
              title: '项名称', 
              dataIndex: 'dictLabel', 
              align: 'center',
              render: (text) => <Text strong>{text}</Text>
            },
            { 
              title: '项值', 
              dataIndex: 'dictValue', 
              align: 'center',
              render: (text) => <Tag color="geekblue">{text}</Tag>
            },
            { 
              title: '排序', 
              dataIndex: 'sort', 
              align: 'center',
              render: (text) => <Text type="secondary">{text}</Text>
            },
            { 
              title: '状态', 
              dataIndex: 'status', 
              align: 'center', 
              render: v => {
                const opt = statusOptions.find(opt => Number(opt.dictValue) === v);
                return opt ? (
                  <Tag 
                    color={v === 1 ? 'green' : 'red'} 
                    icon={v === 1 ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                  >
                    {opt.dictLabel}
                  </Tag>
                ) : v;
              } 
            },
            { 
              title: '备注', 
              dataIndex: 'remark', 
              align: 'center',
              render: (text) => text || <Text type="secondary">-</Text>
            },
            { 
              title: '创建时间', 
              dataIndex: 'createdAt', 
              align: 'center',
              render: (text) => <Text type="secondary">{text}</Text>
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
                        title="确定删除该字典项吗？" 
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
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={
          <div className="modal-header">
            {editing ? (
              <>
                <EditOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                <span>编辑字典项</span>
              </>
            ) : (
              <>
                <PlusOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                <span>新增字典项</span>
              </>
            )}
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleOk}
        confirmLoading={loading}
        destroyOnHidden
        width={600}
      >
        <Form 
          form={form} 
          layout="vertical"
          className="dict-form"
          autoComplete="off"
        >
          <Form.Item 
            name="dictType" 
            label="字典类型" 
            rules={[{ required: true, message: '请选择字典类型' }]}
          >
            <Select 
              placeholder="请选择字典类型"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {dictTypes.map(type => (
                <Select.Option key={type.dictType} value={type.dictType}>
                  {type.dictName} ({type.dictType})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="dictLabel" 
                label="项名称" 
                rules={[{ required: true, message: '请输入项名称' }]}
              >
                <Input placeholder="如：启用" />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item 
                name="dictValue" 
                label="项值" 
                rules={[{ required: true, message: '请输入项值' }]}
              >
                <Input placeholder="如：1" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
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
                />
              </Form.Item>
            </Col>
            
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
          </Row>
          
          <Form.Item name="remark" label="备注">
            <Input.TextArea placeholder="请输入备注信息" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
      
      <style jsx global>{`
        .dict-item-container {
          padding: 20px;
          background: #f0f2f5;
          min-height: 100vh;
        }
        
        .ant-card {
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
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
        }
      `}</style>
    </div>
  );
};

export default DictItemList;