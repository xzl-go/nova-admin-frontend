import React, { useEffect, useState } from 'react';
import { Modal, Tree, Spin, message } from 'antd';
import { fetchMenus } from '../../services/menu';
import { assignPerms, fetchRolePerms } from '../../services/role';

function toTreeData(list) {
  return (Array.isArray(list) ? list : []).map(item => ({
    key: item.id,
    title: item.name,
    path: item.path,
    method: item.method,
    perms: item.perms,
    children: toTreeData(item.children)
  }));
}

const flatten = (arr) => (Array.isArray(arr) ? arr : []).forEach(item => {
  flatMenus.push(item);
  if (Array.isArray(item.children) && item.children.length > 0) flatten(item.children);
});

const AssignPermsModal = ({ visible, onCancel, role, onOk }) => {
  const [loading, setLoading] = useState(false);
  const [menuTree, setMenuTree] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);

  useEffect(() => {
    if (visible && role) {
      setLoading(true);
      Promise.all([
        fetchMenus(),
        fetchRolePerms({ role_serial: role.serial, dept_serial: role.dom })
      ]).then(([menus, perms]) => {
        setMenuTree(toTreeData(menus));
        const safePerms = Array.isArray(perms) ? perms : [];
        // perms: [{path, method, perm}]，需找到对应菜单id
        const checked = [];
        menus.forEach(menu => {
          safePerms.forEach(p => {
            if (
              menu.path === p.path &&
              (!menu.method || menu.method === p.method) &&
              (!menu.perms || menu.perms === p.perm)
            ) {
              checked.push(menu.id);
            }
          });
        });
        setCheckedKeys(checked);
      }).finally(() => setLoading(false));
    }
  }, [visible, role]);
  const handleOk = async () => {
    setLoading(true);
    // 组装 perms 数组，只收集叶子节点（没有children的节点）
    const flatMenus = [];
    const flatten = (arr) => arr.forEach(item => {
      if (item.children && item.children.length > 0) {
        flatten(item.children);
      } else {
        flatMenus.push(item);
      }
    });
    flatten(menuTree);
    console.log('flatMenus', flatMenus);
    console.log('checkedKeys', checkedKeys);
    const perms = flatMenus
      .filter(m => checkedKeys.includes(m.key))
      .map(m => ({
        path: m.path,
        method: m.method || 'GET',
        perm: m.perms || ''
      }));
    console.log('perms', perms);
    const req = {
      role_serial: role.serial,
      dept_serial: role.dom,
      perms,
    }
    await assignPerms(req);
    message.success('分配成功');
    setLoading(false);
    onOk && onOk();
  };
 

  // 辅助函数：递归获取所有叶子节点id
  const getAllLeafIds = (nodes) => {
    let ids = [];
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        ids = ids.concat(getAllLeafIds(node.children));
      } else {
        ids.push(node.key);
      }
    });
    return ids;
  };

  // Tree onCheck事件，确保勾选菜单时自动勾选所有子接口
  const handleCheck = (checkedKeysValue, e) => {
    let newChecked = Array.isArray(checkedKeysValue) ? checkedKeysValue : checkedKeysValue.checked;
    // 如果当前勾选的是父节点，自动勾选其所有叶子节点
    if (e && e.node && e.node.children && e.node.children.length > 0 && e.checked) {
      const leafIds = getAllLeafIds(e.node.children);
      newChecked = Array.from(new Set([...newChecked, ...leafIds]));
    }
    setCheckedKeys(newChecked);
  };

  return (
    <Modal
      title={`分配权限 - ${role?.name || ''}`}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      width={600}
    >
      <Spin spinning={loading}>
        <Tree
          checkable
          treeData={menuTree}
          checkedKeys={checkedKeys}
          onCheck={handleCheck}
          defaultExpandAll
        />
      </Spin>
    </Modal>
  );
};

export default AssignPermsModal; 