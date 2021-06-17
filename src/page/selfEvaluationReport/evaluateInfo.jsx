/***
 *  工程师自评统计报表-工程师技能评价查看-导出工程师评定结果
 * @auth wangxinyue
 */

import React, { Component } from "react";
import {
  message,
  Button,
  Input,
  Row,
  Col,
  Form,
  Table,
  Tooltip,
  Modal,
} from "antd";
import moment from "moment";
import Common from "/page/common.jsx";
// 引入 API接口
import { getAssessLeaderReport } from "/api/selfEvaluationReport";
// 引入 API工程师自评技能报表（分页）接口
import {
  GetselectAssessReportList,
  GetselectAssessProableReportList,
} from "/api/evaluateInfo.js";
import "@/assets/less/pages/evalutateinfo.less";

// 分页组件
import Pagination from "@/components/pagination/index";
import { AutoScroll } from "sortablejs";
// 引入页面CSS
// import '/assets/less/pages/logBookTable.css'
const FormItem = Form.Item;
class AssessmentReport extends Component {
  // 挂载完成
  componentDidMount = () => {
    this.init();
    this.SortTable();
    //窗口变动的时候调用
    window.addEventListener(
      "resize",
      () => {
        this.SortTable();
      },
      false
    );
  };
  // 获取表格高度
  SortTable = () => {
    setTimeout(() => {
      console.log(this.tableDom.clientHeight,'biaoge')
        let h = this.tableDom.clientHeight -150;
        this.setState({
          h: {
            y: h,
          },
        });
      
    }, 0);
  };
  state = {
    h: { y: 240 }, //设置表格的高度
    visible: false, // 对话框的状态
    // 表单的input
    regionalName: "", //大区
    departmentName: "", //部门
    userName: "", //姓名
    // 分页配置
    pagination: {
      pageSize: 10,
      current: 1,
      total: 0,
    },
    loading: false, //表格加载太
    //右侧角色表格数据
    tabledata: [],
    Twotabledata: [],
    assessId: "",

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
        title: "姓名",
        dataIndex: "realName",
        align: "center",
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => (
          <Tooltip placement="topLeft" title={text}>
            <span
              style={{
                color: "#1890ff",
                cursor: "pointer",
               
              }}
              onClick={() => this.showModal(record)}
            >
              {text}
            </span>
          </Tooltip>
        ),
      },
     {
        title: "大区",
        dataIndex: "regionalName",
        align: "center",
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
       {
        title: "部门名称",
        dataIndex: "orgFullName",
        align: "center",
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      }, 
      {
        title: "工作经验",
        dataIndex: "experienceName",
        align: "center",
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: "沟通能力",
        dataIndex: "commskillsName",
        align: "center",
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: "文档编写能力",
        dataIndex: "docskillsName",
        align: "center",
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: "高级证书",
        dataIndex: "certLevelPrimaryCount",
        align: "center",
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: "中级证书",
        dataIndex: "certLevelIntermediateCount",
        align: "center",
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: "初级证书",
        dataIndex: "certLevelSeniorCount",
        align: "center",
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: "等级",
        dataIndex: "comableLevelName",
        align: "center",
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: "成绩",
        dataIndex: "comableFraction",
        align: "center",
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
    ],
    //第二个表格数据
    column: [
      {
        title: "序号",
        dataIndex: "key",
        editable: false,
        align: "center",
        width: "80px",
        render: (text, record, index) => `${index + 1}`,
      },
      {
        title: "姓名",
        dataIndex: "realName",
        align: "center",
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => (
          <Tooltip placement="topLeft" title={text}>
            <span
              style={{
                color: "#1890ff",
                cursor: "pointer",
                fontSize:"12px"
              }}
              onClick={() => this.showModal(record)}
            >
              {text}
            </span>
          </Tooltip>
        ),
      },
       {
        title: "大区",
        dataIndex: "regionalName",
        align: "center",
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: "部门名称",
        dataIndex: "orgFullName",
        align: "center",
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: "产品类别",
        dataIndex: "productCategoryName",
        align: "center",
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: "技术方向",
        dataIndex: "skillTypeCodeName",
        align: "center",
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: "品牌",
        dataIndex: "brandCodeName",
        align: "center",
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: "产品线级别",
        dataIndex: "productLineLevelCodeName",
        align: "center",
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: "产品线",
        dataIndex: "productLineCodeName",
        align: "center",
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },

      {
        title: "能力级别",
        dataIndex: "proableLevelName",
        align: "center",
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      
    ],
    // 存放当前选中行的key
    assessId: null,
    // 存放当前选中行的row数据
    selectedRows: null,
    tableId: null,
  };
 //出初始化
  init = () => {
    this.getTable();

  };
  getTable = (flag = 1) => {
    this.setState({ loading: true });
    let obj = Object.assign(
      {},
      {
        regionalName: this.state.regionalName,
        departmentName: this.state.departmentName,
        userName: this.state.userName,
      }
    );
    //请求接口GetselectAssessReportList工程师自评技能报表（分页）
    GetselectAssessReportList(
      this.state.pagination.pageSize,
      flag
        ? (this.state.pagination.current - 1) * this.state.pagination.pageSize
        : 0,
      obj
    ).then((res) => {
      if (res.success == 1) {
        let pagination = Object.assign({}, this.state.pagination, {
          pageSize: res.data.size,
          current: res.data.current,
          total: res.data.total,
        });
        this.setState({
          loading: false,
          tabledata: res.data.records,
          pagination,
        });
      } else if (res.success == 0) {
        message.error(res.message);
      }
    });
  };

  //弹出框
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  //弹出框
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  //弹出框
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  // 导出工程师技能评价报告
  downFile = () => {
    let currentDay = moment().format("YYYYMMDD");
    let fileName = "工程师技能评价报告_" + currentDay + ".xlsx";
    const hide = message.loading("报表数据正在检索中,请耐心等待。。。", 0);
    getAssessLeaderReport().then((res) => {
      if (res.success == 1) {
        message.destroy();
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.href = res.data + "?filename=" + fileName;
        a.click();
        document.body.removeChild(a);
      } else if (res.success == 0) {
        message.destroy();
        message.error(res.message);
      }
    });
  };
  //获取表单数据
  getFormData = (_) => {
    let params;
    this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
      if (!err || !Object.getOwnPropertyNames(err).length) {
        //校验完成执行的逻辑 获取合并后的表单数据
        params = Object.assign({}, val);
      }
    });
    return params;
  };

  // 页码改变的回调，参数是改变后的页码及每页条数
  onPageChange = (current, pageSize) => {
    let pagination = Object.assign({}, this.state.pagination, { current });

    this.setState(
      {
        pagination,
      },
      () => {
        console.log(this.state.pagination);
        // 调用接口
        this.getTable();
      }
    );
  };
  // 当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
  onShowSizeChange = (current, pageSize) => {
    let pagination = Object.assign({}, this.state.pagination, { pageSize });

    this.setState(
      {
        pagination,
      },
      () => {
        // 调用接口
        this.getTable();
      }
    );
  };

  // 单选框按钮---选中事件
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  // 2021616选中行时就选中单选框按钮
  onClickRow = (record) => {
    return {
      onClick: () => {
        let assessId = record.assessId;
        let selectedRows = [record];
        this.setState({
          loading: true,
          assessId: assessId,
          selectedRows,
        });
        let obj = {
          assessId: parseInt(assessId),
        };
        GetselectAssessProableReportList(obj).then((res) => {
          console.log(res);
          if (res.success == 1) {
            this.setState({
              loading: false,
              Twotabledata: res.data,
            });
          } else if (res.success == 0) {
            message.error(res.message);
          }
        });
        
        this.setState({
          loading: false,
          Twotabledata: null
        });

      },
    };
  };
  //input 事件
  inputChange(name, e) {
    this.setState({
      [name]: e.target.value,
    });
  }
  //查询
  search = async (type = false) => {
    this.getTable(0);
  };

  //清空高级搜索
  reset =async (regionalName,departmentName,userName) => { 
   await  this.setState({
       loading: true,
      regionalName: null,
      departmentName: null,
      userName: null,
    })
     this.getTable();
    
  };
  render = (_) => {
    const { h, selectedRowKeys } = this.state;
    console.log(h)
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      type: "radio",
    };
    return (
      <div
        className="main_height"
        style={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          paddingTop: "20px",
        }}
      >
        <div style={{ width: "100%", margin: "0 auto" }}>
          <Form>
            <Row>
              <Col span={12}>
                <Input
                  addonBefore="大区"
                  placeholder="请输入"
                  value={this.state.regionalName}
                  onChange={this.inputChange.bind(this, "regionalName")}
                  style={{ width: "170px" , margin:"0 15px" }}
                />
                <Input
                  addonBefore="部门"
                  placeholder="请输入"
                  value={this.state.departmentName}
                  onChange={this.inputChange.bind(this, "departmentName")}
                  style={{ width: "170px",margin:"0 5px" }}
                />
                <Input
                  addonBefore="姓名"
                  placeholder="请输入"
                  value={this.state.userName}
                  onChange={this.inputChange.bind(this, "userName")}
                  style={{ width: "170px",margin:"0 5px" }}
                />
                <Button type="primary"  style={{ margin:"0 5px" }} onClick={() => this.search()}>
                  查询
                </Button>
                <Button
                  type="primary"
                  style={{ margin:"0 5px" }}
                  onClick={() => this.reset()}
                >
                  重置
                </Button>
              </Col>
            </Row>
          </Form>
          <Button
            type="primary"
            onClick={this.downFile}
            style={{
              marginLeft: "30px",
              position: "fixed",
              right: "62px",
              top: "125px",
            }}
          >
            导出工程师评定结果
          </Button>
          </div>
          {/* //表格 */}
          <div
            className="tableParson"
            style={{ flex: "auto" }}
            ref={(el) => (this.tableDom = el)}
          >
            <Table
              bordered
              rowKey={(record) => record.userId}
              onRow={this.onClickRow}
              dataSource={this.state.tabledata}
              columns={this.state.columns}
              style={{
                tableLayout:"fixed",
                marginTop: "20px",
                zoom: "1",
                marginTop: "16px",
                overflowY: "Auto",
                padding: "0 15px",
                borderCollapse:"separate",
                borderSpacing: 0
              }}
              pagination={false}
              scroll={h}
              size="small"
              loading={this.state.loading}
            />
            {/* <Pagination current={this.state.pagination.current} pageSize={this.state.pagination.pageSize} total={this.state.pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} size="small" /> */}
            <Pagination
              total={this.state.pagination.total}
              pageSize={this.state.pagination.pageSize}
              current={this.state.pagination.current}
              onChange={this.onPageChange}
              onShowSizeChange={this.onShowSizeChange}
            ></Pagination>
          </div>
          {/* //弹出框 */}
          <Modal
             title='工程师技能评价查看'
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            {/* //表格内容 */}
            <div>
              <Table
                bordered
                rowKey={(record) => record.assessId}
                onRow={this.onRow}
                // rowSelection={{
                //   onChange: this.onTableSelect,
                //   selectedRowKeys: this.state.tableSelecteds,
                //   type: "radio",
                // }}
                dataSource={this.state.Twotabledata}
                columns={this.state.column}
                style={{
                  marginTop: "20px",
                  zoom: "1",
                  marginTop: "16px",
                  overflowY: "Auto",
                  padding: "0 15px",
                }}
                pagination={false}
                scroll={h}
                size="small"
                loading={this.state.loading}
              />
            </div>
          </Modal>
        </div>
    
    );
  };
}
export default AssessmentReport;
