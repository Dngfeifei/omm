/***
 *  工具类
 * @auth yyp
 */



//判断String 是否为空
let empty = (params) => {
  if (params == "" || params == null || params == undefined) { // "",null,undefined
    return true
  } else {
    return false
  }
}
//判断Array 是否为空
let zero = (params) => {
  if (!params.length) { // "",null,undefined
    return true
  } else {
    return false
  }
}
//判断Object 是否为空
let noHasProperty = (params) => {
  if (!Object.keys(params).length) {
    return true
  } else {
    return false
  }
}


// 判断数据是否为空是否为空
const nullCheck = (params) => {
  if (typeof (params) == "string") {
    return empty(params)
  } else if (Object.prototype.toString.call(params) === '[object Array]') {
    return zero(params)
  } else if (Object.prototype.toString.call(params) === '[object Object]') {
    return noHasProperty(params)
  }
}
export default nullCheck