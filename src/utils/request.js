/*
 * @Author: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @Date: 2025-06-25 11:25:49
 * @LastEditors: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @LastEditTime: 2025-07-01 17:46:30
 * @FilePath: /nova-admin/frontend/src/utils/request.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
import { message } from 'antd';

const request = (url, options = {}) => {
  return axios({
    url,
    method: options.method || 'GET',
    data: options.data,
    params: options.params,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      ...options.headers,
    },
  }).then(res => {
    const result = res.data;
    if (typeof result === 'object' && result !== null && 'code' in result) {
      if (result.code !== 0) {
        message.error(result.message || '操作失败');
        if (result.code === 401) {
          console.log('无效token,重定向登录页')
          localStorage.removeItem('token');
          window.location.href = '/login' ;
        }
        return Promise.resolve({ code: result.code, message: result.message, data: result.data || [] });
      }
      return { ...result, data: result.data === undefined || result.data === null ? [] : result.data };
    }
  }).catch(err => {
    message.error(err && err.message ? err.message : '请求失败');
    return { code: -1, message: err && err.message ? err.message : '请求失败', data: [] };
  });
};

export default request;