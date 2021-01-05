"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redux = require("redux");

var _reduxLogger = _interopRequireDefault(require("redux-logger"));

var _reduxSaga = _interopRequireDefault(require("redux-saga"));

var _sagas = _interopRequireDefault(require("./sagas"));

var _globalReducers = require("./globalReducers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var sagaMiddleware = (0, _reduxSaga["default"])(); //创建action操作库reducer

var reducer = (0, _redux.combineReducers)({
  global: _globalReducers.GlobalReducer
}); //创建数据仓库store

var store = (0, _redux.createStore)(reducer, (0, _redux.applyMiddleware)(sagaMiddleware));

if (process.env.NODE_ENV == 'development') {
  store = (0, _redux.createStore)(reducer, (0, _redux.applyMiddleware)(_reduxLogger["default"], sagaMiddleware));
} //启动saga


_sagas["default"].map(function (val) {
  sagaMiddleware.run(val);
});

var _default = store;
exports["default"] = _default;