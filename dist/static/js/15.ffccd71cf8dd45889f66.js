webpackJsonp([15],{106:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.downloadFile=t.uploadTemplate=t.deleteResumeTemplate=t.editResumeTemplate=t.addResumeTemplate=t.getResumeTemplateList=void 0;var r=n(10),a=function(e){return e&&e.__esModule?e:{default:e}}(r);t.getResumeTemplateList=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return a.default.fetchPost("/resumeTemplate/list",e)},t.addResumeTemplate=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return a.default.fetchPost("/resumeTemplate/add",e,!0)},t.editResumeTemplate=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return a.default.fetchPost("/resumeTemplate/update",e,!0)},t.deleteResumeTemplate=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return a.default.fetchGet("/resumeTemplate/delete",e)},t.uploadTemplate="/resumeTemplate/upload",t.downloadFile=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return a.default.fetchBlob("/resumeTemplate/downloadFile",e)}},133:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(a,o){try{var c=t[a](o),i=c.value}catch(e){return void n(e)}if(!c.done)return Promise.resolve(i).then(function(e){r("next",e)},function(e){r("throw",e)});e(i)}return r("next")})}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l=n(21),s=r(l),u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(1),d=r(f),p=n(5),m=n(106),h=p.Form.Item,v=function(e){function t(){var e,n,r,i,l=this;o(this,t);for(var u=arguments.length,f=Array(u),v=0;v<u;v++)f[v]=arguments[v];return n=r=c(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(f))),r.state={rules:[{label:"名称",key:"name",option:{rules:[{required:!0,message:"请输入模版名称!"}]},render:function(e){return d.default.createElement(p.Input,{style:{width:200}})}},{label:"备注",key:"tips",option:{rules:[]},render:function(e){return d.default.createElement(p.Input,{style:{width:200}})}}],loading:!1,lock:!1,fileName:"",fileList:[]},r.handleChange=function(e){var t=e.fileList;r.setState({fileList:t.slice(-1)});var n=t[t.length-1];n&&"done"==n.status&&r.setState({fileName:n.response.data})},r.handleFetch=function(e){return"edit"==r.props.config.type?(e.id=r.props.config.item.id,(0,m.editResumeTemplate)(e)):(0,m.addResumeTemplate)(e)},r.handleOk=function(){var e=a(s.default.mark(function e(t){return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r.state.lock){e.next=4;break}return e.next=3,r.setState({lock:!0});case 3:r.props.form.validateFieldsAndScroll(null,{},function(e,t){if(e&&Object.getOwnPropertyNames(e).length)r.setState({lock:!1});else{var n=Object.assign({},t);if(n.tips||delete n.tips,!r.state.fileName)return void p.message.error("请先上传简历模版!");n.path=r.state.fileName,r.handleFetch(n).then(function(e){200!=e.code&&!0!==e||(p.message.success("操作成功"),r.props.getTree(),r.props.done()),r.setState({lock:!1})})}});case 4:case"end":return e.stop()}},e,l)}));return function(t){return e.apply(this,arguments)}}(),r.render=function(e){var t=r.props.form.getFieldDecorator;return d.default.createElement(p.Modal,{title:r.props.config.title,onOk:r.handleOk,visible:r.props.config.visible,confirmLoading:r.state.loading,onCancel:r.props.onCancel,width:500,style:{top:50,marginBottom:100},okText:"提交",cancelText:"取消"},d.default.createElement(p.Form,null,r.state.rules.map(function(e,n){return d.default.createElement(h,{label:e.label,labelCol:{span:4}},t(e.key,e.option)(e.render()))})),d.default.createElement(p.Upload,{action:m.uploadTemplate,onChange:r.handleChange,fileList:r.state.fileList},d.default.createElement(p.Button,null,d.default.createElement(p.Icon,{type:"upload"})," 上传模版")))},i=n,c(r,i)}return i(t,e),u(t,[{key:"componentWillReceiveProps",value:function(){function e(e){return t.apply(this,arguments)}var t=a(s.default.mark(function e(t){var n;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.config!=this.props.config&&t.config.visible&&("edit"!=t.config.type?(this.props.form.resetFields(),this.setState({fileName:"",fileList:[]})):(n=t.config.item,this.props.form.setFields({name:{value:n.name},tips:{value:n.tips}}),n.path&&this.setState({fileName:n.path,fileList:[{uid:n.path,name:"简历模版.ftl",status:"done"}]})));case 1:case"end":return e.stop()}},e,this)}));return e}()}]),t}(f.Component),y=p.Form.create()(v);t.default=y},46:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(a,o){try{var c=t[a](o),i=c.value}catch(e){return void n(e)}if(!c.done)return Promise.resolve(i).then(function(e){r("next",e)},function(e){r("throw",e)});e(i)}return r("next")})}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l=n(21),s=r(l),u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(1),d=r(f),p=n(5),m=n(106),h=n(89),v=r(h),y=n(133),g=r(y),b=p.Button.Group,w=function(e){function t(){var e,n,r,i,l=this;o(this,t);for(var u=arguments.length,f=Array(u),h=0;h<u;h++)f[h]=arguments[h];return n=r=c(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(f))),r.state=Object.assign({},r.state,{search:Object.assign({condition:""},r.state.pageconf),columns:[{title:"名称",dataIndex:"name"},{title:"创建人",dataIndex:"createUserName"},{title:"创建时间",dataIndex:"createTime"},{title:"备注",dataIndex:"tips"},{title:" 操作 ",dataIndex:"operate",render:function(e,t){return d.default.createElement("a",{style:{display:"inline-block",width:60},onClick:function(){var e=a(s.default.mark(function e(n){return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:r.download(t.path);case 1:case"end":return e.stop()}},e,l)}));return function(t){return e.apply(this,arguments)}}()},"导出样例")}}],selected:{},loading:!0,tabledata:[],modalconf:{visible:!1,item:{}}}),r.download=function(e){(0,m.downloadFile)({path:e}).then(function(e){var t=document.createElement("a");document.body.appendChild(t),t.style.display="none";var n=window.URL.createObjectURL(e);t.href=n,t.download="样例.doc",t.click(),document.body.removeChild(t)})},r.search=function(){var e=a(s.default.mark(function e(t){var n;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({loading:!0,selected:{}});case 2:return n=Object.assign({},r.state.search),console.log(n),n.condition||delete n.condition,e.abrupt("return",(0,m.getResumeTemplateList)(n).then(function(e){var t=function(e){return e(e)}(function(e){return function(e){return e.map(function(e){return Object.assign({},e,{key:e.id})})}})(e.data.records);r.setState({tabledata:t,loading:!1,pagination:Object.assign({},r.state.pagination,{total:e.data.total,current:e.data.current})})}));case 6:case"end":return e.stop()}},e,l)}));return function(t){return e.apply(this,arguments)}}(),r.deleteback=function(e){r.search()},r.delete=function(e){r.handleOk(m.deleteResumeTemplate,"id","删除","deleteback")},r.done=function(){var e=a(s.default.mark(function e(t){var n,a;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(n=r.state.modalconf.type,a={},a.modalconf={visible:!1,item:{}},r.setState(a),"add"!=n){e.next=8;break}r.research(),e.next=11;break;case 8:return e.next=10,r.setState({selected:{}});case 10:r.search();case 11:case"end":return e.stop()}},e,l)}));return function(t){return e.apply(this,arguments)}}(),r.renderSearch=function(e){return d.default.createElement("div",null,d.default.createElement("div",{className:"mgrSearchBar"},d.default.createElement(p.Input,{value:r.state.search.condition,suffix:r.state.search.condition?d.default.createElement(p.Icon,{type:"close-circle",onClick:function(e){return r.changeSearch({condition:""})}}):null,onChange:function(e){return r.changeSearch({condition:e.target.value})},addonBefore:"名称",placeholder:"输入模版名称"}),d.default.createElement(p.Button,{onClick:r.search,type:"primary",icon:"search"},"搜索")))},r.renderBtn=function(e){return d.default.createElement("div",null,d.default.createElement(b,null,d.default.createElement(p.Button,{onClick:function(e){return r.addmodal("modalconf","添加模版")},type:"primary",icon:"plus"},"添加"),d.default.createElement(p.Button,{onClick:function(e){return r.editmodal("modalconf","编辑模版")},type:"primary",icon:"edit"},"修改"),d.default.createElement(p.Button,{onClick:r.changemodel,type:"primary",icon:"close"},"删除")))},r.rendermodal=function(e){return[d.default.createElement(g.default,{onCancel:function(e){return r.cancelform("modalconf")},done:function(e){return r.done()},getTree:function(e){return r.search()},config:r.state.modalconf}),d.default.createElement(p.Modal,{title:"信息",visible:r.state.visible,onOk:r.delete,mask:!1,width:400,onCancel:r.changemodel,okText:"确认",cancelText:"取消"},d.default.createElement("p",null,"是否删除？"))]},i=n,c(r,i)}return i(t,e),u(t,[{key:"componentWillMount",value:function(){function e(){return t.apply(this,arguments)}var t=a(s.default.mark(function e(){return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.search();case 1:case"end":return e.stop()}},e,this)}));return e}()}]),t}(v.default);t.default=w},89:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(a,o){try{var c=t[a](o),i=c.value}catch(e){return void n(e)}if(!c.done)return Promise.resolve(i).then(function(e){r("next",e)},function(e){r("throw",e)});e(i)}return r("next")})}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l=n(21),s=r(l),u=n(1),f=r(u),d=n(5),p=n(9),m=function(e){function t(){var e,n,r,i,l=this;o(this,t);for(var u=arguments.length,m=Array(u),h=0;h<u;h++)m[h]=arguments[h];return n=r=c(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(m))),r.state={columns:[],selectedtable:!0,selected:{},loading:!0,tabledata:[],visible:!1,search:{},pageconf:{limit:10,offset:0},pagination:{total:1,current:1,pageSize:10,onChange:function(e,t){return r.pageChange(e,t)}}},r.pageChange=function(){var e=a(s.default.mark(function e(t,n){return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({search:Object.assign({},r.state.search,{offset:(t-1)*n})});case 2:r.search();case 3:case"end":return e.stop()}},e,l)}));return function(t,n){return e.apply(this,arguments)}}(),r.onselect=function(e,t){r.setState({selected:{selectedKeys:e,selectedItems:t}})},r.orderdetail=function(){var e=a(s.default.mark(function e(t){return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({selected:{selectedKeys:[t.id],selectedItems:[t]}});case 2:r.addpane(1);case 3:case"end":return e.stop()}},e,l)}));return function(t){return e.apply(this,arguments)}}(),r.setselect=function(){var e=a(s.default.mark(function e(t,n){return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({selected:{selectedKeys:[t.id],selectedItems:[t]}});case 2:n();case 3:case"end":return e.stop()}},e,l)}));return function(t,n){return e.apply(this,arguments)}}(),r.changeSearch=function(e){var t=Object.assign({},r.state.search,e,r.state.pageconf);r.setState({search:t})},r.handleTime=function(e,t){e[t]?e[t]=(0,p.momentFormat)(e[t]):delete e[t]},r.research=function(){var e=a(s.default.mark(function e(t){return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({search:Object.assign({},r.state.pageconf),selected:{}});case 2:r.search();case 3:case"end":return e.stop()}},e,l)}));return function(t){return e.apply(this,arguments)}}(),r.changemodel=function(e){r.state.selected.selectedKeys&&r.state.selected.selectedKeys.length?r.setState({visible:!r.state.visible}):d.message.warning("请选中表格中的某一记录！")},r.cancelform=function(e){var t={};t[e]=Object.assign({},r.state[e],{visible:!1,item:{}}),r.setState(t)},r.addmodal=function(){var e=a(s.default.mark(function e(t,n){var a;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a={},a[t]={title:n,visible:!0,type:"add"},r.setState(a);case 3:case"end":return e.stop()}},e,l)}));return function(t,n){return e.apply(this,arguments)}}(),r.editmodal=function(){var e=a(s.default.mark(function e(t,n){var a;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:r.state.selected.selectedKeys&&r.state.selected.selectedKeys.length?(a={},a[t]={title:n,visible:!0,type:"edit",item:r.state.selected.selectedItems[0]},r.setState(a)):d.message.warning("请选中表格中的某一记录！");case 1:case"end":return e.stop()}},e,l)}));return function(t,n){return e.apply(this,arguments)}}(),r.handleOk=function(){var e=a(s.default.mark(function e(t,n,o){var c,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"search";return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!r.state.selected.selectedKeys||!r.state.selected.selectedKeys.length){e.next=8;break}return e.next=3,r.setState({confirmLoading:!0});case 3:c={},c[n]=r.state.selected.selectedKeys[0],t(c).then(function(){var e=a(s.default.mark(function e(t){return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({visible:!1,confirmLoading:!1});case 2:if(200!=t.code){e.next=6;break}return d.message.success(o+"成功"),r[i](),e.abrupt("return");case 6:case"end":return e.stop()}},e,l)}));return function(t){return e.apply(this,arguments)}}()),e.next=9;break;case 8:d.message.warning("请选中表格中的某一记录！");case 9:case"end":return e.stop()}},e,l)}));return function(t,n,r){return e.apply(this,arguments)}}(),r.selectJudge=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=r.state.selected;n.selectedKeys&&n.selectedKeys.length?t?e(n.selectedKeys,n.selectedItems):e(n.selectedKeys[0],n.selectedItems[0]):d.message.warning("请选中表格中的某一记录！")},r.renderSearch=function(e){return null},r.renderBtn=function(e){return null},r.renderBottomBtn=function(e){return null},r.rendermodal=function(e){return null},r.renderTable=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:r.state.pagination;return f.default.createElement(d.Table,{size:"small",bordered:!0,loading:r.state.loading,rowSelection:e,columns:r.state.columns,pagination:t,locale:{emptyText:"暂无数据"},dataSource:r.state.tabledata})},r.render=function(e){var t={type:"radio",selectedRowKeys:r.state.selected.selectedKeys,onChange:r.onselect};return f.default.createElement("div",{className:"mgrWrapper"},r.renderSearch(),r.renderBtn(),r.renderTable(r.state.selectedtable?t:null),r.renderBottomBtn(),r.rendermodal())},i=n,c(r,i)}return i(t,e),t}(u.Component);t.default=m}});
//# sourceMappingURL=15.ffccd71cf8dd45889f66.js.map