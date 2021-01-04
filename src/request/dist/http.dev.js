"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.post = post;
exports.delet = delet;

var _axios = _interopRequireDefault(require("axios"));

var _qs = _interopRequireDefault(require("qs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 引入Axios
// 引入qs模块，用来序列化post类型的数据
// import {
//   getSession,
//   getCookie
// } from '../utils/utils';
// 设置请求超时时间
_axios["default"].defaults.timeout = 20000; // 设置post请求头

_axios["default"].defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'; //设置默认cookie携带

_axios["default"].defaults.withCredentials = true; // 判断开发环境（一般用于本地代理）

if (process.env.NODE_ENV === 'development') {
  // 开发环境
  _axios["default"].defaults.baseURL = '/dataApi';
}
/**
 * 设置请求拦截器
 */


_axios["default"].interceptors.request.use(function (config) {
  if (config.method === 'get') {
    //如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
    config.paramsSerializer = function (params) {
      return _qs["default"].stringify(params, {
        arrayFormat: 'repeat'
      });
    };
  }

  return config;
}, function (error) {
  return Promise.error(error);
});
/**
 * 响应拦截器
 */


_axios["default"].interceptors.response.use(function (response) {
  // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据；否则的话抛出错误
  if (response.status === 200) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(response);
  }
}, // 服务器状态码不是2开头的的情况
// 这里可以跟你们的后台开发人员协商好统一的错误状态码    
// 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
// 下面列举几个常见的操作，其他需求可自行扩展
function (err) {
  //http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误';
        break;

      case 401:
        err.message = '未授权，请登录'; // 这里写清除token的代码

        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          } //登录成功后跳入浏览的当前页面

        });
        break;

      case 403:
        err.message = '拒绝访问';
        break;

      case 404:
        err.message = "\u8BF7\u6C42\u5730\u5740\u51FA\u9519";
        break;

      case 408:
        err.message = '请求超时';
        break;

      case 500:
        err.message = '服务器内部错误';
        break;

      case 501:
        err.message = '服务未实现';
        break;

      case 502:
        err.message = '网关错误';
        break;

      case 503:
        err.message = '服务不可用';
        break;

      case 504:
        err.message = '网关超时';
        break;

      case 505:
        err.message = 'HTTP版本不受支持';
        break;

      default:
    }
  } // 返回接口返回的错误信息


  return Promise.reject(err);
});
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */


function get(url) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Promise(function (resolve, reject) {
    _axios["default"].get(url, {
      params: params
    }).then(function (response) {
      resolve(response.data);
    })["catch"](function (err) {
      reject(err);
    });
  });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */


function post(url) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  //  问题：axios post请求后端接收不到参数问题：

  /**解决方案一：有效，但是兼容性不是很好，不是所有浏览器都支持
   *  let data = new URLSearchParams()
   *  for (var key in params) {
   *     data.append(key, params[key])
   *  }
   */
  // transformRequest = function (data) {
  //   data = JSON.stringify(data)
  //   return data
  // }
  return new Promise(function (resolve, reject) {
    /**
     * 解决方案二：使用qs模块(axios中自带),使用qs.stringify()序列化params
     */
    _axios["default"].post(url, params).then(function (response) {
      resolve(response.data);
    })["catch"](function (err) {
      reject(err);
    });
  });
}
/**
 * delete方法，对应delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */


function delet(url) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Promise(function (resolve, reject) {
    _axios["default"]["delete"](url, {
      params: params
    }).then(function (response) {
      resolve(response.data);
    })["catch"](function (err) {
      reject(err);
    });
  });
}