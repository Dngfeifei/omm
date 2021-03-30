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