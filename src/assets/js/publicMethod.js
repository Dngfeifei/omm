/*
公共方法
*/

/*
回车确认操作事件
@params   e为传入的事件操作对象，eventFn为传入的执行函数
*/
export const onKey = (e,eventFn) => {
    let keyCode = e.keyCode;
    if(keyCode == 13 && typeof eventFn === "function"){
        eventFn();
        e.target.blur();
    }
}

/*
普通数组去重
@params  data，传入数据
*/
export const arrayDuplication = (data) => {
    let newArr = new Set(data);
    return newArr;
}
/*
元素为对象数组去重
@params  data，传入数据,id为比较属性
*/
export const arrayObject = (data,id) => {
    let newArr = [],obj = {},key = id;
    data.forEach(element => {
        if(!(element[key] in obj)){
            obj[key] = true;
            newArr.push(element);
        }
    });
    return newArr;
}
/*
获取时间日期的时间戳
@params  date
*/
// export const getTime = (date) => {
    
//     return newArr;
// }
/*
根据时间戳格式化日期
@params  date
*/
export const getTime = (dateTime,type) => {
    const date = new Date(dateTime);
    const o = {
        "M+" : date.getMonth() + 1, //月份
        "d+" : date.getDate(), //日
        "h+" : date.getHours(), //小时
        "m+" : date.getMinutes(), //分
        "s+" : date.getSeconds(), //秒
        "q+" : Math.floor((date.getMonth() + 3) / 3), //季度
        "S" : date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(type))
        type = type.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
        type = type.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return type;
}