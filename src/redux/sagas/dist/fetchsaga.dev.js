"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee4;

var _effects = require("redux-saga/effects");

var ACTION = _interopRequireWildcard(require("../action"));

var fetch = _interopRequireWildcard(require("/api/global"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(addpane),
    _marked2 =
/*#__PURE__*/
regeneratorRuntime.mark(removepane),
    _marked3 =
/*#__PURE__*/
regeneratorRuntime.mark(getMenu),
    _marked4 =
/*#__PURE__*/
regeneratorRuntime.mark(_callee4);

//添加到tab已经点击选择标签，并设置当前显示
function addpane() {
  return regeneratorRuntime.wrap(function addpane$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _effects.takeLatest)(ACTION.ADD_PANE,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee(action) {
            var panes, has, pane, key, nextpane, _nextpane;

            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return (0, _effects.select)(function (state) {
                      return state.global.panes;
                    });

                  case 2:
                    panes = _context.sent;
                    has = false;
                    pane = {};
                    panes.forEach(function (i, k) {
                      if (i.key == action.data.key) {
                        has = true;
                        pane = i;
                        key = k;
                      }
                    });

                    if (has) {
                      _context.next = 12;
                      break;
                    }

                    nextpane = panes.concat(action.data);
                    _context.next = 10;
                    return (0, _effects.put)({
                      type: ACTION.SET_PANE_STATE,
                      data: nextpane
                    });

                  case 10:
                    _context.next = 17;
                    break;

                  case 12:
                    if (!(has && pane.url && pane.url != action.data.url)) {
                      _context.next = 17;
                      break;
                    }

                    _nextpane = panes.concat([]);
                    _nextpane[key] = action.data;
                    _context.next = 17;
                    return (0, _effects.put)({
                      type: ACTION.SET_PANE_STATE,
                      data: _nextpane
                    });

                  case 17:
                    _context.next = 19;
                    return (0, _effects.put)({
                      type: ACTION.SET_PANE_ACTIVEKEY,
                      data: action.data.key
                    });

                  case 19:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked);
} //删除tab显示面板，并设置当前应显示面板


function removepane() {
  return regeneratorRuntime.wrap(function removepane$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return (0, _effects.takeLatest)(ACTION.REMOVE_PANE,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee2(action) {
            var panes, activeKey, nextpane, index;
            return regeneratorRuntime.wrap(function _callee2$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return (0, _effects.select)(function (state) {
                      return state.global.panes;
                    });

                  case 2:
                    panes = _context3.sent;
                    _context3.next = 5;
                    return (0, _effects.select)(function (state) {
                      return state.global.activeKey;
                    });

                  case 5:
                    activeKey = _context3.sent;
                    nextpane = panes.concat([]);
                    nextpane.forEach(function (i, k) {
                      if (i.key == action.key) {
                        index = k;
                      }
                    }); //console.log(index)

                    if (!(index != undefined)) {
                      _context3.next = 15;
                      break;
                    }

                    nextpane.splice(index, 1);
                    _context3.next = 12;
                    return (0, _effects.put)({
                      type: ACTION.SET_PANE_STATE,
                      data: nextpane
                    });

                  case 12:
                    if (!(action.key == activeKey)) {
                      _context3.next = 15;
                      break;
                    }

                    _context3.next = 15;
                    return (0, _effects.put)({
                      type: ACTION.SET_PANE_ACTIVEKEY,
                      data: nextpane[index - 1] ? nextpane[index - 1].key : nextpane[0] ? nextpane[0].key : ''
                    });

                  case 15:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee2);
          }));

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  }, _marked2);
} //获取导航树


function getMenu() {
  return regeneratorRuntime.wrap(function getMenu$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return (0, _effects.takeLatest)(ACTION.GET_MENU,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee3(action) {
            var data;
            return regeneratorRuntime.wrap(function _callee3$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return (0, _effects.call)(fetch.getMenu);

                  case 2:
                    data = _context5.sent;

                    if (!data.data) {
                      _context5.next = 6;
                      break;
                    }

                    _context5.next = 6;
                    return (0, _effects.put)({
                      type: ACTION.GET_MENU_SUCCESS,
                      data: data.data
                    });

                  case 6:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee3);
          }));

        case 2:
        case "end":
          return _context6.stop();
      }
    }
  }, _marked3);
}

function _callee4() {
  return regeneratorRuntime.wrap(function _callee4$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return (0, _effects.fork)(addpane);

        case 2:
          _context7.next = 4;
          return (0, _effects.fork)(removepane);

        case 4:
          _context7.next = 6;
          return (0, _effects.fork)(getMenu);

        case 6:
        case "end":
          return _context7.stop();
      }
    }
  }, _marked4);
}