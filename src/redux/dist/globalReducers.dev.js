"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GlobalReducer = void 0;

var _tools = require("/api/tools");

var _action = require("./action");

var globalDataStructure = {
  loading: false,
  panes: [],
  activeKey: '',
  menu: []
}; //redux状态管理action执行操作函数

var GlobalReducer = function GlobalReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : globalDataStructure;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _action.TOGGLE:
      return (0, _tools.Assign)(state, {
        collapsed: !state.collapsed
      });
    //设置菜单面板隐藏收缩

    case _action.START_LOADING:
      return (0, _tools.Assign)(state, {
        loading: true
      });
    //设置loading效果显示

    case _action.CLOSE_LOADING:
      return (0, _tools.Assign)(state, {
        loading: false
      });
    //接口交互成功后取消loading显示

    case _action.SET_PANE_STATE:
      return (0, _tools.Assign)(state, {
        panes: action.data
      });
    //设置选择过的tab标签集合

    case _action.SET_PANE_ACTIVEKEY:
      return (0, _tools.Assign)(state, {
        activeKey: action.data
      });
    //设置当前选择的tab标签

    case _action.GET_MENU_SUCCESS:
      return (0, _tools.Assign)(state, {
        menu: action.data
      });
    //获取导航树节点

    case _action.RESET:
      return globalDataStructure;
    //重置所有状态

    default:
      return state;
  }
};

exports.GlobalReducer = GlobalReducer;