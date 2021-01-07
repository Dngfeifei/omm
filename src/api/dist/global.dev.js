"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMenu = void 0;

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//获取导航节点
var getMenu = function getMenu() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  params = Object.assign({
    sysid: 1
  }, params); //模拟接口，后续开发谨记替换

  return _index["default"].fetchGet('/static/mock/getMenu_copy.json', params); //return http.fetchGet('/sysResources/tree', params)
};

exports.getMenu = getMenu;