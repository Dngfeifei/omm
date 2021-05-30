// /*
//  * @Author: mikey.wangxinyue
//  */
import React, { Component } from "react";
import {
  Modal,
  Tree,
  message,
  Button,
  Row,
  Col,
  Form,
  Input,
  Select,
  Table,
  Card,
} from "antd";
// 引入 Tree树形组件
import TreeParant from "@/components/tree/index.jsx";
//引入新增弹出框
import MyModal from './AddalertConmponent/Addalert'
import {
 
  AddRoleGroup,
  EditRoleGroup,
  DelRoleGroup,
  
  AddRole,
  EditRole,
 
  GetResourceTree,
} from "/api/role.js";
//1:yurry渲染模糊列表树管理
import {GetsystemTree,GetList,GetDelete} from "/api/datajurisdiction.js"
import { GetDictInfo } from "/api/dictionary";
import Pagination from "/components/pagination";
const { confirm } = Modal;
const { TreeNode } = Tree;
const { Option } = Select;
const FormItem = Form.Item;
const assignment = (data) => {
  data.forEach((list, i) => {
    list.key = list.id;
    list.value = list.id;
    if (list.hasOwnProperty("metaCategoryName")) {
      list.title = list.metaCategoryName;
    } 
    if (list.hasOwnProperty("children")) {
      if (list.children.length > 0) {
        assignment(list.children);
      }
    } else {
      return;
    }
  });
};
class Access extends Component {
  SortTable = () => {
    setTimeout(() => {
      let h = this.tableDom.clientHeight - 100;
      this.setState({
        h: {
          y: h,
        },
      });
    }, 0);
  };
  componentDidMount() {
    this.SortTable();
    //窗口变动的时候调用
    window.onresize = () => {
       this.SortTable();
    };
  }
  async componentWillMount() {
    // 查询左侧树
    this.searchTree();
    // 获取下拉框数据
    this.getDictData();
    // 请求角色所要挂载的全量资源数据
    GetResourceTree().then((res) => {
      if (res.success != 1) {
        message.error("请求错误");
        return;
      } else {
        //给tree数据赋值key title
        assignment(res.data);
        this.setState({
          resourceData: res.data,
        });
      }
    });
  }
  state = {
    //新增按钮弹出框快关
    visible: false,
    addTitle: '新增',
    updateTitle: '新增',
    statusModal: 0,
    updataModal: {},
    // 表格默认滚动高度
    h: { y: 240 },
    // 首次进入
    newEntry: true,
    // tree节点搜索高亮配置
    expandedKeys: [],
    searchValue: "",
    autoExpandParent: true,
    // 分页参数
    pageConf: {
      limit: 10,
      offset: 0,
    },
    // 分页配置
    pagination: {
      pageSize: 10,
      current: 1,
      total: 0,
    },
    // 分页配置
    // 请求加锁 防止多次请求
    lock: false,
    // 资源类型
    comboBox: {
      status: [],
    },
    //左侧角色树相关数据
    tree: {
      //右侧角色树数据
      treeData: [],
    }, 
    // treeDataList: [],
    //右侧table相关数据
    table: {
      //右侧角色表格配置
      columns: [
        {
          title: "序号",
          dataIndex: "key",
          editable: false,
          align: "center",
          width: "80px",
          render: (text, record, index) => `${index + 1}`,
        },
        {
          title: "权限对象",
          dataIndex: "positionName",
          align: "center",
        },
        {
          title: "权限点",
          dataIndex: "functionName",
          align: "center",
          // render: (t, r) => {
          //   t.toString();
          //   if (t == "1") {
          //     return "启用";
          //   } else if (t == "0") {
          //     return "禁用";
          //   }
          // },
        },
        {
          title: "配置属性",
          dataIndex: "configFieldInfo",
          align: "center",
        },
      ],
      //右侧角色表格数据
      rolesData: [],
    },
    //新增修改角色组弹窗配置
    roleGroupWindow: {
      roleGroupModal: false, //弹窗是否显示可见
      roleGroupModalType: 0, //0新增  1修改
      roleGroupModalTitle: "新增", //弹窗title
    },
    //角色组参数数据
    newRoleGroup: {
      //tree当前选中项ID
      treeSelect: null,
      //新增或修改后的角色组数据
      newRoleGroupVal: null,
    },
    //新增修改角色弹窗配置
    roleWindow: {
      roleModal: false,
      roleModalType: 0, //0新增  1修改
      roleModalTitle: "新增",
    },
    //右侧查询表单参数
    searchRoleName: null,
    searchListID: null,
    //当前选中角色数据
    currentRole: {
      id: null,
      roleName: null,
      status: null,
      resources: [],
    },
    //表格选中项
    tableSelecteds: [],
    tableSelectedInfo: [],
    //资源树数据
    resourceData: null,
  };

  //角色组树数据查询
  searchTree = async () => {
    //请求角色组数据 右侧表格渲染第一列角色数据
    GetsystemTree().then((res) => {
      if (res.success != 1) {
        message.error("请求错误");
        return;
      } else {
        assignment(res.data);
        this.setState({
          searchListID: res.data[0].id,
          tree: { treeData: res.data },
        });
        // this.generateList(res.data)
        // if (this.state.newEntry && res.data) {
        //   this.setState({
        //     searchListID: res.data[0].id,
        //     newRoleGroup: {
        //       treeSelect: res.data[0].id,
        //       newRoleGroupVal: res.data[0].roleCategoryName,
        //     },
        //   });
        //   this.searchRoleFun(res.data[0].id);
        //   this.setState({ newEntry: false });
        // }
      }
    });
  };
  //新增角色组
  addRoleGroup = () => {
    // 新增内容区域内容置空 新增内容区域显示
    let select = this.state.newRoleGroup.treeSelect;
    this.setState({
      newRoleGroup: {
        treeSelect: select,
        newRoleGroupVal: null,
      },
      roleGroupWindow: {
        roleGroupModal: true,
        roleGroupModalType: 0,
        roleGroupModalTitle: "新增角色组",
      },
    });
  };
  //编辑角色组
  editRoleGroup = () => {
    let selected = this.state.newRoleGroup.treeSelect;
    //1 判断角色组tree是否有选中 如无选中提示无选中数据无法修改
    if (selected == "" || selected == null) {
      message.destroy();
      message.warning("没有选中数据,无法进行修改!");
      return;
    }
    //2 编辑弹窗展示
    this.setState({
      roleGroupWindow: {
        roleGroupModal: true,
        roleGroupModalType: 1,
        roleGroupModalTitle: "修改角色组",
      },
    });
  };
  //删除角色组
  delRoleGroup = async (_) => {
    //1 判断角色组tree是否有选中 如无选中提示无选中数据无法删除
    let selected = this.state.newRoleGroup.treeSelect;
    if (selected == "" || selected == null) {
      message.destroy();
      message.warning("没有选中数据,无法进行删除!");
      return;
    }
    //2 获取选中项  发起删除请求
    let params = this.state.newRoleGroup.treeSelect; //参数 id和角色组名称
    let _this = this;
    confirm({
      title: "删除",
      content: "删除后不可恢复,确定删除吗？",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        DelRoleGroup({ id: params }).then((res) => {
          if (res.success != 1) {
            message.error(res.message);
            return;
          } else {
            // 重新查询渲染数据
            _this.searchTree();
            // 选中项已删除,存储的选中项数据置为空
            _this.setState({
              newRoleGroup: {
                treeSelect: null,
                newRoleGroupVal: null,
              },
              searchListID: [],
            });
          }
        });
      },
    });
  };
  // 树选中后
  onTreeSelect = async (selectedKeys, info) => {
    if (!info.selected) {
      this.setState({
        newRoleGroup: {
          treeSelect: null,
          newRoleGroupVal: null,
        },
        searchListID: [],
      });
      let table = Object.assign({}, this.state.table, { rolesData: [] });
      let pagination = Object.assign({}, this.state.pagination, {
        total: 0,
        current: 1,
      });
      let pageConf = Object.assign({}, this.state.pageConf, {
        offset: 0,
      });
      this.setState({
        table: table,
        pagination: pagination,
        pageConf: pageConf,
      });
      return;
    }
    let data = info.selectedNodes[0].props.dataRef;
    this.setState({
      newRoleGroup: {
        treeSelect: data.id,
        newRoleGroupVal: data.roleCategoryName,
      },
      searchListID: data.id,
      tableSelecteds: [],
      tableSelectedInfo: [],
    });
    // 选中后请求角色数据
    this.searchRoleFun(data.id);
  };
  // 打开节点
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  //获取新增或修改后的角色组名称
  getNewRoleGroupVal = (e) => {
    let newRoleGroup = Object.assign({}, this.state.newRoleGroup, {
      newRoleGroupVal: e.target.value,
    });
    this.setState({
      newRoleGroup: newRoleGroup,
    });
  };
  //保存新增或修改后的角色组名称
  saveRoleGroup = (_) => {
    //1 获取input数据
    let val = this.state.newRoleGroup.newRoleGroupVal;
    //2 校验数据 不能为空 空：提示名称为空不能保存
    if (val == "" || val == null) {
      message.destroy();
      message.warning("名称为空，不能保存数据!");
      return;
    }
    if (this.state.lock) {
      return;
    } else {
      this.setState({ lock: true });
    }
    //3 判断保存类型是新增还是修改
    if (this.state.roleGroupWindow.roleGroupModalType == 0) {
      //新增 请求新增方法
      let params = {
        parentId: this.state.newRoleGroup.treeSelect,
        roleCategoryName: this.state.newRoleGroup.newRoleGroupVal,
      };
      AddRoleGroup(params).then((res) => {
        if (res.success != 1) {
          message.error(res.message);
          this.setState({ lock: false });
          return;
        } else {
          // 4 请求完成后关闭弹窗并将输入框赋值为空
          this.setState({
            roleGroupWindow: {
              roleGroupModal: false,
            },
            newRoleGroup: Object.assign({}, this.state.newRoleGroup, {
              newRoleGroupVal: "",
            }),
            lock: false,
          });
          //5 左侧角色组tree刷新
          this.searchTree();
        }
      });
    } else if (this.state.roleGroupWindow.roleGroupModalType == 1) {
      //修改 请求修改方法
      let params = {
        id: this.state.newRoleGroup.treeSelect,
        roleCategoryName: this.state.newRoleGroup.newRoleGroupVal,
      };
      EditRoleGroup(params).then((res) => {
        if (res.success != 1) {
          message.error(res.message);
          this.setState({ lock: false });
          return;
        } else {
          // 4 请求完成后关闭弹窗并将输入框赋值为空
          this.setState({
            roleGroupWindow: {
              roleGroupModal: false,
            },
            lock: false,
          });
          this.searchTree();
        }
      });
    }
  };
  //点击行选中选框
  onRow = (record) => {
    return {
      onClick: () => {
        let selectedKeys = [record.id],
          selectedItems = [record];
        this.setState({
          tableSelecteds: selectedKeys,
          tableSelectedInfo: selectedItems,
        });
      },
    };
  };
  // 角色名称查询
//   searchRoleNameFun = () => {
//     let id = this.state.searchListID;
//     let name = this.state.searchRoleName;
//     //1 判断角色组tree是否有选中 如无选中提示无选中 无法查询
//     if (id == "" || id == null) {
//       message.destroy();
//       message.warning("请先选中左侧角色组，然后再进行查询。");
//       return;
//     }
//     // if (name == "" || name == null) {
//     //     message.destroy()
//     //     message.warning('请先输入查询内容，然后再进行查询。');
//     //     return
//     // }
//     // 2 发起查询请求 查询后结构给table赋值
//     // 选中后请求角色数据
//     let params = Object.assign(
//       {},
//       {
//         businessKey: id,
//         roleName: name,
//       },
//       this.state.pageConf
//     );
// debugger
//     GetList(params).then((res) => {
//       console.log(res)
//       if (res.success == 1) {
//         let data = Object.assign({}, this.state.table, {
//           rolesData: res.data.records,
//         });
//         let pagination = Object.assign({}, this.state.pagination, {
//           total: res.data.total,
//         });
//         this.setState({ table: data, pagination: pagination });
//       } else {
//         message.error(res.message);
//       }
//     });
//   };
  // 角色名称查询
  searchRoleNameFun2 = (pageConf) => {
    let id = this.state.searchListID;
    let name = this.state.searchRoleName;
    //1 判断角色组tree是否有选中 如无选中提示无选中 无法查询
    if (id == "" || id == null) {
      message.destroy();
      message.warning("请先选中左侧角色组，然后再进行查询。");
      return;
    }
    // 2 发起查询请求 查询后结构给table赋值
    // 选中后请求角色数据
    let params = Object.assign({}, {
      businessKey:id,
      roleName: name,
  }, this.state.pageConf)

    GetList(params).then((res) => {
      console.log(res)
      if (res.success == 1) {
        let data = Object.assign({}, this.state.table, {
          rolesData: res.data.records,
        });
        let pagination = Object.assign({}, this.state.pagination, {
          total: res.data.total,
          pageSize: res.data.size,
          current: res.data.current,
        });
        let pageConf = Object.assign({}, this.state.pagination, {
          limit: res.data.size,
          offset: (res.data.current - 1) * res.data.size,
        });
        this.setState({
          table: data,
          pagination: pagination,
          pageConf: pageConf,
        });
      } else {
        message.error("请求失败,请重试！");
      }
    });
  };
  // 角色列表获取
  searchRoleFun = (id) => {
    //1 判断角色组tree是否有选中 如无选中提示无选中 无法查询
    if (id == "" || id == null) {
      message.warning("请先选中左侧角色组，然后再进行查询。");
      return;
    }
    // 2 发起查询请求 查询后结构给table赋值
    // 选中后请求角色数据
    let params = Object.assign(
      {},
      {
        businessKey: id,
      },
      this.state.pageConf,
      { offset: 0 }
    );
   

    GetList(params).then((res) => {
      if (res.success == 1) {
        let data = Object.assign({}, this.state.table, {
          rolesData: res.data.records,
        });
        let pagination = Object.assign({}, this.state.pagination, {
          total: res.data.total,
          pageSize: res.data.size,
          current: res.data.current,
        });
        let pageConf = Object.assign({}, this.state.pagination, {
          limit: res.data.size,
          offset: (res.data.current - 1) * 10,
        });
        this.setState({
          table: data,
          pagination: pagination,
          pageConf: pageConf,
        });
      } else {
        message.error(res.message);
      }
    });
  };
  // 点击添加，按钮的弹出框
  // addRoleItem = (_) => {
    // let id = this.state.searchListID
    // //1 判断角色组tree是否有选中 如无选中提示无选中 无法新增角色
    // if (id == "" || id == null) {
    //     message.warning('请先选中左侧角色组，然后再进行角色新增。');
    //     return
    // }
    // this.setState({
    //     roleWindow: {
    //         roleModal: true,
    //         roleModalType: 0,
    //         roleModalTitle: "新增"
    //     },
    // })
  // };
// 点击新增按钮的弹出框yurry
  showModel = () => {
    let visible = this.state.visible;
    this.setState({
      visible: !visible,
      statusModal: 0
    })
  }
  // 点击新增按钮的弹出框yurry
  onCancel = () => {
    console.log('cancel');
    this.setState({
      visible: false,
      key: Math.random()
    });
  }

  // 点击修改，按钮的弹出框
  editRoleItem = () => {
    if (
      !this.state.tableSelectedInfo ||
      this.state.tableSelectedInfo.length == 0
    ) {
      message.destroy();
      message.warning("没有选中数据,无法进行修改!");
      return;
    }
    let row = this.state.tableSelectedInfo[0];
    let visible = this.state.visible;
    this.setState({
      statusModal: 1,
      updataModal: row,
      searchListID: row.businessKey,
      visible: !visible,
    })




    // let ids = [];
    // if (row.resources && row.resources.length > 0) {
    //   if (row.resources[0]) {
    //     row.resources.forEach((item) => {
    //       //代码修改过，源代码为 ids.push(item.id)
    //       let item1 = this.getId(this.state.resourceData, item.id);
    //       !item1 && ids.push(item.id);
    //       //代码修改过，源代码为 ids.push(item.id)
    //     });
    //   }
    // }
    // this.setState({
    //   roleWindow: {
    //     roleModal: true,
    //     roleModalType: 1,
    //     roleModalTitle: "修改角色",
    //   },
    //   currentRole: {
    //     id: row.id,
    //     roleName: row.roleName,
    //     status: row.status.toString(),
    //     resources: ids,
    //   },
    // });
  };

  //角色表格单项删除
  delRoleItem = async (arr) => {
    if (
      !this.state.tableSelectedInfo ||
      this.state.tableSelectedInfo.length == 0
    ) {
      message.destroy();
      message.warning("没有选中数据,无法进行删除!");
    }
    let id = this.state.tableSelectedInfo[0].id;
    let _this = this;
    confirm({
      title: "删除",
      content: "删除后不可恢复,确定删除吗？",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        GetDelete({ id: id }).then((res) => {
          if (res.success == 1) {
            _this.searchRoleFun(_this.state.searchListID);
            _this.setState({
              tableSelecteds: [],
              tableSelectedInfo: [],
            });
          } else {
            message.error(res.message);
          }
        });
      },
    });
  };
  // 角色数据保存
  editRoleSave = async () => {
    // 1 校验必填数据是否填写
    // 表单数据
    let formData = this.state.currentRole;
    if (
      !formData.roleName ||
      formData.roleName.length == "" ||
      formData.roleName.length == 0
    ) {
      message.destroy();
      message.error("请输入角色名称");
      return;
    }

    if (
      !formData.status &&
      formData.status === null &&
      typeof formData.status != "number"
    ) {
      message.destroy();
      message.error("请选择角色状态");
      return;
    }
    // 当前表单编辑类型（保存或修改）
    let type = this.state.roleWindow.roleModalType;
    // 当前选择的角色组ID
    let id = this.state.searchListID;
    // 资源树选中数组
    let resourceArr = [];
    // 过滤掉含有子节点的父节点
    // formData.resourcesInfo.checkedNodes.forEach((item) => {
    //     if (item.props.parentResourceId ) {
    //         resourceArr.push(({ id:item.props.id})
    //     }
    //     if (!item.props.parentResourceId && !item.props.children.length) {
    //         resourceArr.push({ id:item.props.id})
    //     }
    // })
    /* if (formData.resources && formData.resources.length > 0) {
            formData.resources.forEach(item => {
                resourceArr.push({ id: item })
            })
        }原代码*/

    //重新格式化上传数据
    let updata = [];
    if (formData.resources && formData.resources.length > 0) {
      formData.resources.forEach((item) => {
        let item1 = this.getParentId(this.state.resourceData, item);
        updata = [...updata, ...item1, ...[item]];
      });
    }
    updata = Array.from(new Set(updata));
    if (updata && updata.length > 0) {
      updata.forEach((item) => {
        resourceArr.push({ id: item });
      });
    }
    if (!type) {
      // 新增保存
      let params = {
        roleName: formData.roleName,
        status: formData.status,
        resources: resourceArr,
        roleCategoryId: id,
      };
      if (this.state.lock) {
        return;
      } else {
        this.setState({ lock: true });
      }
      AddRole(params).then((res) => {
        if (res.success == 1) {
          this.setState({
            roleWindow: {
              roleModal: false,
              roleModalType: null, //0新增  1修改
              roleModalTitle: null,
            },
            currentRole: {
              roleCode: null,
              roleName: null,
              status: null,
              resources: [],
            },
            tableSelecteds: [],
            // tableSelectedInfo: []
          });
          this.searchRoleFun(id);
          message.success("操作成功");
        } else {
          message.error(res.message);
        }
        this.setState({ lock: false });
      });
    } else {
      {
        // 修改保存
        let params = {
          roleName: formData.roleName,
          status: formData.status,
          id: formData.id,
          resources: resourceArr,
        };
        if (this.state.lock) {
          return;
        } else {
          this.setState({ lock: true });
        }

        EditRole(params).then((res) => {
          if (res.success == 1) {
            this.setState({
              roleWindow: {
                roleModal: false,
                roleModalType: null, //0新增  1修改
                roleModalTitle: null,
              },
              currentRole: {
                roleCode: null,
                roleName: null,
                status: null,
                resources: [],
              },
              tableSelecteds: [formData.id],
              tableSelectedInfo: [params],
            });
            this.searchRoleFun(id);
            message.success("操作成功");
          } else {
            message.error(res.message);
          }
          this.setState({ lock: false });
        });
      }
    }
  };
  // 角色表格批量删除
  delRoleItems = async () => {
    let arr = this.state.tableSelecteds;
    if (arr && arr.length) {
      this.delRoleItem(arr);
    } else {
      message.destroy();
      message.warning("请先选中要删除的数据，然后再进行批量删除操作。");
    }
  };
  //获取角色名称查询选项
  getSearchRoleName = (e) => {
    let newData = Object.assign({}, { searchRoleName: e.target.value });
    this.setState({
      searchRoleName: e.target.value,
    });
  };
  // 分页页码变化
  pageIndexChange = (current, pageSize) => {
    let pageConf = Object.assign({}, this.state.pageConf, {
      offset: (current - 1) * pageSize,
    });
    this.setState({
      pageConf: pageConf,
      tableSelecteds: [],
      tableSelectedInfo: [],
    });
    this.searchRoleNameFun2(pageConf);
  };
  // 分页条数变化
  pageSizeChange = (current, pageSize) => {
    // let pagination = Object.assign({}, this.state.pageConf, { pageSize: pageSize });
    // this.setState({
    //     pageConf: pageConf,
    // })
    // this.searchRoleNameFun2(pageConf)
    let pageConf = Object.assign({}, this.state.pageConf, { limit: pageSize });
    this.setState({
      pageConf: pageConf,
      tableSelecteds: [],
      tableSelectedInfo: [],
    });
    this.searchRoleNameFun2(pageConf);
  };
  //获取新增或修改后的角色名称
  getroleName = (e) => {
    let newData = Object.assign({}, this.state.currentRole, {
      roleName: e.target.value,
    });
    this.setState({
      currentRole: newData,
      tableSelecteds: [],
      tableSelectedInfo: [],
    });
  };
  //获取新增或修改后的角色状态
  getstatus = (e) => {
    let newData = Object.assign({}, this.state.currentRole, { status: e });
    this.setState({
      currentRole: newData,
    });
  };

  // 表格选中后
  onTableSelect = (selectedRowKeys, info) => {
    //获取table选中项
    this.setState({
      tableSelecteds: selectedRowKeys,
      tableSelectedInfo: info,
    });
  };
  // 资源树选中后
  onCheck = (checkedKeys, info) => {
    let obj = Object.assign({}, this.state.currentRole, {
      resources: checkedKeys,
      resourcesInfo: info,
    });
    this.setState({
      currentRole: obj,
    });
  };
  getDictData = () => {
    GetDictInfo({ dictCode: "status" }).then((res) => {
      if (res.success != 1) {
        message.error(res.message);
      } else {
        let comboBox = Object.assign({}, this.state.comboBox, {
          status: res.data,
        });
        this.setState({ comboBox: comboBox });
      }
    });
  };
  //判断该节点是否渲染
  getId = (list, id) => {
    for (let i in list) {
      if (list[i].id == id && list[i].children && list[i].children.length) {
        return true;
      }
      if (list[i].children) {
        let node = this.getId(list[i].children, id);
        if (node) {
          return true;
        }
      }
    }
  };

  //获取父节点数据
  getParentId = (list, id) => {
    for (let i in list) {
      if (list[i].id == id) {
        return [];
      }
      if (list[i].children) {
        let node = this.getParentId(list[i].children, id);
        if (node !== undefined) {
          console.log(list[i]);
          return node.concat(list[i].id);
        }
      }
    }
  };
  render = (_) => {
    const { h } = this.state;
    const {loading,dialog,message}=this.state;
    return (
      <div
        style={{ background: " #fff", height: "100%" }}
      >
        <Row gutter={24} className="main_height">
          <Col
            span={5}
            className="gutter-row"
            style={{
              backgroundColor: "white",
              paddingTop: "16px",
              height: "99.7%",
              borderRight: "5px solid #f0f2f5",
            }}
          >
            <TreeParant
              treeData={this.state.tree.treeData}
              // selectedKeys={[this.state.searchListID]}
              // addTree={this.addRoleGroup}
              // editTree={this.editRoleGroup}
              // deletetTree={this.delRoleGroup}
              onExpand={this.onExpand}
              onSelect={this.onTreeSelect} //点击树节点触发事件
              search={false}
              edit={false}
            ></TreeParant>
          </Col>
          <Col
            span={19}
            className="gutter-row main_height"
            style={{
              padding: "30px 10px 0",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              flexWrap: "nowrap",
            }}
          >
            <Form style={{ width: "100%" }}>
              <Row>
                {/* <Col span={12}>
                  <Input
                    addonBefore="角色名称"
                    placeholder="请输入"
                    value={this.state.searchRoleName}
                    onChange={this.getSearchRoleName}
                    style={{ width: "200px" }}
                  />
                  <Button type="primary" onClick={this.searchRoleNameFun}>
                    查询
                  </Button>
                </Col> */}
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button
                    type="info"
                    style={{ marginRight: "10px" }}
                    onClick={this.delRoleItem}
                  >
                    删除
                  </Button>
                  <Button
                    type="info"
                    style={{ marginRight: "10px" }}
                    onClick={this.editRoleItem}
                  >
                    修改
                  </Button>
                  {/* //yurry组件 */}
                  <Button type="primary" onClick={this.showModel}>
                    新增
                  </Button>
                  {
                    this.state.visible?<MyModal
                    
                    title={this.state.statusModal ? this.state.updateTitle : this.state.addTitle}
                    searchListID={this.state.searchListID}
                    updataModal={this.state.statusModal ? this.state.updataModal : ''}
                   onCancel={this.onCancel}>
               </MyModal> :null
                  }
                </Col>
              </Row>
            </Form>
            <div
              className="tableParson"
              style={{ flex: "auto" }}
              ref={(el) => (this.tableDom = el)}
            >
              <Table
                bordered
                onRow={this.onRow}
                rowSelection={{
                  onChange: this.onTableSelect,
                  selectedRowKeys: this.state.tableSelecteds,
                  type: "radio",
                }}
                dataSource={this.state.table.rolesData}
                columns={this.state.table.columns}
                style={{ marginTop: "20px" }}
                rowKey={"id"}
                pagination={false}
                scroll={h}
                size="small"
              />
              <Pagination
                current={this.state.pagination.current}
                pageSize={this.state.pagination.pageSize}
                total={this.state.pagination.total}
                onChange={this.pageIndexChange}
                onShowSizeChange={this.pageSizeChange}
                size="small"
              />
            </div>
          </Col>
        </Row>
        {/* 角色组新增修改弹窗 */}
        <Modal
          title={this.state.roleGroupWindow.roleGroupModalTitle}
          visible={this.state.roleGroupWindow.roleGroupModal}
          onCancel={(_) =>
            this.setState({ roleGroupWindow: { roleGroupModal: false } })
          }
          onOk={this.saveRoleGroup}
          cancelText="取消"
          okText="保存"
        >
          <Input
            addonBefore="角色组名称"
            placeholder="请输入"
            value={this.state.newRoleGroup.newRoleGroupVal}
            onChange={this.getNewRoleGroupVal}
            style={{ margin: "5% 10px", width: "90%" }}
          />
        </Modal>
        {/* 角色的新增修改弹窗 */}
        <Modal
          title={this.state.roleWindow.roleModalTitle}
          visible={this.state.roleWindow.roleModal}
          onCancel={(_) =>
            this.setState({
              roleWindow: { roleModal: false },
              currentRole: {
                roleCode: null,
                roleName: null,
                status: null,
              },
            })
          }
          onOk={(_) => this.editRoleSave()}
          width={650}
          style={{ top: 50, marginBottom: 100 }}
          okText="保存"
          cancelText="取消"
        >
          <FormItem label={"角色名称"} labelCol={{ span: 4 }}>
            <Input
              placeholder="请输入"
              value={this.state.currentRole.roleName}
              onChange={this.getroleName}
              style={{ width: "300px" }}
            />
          </FormItem>
          <FormItem label={"角色状态"} labelCol={{ span: 4 }}>
            <Select
              style={{ width: "300px" }}
              value={this.state.currentRole.status}
              onChange={this.getstatus}
            >
              {this.state.comboBox.status.map((t) => (
                <Option
                  key={t.itemCode.toString()}
                  value={t.itemCode.toString()}
                >
                  {t.itemValue}
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem
            style={{ margin: 0 }}
            label={"关联资源"}
            labelCol={{ span: 4 }}
          ></FormItem>
          <Card
            style={{ width: "500px", overflowY: "auto", marginLeft: "30px" }}
          >
            <Tree
              checkable
              onCheck={this.onCheck}
              autoExpandParent={true}
              checkedKeys={this.state.currentRole.resources}
              style={{ height: "200px" }}
              treeData={this.state.resourceData}
            />
          </Card>
        </Modal>
      </div>
    );
  };
}
const DataAccess = Form.create()(Access);
export default DataAccess;
