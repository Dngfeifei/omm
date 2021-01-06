"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _isomorphicFetch = _interopRequireDefault(require("isomorphic-fetch"));

var _whitelist = _interopRequireDefault(require("/api/whitelist"));

var _antd = require("antd");

var _reactRouter = require("react-router");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var handleRequest = function handleRequest(url, method) {
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var json = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var has = false;

  _whitelist["default"].forEach(function (val) {
    if (val == url) has = true;
  });

  var token = localStorage.getItem('token') || '';
  var header = Object.assign({}, {
    'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded'
  }, has ? {} : {
    'Authorization': "Bearer ".concat(token)
  });
  var req = {
    method: method,
    headers: new Headers(header)
  };

  if (method == 'POST') {
    req = Object.assign({
      body: json ? JSON.stringify(body) : body,
      bodyUsed: true
    }, req);
  } // let wholeUrl = `${process.env.API_URL}${url}`


  var wholeUrl = url;

  if (process.env.NODE_ENV == 'production') {
    wholeUrl = "/xpro".concat(url);
  }

  return new Request(wholeUrl, req);
};

var handleResponse = function handleResponse(res) {
  return new Promise(function (rsl, rej) {
    // if (res.status == 200) {
    rsl(res.json()); // }
    // rej(res)
  }).then(function (res) {
    if (res.code == 700) {//hashHistory.push('/login') //开发模式下不经过改跳转
    } else if (res.code != 200) {
      _antd.message.error(res.message);
    } //


    return res;
  })["catch"](function (err) {
    _antd.message.error('请求超时');

    console.error(new Error("status: ".concat(res.status, ", statusText: ").concat(res.statusText)));
  });
};

var handleTimeout = function handleTimeout(url, type) {
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var json = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var times = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 100000;
  return Promise.race([new Promise(function (rsl, rej) {
    setTimeout(function (_) {
      rsl({
        status: 500,
        statusText: 'Timeout'
      });
    }, times);
  }), (0, _isomorphicFetch["default"])(handleRequest(url, type, body, json))]);
};

var handleParams = function handleParams(params) {
  var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var str = '';
  var timestamp = 'timestamp=' + Date.parse(new Date()).toString();

  for (var i in params) {
    if (params[i] != undefined && params[i] != null) str += "".concat(i, "=").concat(params[i], "&");
  }

  if (str.length) {
    str = "".concat(s).concat(str).concat(timestamp);
  } else {
    str = "".concat(s).concat(timestamp);
  }

  return encodeURI(str);
};

var handleURL = function handleURL(url) {
  if (process.env.NODE_ENV == 'production') {
    url = "/xpro".concat(url);
  }

  return url;
};

var _default = {
  tools: {
    handleParams: handleParams,
    handleURL: handleURL
  },
  fetchGet: function fetchGet(url) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var times = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100000;
    return handleTimeout("".concat(url).concat(handleParams(params, '?')), 'GET', null, null, times).then(handleResponse);
  },
  fetchPost: function fetchPost(url) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var json = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var times = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100000;
    return handleTimeout(url, 'POST', json ? params : handleParams(params), json, times).then(handleResponse);
  },
  fetchBlob: function fetchBlob(url) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return handleTimeout("".concat(url).concat(handleParams(params, '?')), 'GET', null, null, 900000).then(function (response) {
      if (response.status == 901) {
        _antd.message.error('没有找到对应的资料');

        return null;
      } else {
        return response.blob();
      }
    });
  },
  fetchBlobPost: function fetchBlobPost(url) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return handleTimeout(url, 'POST', params, true, 900000).then(function (response) {
      if (response.status == 901) {
        _antd.message.error('没有找到对应的资料');

        return null;
      } else {
        return response.blob();
      }
    });
  }
};
exports["default"] = _default;