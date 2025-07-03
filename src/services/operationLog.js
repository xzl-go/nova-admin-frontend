/*
 * @Author: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @Date: 2025-07-01 10:26:13
 * @LastEditors: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @LastEditTime: 2025-07-01 14:10:27
 * @FilePath: /nova-admin/frontend/src/services/operationLog.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { API } from './api';
import request from '../utils/request';

export function fetchOperationLogs(params) {
  return request(API.OPERATION_LOG_LIST, {
    method: 'GET',
    params,
  });
} 