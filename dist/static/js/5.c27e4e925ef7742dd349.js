webpackJsonp([5],{120:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(a,o){try{var c=t[a](o),i=c.value}catch(e){return void n(e)}if(!c.done)return Promise.resolve(i).then(function(e){r("next",e)},function(e){r("throw",e)});e(i)}return r("next")})}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=n(21),s=r(u),l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},f=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=n(1),p=r(d),h=n(5),m=(n(11),n(93)),y=(n(9),h.Form.Item),v=function(e){function t(){var e,n,r,i,u=this;o(this,t);for(var f=arguments.length,d=Array(f),v=0;v<f;v++)d[v]=arguments[v];return n=r=c(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(d))),r.state={rules:[{label:"角色名称",key:"name",option:{rules:[{required:!0,message:"请输入角色名称!"}]},render:function(e){return p.default.createElement(h.Input,{style:{width:200}})}},{label:"排序",key:"num",option:{rules:[]},render:function(e){return p.default.createElement(h.InputNumber,{style:{width:200}})}},{label:"说明",key:"tips",option:{rules:[]},render:function(e){return p.default.createElement(h.Input,{style:{width:200}})}}],loading:!1,lock:!1},r.handleFetch=function(e){return"edit"==r.props.config.type?(e.id=r.props.config.item.id,(0,m.editRole)(e)):(0,m.addRole)(e)},r.handleOk=function(){var e=a(s.default.mark(function e(t){return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r.state.lock){e.next=4;break}return e.next=3,r.setState({lock:!0});case 3:r.props.form.validateFieldsAndScroll(null,{},function(e,t){if(e&&Object.getOwnPropertyNames(e).length)r.setState({lock:!1});else{var n=Object.assign({},t);n.deptid||delete n.deptid,n.num||delete n.num,r.handleFetch(n).then(function(e){200==e.code&&(h.message.success("操作成功"),r.props.done()),r.setState({lock:!1})})}});case 4:case"end":return e.stop()}},e,u)}));return function(t){return e.apply(this,arguments)}}(),r.render=function(e){var t=r.props.form.getFieldDecorator,n={labelCol:{xs:{span:24},sm:{span:4}},wrapperCol:{xs:{span:24},sm:{span:20}}};return p.default.createElement(h.Modal,{title:r.props.config.title,onOk:r.handleOk,visible:r.props.config.visible,confirmLoading:r.state.loading,onCancel:r.props.onCancel,style:{top:50,marginBottom:100},okText:"提交",cancelText:"取消"},p.default.createElement(h.Form,null,r.state.rules.map(function(e,r){return p.default.createElement(y,l({},n,{key:r,label:e.label}),t(e.key,e.option)(e.render()))})))},i=n,c(r,i)}return i(t,e),f(t,[{key:"componentWillReceiveProps",value:function(){function e(e){return t.apply(this,arguments)}var t=a(s.default.mark(function e(t){var n;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.config!=this.props.config&&t.config.visible&&("edit"!=t.config.type?this.props.form.resetFields():(n=t.config.item,console.log(n),this.props.form.setFields({name:{value:n.name},tips:{value:n.tips},num:{value:n.num}})));case 1:case"end":return e.stop()}},e,this)}));return e}()}]),t}(d.Component),g=h.Form.create()(v);t.default=g},54:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(a,o){try{var c=t[a](o),i=c.value}catch(e){return void n(e)}if(!c.done)return Promise.resolve(i).then(function(e){r("next",e)},function(e){r("throw",e)});e(i)}return r("next")})}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u,s,l=n(21),f=r(l),d=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),p=n(1),h=r(p),m=n(11),y=n(5),v=n(93),g=n(12),b=n(89),w=r(b),k=n(120),x=r(k),O=n(97),_=r(O),E=y.Button.Group,j=(u=(0,m.connect)(function(e){return{}},function(e){return{getRoleTree:function(){e({type:g.GET_ROLE_TREE})}}}))(s=function(e){function t(){var e,n,r,i,u=this;o(this,t);for(var s=arguments.length,l=Array(s),d=0;d<s;d++)l[d]=arguments[d];return n=r=c(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(l))),r.state=Object.assign({},r.state,{search:Object.assign({},r.state.pageconf),columns:[{title:"名称",dataIndex:"name"},{title:"排序",dataIndex:"num"},{title:"说明",dataIndex:"tips"}],editModalConf:{visible:!1,item:{}},roleModal:{visible:!1,item:{}}}),r.search=function(){var e=a(f.default.mark(function e(t){var n;return f.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({loading:!0,selected:{}});case 2:return n=Object.assign({},r.state.search),n.roleName||delete n.roleName,e.abrupt("return",(0,v.getRoleList)(n).then(function(e){var t=void 0;t=e.data.records.map(function(e){return Object.assign({},e,{key:e.id})}),r.setState({tabledata:t,loading:!1,pagination:Object.assign({},r.state.pagination,{total:e.data.total,current:e.data.current})})}));case 5:case"end":return e.stop()}},e,u)}));return function(t){return e.apply(this,arguments)}}(),r.deleteBack=function(){var e=a(f.default.mark(function e(t){return f.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:r.search(),r.props.getRoleTree();case 2:case"end":return e.stop()}},e,u)}));return function(t){return e.apply(this,arguments)}}(),r.delete=function(e){r.handleOk(v.deleteRole,"roleId","删除","deleteBack")},r.done=function(){var e=a(f.default.mark(function e(t){var n,a;return f.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(n=r.state.editModalConf.type,a={},a[t]={visible:!1,item:{}},r.setState(a),"add"!=n||"editModalConf"!=t){e.next=8;break}r.research(),e.next=11;break;case 8:return e.next=10,r.setState({selected:{}});case 10:r.search();case 11:case"end":return e.stop()}},e,u)}));return function(t){return e.apply(this,arguments)}}(),r.renderSearch=function(e){return h.default.createElement("div",{className:"mgrSearchBar"},h.default.createElement(y.Input,{value:r.state.search.roleName,suffix:r.state.search.roleName?h.default.createElement(y.Icon,{type:"close-circle",onClick:function(e){return r.changeSearch({roleName:""})}}):null,onChange:function(e){return r.changeSearch({roleName:e.target.value})},addonBefore:"角色名称"}),h.default.createElement(y.Button,{onClick:r.search,type:"primary",icon:"search"},"搜索"),h.default.createElement(E,null,h.default.createElement(y.Button,{onClick:function(e){return r.addmodal("editModalConf","添加角色")},type:"primary",icon:"plus"},"添加"),h.default.createElement(y.Button,{onClick:function(e){return r.editmodal("editModalConf","编辑角色")},type:"primary",icon:"edit"},"修改"),h.default.createElement(y.Button,{onClick:r.changemodel,type:"primary",icon:"close"},"删除"),h.default.createElement(y.Button,{onClick:function(e){return r.editmodal("roleModal","权限配置")},type:"primary",icon:"usb"},"权限配置")))},r.rendermodal=function(e){return h.default.createElement("div",null,h.default.createElement(y.Modal,{title:"信息",visible:r.state.visible,onOk:r.delete,mask:!1,width:400,onCancel:r.changemodel,okText:"确认",cancelText:"取消"},h.default.createElement("p",null,"是否删除？")),h.default.createElement(x.default,{onCancel:function(e){return r.cancelform("editModalConf")},done:function(e){return r.done("editModalConf")},config:r.state.editModalConf}),h.default.createElement(_.default,{onCancel:function(e){return r.cancelform("roleModal")},done:function(e){return r.done("roleModal")},config:r.state.roleModal}))},i=n,c(r,i)}return i(t,e),d(t,[{key:"componentWillMount",value:function(){function e(){return t.apply(this,arguments)}var t=a(f.default.mark(function e(){return f.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.search();case 1:case"end":return e.stop()}},e,this)}));return e}()}]),t}(w.default))||s;t.default=j},89:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(a,o){try{var c=t[a](o),i=c.value}catch(e){return void n(e)}if(!c.done)return Promise.resolve(i).then(function(e){r("next",e)},function(e){r("throw",e)});e(i)}return r("next")})}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=n(21),s=r(u),l=n(1),f=r(l),d=n(5),p=n(9),h=function(e){function t(){var e,n,r,i,u=this;o(this,t);for(var l=arguments.length,h=Array(l),m=0;m<l;m++)h[m]=arguments[m];return n=r=c(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(h))),r.state={columns:[],selectedtable:!0,selected:{},loading:!0,tabledata:[],visible:!1,search:{},pageconf:{limit:10,offset:0},pagination:{total:1,current:1,pageSize:10,onChange:function(e,t){return r.pageChange(e,t)}}},r.pageChange=function(){var e=a(s.default.mark(function e(t,n){return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({search:Object.assign({},r.state.search,{offset:(t-1)*n})});case 2:r.search();case 3:case"end":return e.stop()}},e,u)}));return function(t,n){return e.apply(this,arguments)}}(),r.onselect=function(e,t){r.setState({selected:{selectedKeys:e,selectedItems:t}})},r.orderdetail=function(){var e=a(s.default.mark(function e(t){return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({selected:{selectedKeys:[t.id],selectedItems:[t]}});case 2:r.addpane(1);case 3:case"end":return e.stop()}},e,u)}));return function(t){return e.apply(this,arguments)}}(),r.setselect=function(){var e=a(s.default.mark(function e(t,n){return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({selected:{selectedKeys:[t.id],selectedItems:[t]}});case 2:n();case 3:case"end":return e.stop()}},e,u)}));return function(t,n){return e.apply(this,arguments)}}(),r.changeSearch=function(e){var t=Object.assign({},r.state.search,e,r.state.pageconf);r.setState({search:t})},r.handleTime=function(e,t){e[t]?e[t]=(0,p.momentFormat)(e[t]):delete e[t]},r.research=function(){var e=a(s.default.mark(function e(t){return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({search:Object.assign({},r.state.pageconf),selected:{}});case 2:r.search();case 3:case"end":return e.stop()}},e,u)}));return function(t){return e.apply(this,arguments)}}(),r.changemodel=function(e){r.state.selected.selectedKeys&&r.state.selected.selectedKeys.length?r.setState({visible:!r.state.visible}):d.message.warning("请选中表格中的某一记录！")},r.cancelform=function(e){var t={};t[e]=Object.assign({},r.state[e],{visible:!1,item:{}}),r.setState(t)},r.addmodal=function(){var e=a(s.default.mark(function e(t,n){var a;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a={},a[t]={title:n,visible:!0,type:"add"},r.setState(a);case 3:case"end":return e.stop()}},e,u)}));return function(t,n){return e.apply(this,arguments)}}(),r.editmodal=function(){var e=a(s.default.mark(function e(t,n){var a;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:r.state.selected.selectedKeys&&r.state.selected.selectedKeys.length?(a={},a[t]={title:n,visible:!0,type:"edit",item:r.state.selected.selectedItems[0]},r.setState(a)):d.message.warning("请选中表格中的某一记录！");case 1:case"end":return e.stop()}},e,u)}));return function(t,n){return e.apply(this,arguments)}}(),r.handleOk=function(){var e=a(s.default.mark(function e(t,n,o){var c,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"search";return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!r.state.selected.selectedKeys||!r.state.selected.selectedKeys.length){e.next=8;break}return e.next=3,r.setState({confirmLoading:!0});case 3:c={},c[n]=r.state.selected.selectedKeys[0],t(c).then(function(){var e=a(s.default.mark(function e(t){return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({visible:!1,confirmLoading:!1});case 2:if(200!=t.code){e.next=6;break}return d.message.success(o+"成功"),r[i](),e.abrupt("return");case 6:case"end":return e.stop()}},e,u)}));return function(t){return e.apply(this,arguments)}}()),e.next=9;break;case 8:d.message.warning("请选中表格中的某一记录！");case 9:case"end":return e.stop()}},e,u)}));return function(t,n,r){return e.apply(this,arguments)}}(),r.selectJudge=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=r.state.selected;n.selectedKeys&&n.selectedKeys.length?t?e(n.selectedKeys,n.selectedItems):e(n.selectedKeys[0],n.selectedItems[0]):d.message.warning("请选中表格中的某一记录！")},r.renderSearch=function(e){return null},r.renderBtn=function(e){return null},r.renderBottomBtn=function(e){return null},r.rendermodal=function(e){return null},r.renderTable=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:r.state.pagination;return f.default.createElement(d.Table,{size:"small",bordered:!0,loading:r.state.loading,rowSelection:e,columns:r.state.columns,pagination:t,locale:{emptyText:"暂无数据"},dataSource:r.state.tabledata})},r.render=function(e){var t={type:"radio",selectedRowKeys:r.state.selected.selectedKeys,onChange:r.onselect};return f.default.createElement("div",{className:"mgrWrapper"},r.renderSearch(),r.renderBtn(),r.renderTable(r.state.selectedtable?t:null),r.renderBottomBtn(),r.rendermodal())},i=n,c(r,i)}return i(t,e),t}(l.Component);t.default=h},93:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.setAuthority=t.getAuthTree=t.editRole=t.addRole=t.getRoleTree=t.deleteRole=t.getRoleList=void 0;var r=n(10),a=function(e){return e&&e.__esModule?e:{default:e}}(r);t.getRoleList=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return a.default.fetchPost("/role/list",e)},t.deleteRole=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return a.default.fetchPost("/role/remove",e)},t.getRoleTree=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return a.default.fetchPost("/role/roleTreeListByUserId",e)},t.addRole=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return a.default.fetchPost("/role/add",e)},t.editRole=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return a.default.fetchPost("/role/edit",e)},t.getAuthTree=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return a.default.fetchGet("/menu/menuTreeListByRoleId/"+e.id)},t.setAuthority=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return a.default.fetchPost("/role/setAuthority",e)}},97:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(a,o){try{var c=t[a](o),i=c.value}catch(e){return void n(e)}if(!c.done)return Promise.resolve(i).then(function(e){r("next",e)},function(e){r("throw",e)});e(i)}return r("next")})}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=n(21),s=r(u),l=n(1),f=r(l),d=n(5),p=n(93),h=d.Tree.TreeNode,m=function(e){function t(){var e,n,r,i,u=this;o(this,t);for(var l=arguments.length,m=Array(l),y=0;y<l;y++)m[y]=arguments[y];return n=r=c(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(m))),r.componentWillReceiveProps=function(){var e=a(s.default.mark(function e(t){return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.config.item.id&&r.props.config.item.id!=t.config.item.id&&(0,p.getAuthTree)({id:t.config.item.id}).then(function(e){var t=[];!function(e){return e(e)}(function(e){return function(n){return n.map(function(n){if(n.checked&&t.push(n.id),n.childList&&n.childList.length)return e(e)(n.childList)})}})(e.data),r.setState({treeData:e.data,checkedKeys:{checked:t},expandKeys:[]})});case 1:case"end":return e.stop()}},e,u)}));return function(t){return e.apply(this,arguments)}}(),r.state={treeData:[],loading:!1,checkedKeys:{checked:[]},lock:!1,expandKeys:[]},r.handleOk=function(){var e=a(s.default.mark(function e(t){return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r.state.lock){e.next=4;break}return e.next=3,r.setState({lock:!0});case 3:(0,p.setAuthority)({roleId:r.props.config.item.id,ids:r.state.checkedKeys.checked.join(",")}).then(function(e){200==e.code&&(d.message.success("修改权限成功"),r.props.done()),r.setState({lock:!1})});case 4:case"end":return e.stop()}},e,u)}));return function(t){return e.apply(this,arguments)}}(),r.onCheck=function(e){r.setState({checkedKeys:e})},r.onCancel=function(e){r.setState({checkedKeys:{checked:[]}}),r.props.onCancel()},r.expand=function(e,t){r.setState({expandKeys:e})},r.render=function(e){return f.default.createElement(d.Modal,{title:r.props.config.title,style:{top:50,marginBottom:100},onOk:r.handleOk,visible:r.props.config.visible,confirmLoading:r.state.loading,onCancel:r.onCancel,okText:"保存",cancelText:"取消"},f.default.createElement("div",{className:"authTitle"},r.props.config.item.name),f.default.createElement(d.Tree,{checkable:!0,expandedKeys:r.state.expandKeys,onExpand:r.expand,onCheck:r.onCheck,checkStrictly:!0,checkedKeys:r.state.checkedKeys},function(e){return e(e)}(function(e){return function(t){return t.map(function(t){return t.childList&&t.childList.length?f.default.createElement(h,{title:t.name,key:t.id},e(e)(t.childList)):f.default.createElement(h,{title:t.name,key:t.id})})}})(r.state.treeData)))},i=n,c(r,i)}return i(t,e),t}(l.Component);t.default=m}});
//# sourceMappingURL=5.c27e4e925ef7742dd349.js.map