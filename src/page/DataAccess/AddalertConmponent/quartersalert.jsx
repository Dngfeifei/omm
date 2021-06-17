// /*2：岗位弹出框
//  * @Author: mikey.wangxinyue
//  */
import React, { Component } from "react";
// 引入 Tree树形组件
import TreeParant from "@/components/tree/index.jsx";
import { GetResourceTree} from "@/api/role.js";
import { GetDictInfo } from "@/api/dictionary";
import Pagination from "@/components/pagination";
import "@/assets/less/pages/quartersalert.css";
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
const { confirm } = Modal;
const { TreeNode } = Tree;
const { Option } = Select;
const FormItem = Form.Item;

//1:yurry渲染模糊列表树管理
import {GetgetTree,GetTreePaging} from "@/api/datajurisdiction.js"
//树结构
const assignment = (data) => {
  data.forEach((list, i) => {
    list.key = list.id;
    list.value = list.id;
    if (list.hasOwnProperty("positionCategoryName")) {
      list.title = list.positionCategoryName;
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

export default class MyModal extends Component {
  componentDidMount() {
    // this.SortTable();
    //窗口变动的时候调用
    window.onresize = () => {
      this.SortTable();
    };
  }
  SortTable = () => {
    // setTimeout(() => {
      // let h = this.tableDom.clientHeight - 100;
    //   this.setState({
    //     h: {
    //       y: h,
    //     },
    //   });
    // }, 0);
  };
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
  constructor(props) {
    super(props);
    this.state = {
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
            // title: "序号",
            dataIndex: "positionCategoryId",
            editable: false,
            align: "center",
            width: "80px",
            render: (text, record, index) => `${index + 1}`,
          },
          {
            title: "岗位名称",
            dataIndex: "positionName",
            align: "center",
          },
          {
            title: "描述",
            dataIndex: "description",
            align: "center",
          }
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
  }

  handleOk = () => {
    this.props.onOk(this.state.tableSelectedInfo);
  };

  handleCancel = (e) => {
    this.props.onCance();
  };

  //岗位组树数据查询
  searchTree = async () => {
    //请求岗位组数据 右侧表格渲染第一列角色数据
    GetgetTree().then((res) => {
      if (res.success != 1) {
        message.error("请求错误");
        return;
      } else {
      
        assignment(res.data);
        this.setState({
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
        // pagination: pagination,
        pageConf: pageConf,
      });
      return;
    }
    let data = info.selectedNodes[0].props.dataRef;
    this.setState({
      newRoleGroup: {
        treeSelect: data.id,
        newRoleGroupVal: data.positionCategoryName,
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
        positionCategoryName: this.state.newRoleGroup.newRoleGroupVal,
      };
   
    } else if (this.state.roleGroupWindow.roleGroupModalType == 1) {
      //修改 请求修改方法
      let params = {
        id: this.state.newRoleGroup.treeSelect,
        positionCategoryName: this.state.newRoleGroup.newRoleGroupVal,
      };
    
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
  // 岗位名称查询
  searchRoleNameFun = () => {
    let id = this.state.searchListID;
    let name = this.state.searchRoleName;
    //1 判断角色组tree是否有选中 如无选中提示无选中 无法查询
    if (id == "" || id == null) {
      message.destroy();
      message.warning("请先选中左侧角色组，然后再进行查询。");
      return;
    }
    // if (name == "" || name == null) {
    //     message.destroy()
    //     message.warning('请先输入查询内容，然后再进行查询。');
    //     return
    // }
    // 2 发起查询请求 查询后结构给table赋值
    // 选中后请求角色数据
    let params = Object.assign({}, {
      positionCategoryId: id,
      positionName: name,
  }, this.state.pageConf, { offset: 0 })
    
    GetTreePaging(params).then((res) => {
      if (res.success == 1) {
        console.log(res.data)
        let data = Object.assign({}, this.state.table, {
          rolesData: res.data.records,
        });
     
        let pageConf = Object.assign({},{
          limit: res.data.size,
          offset: (res.data.current - 1) * res.data.size,
      })
        this.setState({ table: data,pageConf: pageConf });
      } else {
        message.error(res.message);
      }
    });
  };
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
    let params = Object.assign(
      {},
      {
        positionCategoryId: id,
        roleName: name,
      },
      pageConf
    );
    
    GetTreePaging(params).then((res) => {
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

  // 岗位列表获取
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
        positionCategoryId: id,
      },
      this.state.pageConf,
      { offset: 0 }
    );

    GetTreePaging(params).then((res) => {
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

  

  //获取岗位名称查询选项
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
 
 
  // 表格选中后
  onTableSelect = (selectedRowKeys, info) => {

    //获取table选中项
    this.setState({
      tableSelecteds: selectedRowKeys,
      tableSelectedInfo: info, // positionName
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
      <Modal
        // key={Math.random()}
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        className="quartersbox"
      >
        {/* //这里写内容 */}
        <div>
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
                edit={false}
                treeData={this.state.tree.treeData}
                onExpand={this.onExpand}
                onSelect={this.onTreeSelect} //点击树节点触发事件
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
                  <Col span={12}>
                    <Input
                      addonBefore="岗位名称"
                      placeholder="请输入"
                      value={this.state.searchRoleName}
                      onChange={this.getSearchRoleName}
                      style={{ width: "200px" }}
                    />
                    <Button type="primary" onClick={this.searchRoleNameFun}>
                      查询
                    </Button>
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
                    type: "checkbox",
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
         
        </div>
      </Modal>
    );
  };
}
