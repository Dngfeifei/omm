// 随机生成id
export function genNonDuplicateId(n = 13) {
  const str = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < n; i++) {
    let random = Math.random() * str.length
    result += str[parseInt(random, 10)]
  }
  return result
}

// 兼容数据
export function compatData(data) {
  data.forEach(item => {
    if (!item.id) {
      item.id = genNonDuplicateId()
    }
  });
  return data
}

//  从样式表中获取定级类列表
export function getClassList(stylesheet) {
  var clsList = []
  if (stylesheet) {
    try {
      var tokenReg = /(\.[^}]+})/g
      var tokens = []
      do {
        var token = tokenReg.exec(stylesheet)
        if (token) {
          tokens.push(token[0])
        }
      } while (token)

      var clsReg = /\.([^ ]+)/
      clsList = tokens.map(token => {
        return clsReg.exec(token)[1]
      })
    } catch (error) {
      console.log(error);
    }
  }
  return clsList
}

export function recover(target, source) {
  if (target === undefined || target === null) { throw new TypeError('Cannot convert first argument to object') }
  var to = Object(target)
  if (source === undefined || source === null) { return to }
  var keysArray = Object.keys(Object(target))
  for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
    var nextKey = keysArray[nextIndex]
    var desc = Object.getOwnPropertyDescriptor(target, nextKey)
    if (desc !== undefined && desc.enumerable) {
      if (to.hasOwnProperty(nextKey)) {
        if (to[nextKey] instanceof Array) {
          to[nextKey] = source[nextKey]
        } else if (to[nextKey] instanceof Object) {
          recover(to[nextKey], source[nextKey])
        } else if (source[nextKey] !== undefined) {
          to[nextKey] = source[nextKey]
        } else if (typeof (to[nextKey]) === 'string') {
          to[nextKey] = ''
        } else {
          to[nextKey] = undefined
        }
      }
    }
  }
  return to
}
