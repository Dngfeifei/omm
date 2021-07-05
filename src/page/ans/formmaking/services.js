import {FLowAreaList} from '@/api/design'

// 获取区域列表
function getAreaList() {
  return new Promise((resolve) => {

    FLowAreaList().then(res => {
      resolve(res.treeData[0]);
    })

  });
}

export default {
  getAreaList,
}
