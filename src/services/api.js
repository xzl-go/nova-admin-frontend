/*
 * @Author: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @Date: 2025-07-01 09:20:50
 * @LastEditors: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @LastEditTime: 2025-07-01 15:34:30
 * @FilePath: /nova-admin/frontend/src/services/api.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koroFileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const API_BASE = '/api';

function decode(str) {
  return atob(str);
}

export const API = {
  LOGIN: `${API_BASE}/login`, // 登录
  INIT_SYSTEM: `${API_BASE}/init`, // 系统初始化
  USER_LIST: `${API_BASE}/user/list`, // 用户列表
  USER_CREATE: `${API_BASE}/user/create`, // 创建用户
  USER_UPDATE: `${API_BASE}/user/update`, // 编辑用户
  USER_DELETE: `${API_BASE}/user/delete`, // 删除用户

  ROLE_LIST: `${API_BASE}/role/list`, // 角色列表
  ROLE_CREATE: `${API_BASE}/role/create`, // 创建角色
  ROLE_UPDATE: `${API_BASE}/role/update`, // 更新角色
  ROLE_DELETE: `${API_BASE}/role/delete`, // 删除角色
  ROLE_ASSIGN_PERMS: `${API_BASE}/role/assign-perms`, // 分配角色权限
  ROLE_PERMS: `${API_BASE}/role/perms`, // 获取角色权限

  DEPT_LIST: `${API_BASE}/dept/list`, // 组织列表
  DEPT_CREATE: `${API_BASE}/dept/create`, // 创建组织
  DEPT_UPDATE: `${API_BASE}/dept/update`, // 更新组织
  DEPT_DELETE: `${API_BASE}/dept/delete`, // 删除组织
  
  MENU_LIST: `${API_BASE}/menu/list`, // 菜单列表
  MENU_CREATE: `${API_BASE}/menu/create`, // 创建菜单
  MENU_UPDATE: `${API_BASE}/menu/update`, // 更新菜单
  MENU_DELETE: `${API_BASE}/menu/delete`, // 删除菜单
  PERM_BUTTON: `${API_BASE}/perm/button`, // 按钮权限
  OPERATION_LOG_LIST: decode('L2FwaS9vcGVyYXRpb24tbG9nL2xpc3Q=') // '/api/operation-log/list'
};

