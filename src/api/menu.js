import http from './index';

const REMOTE_URL = '';

export const getMenuTreeData = (params = {}) =>
  http.fetchGet(REMOTE_URL + `/sys/menu/treeData`, params);
