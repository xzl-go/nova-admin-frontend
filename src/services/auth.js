/*
 * @Author: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @Date: 2025-06-25 13:13:45
 * @LastEditors: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @LastEditTime: 2025-07-02 09:36:28
 * @FilePath: /nova-admin/frontend/src/services/auth.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '../utils/request';
import { API } from './api';

export const login = (data) => {
  return request(API.LOGIN, {
    method: 'post',
    data
  });
};

export const initSystem = (data) => {
  return request(API.INIT_SYSTEM, {
    method: 'post',
    data
  });
};

export const fetchLoginStats = () => {
  return request('/api/stat/login', { method: 'GET' }).then(res => res.data || { count: 0 });
};

export const logout = () => {
  return request('/api/logout', { method: 'POST' });
};

export const fetchUserStats = () => {
  return request('/api/stat/user', { method: 'GET' }).then(res => res.data || { count: 0 });
};

export const fetchRoleStats = () => {
  return request('/api/stat/role', { method: 'GET' }).then(res => res.data || { count: 0 });
};

export const fetchDeptStats = () => {
  return request('/api/stat/dept', { method: 'GET' }).then(res => res.data || { count: 0 });
};

export const fetchOnlineUserStats = () => {
  return request('/api/stat/online-user', { method: 'GET' }).then(res => res.data || { count: 0 });
};