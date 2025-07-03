/*
 * @Author: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @Date: 2025-06-25 11:25:58
 * @LastEditors: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @LastEditTime: 2025-07-01 09:27:35
 * @FilePath: /nova-admin/frontend/src/services/user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '../utils/request';
import { API } from './api';

export function fetchUsers(params) {
  return request(API.USER_LIST, { method: 'GET', params }).then(res => res.data || []);
}

export function createUser(data) {
  return request(API.USER_CREATE, { method: 'POST', data });
}

export function updateUser(data) {
  return request(API.USER_UPDATE, { method: 'POST', data });
}

export function deleteUser(data) {
  return request(API.USER_DELETE, { method: 'POST', data });
}

export function fetchRoles(params) {
  return request(API.ROLE_LIST, { method: 'GET', params }).then(res => res.data || []);
}

export function fetchDepts(params) {
  return request(API.DEPT_LIST, { method: 'GET', params }).then(res => res.data || []);
}