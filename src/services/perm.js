import request from '../utils/request';
import { API } from './api';


export function fetchPerms() {
  return request(API.PERM_BUTTON, { method: 'GET' });
} 