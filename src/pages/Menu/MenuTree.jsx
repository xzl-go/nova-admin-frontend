import React, { useEffect, useState } from 'react';
import { Table, Radio, Button, Modal, Form, Input, message, Popconfirm, Space, Tree } from 'antd';
import { fetchMenus, createMenu, updateMenu, deleteMenu } from '../../services/menu';

const MenuTree = () => {
  const [menus, setMenus] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [form] = Form.useForm();
  const [viewMode, setViewMode] = useState('list');

  const loadMenus = async () => {
    try {
      const res = await fetchMenus();
      setMenus(res);
    } catch (e) {
      message.error('获取菜单失败');
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  // 只保留顶层菜单节点
  const topMenus = menus.filter(item => item.type === 'menu');

  // const renderTreeTitle = (node) => (
  //   <Space>
  //     <span>
  //       {node.name}
  //       {node.type === 'api' && <span style={{ color: '#888', marginLeft: 8 }}>[API]</span>}
  //     </span>
  //     {viewMode === 'list' && (
  //       <>
  //         <Button size="small" onClick={e => {e.stopPropagation(); showModal(node);}}>编辑</Button>
  //         <Popconfirm title="确定删除该菜单吗？" onConfirm={e => {e.stopPropagation(); handleDelete(node);}}>
  //           <Button size="small" danger>删除</Button>
  //         </Popconfirm>
  //       </>
  //     )}
  //   </Space>
  // );

// 操作按钮隐藏
  const renderTreeTitle = (node) => (
    <span>{node.name}</span>
  );

  const columns = [
    { title: '菜单名', dataIndex: 'name', key: 'name', render: (text, record) => (
      <span>
        {text}
        {record.type === 'api' && <span style={{ color: '#888', marginLeft: 8 }}>[API]</span>}
      </span>
    )},
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '路径', dataIndex: 'path', key: 'path' },
    { title: '权限标识', dataIndex: 'perms', key: 'perms' },
  ];

  const renderSubTable = (children) => {
    if (!children || children.length === 0) return null;
    return (
      <Table
        dataSource={children}
        columns={columns}
        rowKey="id"
        pagination={false}
        size="small"
        showHeader={false}
        expandable={{
          expandedRowRender: (record) => renderSubTable(record.children),
          rowExpandable: record => record.children && record.children.length > 0,
        }}
      />
    );
  };

  // 其它弹窗、表单等逻辑不变...

  return (
    <div>
      <Radio.Group value={viewMode} onChange={e => setViewMode(e.target.value)} style={{ marginBottom: 16 }}>
        <Radio.Button value="tree">树状结构</Radio.Button>
        <Radio.Button value="list">列表视图</Radio.Button>
      </Radio.Group>
      {viewMode === 'tree' ? (
        // <Tree
        //   treeData={topMenus.map(node => ({ ...node, title: renderTreeTitle(node) }))}
        // />
        <Tree
          treeData={toTreeData(depts)}
          defaultExpandAll
          onSelect={(_, info) => setSelected(info.node)}
        />
      ) : (
        <Table
          dataSource={topMenus}
          columns={columns}
          rowKey="id"
          pagination={false}
          expandable={{
            expandedRowRender: (record) => renderSubTable(record.children),
            rowExpandable: record => record.children && record.children.length > 0,
          }}
        />
      )}
      {/* 其它弹窗、表单等... */}
    </div>
  );
};

export default MenuTree;