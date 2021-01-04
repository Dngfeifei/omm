"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee7;

var _effects = require("redux-saga/effects");

var _reactRouter = require("react-router");

var _antd = require("antd");

var ACTION = _interopRequireWildcard(require("../action"));

var fetch = _interopRequireWildcard(require("/api/global"));

var mgrApi = _interopRequireWildcard(require("/api/mgr"));

var _tools = require("/api/tools");

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
regeneratorRuntime.mark(getThisrole),
    _marked4 =
/*#__PURE__*/
regeneratorRuntime.mark(getMenu),
    _marked5 =
/*#__PURE__*/
regeneratorRuntime.mark(getRoleTree),
    _marked6 =
/*#__PURE__*/
regeneratorRuntime.mark(getTodoCount),
    _marked7 =
/*#__PURE__*/
regeneratorRuntime.mark(_callee7);

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
}

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
} //获得当前用户的角色集合


function getThisrole() {
  return regeneratorRuntime.wrap(function getThisrole$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return (0, _effects.takeLatest)(ACTION.GET_THISROLE,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee3(action) {
            var data, datas;
            return regeneratorRuntime.wrap(function _callee3$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return (0, _effects.call)(fetch.getThisrole);

                  case 2:
                    data = _context5.sent;

                    if (!data.data) {
                      _context5.next = 7;
                      break;
                    }

                    datas = data.data.roles;
                    _context5.next = 7;
                    return (0, _effects.put)({
                      type: ACTION.GET_THISROLE_SUCCESS,
                      data: datas
                    });

                  case 7:
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

function getMenu() {
  return regeneratorRuntime.wrap(function getMenu$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return (0, _effects.takeLatest)(ACTION.GET_MENU,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee4(action) {
            var data;
            return regeneratorRuntime.wrap(function _callee4$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return (0, _effects.call)(fetch.getMenu);

                  case 2:
                    data = _context7.sent;

                    if (!data.data) {
                      _context7.next = 6;
                      break;
                    }

                    _context7.next = 6;
                    return (0, _effects.put)({
                      type: ACTION.GET_MENU_SUCCESS,
                      data: data.data
                    });

                  case 6:
                  case "end":
                    return _context7.stop();
                }
              }
            }, _callee4);
          }));

        case 2:
        case "end":
          return _context8.stop();
      }
    }
  }, _marked4);
}

function getRoleTree() {
  return regeneratorRuntime.wrap(function getRoleTree$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return (0, _effects.takeLatest)(ACTION.GET_ROLE_TREE,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee5(action) {
            var data, list;
            return regeneratorRuntime.wrap(function _callee5$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return (0, _effects.call)(mgrApi.getRoleTree);

                  case 2:
                    data = _context9.sent;

                    if (!data.data) {
                      _context9.next = 7;
                      break;
                    }

                    list = (0, _tools.handleTreeData)(data.data, 'name', 'id', 'childList');
                    _context9.next = 7;
                    return (0, _effects.put)({
                      type: ACTION.GET_ROLE_TREE_COMPLETE,
                      data: list
                    });

                  case 7:
                  case "end":
                    return _context9.stop();
                }
              }
            }, _callee5);
          }));

        case 2:
        case "end":
          return _context10.stop();
      }
    }
  }, _marked5);
}

function getTodoCount() {
  return regeneratorRuntime.wrap(function getTodoCount$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return (0, _effects.takeLatest)(ACTION.GET_TODOCOUNT,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee6(action) {
            var data;
            return regeneratorRuntime.wrap(function _callee6$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    _context11.next = 2;
                    return (0, _effects.call)(fetch.getTodoCount);

                  case 2:
                    data = _context11.sent;

                    if (!data.data) {
                      _context11.next = 6;
                      break;
                    }

                    _context11.next = 6;
                    return (0, _effects.put)({
                      type: ACTION.GET_TODOCOUNT_SUCCESS,
                      data: data.data
                    });

                  case 6:
                  case "end":
                    return _context11.stop();
                }
              }
            }, _callee6);
          }));

        case 2:
        case "end":
          return _context12.stop();
      }
    }
  }, _marked6);
}

function _callee7() {
  return regeneratorRuntime.wrap(function _callee7$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return (0, _effects.fork)(addpane);

        case 2:
          _context13.next = 4;
          return (0, _effects.fork)(removepane);

        case 4:
          _context13.next = 6;
          return (0, _effects.fork)(getMenu);

        case 6:
          _context13.next = 8;
          return (0, _effects.fork)(getRoleTree);

        case 8:
          _context13.next = 10;
          return (0, _effects.fork)(getThisrole);

        case 10:
          _context13.next = 12;
          return (0, _effects.fork)(getTodoCount);

        case 12:
        case "end":
          return _context13.stop();
      }
    }
  }, _marked7);
}