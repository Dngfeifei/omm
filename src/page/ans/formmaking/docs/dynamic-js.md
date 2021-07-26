

# 组件onChange联动

组件设置onChange字段支持自定义JavaScript，组件触发onChange修改自身值的时候，如果设置了该字段，会使用eval执行对应代码。

为了支持多组件联动，在window下挂载了global对象，暴露出部分方法供用户修改表单内容

// 设置表单指定组件值，
fieldId {string} 组件id，获取渠道： 1.在表单设计页面组件处返显  2. 表单设计页面点击生成JSON  3. 预览-》获取数据
value {string|number} 想要设置的值
window.global.updateValue = (fieldId, value) => {}


// 更新表单指定控件
newCtrl {表单控件} 具体数据结构参考`src/page/ans/formmaking/lib/componentsConfig.js`
window.global.updateControl = (newCtrl) => {}

// 根据表单控件id获取控件
ctrlId {string} 表单控件id
返回值： 对应表单控件或undefined(没找到对应id的控件时)
window.global.getControl = (ctrlId) => { }

// 当前触发onChange事件组件的新值（onChange高频触发且计算耗时，可能存在多个值互相覆盖？）
window.global.value = value

## demo
以下是模拟的省市区三级联动onChange代码


// 省onChange设置市列表

var cityMap = {
  '贵州': [
    { label: '贵阳', value: '贵阳' },
    { label: '遵义', value: '遵义' },
  ],
  '北京': [
    { label: '昌平区', value: '昌平区' },
    { label: '海淀区', value: '海淀区' },
  ]
}
var diMap = {
  '贵阳': [
    { label: '观山湖区', value: '观山湖区' },
    { label: '白云区', value: '白云区' },
  ],
  '昌平区': [
    { label: '天通北苑', value: '天通北苑' },
    { label: '回龙观', value: '回龙观' },
  ],
}

var ctrl = window.global.getControl('select_31pvwlh1cghcm');
ctrl.options.options = cityMap[window.global.value] || [];
ctrl.options.value = '';
window.global.updateControl(ctrl);
var ctrl2 = window.global.getControl('select_r7tfgdfp24j7d');
ctrl2.options.value = '';
window.global.updateControl(ctrl2);

// 市onChange设置县列表
var cityMap = {
  '贵州': [
    { label: '贵阳', value: '贵阳' },
    { label: '遵义', value: '遵义' },
  ],
  '北京': [
    { label: '昌平区', value: '昌平区' },
    { label: '海淀区', value: '海淀区' },
  ]
}
var diMap = {
  '贵阳': [
    { label: '观山湖区', value: '观山湖区' },
    { label: '白云区', value: '白云区' },
  ],
  '昌平区': [
    { label: '天通北苑', value: '天通北苑' },
    { label: '回龙观', value: '回龙观' },
  ],
  '海淀区': [
    { label: '北京邮电大学', value: '北京邮电大学' },
    { label: '北京师范大学', value: '北京师范大学' },
  ],
}

var ctrl = window.global.getControl('select_hhqsq5zxdafs6');
ctrl.options.options = diMap[window.global.value] || [];
ctrl.options.value = '';
window.global.updateControl(ctrl);
