import request from '../utils/request';

// 字典类型相关
export function fetchDictTypes() {
  return request('/api/dict/type/list', { method: 'GET' }).then(res => res.data || []);
}
export function createDictType(data) {
  return request('/api/dict/type/create', { method: 'POST', data });
}
export function updateDictType(data) {
  return request('/api/dict/type/update', { method: 'POST', data });
}
export function deleteDictType(id) {
  return request('/api/dict/type/delete', { method: 'POST', params: { id } });
}

// 字典项相关
export function fetchDictItems(params) {
  return request('/api/dict/item/list', { method: 'GET', params }).then(res => res.data || []);
}
export function createDictItem(data) {
  return request('/api/dict/item/create', { method: 'POST', data });
}
export function updateDictItem(data) {
  return request('/api/dict/item/update', { method: 'POST', data });
}
export function deleteDictItem(id) {
  return request('/api/dict/item/delete', { method: 'POST', params: { id } });
} 