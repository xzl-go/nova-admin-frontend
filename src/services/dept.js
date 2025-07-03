/*
 * @Author: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @Date: 2025-06-25 11:28:30
 * @LastEditors: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @LastEditTime: 2025-07-01 09:32:18
 * @FilePath: /nova-admin/frontend/src/services/dept.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '../utils/request';
import {API} from './api'

export function fetchDepts(params) {
  return request(API.DEPT_LIST, { method: 'GET', params }).then(res => res.data || []);
}

export function createDept(data) {
  return request(API.DEPT_CREATE, { method: 'POST', data });
}

export function updateDept(data) {
  return request(API.DEPT_UPDATE, { method: 'POST', data });
}

export function deleteDept(data) {
  return request(API.DEPT_DELETE, { method: 'POST', data });
}