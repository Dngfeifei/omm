import http from './index';

const REMOTE_URL = 'http://152.136.121.201:8080/jeeplus-vue';

export const getMenuTreeData = (params = {}) =>
  http.fetchGet(REMOTE_URL + `/sys/menu/treeData`, params);
