// 引入Axios
import axios from 'axios';
// 引入qs模块，用来序列化post类型的数据
import qs from 'qs';

// import {
//   getSession,
//   getCookie
// } from '../utils/utils';


// 设置请求超时时间
axios.defaults.timeout = 20000
// 设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
//设置默认cookie携带
axios.defaults.withCredentials = true

// 判断开发环境（一般用于本地代理）
if (process.env.NODE_ENV === 'development') { // 开发环境
  axios.defaults.baseURL = '/dataApi';

}
 
/**
 * 设置请求拦截器
 */
axios.interceptors.request.use(
  config => {
    if (config.method === 'get') {
      //如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
      config.paramsSerializer = function (params) {
        return qs.stringify(params, {
          arrayFormat: 'repeat'
        })
      }
    }
    return config;
  },
  error => {
    return Promise.error(error);
  }
)

/**
 * 响应拦截器
 */
axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据；否则的话抛出错误
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是2开头的的情况
  // 这里可以跟你们的后台开发人员协商好统一的错误状态码    
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  // 下面列举几个常见的操作，其他需求可自行扩展
  err => {
    //http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误'
          break
        case 401:
          err.message = '未授权，请登录'
          // 这里写清除token的代码
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            } //登录成功后跳入浏览的当前页面
          })
          break
        case 403:
          err.message = '拒绝访问'
          break
        case 404:
          err.message = `请求地址出错`
          break
        case 408:
          err.message = '请求超时'
          break
        case 500:
          err.message = '服务器内部错误'
          break
        case 501:
          err.message = '服务未实现'
          break
        case 502:
          err.message = '网关错误'
          break
        case 503:
          err.message = '服务不可用'
          break
        case 504:
          err.message = '网关超时'
          break
        case 505:
          err.message = 'HTTP版本不受支持'
          break
        default:
      }
    }
    // 返回接口返回的错误信息
    return Promise.reject(err);
  }
)


/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(response => {
      resolve(response.data);
    }).catch(err => {
      reject(err)
    })
  })
}


/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params = {}) {
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
  return new Promise((resolve, reject) => {
    /**
     * 解决方案二：使用qs模块(axios中自带),使用qs.stringify()序列化params
     */
    axios.post(url, params).then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
  })
}


/**
 * delete方法，对应delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function delet(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, {
      params: params
    }).then(response => {
      resolve(response.data);
    }).catch(err => {
      reject(err)
    })
  })
}
