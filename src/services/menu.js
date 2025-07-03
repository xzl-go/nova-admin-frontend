/*
 * @Author: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @Date: 2025-06-25 11:28:52
 * @LastEditors: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @LastEditTime: 2025-07-01 16:31:54
 * @FilePath: /nova-admin/frontend/src/services/menu.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '../utils/request';
import { API } from './api';

export function fetchMenus(params) {
  return request(API.MENU_LIST, { method: 'GET', params }).then(res => Array.isArray(res.data) ? res.data : []);
}

export function createMenu(data) {
  return request(API.MENU_CREATE, { method: 'POST', data });
}

export function updateMenu(data) {
  return request(API.MENU_UPDATE, { method: 'POST', data });
}

export function deleteMenu(data) {
  return request(API.MENU_DELETE, { method: 'POST', data });
}