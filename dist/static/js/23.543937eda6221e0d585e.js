webpackJsonp([23],{38:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(a,s){try{var c=t[a](s),o=c.value}catch(e){return void n(e)}if(!c.done)return Promise.resolve(o).then(function(e){r("next",e)},function(e){r("throw",e)});e(o)}return r("next")})}}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=n(21),i=r(u),l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(1),d=(r(f),n(11),n(5),n(96)),p=n(89),h=r(p),v=function(e){function t(){var e,n,r,o,u=this;s(this,t);for(var l=arguments.length,f=Array(l),p=0;p<l;p++)f[p]=arguments[p];return n=r=c(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(f))),r.state={columns:[{title:"部门名称",dataIndex:"name"},{title:"部门代码",dataIndex:"code"},{title:"修改时间",dataIndex:"updateTime"},{title:"是否启用",dataIndex:"enabled",render:function(e){return e?"是":"否"}}],selected:{},loading:!0,tabledata:[],modalconf:{visible:!1,item:{}},search:{}},r.search=function(){var e=a(i.default.mark(function e(t){var n;return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({loading:!0,selected:{}});case 2:return n=Object.assign({},r.state.search),n.condition||delete n.condition,e.abrupt("return",(0,d.listDept)(n).then(function(e){var t=void 0;t=function(e){return e(e)}(function(e){return function(t){return t.map(function(t){var n=Object.assign({},t,{key:t.id});if(t.childrenDepts&&t.childrenDepts.length){var r=Object.assign({},n,{children:e(e)(t.childrenDepts)});return delete r.childrenDepts,r}return n})}})(e.data),r.setState({tabledata:t,loading:!1})}));case 5:case"end":return e.stop()}},e,u)}));return function(t){return e.apply(this,arguments)}}(),r.rendermodal=function(e){return[]},o=n,c(r,o)}return o(t,e),l(t,[{key:"componentWillMount",value:function(){function e(){return t.apply(this,arguments)}var t=a(i.default.mark(function e(){return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.search();case 1:case"end":return e.stop()}},e,this)}));return e}()}]),t}(h.default);t.default=v},89:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(a,s){try{var c=t[a](s),o=c.value}catch(e){return void n(e)}if(!c.done)return Promise.resolve(o).then(function(e){r("next",e)},function(e){r("throw",e)});e(o)}return r("next")})}}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=n(21),i=r(u),l=n(1),f=r(l),d=n(5),p=n(9),h=function(e){function t(){var e,n,r,o,u=this;s(this,t);for(var l=arguments.length,h=Array(l),v=0;v<l;v++)h[v]=arguments[v];return n=r=c(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(h))),r.state={columns:[],selectedtable:!0,selected:{},loading:!0,tabledata:[],visible:!1,search:{},pageconf:{limit:10,offset:0},pagination:{total:1,current:1,pageSize:10,onChange:function(e,t){return r.pageChange(e,t)}}},r.pageChange=function(){var e=a(i.default.mark(function e(t,n){return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({search:Object.assign({},r.state.search,{offset:(t-1)*n})});case 2:r.search();case 3:case"end":return e.stop()}},e,u)}));return function(t,n){return e.apply(this,arguments)}}(),r.onselect=function(e,t){r.setState({selected:{selectedKeys:e,selectedItems:t}})},r.orderdetail=function(){var e=a(i.default.mark(function e(t){return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({selected:{selectedKeys:[t.id],selectedItems:[t]}});case 2:r.addpane(1);case 3:case"end":return e.stop()}},e,u)}));return function(t){return e.apply(this,arguments)}}(),r.setselect=function(){var e=a(i.default.mark(function e(t,n){return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({selected:{selectedKeys:[t.id],selectedItems:[t]}});case 2:n();case 3:case"end":return e.stop()}},e,u)}));return function(t,n){return e.apply(this,arguments)}}(),r.changeSearch=function(e){var t=Object.assign({},r.state.search,e,r.state.pageconf);r.setState({search:t})},r.handleTime=function(e,t){e[t]?e[t]=(0,p.momentFormat)(e[t]):delete e[t]},r.research=function(){var e=a(i.default.mark(function e(t){return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({search:Object.assign({},r.state.pageconf),selected:{}});case 2:r.search();case 3:case"end":return e.stop()}},e,u)}));return function(t){return e.apply(this,arguments)}}(),r.changemodel=function(e){r.state.selected.selectedKeys&&r.state.selected.selectedKeys.length?r.setState({visible:!r.state.visible}):d.message.warning("请选中表格中的某一记录！")},r.cancelform=function(e){var t={};t[e]=Object.assign({},r.state[e],{visible:!1,item:{}}),r.setState(t)},r.addmodal=function(){var e=a(i.default.mark(function e(t,n){var a;return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a={},a[t]={title:n,visible:!0,type:"add"},r.setState(a);case 3:case"end":return e.stop()}},e,u)}));return function(t,n){return e.apply(this,arguments)}}(),r.editmodal=function(){var e=a(i.default.mark(function e(t,n){var a;return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:r.state.selected.selectedKeys&&r.state.selected.selectedKeys.length?(a={},a[t]={title:n,visible:!0,type:"edit",item:r.state.selected.selectedItems[0]},r.setState(a)):d.message.warning("请选中表格中的某一记录！");case 1:case"end":return e.stop()}},e,u)}));return function(t,n){return e.apply(this,arguments)}}(),r.handleOk=function(){var e=a(i.default.mark(function e(t,n,s){var c,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"search";return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!r.state.selected.selectedKeys||!r.state.selected.selectedKeys.length){e.next=8;break}return e.next=3,r.setState({confirmLoading:!0});case 3:c={},c[n]=r.state.selected.selectedKeys[0],t(c).then(function(){var e=a(i.default.mark(function e(t){return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setState({visible:!1,confirmLoading:!1});case 2:if(200!=t.code){e.next=6;break}return d.message.success(s+"成功"),r[o](),e.abrupt("return");case 6:case"end":return e.stop()}},e,u)}));return function(t){return e.apply(this,arguments)}}()),e.next=9;break;case 8:d.message.warning("请选中表格中的某一记录！");case 9:case"end":return e.stop()}},e,u)}));return function(t,n,r){return e.apply(this,arguments)}}(),r.selectJudge=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=r.state.selected;n.selectedKeys&&n.selectedKeys.length?t?e(n.selectedKeys,n.selectedItems):e(n.selectedKeys[0],n.selectedItems[0]):d.message.warning("请选中表格中的某一记录！")},r.renderSearch=function(e){return null},r.renderBtn=function(e){return null},r.renderBottomBtn=function(e){return null},r.rendermodal=function(e){return null},r.renderTable=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:r.state.pagination;return f.default.createElement(d.Table,{size:"small",bordered:!0,loading:r.state.loading,rowSelection:e,columns:r.state.columns,pagination:t,locale:{emptyText:"暂无数据"},dataSource:r.state.tabledata})},r.render=function(e){var t={type:"radio",selectedRowKeys:r.state.selected.selectedKeys,onChange:r.onselect};return f.default.createElement("div",{className:"mgrWrapper"},r.renderSearch(),r.renderBtn(),r.renderTable(r.state.selectedtable?t:null),r.renderBottomBtn(),r.rendermodal())},o=n,c(r,o)}return o(t,e),t}(l.Component);t.default=h},96:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.listOrgpost=t.listDept=void 0;var r=n(10),a=function(e){return e&&e.__esModule?e:{default:e}}(r);t.listDept=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return a.default.fetchGet("/department/list",e)},t.listOrgpost=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return a.default.fetchGet("/orgpost/list",e)}}});
//# sourceMappingURL=23.543937eda6221e0d585e.js.map