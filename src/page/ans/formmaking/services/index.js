/*
 * 调用后端接口
 */
import {
  FLowQueryByUserId, FLowDepartList, FLowUserList,FLowQueryByDepartId
} from '@/api/design'


let services = {
    // 获取用户列表
    async getUserList(param){
        let res  = await FLowUserList(param)
        return {list: res.page.list, count: res.page.count}
    },
    // 根据用户id获取用户信息
    async getUserInfoById(param) {
        let res  = await FLowQueryByUserId(param)
        return res.user;
    },
    // 获取部门列表
    async getDepartList(param) {
        let res  = await FLowDepartList(param)
        return res.treeData[0];
    },
    // 根据id获取部门信息
    async getDepartInfoById(param) {
        let res  = await FLowQueryByDepartId(param)
        return res.office;
    }
};

module.exports  = {
    ...services
}
