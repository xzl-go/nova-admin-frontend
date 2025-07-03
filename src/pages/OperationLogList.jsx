/*
 * @Author: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @Date: 2025-07-01 10:25:12
 * @LastEditors: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @LastEditTime: 2025-07-02 15:54:41
 * @FilePath: /nova-admin/frontend/src/pages/OperationLogList.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Tag, Tooltip, Select } from 'antd';
import { fetchOperationLogs } from '../services/operationLog';

const { Option } = Select;

const OperationLogList = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  const [searchAction, setSearchAction] = useState('');
  const [searchMethod, setSearchMethod] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadLogs({ page, pageSize });
    // eslint-disable-next-line
  }, [page, pageSize]);

  const loadLogs = async (params = {}) => {
    setLoading(true);
    try {
      const res = await fetchOperationLogs({
        username: searchUser,
        action: searchAction,
        method: searchMethod,
        result: searchResult,
        page,
        pageSize,
        ...params,
      });
      setLogs(res.data || []);
      setTotal(res.total || 0);
    } catch (e) {
      setLogs([]);
      setTotal(0);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    setPage(1);
    loadLogs({ page: 1, pageSize });
  };

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns = [
    { title: '操作人', dataIndex: 'username', key: 'username', width: 100 },
    { title: 'IP', dataIndex: 'ip', key: 'ip', width: 120 },
    { title: '时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
    { title: '方法', dataIndex: 'method', key: 'method', width: 80,
      render: (text) => <Tag color={text === 'GET' ? 'blue' : text === 'POST' ? 'green' : 'orange'}>{text}</Tag>
    },
    { title: '路径', dataIndex: 'path', key: 'path', width: 200,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>
    },
    { title: '动作', dataIndex: 'action', key: 'action', width: 120 },
    { title: '参数', dataIndex: 'params', key: 'params', width: 200,
      render: (text) => <Tooltip title={text}>{text && text.length > 30 ? text.slice(0, 30) + '...' : text}</Tooltip>
    },
    { title: '结果', dataIndex: 'result', key: 'result', width: 80,
      render: (text) => <Tag color={text === '成功' ? 'green' : 'red'}>{text}</Tag>
    },
    { title: '消息', dataIndex: 'message', key: 'message', width: 200,
      render: (text) => <Tooltip title={text}>{text && text.length > 30 ? text.slice(0, 30) + '...' : text}</Tooltip>
    },
  ];

  return (
    <div>
      {/* <h2 style={{marginBottom: 16}}>操作日志</h2> */}
      <Space style={{marginBottom: 16}}>
        <Input
          placeholder="操作人"
          value={searchUser}
          onChange={e => setSearchUser(e.target.value)}
          allowClear
        />
        <Input
          placeholder="动作"
          value={searchAction}
          onChange={e => setSearchAction(e.target.value)}
          allowClear
        />
        <Select
          placeholder="方法"
          value={searchMethod || undefined}
          onChange={setSearchMethod}
          allowClear
          style={{ width: 100 }}
        >
          <Option value="POST">POST</Option>
          <Option value="GET">GET</Option>
          <Option value="PUT">PUT</Option>
          <Option value="DELETE">DELETE</Option>
        </Select>
        <Select
          placeholder="结果"
          value={searchResult || undefined}
          onChange={setSearchResult}
          allowClear
          style={{ width: 100 }}
        >
          <Option value="成功">成功</Option>
          <Option value="失败">失败</Option>
        </Select>
        <Button type="primary" onClick={handleSearch}>查询</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={logs}
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => `共${total}条`,
          locale: { items_per_page: '条/页' },
        }}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
        bordered
      />
    </div>
  );
};

export default OperationLogList; 


