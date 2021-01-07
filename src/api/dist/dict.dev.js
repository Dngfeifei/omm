"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCompanys = exports.importURL = exports.exportDict = exports.getDictSelectMuti = exports.getDictSelect = exports.deleteDictData = exports.editDictData = exports.addDictData = exports.getDictDataList = exports.deleteDict = exports.editDict = exports.addDict = exports.getDictList = void 0;

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getDictList = function getDictList() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _index["default"].fetchPost("/dict/list", params);
};

exports.getDictList = getDictList;

var addDict = function addDict() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _index["default"].fetchPost("/dict/add", params);
};

exports.addDict = addDict;

var editDict = function editDict() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _index["default"].fetchPost("/dict/update", params);
};

exports.editDict = editDict;

var deleteDict = function deleteDict() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _index["default"].fetchGet("/dict/delete", params);
};

exports.deleteDict = deleteDict;

var getDictDataList = function getDictDataList() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _index["default"].fetchPost("/dictData/list", params);
};

exports.getDictDataList = getDictDataList;

var addDictData = function addDictData() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _index["default"].fetchPost("/dictData/add", params);
};

exports.addDictData = addDictData;

var editDictData = function editDictData() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _index["default"].fetchPost("/dictData/update", params);
};

exports.editDictData = editDictData;

var deleteDictData = function deleteDictData() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _index["default"].fetchGet("/dictData/delete", params);
};

exports.deleteDictData = deleteDictData;

var getDictSelect = function getDictSelect() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _index["default"].fetchGet("/dictData/getDictSelect", params);
};

exports.getDictSelect = getDictSelect;

var getDictSelectMuti = function getDictSelectMuti() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _index["default"].fetchGet("/dictData/getDictSelectMuti", params);
};

exports.getDictSelectMuti = getDictSelectMuti;

var exportDict = function exportDict() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _index["default"].fetchBlob("/dictData/exportDict", params);
};

exports.exportDict = exportDict;

var importURL = _index["default"].tools.handleURL('/dictData/importDict');

exports.importURL = importURL;

var getCompanys = function getCompanys() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _index["default"].fetchGet("/company/tree", params);
};

exports.getCompanys = getCompanys;