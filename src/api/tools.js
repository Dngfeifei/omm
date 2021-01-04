import moment from 'moment'

export const Assign = (prevState, nextState) => Object.assign({}, prevState, nextState)

export const handleNumberFormInitialValue = val => val || val == 0 ? val : ''

export const momentFormat = date => date.format('YYYY-MM-DD')

export const handleTreeData = (tree, nameKey, idKey, childKey, disablelast = false) => (f => f(f))(f => list => list.map(val => {
	let baseItem = {
		title: val[nameKey],
		label: val[nameKey],
		key: String(val[idKey]),
		value: String(val[idKey])
	}
	if (val[childKey] && val[childKey].length) {
		return Object.assign({}, baseItem, {
			children: f(f)(val[childKey])
		}, disablelast ? {disabled: true} : {})
	} 
	return baseItem
}))(tree)

export const handleTreeValue = (tree, code, prop1 = 'value') => {
	let value = null
	tree.forEach(item => {
		if(item[prop1] == code){
			value = item.title
		}else if(item.children && item.children.length > 0){
			let temp = handleTreeValue(item.children, code, prop1)
			if(temp) value = temp
		}
	})
	return value
}

export const handleTreeTop = tree => {
	return [{
		children: tree,
		label: "顶级",
		value: "0",
		key: "0",
		title: "顶级"
	}]
}

export const parseUnit = (selectItem, type = 'normal') => {
	let unit = selectItem.uName.trim()
	let key1 = unit.indexOf('(')
	let key2 = unit.indexOf(':')
	let key3 = unit.indexOf(')')
	let item, scale
	let names = unit.slice(0, key1).split(',')
	scale = unit.slice(key2 + 1, key3) 

	item = {
		baseUnit: names[0],
		marginUnit: names[1],
		scale,
		id: selectItem.id || ''
	}

	if (type == 'normal') {
		return item
	} else {
		return names
	}
}

export const handleLocation = _ => {
	let s = location.search.substring(1, location.search.length)
	let search = {}
	let a = [s]
	if (s.length > 1 && s.indexOf('&') > 0 && s) {
		a = s.split('&')
	}
	a.forEach(val => {
		let b = val.split('=')
		search[b[0]] = b[1]
	})
	return search
}

export const weekToDate = (year, week) => {
	//年度第一天
	let yearFirstDay = new Date(year, 0, 1)
	//那一年第一天是星期几
  let yearFirstDayWeek = yearFirstDay.getDay() || 7
  //第一周第一天的日期
  let date = new Date(yearFirstDay)
  if(yearFirstDayWeek != 1){
  	date.setDate(yearFirstDay.getDate() + 7 - yearFirstDayWeek);
  }
  let date1 = new Date(date.setDate(date.getDate() + 7 * (week - 1)))
  let date2 = new Date(new Date().setDate(date1.getDate() + 6))
  return [moment(date1), moment(date2)]
}

export const tstr = (num, fix) => {
	if (fix == 4) {
		return num.toFixed(fix).toString()
	}
	if (fix) {
		return num.toFixed(2).toString()
	}
	return num.toString()
}
// 无闪现下载excel
export const downloadByUrl = url => {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  function iframeLoad() {
    const win = iframe.contentWindow;
    const doc = win.document;
    if (win.location.href === url) {
      if (doc.body.childNodes.length > 0) {
        // response is error
      }
      iframe.parentNode.removeChild(iframe);
    }
  }
  if ('onload' in iframe) {
    iframe.onload = iframeLoad;
  } else if (iframe.attachEvent) {
    iframe.attachEvent('onload', iframeLoad);
  } else {
    iframe.onreadystatechange = function onreadystatechange() {
      if (iframe.readyState === 'complete') {
        iframeLoad;
      }
    };
  }
  iframe.src = '';
  document.body.appendChild(iframe);
  setTimeout(function loadUrl() {
    iframe.contentWindow.location.href = url + '&timeStamp=' + Date.parse(new Date()).toString();
  }, 50);
}
//下载文件
export const dealBlob = (b, name) => {
	 if(window.navigator.msSaveBlob){// 兼容ie11
		try{
			window.navigator.msSaveBlob(b, name); 
		}catch(e){
			console.log('windows download error...')
			console.log(e);
		}
	}else{
		const aLink = document.createElement('a');
	  document.body.appendChild(aLink);
	  aLink.style.display='none';
	  const objectUrl = window.URL.createObjectURL(b);
	  aLink.href = objectUrl;
	  if(name){
		  aLink.download = name;
		}
	  aLink.click();
	  document.body.removeChild(aLink)
	  window.URL.revokeObjectURL(objectUrl);
	}
}
//判断是否图片
export const isImage = suffix => {
	let imgs = ['gif','png','jpg','jpeg'];
	return imgs.indexOf(suffix.toLowerCase()) >= 0
}
//在集合中增加key
export const assignKey = list => {
	return list.map(val => {
		let baseItem = Object.assign({}, val, { key: val.id })
		if(baseItem.children && baseItem.children.length > 0){
			baseItem.children = assignKey(baseItem.children)
			baseItem.isparentnode = 1 //是否父节点
		}
		return baseItem
	})
}
//通过身份证号获得性别
export const getGenderByIdnum = IdNO => {
  if (IdNO.length==18) {
    return IdNO.charAt(16)%2==0 ? 2 : 1;
  }else if(IdNO.length==15){
    return IdNO.charAt(14)%2==0 ? 2 : 1;
  }else{
    return null;
  }
}
//通过身份证号获得出生年月
export const getDateByIdnum = IdNO => {
  let birthday = "";
  if (IdNO.length==18) {
    birthday = IdNO.substr(6,8);
    return birthday.replace(/(.{4})(.{2})/,"$1-$2-");
  }else if(IdNO.length==15){
    birthday = "19"+IdNO.substr(6,6);
    return birthday.replace(/(.{4})(.{2})/,"$1-$2-");
  }else{
    return null; 
  }
}

//千分为显示
export const numSep = num =>{
  return num && Number(num)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
          return $1 + ",";
      });
}
//百分号显示
export const percentSep = num =>{
  return num && (num * 100 + '%')
}

//审核消息
export const divideMsg = (msg, i) =>{
	if(!msg){
		return ''
	}
	if(i === 0){
		let dateIndex = msg.lastIndexOf(';')
		let contentIndex = msg.indexOf(':')
		return msg.substr(0,dateIndex > contentIndex ?  contentIndex + 1 : dateIndex)
	}else if(i === 1){
		return msg.substr(msg.indexOf(':') + 1, msg.lastIndexOf(';') - msg.indexOf(':'))
	}else if(i === 2){
		return msg.substr(msg.lastIndexOf(';') + 1)
	}
}

//单据状态
export const vbillMap = {
	8: '自由',
	0: '审批未通过',
	1: '已审批',
	2: '正在审批中',
	3: '提交状态',
	4: '作废',
	5: '关闭',
	6: '终止(结算)态',
	7: '冻结状态'
}
//项目状态
export const iprojMap = {
	0: '立项',
	1: '已签约',
	2: '强制关闭',
	3: '丢单关闭',
	4: '验收关闭'
}
//审核状态
export const StatusMap = {
	0:'申请中', 
	1:'已通过',
	2:'已拒绝',
	3:'已续借',
	4:'已归还'
}
//审核状态
export const ReportMap = {
	1:'表格', 
	2:'柱状图',
	3:'饼图'
}




















