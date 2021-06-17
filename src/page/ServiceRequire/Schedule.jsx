// /*
//  * @Author: mikey.wangxinyue
//  */
import React, { Component } from "react";
import { connect } from "react-redux";
import { ArrowsAltOutlined, FullscreenOutlined } from "@ant-design/icons";
import { hashHistory } from "react-router";
import moment from "moment";

import {
  Form,
  Input,
  Button,
  Modal,
  message,
  Select,
  Tooltip,
  Table,
  Row,
  Col,
  DatePicker,
  Space,
} from "antd";
const { Option } = Select;
const FormItem = Form.Item;
const dateFormat = "YYYY-MM-DD";
import { DownOutlined, UpOutlined, companyList } from "@ant-design/icons";
// 引入页面CSS
import "@/assets/less/pages/logBookTable.css";

// 引入页面Schedule样式
import "/assets/less/pages/Schedule.css";
// 分页组件
import Pagination from "@/components/pagination/index";

// 引入 API接口
import { GetbiSqtBase, GetDictInfo, GetCompanyList } from "/api/Schedule";
//202158点击新增按钮页面
import { ADD_PANE } from "/redux/action";
@connect(
  (state) => ({}),
  (dispath) => ({
    add(pane) {
      dispath({ type: ADD_PANE, data: pane });
    },
  })
)

//引入组件弹框****
class Schedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMore: false,
      //设置表格的高度
      h: { y: 240 },
      // 客户级别--数据集合
      rankArray: [],
      rules: [
        {
          label: "记录单号",
          key: "orderNum",
          node: 1,
          render: (_) => (
            <Input style={{ width: 200 }} placeholder="请输入单号" />
          ),
        },
        {
          label: "项目编号",
          key: "projectNumber",
          node: 1,
          render: (_) => (
            <Input
              style={{ width: 200 }}
              placeholder="请输入项目号"
            />
          ),
        },
        {
          label: "项目名称",
          key: "projectName",
          node: 1,
          render: (_) => (
            <Input
              style={{ width: 200}}
              placeholder="请输入项目名称"
            />
          ),
        },
        {
          label: "项目类别",
          key: "projectType",
          node: 1,
          render: (_) => (
            <Select
              style={{ width: 200 }}
              placeholder="请选择"
              allowClear={true}
            >
              {this.state.projectTypeList.map((items, index) => {
                return (
                  <Option
                    style={{ border: 0 }}
                    key={items.itemCode}
                    value={items.itemCode}
                  >
                    {items.itemValue}
                  </Option>
                );
              })}
            </Select>
          ),
        },
        {
          label: "项目状态",
          key: "projectStatus",
          node: 1,
          render: (_) => (
            <Select
              style={{ width: 200 }}
              placeholder="请选择"
              allowClear={true}
            >
              {this.state.projectStatusList.map((items, index) => {
                return (
                  <Option key={items.itemCode} value={items.itemCode}>
                    {items.itemValue}
                  </Option>
                );
              })}
            </Select>
          ),
        },
        {
          label: "服务类别",
          key: "serviceType",
          node: 1,
          render: (_) => (
            <Select
              style={{ width: 200 }}
              placeholder="请选择"
              allowClear={true}
            >
              {this.state.servicesTypeList.map((items, index) => {
                return (
                  <Option key={items.itemCode} value={items.itemCode}>
                    {items.itemValue}
                  </Option>
                );
              })}
            </Select>
          ),
        },
        {
          label: "所属行业",
          key: "industry",
          node: 1,
          render: (_) => (
            <Input style={{ width: 200 }} placeholder="请输入" />
          ),
        },
        {
          label: "公司名称",
          key: "compayName",
          node: 2,
          render: (_) => (
            <Select
              style={{ width: 200 }}
              placeholder="请选择"
              allowClear={true}
            >
              {this.state.companyNameList.map((items, index) => {
                return (
                  <Option key={index} value={items.name}>
                    {items.name}
                  </Option>
                );
              })}
            </Select>
          ),
        },
        {
          label: "客户编码",
          key: "custNum",
          node: 2,
          render: (_) => (
            <Input
              style={{ width: 200 }}
              placeholder="请输入客户编码"
            />
          ),
        },
        {
          label: "客户名称",
          key: "custName",
          node: 2,
          render: (_) => (
            <Input
              style={{ width: 200 }}
              placeholder="请输入客户名称"
            />
          ),
        },
        {
          label: "客户级别",
          key: "custLevelName",
          node: 2,
          render: (_) => (
            <Select
              style={{ width: 200 }}
              placeholder="请选择"
              allowClear={true}
            >
              {this.state.customerLevels.map((items, index) => {
                return (
                  <Option key={items.itemCode} value={items.itemCode}>
                    {items.itemValue}
                  </Option>
                );
              })}
            </Select>
          ),
        },
        {
          label: "项目销售",
          key: "salesmanName",
          node: 2,
          render: (_) => (
            <Input style={{ width: 200 }} placeholder="请输入" />
          ),
        },
        {
          label: "项目开始日期",
          key: "startDate",
          node: 2,
          render: (_) => (
            <DatePicker style={{ width: 200 }} />
          ),
        },
        {
          label: "项目结束日期",
          key: "endDate",
          node: 2,
          render: (_) => (
            <DatePicker style={{ width: 200 }} />
          ),
        },
        {
          label: "项目经理",
          key: "managerName",
          node: 2,
          render: (_) => (
            <Input style={{ width: 200 }} placeholder="请输入" />
          ),
        },
        {
          label: "最终客户名称",
          key: "finalCustName",
          node: 2,
          render: (_) => (
            <Input
              style={{ width: 200, padding: "0 45px" }}
              placeholder="请输入"
            />
          ),
        },
        {
          label: "续签项目号",
          key: "renewalNumber",
          node: 2,
          render: (_) => (
            <Input style={{ width: 200, }} placeholder="请输入" />
          ),
        },
        {
          label: "续签项目名称",
          key: "renewalName",
          node: 2,
          render: (_) => (
            <Input style={{ width: 200, }} placeholder="请输入" />
          ),
        },
      ],
      // 项目类别---数据集合
      projectTypeList: [],
      //项目状态
      projectStatusList: [],
      // 服务类别--数据集合
      servicesTypeList: [],
      // 公司下拉框数据
      companyNameList: [],
      //客户级别下拉框数据
      customerLevels: [],
      // 表格数据   2021429
      tabledata: [],
      // 表格列数据
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          align: "center",
          width: "80px",
          // 第一种：每一页都从1开始
          render: (text, record, index) => `${index + 1}`,
        },
        {
          title: "记录单号",
          dataIndex: "orderNum",
          ellipsis: {
            showTitle: false,
          },
          width: "140px",
          render: (text, record) => (
            <Tooltip placement="topLeft" title={text}>
              <span
                style={{
                  color: "#1890ff",
                  cursor: "pointer",
                  display: "block",
                  textAlign: "center",
                }}
                onClick={() => this.previewing(record)}
              >
                {text}
              </span>
            </Tooltip>
          ),
        },
        {
          title: "项目编号",
          dataIndex: "projectNumber",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ),
        },
        {
          title: "项目名称",
          dataIndex: "projectName",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
        },
        {
          title: "客户编码",
          dataIndex: "custNum",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ),
        },
        {
          title: "客户名称",
          dataIndex: "custName",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ),
        },
        {
          title: "客户级别",
          dataIndex: "custLevelName",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ),
        },
        {
          title: "公司名称",
          dataIndex: "compayName",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ),
        },
        {
          title: "项目类别",
          dataIndex: "projectTypeName",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ),
        },
        {
          title: "项目状态",
          dataIndex: "projectStatusName",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ),
        },
        {
          title: "服务类别",
          dataIndex: "serviceTypeName",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ),
        },
        {
          title: "所属行业",
          dataIndex: "industry",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ),
        },
        {
          title: "项目开始日期",
          dataIndex: "startDate",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ),
        },
        {
          title: "项目结束日期",
          dataIndex: "endDate",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ),
        },
        {
          title: "项目经理类型",
          dataIndex: "managerTypeName",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ),
        },
        {
          title: "项目经理",
          dataIndex: "managerName",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ),
        },
        {
          title: "项目销售",
          dataIndex: "salesmanName",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ),
        },
        {
          title: "销售联系方式",
          dataIndex: "salesmanPhone",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ),
        },
        {
          title: "是否续签项目",
          dataIndex: "isRenewal",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <div>
              {text == "1" ? "是" : ""}
              {text == "0" ? "否" : ""}
            </div>
          ),
        },
        {
          title: "续签项目号",
          dataIndex: "renewalNumber",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ),
        },
        {
          title: "续签项目名称",
          dataIndex: "renewalName",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ),
        },
        {
          title: "是否转包项目",
          dataIndex: "isSubcontract",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <div>
              {text == "1" ? "是" : ""}
              {text == "0" ? "否" : ""}
            </div>
          ),
        },
        {
          title: "最终客户名称",
          dataIndex: "finalCustName",
          width: "140px",
          ellipsis: {
            showTitle: false,
          },
          render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ),
        },
      ],
      total: 0, // 分页器组件 总条数
      // 此属性是适用于 表格的分页数据
      pageSize: 10,
      current: 0,
      // 此对象只是适用于分页查询
      pagination: {
        limit: 10,
        offset: 1,
      },
      loading: false, //表格加载太

      visible: false, // 对话框的状态
      titleMap: {
        add: "新增客户信息",
        edit: "修改客户信息",
      },
      visibleStatus: "add",
      selectedRowKeys: null,
      newGroup: {
        custNum: "",
        custName: "",
        custLevel: "",
      },
    };
  }
  //按钮显示隐藏
  showMoreData = () => {
    let { showMore } = this.state;
    this.setState({
      showMore: !showMore,
    });
  };

  // 组件将要挂载完成后触发的函数
  componentDidMount() {
    this.SortTable();
    //窗口变动的时候调用
    window.addEventListener(
      "resize",
      () => {
        this.SortTable();
      },
      false
    );

    this.init();
    // 获取客户列表（分页)
    this.getTableList();
  }

  // 获取表格高度
  SortTable = () => {
    setTimeout(() => {
      let h = this.tableDom.clientHeight - 125;
      this.setState({
        h: {
          y: h,
        },
      });
    }, 0);
  };

  // 初始化数据
  init = () => {
    // 获取数据字典各项--数据
    this.getCustLevel();
  };
  // 获取数据字典各项数据
  getCustLevel = () => {
    // 项目类别--数据 input
    GetDictInfo({ dictCode: "projectType" }).then((res) => {
      if (res.success == 1) {
        this.setState({
          projectTypeList: res.data,
        });
      } else if (res.success == 0) {
        message.error(res.message);
      }

      // 项目状态 input
      GetDictInfo({ dictCode: "projectStatus" }).then((res) => {
        if (res.success == 1) {
          this.setState({
            projectStatusList: res.data,
          });
        } else if (res.success == 0) {
          message.error(res.message);
        }
      });
    });

    // 服务类别
    GetDictInfo({ dictCode: "serviceType" }).then((res) => {
      if (res.success == 1) {
        this.setState({
          servicesTypeList: res.data,
        });
      } else if (res.success == 0) {
        message.error(res.message);
      }
    });
    // 客户级别
    GetDictInfo({ dictCode: "customerLevel" }).then((res) => {
      if (res.success == 1) {
        this.setState({
          customerLevels: res.data,
        });
      } else if (res.success == 0) {
        message.error(res.message);
      }
    });
    // 公司列表
    GetCompanyList().then((res) => {
      if (res.success == 1) {
        this.setState({
          companyNameList: res.data,
        });
      } else if (res.success == 0) {
        message.error(res.message);
      }
    });
  };
  // 获取客户列表（分页)
  getTableList = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.setState({ loading: true });
      let newSearchForm = { ...fieldsValue };
      newSearchForm.startDate = newSearchForm.startDate
        ? moment(newSearchForm.startDate).format("YYYY-MM-DD")
        : "";
      newSearchForm.endDate = newSearchForm.endDate
        ? moment(newSearchForm.endDate).format("YYYY-MM-DD")
        : "";
      GetbiSqtBase(this.state.pageSize, this.state.current, newSearchForm).then(
        (res) => {
          if (res.success == 1) {
            this.setState({
              loading: false,
              tabledata: res.data.records,
              total: parseInt(res.data.total),
            });
          } else if (res.success == 0) {
            message.error(res.message);
          }
        }
      );
    });
  };

  // 获取客户信息详情
  getCustInfor = (Id) => {
    biCustomerInfo(Id).then((res) => {
      if (res.success == 1) {
        /**   将客户等级id换成中文   **/
        let newCustLevel = res.data.custLevel;
        // 任务类型下拉列表数据
        let objCenter = this.state.rankArray;
        for (var i = 0; i < objCenter.length; i++) {
          if (newCustLevel.indexOf(objCenter[i].itemValue) >= 0) {
            newCustLevel = objCenter[i].itemCode;
          }
        }
        let newGroup = Object.assign({}, this.state.newGroup, {
          custNum: res.data.custNum,
          custName: res.data.custName,
          custLevel: newCustLevel,
        });

        this.setState({
          newGroup: newGroup,
        });
      } else if (res.success == 0) {
        message.error(res.message);
      }
    });
  };

  // 查询条件--事件
  onSearch = (e) => {
    e.preventDefault();
    // 获取客户列表（分页)
    this.getTableList();
  };

  //清空高级搜索
  clearSearchprops = () => {
    this.props.form.resetFields();
  };

  // 点击表格中某客户编码进行客户信息页面
  previewing = (record) => {
    let pane = {
      title: record.custName + "客户档案",
      key: Math.round(Math.random() * 10000).toString(),
      url: "CustomerInfor/customerInformation.jsx",
      params: {
        id: record.baseId,
      },
    };
    this.props.add(pane);
  };

  // 修改事件按钮----弹出对话框
  handleEdit = () => {
    if (this.state.selectedRowKeys) {
      var key = this.state.selectedRowKeys[0];
      this.setState({
        visible: true,
        visibleStatus: "edit",
      });
      // 调用---查询客户信息详情接口
      this.getCustInfor(key);
    } else {
      message.warning("请先选择一条客户信息！");
    }
  };

  //获取新增或修改后的客户级别
  handleChange = (value) => {
    let newGroup = Object.assign({}, this.state.newGroup, { custLevel: value });
    this.setState({
      newGroup: newGroup,
    });
  };

  //获取新增或修改后的客户名称
  getdictName = (e) => {
    let newGroup = Object.assign({}, this.state.newGroup, {
      custName: e.target.value,
    });
    this.setState({
      newGroup: newGroup,
    });
  };
  //获取新增或修改后的客户编码
  getdictCode = (e) => {
    let newGroup = Object.assign({}, this.state.newGroup, {
      custNum: e.target.value,
    });
    this.setState({
      newGroup: newGroup,
    });
  };

  // 页码改变的回调，参数是改变后的页码及每页条数
  onPageChange = (page, pageSize) => {
    let data = Object.assign({}, this.state.pagination, { offset: page });

    this.setState(
      {
        current: (page - 1) * pageSize,
        pagination: data,
      },
      () => {
        // 获取客户列表（分页)
        this.getTableList();
      }
    );
  };

  // 当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
  onShowSizeChange = (current, pageSize) => {
    let data = Object.assign({}, this.state.pagination, {
      offset: 1,
      limit: pageSize,
    });

    this.setState(
      {
        current: 0,
        pageSize: pageSize,
        pagination: data,
      },
      () => {
        // 获取客户列表（分页)
        this.getTableList();
      }
    );
  };

  // 选中行时就选中单选框按钮
  onClickRow = (record) => {
    return {
      onClick: () => {
        let selectedKeys = [record.baseId];
        this.setState({
          selectedRowKeys: selectedKeys,
        });
      },
    };
  };

  // 单选框按钮---选中事件
  onSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys: selectedRowKeys,
    });
  };

  // 对话框---确认
  handleOk = (e) => {
    var params = this.state.newGroup;
    // 校验数据 不能为空 空：提示名称为空不能保存
    if (params.custName == "" || params.custName == null) {
      message.destroy();
      message.warning("客户名称不能为空!");
      return false;
    }
    if (params.custNum == "" || params.custNum == null) {
      message.destroy();
      message.warning("客户编码不能为空!");
      return false;
    }
    if (params.custLevel == "" || params.custLevel == null) {
      message.destroy();
      message.warning("客户级别不能为空!");
      return false;
    }

    // 判断保存类型是新增还是修改
    if (this.state.visibleStatus == "add") {
    } else if (this.state.visibleStatus == "edit") {
      let _this = this;
      let params = {
        custLevel: _this.state.newGroup.custLevel,
        id: _this.state.selectedRowKeys[0],
      };

      biCustomerUpdate(params).then((res) => {
        if (res.success == 1) {
          message.success(res.message);
          this.setState({
            visible: false,
          });
          // 获取客户列表（分页)
          this.getTableList();
        } else if (res.success == 0) {
          message.error(res.message);
        }
      });
    }
  };
  //点击新增跳转到详情页面
  newObtn = () => {
    //随机生成4位小数
    var str = Math.floor(Math.random() * (99999 - 1000)) + 1000;
    let pane = {
      title: "服务需求表",
      key: "str",
      url: "ServiceRequire/require.jsx",
    };
    this.props.add(pane);
  };
  //点击变更跳转到详情页并有弹出框
  changeType = () => {
    alert("1234");
  };

  render = (_) => {
    const { getFieldDecorator } = this.props.form;

    const { h, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      type: "radio",
    };

    // 节点渲染区域
    return (
      <div
        className="engineerContent main_height"
        id="engineerContent"
        style={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          position: "relative",
        }}
      >
        <Form
          layout="inline"
          style={{ width: "100%", marginTop: "45px" }}
          id="logbookForm"
        >
          {this.state.rules.map((val, index) => {
            if (val.node == 2 && !this.state.showMore) {
              return "";
            }
            return (
              <FormItem
                label={val.label}
                style={{
                 padding:"10px 15px"
                }}
                key={index}
              >
                {getFieldDecorator(val.key, val.option)(val.render())}
              </FormItem>
            );
          })}
          <FormItem>
            <Button
              type="primary"
              style={{ marginLeft: "10px", marginTop: "18px" }}
              onClick={this.onSearch}
            >
              查询
            </Button>
            <Button
              style={{ marginLeft: "10px", marginTop: "18px" }}
              onClick={this.clearSearchprops}
            >
              重置
            </Button>
            <br />
            {/* //icon图标开关 */}
            {this.state.showMore ? (
              <ArrowsAltOutlined
                className="ArrowsAltOutlined"
                onClick={this.showMoreData}
              />
            ) : (
              <FullscreenOutlined
                className="ArrowsAltOutlined"
                onClick={this.showMoreData}
              />
            )}
           
          </FormItem>
        </Form>
        {/* //第二个块元素 */}
        
        <div
          className="tableParson"
          style={{ flex: "1 1 auto " }}
          ref={(el) => (this.tableDom = el)}
        >
           <div className="newchange">
              {/* 新增 变更按钮 */}
              <Button onClick={this.newObtn} style={{ marginLeft: "10px" }}>
                新增
              </Button>
              <Button
                onClick={this.changeType}
                type="primary"
                style={{ marginLeft: "10px" }}
              >
                变更
              </Button>
            </div>
          <Table
            className="Table"
            bordered
            rowKey={(record) => record.baseId} //在Table组件中加入这行代码
            onRow={this.onClickRow}
            rowSelection={rowSelection}
            dataSource={this.state.tabledata}
            columns={this.state.columns}
            pagination={false}
            size={"small"}
            style={{
              marginTop: "50px",
              padding: "0 15px",
              overflowY: "auto",
              height: h,
              overflowX: "hidden",
            }}
            loading={this.state.loading} //设置loading属性
          />

          <Pagination
            total={this.state.total}
            pageSize={this.state.pagination.limit}
            current={this.state.pagination.offset}
            onChange={this.onPageChange}
            onShowSizeChange={this.onShowSizeChange}
          ></Pagination>
        </div>

        {/* 新增/编辑---客户信息对话框 */}
        <Modal
          title={this.state.titleMap[this.state.visibleStatus]}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          width="25%"
          id="modalengineer"
        >
          <Row>
            <label style={{ display: "block", marginBottom: "16px" }}>
              <span
                className={
                  this.state.visibleStatus == "add"
                    ? "ant-form-item-required"
                    : ""
                }
                style={{ display: "inline-block", textAlign: "right" }}
              >
                客户级别：
              </span>
              <Select
                style={{ width: 300 }}
                placeholder="请选择客户级别"
                allowClear={true}
                onChange={this.handleChange}
                value={this.state.newGroup.custLevel}
              >
                {this.state.rankArray.map((items, index) => {
                  return (
                    <Option key={index} value={items.itemCode}>
                      {items.itemValue}
                    </Option>
                  );
                })}
              </Select>
            </label>
            <label style={{ display: "block", marginBottom: "16px" }}>
              <span
                className={
                  this.state.visibleStatus == "add"
                    ? "ant-form-item-required"
                    : ""
                }
                style={{ display: "inline-block", textAlign: "right" }}
              >
                客户编码：
              </span>
              <Input
                placeholder="请选择客户编码"
                value={this.state.newGroup.custNum}
                onChange={this.getdictCode}
                allowClear={true}
                style={{ width: "300px" }}
                disabled={this.state.visibleStatus == "add" ? false : true}
              />
            </label>
            <label style={{ display: "block", marginBottom: "16px" }}>
              <span
                className={
                  this.state.visibleStatus == "add"
                    ? "ant-form-item-required"
                    : ""
                }
                style={{ display: "inline-block", textAlign: "right" }}
              >
                客户名称：
              </span>
              <Input
                placeholder="请选择客户名称"
                value={this.state.newGroup.custName}
                onChange={this.getdictName}
                allowClear={true}
                style={{ width: "300px" }}
                disabled={this.state.visibleStatus == "add" ? false : true}
              />
            </label>
          </Row>
        </Modal>
      </div>
    );
  };
}

const CustormManage = Form.create()(Schedule);
export default CustormManage;
