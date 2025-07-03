import request from '../utils/request';
import { API } from './api';
// 角色列表
export function fetchRoles(params) {
  return request(API.ROLE_LIST, { method: 'GET', params }).then(res => res.data || []);
}
// 创建角色
export function createRole(data) {
  return request(API.ROLE_CREATE, { method: 'POST', data });
}
// 更新角色
export function updateRole(data) {
  return request(API.ROLE_UPDATE, { method: 'POST', data });
}
// 删除角色
export function deleteRole(data) {
  return request(API.ROLE_DELETE, { method: 'POST', data });
}
// 分配权限
export function assignPerms(data) {
  return request(API.ROLE_ASSIGN_PERMS, { method: 'POST', data });
}
// 获取角色权限
export function fetchRolePerms(params) {
  return request(API.ROLE_PERMS, { method: 'GET', params });
}