webpackJsonp([27],{28:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(a,c){try{var o=t[a](c),s=o.value}catch(e){return void n(e)}if(!o.done)return Promise.resolve(s).then(function(e){r("next",e)},function(e){r("throw",e)});e(s)}return r("next")})}}function c(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=n(21),u=r(i),l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(1),d=r(f),p=n(5),h=n(89),m=r(h),y=p.Button.Group,v=function(e){function t(){var e,n,r,s,i=this;c(this,t);for(var l=arguments.length,f=Array(l),h=0;h<l;h++)f[h]=arguments[h];return n=r=o(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(f))),r.state=Object.assign({},r.state,{search:Object.assign({},r.state.pageconf),columns:[{title:"项目编号",dataIndex:"t1"},{title:"合同名称",dataIndex:"t2"},{title:"客户名称",dataIndex:"t3"},{title:"合同额",dataIndex:"t4"},{title:"合同起始日期",dataIndex:"t5"}],modalConf:{visible:!1,item:{}},picmodelConf:{visible:!1,item:{}}}),r.search=function(){var e=a(u.default.mark(function e(t){var n;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:n=[{key:1,t1:"BDG8763",t2:"移动运维三期",t3:"中国移动",t4:"60000",t5:"2019年2月1日"},{key:2,t1:"BDG8763",t2:"移动运维三期",t3:"中国移动",t4:"60000",t5:"2019年2月1日"},{key:3,t1:"BDG8763",t2:"移动运维三期",t3:"中国移动",t4:"60000",t5:"2019年2月1日"},{key:4,t1:"BDG8763",t2:"移动运维三期",t3:"中国移动",t4:"60000",t5:"2019年2月1日"},{key:5,t1:"BDG8763",t2:"移动运维三期",t3:"中国移动",t4:"60000",t5:"2019年2月1日"},{key:6,t1:"BDG8763",t2:"移动运维三期",t3:"中国移动",t4:"60000",t5:"2019年2月1日"},{key:7,t1:"BDG8763",t2:"移动运维三期",t3:"中国移动",t4:"60000",t5:"2019年2月1日"},{key:8,t1:"BDG8763",t2:"移动运维三期",t3:"中国移动",t4:"60000",t5:"2019年2月1日"}],r.setState({tabledata:n,loading:!1,pagination:Object.assign({},r.state.pagination,{total:8,current:0})});case 2:case"end":return e.stop()}},e,i)}));return function(t){return e.apply(this,arguments)}}(),r.delete=function(e){r.handleOk(deletesupplier,"id","删除")},r.done=function(){var e=a(u.default.mark(function e(t){var n;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n={visible:!1,item:{}},e.next=3,r.setState({modalConf:n});case 3:r.research();case 4:case"end":return e.stop()}},e,i)}));return function(t){return e.apply(this,arguments)}}(),r.openPicModel=function(e){r.setState({picmodelConf:{visible:!0}})},r.excelImport=function(e){r.setState({visible:!0})},r.renderSearch=function(e){return d.default.createElement("div",null,d.default.createElement(p.Input,{value:r.state.search.name,suffix:r.state.search.name?d.default.createElement(p.Icon,{type:"close-circle",onClick:function(e){return r.changeSearch({name:""})}}):null,onChange:function(e){return r.changeSearch({name:e.target.value})},style:{width:250},addonBefore:"名称",placeholder:"名称"}),d.default.createElement(y,null,d.default.createElement(p.Button,{onClick:r.search,type:"primary",icon:"search"},"搜索"),d.default.createElement(p.Button,{onClick:r.research,type:"primary",icon:"retweet"},"重置"),d.default.createElement(p.Button,{onClick:function(e){return r.addmodal("modalConf","添加")},type:"primary",icon:"plus"},"添加"),d.default.createElement(p.Button,{onClick:function(e){return r.editmodal("modalConf","编辑")},type:"primary",icon:"edit"},"修改"),d.default.createElement(p.Button,{onClick:r.changemodel,type:"primary",icon:"delete"},"删除"),d.default.createElement(p.Button,{onClick:r.openPicModel,type:"primary",icon:"picture"},"影像"),d.default.createElement(p.Button,{onClick:r.excelImport,type:"primary",icon:"file-excel"},"EXCEL导入")))},r.rendermodal=function(e){return[d.default.createElement(p.Modal,{title:"信息",visible:r.state.visible,onOk:r.delete,mask:!1,width:400,onCancel:r.changemodel,okText:"上传",cancelText:"取消"},d.default.createElement(p.Upload,null,d.default.createElement(p.Button,null,d.default.createElement(p.Icon,{type:"upload"})," excel导入")))]},s=n,o(r,s)}return s(t,e),l(t,[{key:"componentWillMount",value:function(){function e(){return t.apply(this,arguments)}var t=a(u.default.mark(function e(){return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.search();case 1:case"end":return e.stop()}},e,this)}));return e}()}]),t}(m.default);t.default=v},89:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(a,c){try{var o=t[a](c),s=o.value}catch(e){return void n(e)}if(!o.done)return Promise.resolve(s).then(function(e){r("next",e)},function(e){r("throw",e)});e(s)}return r("next")})}}function c(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=n(21),u=r(i),l=n(1),f=r(l),d=n(5),p=n(9),h=function(e){function t(){var e,n,r,s,i=this;c(this,t);for(var l=arguments.length,h=Array(l),m=0;m<l;m++)h[m]=arguments[m];return n=r=o(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(h))),r.state={columns:[],selectedtable:!0,selected:{},loading:!0,tabledata:[],visible:!1,search:{},pageconf:{limit:10,offset:0},pagination:{total:1,current:1,pageSize:10,onChange:function(e,t){return r.pageChange(e,t)}}},r.pageChange=function(){var e=a(u.default.mark(function e(t,n){return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({search:Object.assign({},r.state.search,{offset:(t-1)*n})});case 2:r.search();case 3:case"end":return e.stop()}},e,i)}));return function(t,n){return e.apply(this,arguments)}}(),r.onselect=function(e,t){r.setState({selected:{selectedKeys:e,selectedItems:t}})},r.orderdetail=function(){var e=a(u.default.mark(function e(t){return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({selected:{selectedKeys:[t.id],selectedItems:[t]}});case 2:r.addpane(1);case 3:case"end":return e.stop()}},e,i)}));return function(t){return e.apply(this,arguments)}}(),r.setselect=function(){var e=a(u.default.mark(function e(t,n){return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({selected:{selectedKeys:[t.id],selectedItems:[t]}});case 2:n();case 3:case"end":return e.stop()}},e,i)}));return function(t,n){return e.apply(this,arguments)}}(),r.changeSearch=function(e){var t=Object.assign({},r.state.search,e,r.state.pageconf);r.setState({search:t})},r.handleTime=function(e,t){e[t]?e[t]=(0,p.momentFormat)(e[t]):delete e[t]},r.research=function(){var e=a(u.default.mark(function e(t){return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({search:Object.assign({},r.state.pageconf),selected:{}});case 2:r.search();case 3:case"end":return e.stop()}},e,i)}));return function(t){return e.apply(this,arguments)}}(),r.changemodel=function(e){r.state.selected.selectedKeys&&r.state.selected.selectedKeys.length?r.setState({visible:!r.state.visible}):d.message.warning("请选中表格中的某一记录！")},r.cancelform=function(e){var t={};t[e]=Object.assign({},r.state[e],{visible:!1,item:{}}),r.setState(t)},r.addmodal=function(){var e=a(u.default.mark(function e(t,n){var a;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a={},a[t]={title:n,visible:!0,type:"add"},r.setState(a);case 3:case"end":return e.stop()}},e,i)}));return function(t,n){return e.apply(this,arguments)}}(),r.editmodal=function(){var e=a(u.default.mark(function e(t,n){var a;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:r.state.selected.selectedKeys&&r.state.selected.selectedKeys.length?(a={},a[t]={title:n,visible:!0,type:"edit",item:r.state.selected.selectedItems[0]},r.setState(a)):d.message.warning("请选中表格中的某一记录！");case 1:case"end":return e.stop()}},e,i)}));return function(t,n){return e.apply(this,arguments)}}(),r.handleOk=function(){var e=a(u.default.mark(function e(t,n,c){var o,s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"search";return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!r.state.selected.selectedKeys||!r.state.selected.selectedKeys.length){e.next=8;break}return e.next=3,r.setState({confirmLoading:!0});case 3:o={},o[n]=r.state.selected.selectedKeys[0],t(o).then(function(){var e=a(u.default.mark(function e(t){return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({visible:!1,confirmLoading:!1});case 2:if(200!=t.code){e.next=6;break}return d.message.success(c+"成功"),r[s](),e.abrupt("return");case 6:case"end":return e.stop()}},e,i)}));return function(t){return e.apply(this,arguments)}}()),e.next=9;break;case 8:d.message.warning("请选中表格中的某一记录！");case 9:case"end":return e.stop()}},e,i)}));return function(t,n,r){return e.apply(this,arguments)}}(),r.selectJudge=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=r.state.selected;n.selectedKeys&&n.selectedKeys.length?t?e(n.selectedKeys,n.selectedItems):e(n.selectedKeys[0],n.selectedItems[0]):d.message.warning("请选中表格中的某一记录！")},r.renderSearch=function(e){return null},r.renderBtn=function(e){return null},r.renderBottomBtn=function(e){return null},r.rendermodal=function(e){return null},r.renderTable=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:r.state.pagination;return f.default.createElement(d.Table,{size:"small",bordered:!0,loading:r.state.loading,rowSelection:e,columns:r.state.columns,pagination:t,locale:{emptyText:"暂无数据"},dataSource:r.state.tabledata})},r.render=function(e){var t={type:"radio",selectedRowKeys:r.state.selected.selectedKeys,onChange:r.onselect};return f.default.createElement("div",{className:"mgrWrapper"},r.renderSearch(),r.renderBtn(),r.renderTable(r.state.selectedtable?t:null),r.renderBottomBtn(),r.rendermodal())},s=n,o(r,s)}return s(t,e),t}(l.Component);t.default=h}});
//# sourceMappingURL=27.a41a3c74aac793fec38d.js.map