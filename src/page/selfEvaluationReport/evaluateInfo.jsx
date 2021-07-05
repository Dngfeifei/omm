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
  Select,
  Card,
  Checkbox
} from "antd";
const { Option } = Select;
import moment from "moment";
import Common from "/page/common.jsx";
// 引入 API接口 
import { getAssessLeaderReport } from "/api/selfEvaluationReport";
// 引入 API工程师自评技能报表（分页）接口
// 202171加了一个新功能 基础数据202171
import {
  GetselectAssessReportList,
  GetselectAssessProableReportList,
  Getbasedata,
  GetexportAssessReportList
} from "/api/evaluateInfo.js";
// 引入页面CSS
import "@/assets/less/pages/evalutateinfo.less";

// 分页组件
import Pagination from "@/components/pagination/index";
import { AutoScroll } from "sortablejs";
import { GetDictInfo } from '/api/dictionary'  //数据字典api
// import '/assets/less/pages/evalutateinfo.less'
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

      let h = this.tableDom.clientHeight - 150;
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
                fontSize: "12px"
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
    // id: "",           //	专业id
    assessId: "",     //   工程师自评价id
    productCategory: "", //产品类别
    skillTypeCode: "",   //	技术方向编码
    brandCode: "",    //	品牌编码
    productLineCodes: [], //	产品线编码
    productLineLevelCode: "", //	产品线级别编码
    proableLevel: "", //	专业能力级别
    serviceItemCodes: [], //	服务项
    cases: [{ custName: "", productLineCode: "", serviceItemCode: "", caseDesc: "" }],  //案例

    skillTypeId: "",   //	技术类别编码
    brandId: "",    //	品牌编码
    competenceLevelId: "", //	专业能力级别
    productCategoryData: [],//产品分类下拉框数据
    //下拉框基础数据
    baseData: {
      "commskills": [],   //沟通能力
      "docskills": [],   //文档编辑能力
      "experience": [],   //工作经验
      "productLine": [],   //产品线
      "competenceLevel": [],   //专业能力级别
      "serviceClass": [],   //专业能力
      "skillType": [],   //技术类别
      "brand": [],   //品牌
    },// 202171基础数据请求接口****
  };
  //出初始化
  init = () => {
    this.getTable();//表格
    // 获取数据字典-产品类别数据
    GetDictInfo({ dictCode: "productCategory" }).then(res => {
      console.log(res.data)
      if (res.success != 1) {
        message.error(res.message)
      } else {
        this.setState({
          productCategoryData: res.data
        })
      }
    })
    let skillTypeId = "", brandId = "", competenceLevelId = ""
    // 202171基础数据请求接口
    Getbasedata().then((res) => {
      console.log(res.data)
      if (res.success != 1) {
        message.error(res.message)
      } else {
        this.setState({
          baseData: res.data
        })
        // res.data.skillType.forEach((item) => {
        //   if (item.code == echoData.skillTypeCode) {
        //     skillTypeId = item.id
        //   }
        // })
        // res.data.brand.forEach((item) => {
        //   if (item.code == echoData.brandCode) {
        //     brandId = item.id
        //   }
        // })
        // res.data.competenceLevel.forEach((item) => {
        //   if (item.code == echoData.proableLevel) {
        //     competenceLevelId = item.strValue1
        //   }
        // })

      }
    })
    this.setState({
      // skillTypeId, brandId, competenceLevelId
    })




  };
  // 1：产品类别选中方法
  onSelect0 = (val, option) => {
    // 若技术类别选中项与之前选中数据不同 则品牌已选中项、产品线级别已选中项、产品线已选中项、案例数据中产品线已选中项为空
    let preVal = this.state.productCategory;
    if (preVal != val) {
      this.setState({
        productCategory: val,
        skillTypeCode: "",
        skillTypeId: "",
        brandCode: "",    //	品牌编码
        brandId: "",
        productLineCodes: [], //	产品线编码
        productLineLevelCode: "", //	产品线级别编码
        proableLevel: "", //	专业能力级别
        serviceItemCodes: [], //	服务项
      })
      // let cases = this.state.cases;
      // cases.forEach((item) => {
      //   item.productLineCode = ""
      //   item.serviceItemCode = ""
      // })
      // this.setState({
      //   cases
      // })
    }
  };
  // 技术方向选中方法
  onSelect1 = (val, option) => {
    // 若技术类别选中项与之前选中数据不同 则品牌已选中项、产品线级别已选中项、产品线已选中项、案例数据中产品线已选中项为空
    let preVal = this.state.skillTypeCode;
    if (preVal != val) {
      this.setState({
        brandCode: "",    //	品牌编码
        brandId: "",
        productLineCodes: [], //	产品线编码
        productLineLevelCode: "", //	产品线级别编码
        skillTypeCode: val,
        skillTypeId: option.key
      })
      // let cases = this.state.cases;
      // cases.forEach((item) => {
      //     item.productLineCode = ""
      // })
      // this.setState({
      //     cases
      // })
    }
  }
  // 品牌选中方法
  onSelect2 = (val, option) => {
    // 若品牌选中项与之前选中数据不同 则产品线级别已选中项、产品线已选中项、案例数据中产品线已选中项为空
    let preVal = this.state.brandCode;
    if (preVal != val) {
      this.setState({
        productLineCodes: [], //	产品线编码
        productLineLevelCode: "", //	产品线级别编码
        brandCode: val,
        brandId: option.key
      })
      // let cases = this.state.cases;
      // cases.forEach((item) => {
      //   item.productLineCode = ""
      // })
      // this.setState({
      //   cases
      // })
    }
  }
  // 产品线级别选中方法
  onSelect3 = (val, option) => {
    // 若产品线级别选中项与之前选中数据不同 则产品线已选中项、案例数据中产品线已选中项为空
    let preVal = this.state.productLineLevelCode;
    if (preVal != val) {
      this.setState({
        productLineCodes: [], //	产品线编码
        productLineLevelCode: val, //	产品线级别编码

      })
      // let cases = this.state.cases;
      // cases.forEach((item) => {
      //     item.productLineCode = ""
      // })
      // this.setState({
      //     cases
      // })
    }
  }
  // 产品线选中方法
  onChange4 = (checkedValues, info) => {
    this.setState({
      productLineCodes: checkedValues
    })
    // let cases = this.state.cases;
    // cases.forEach((item) => {
    //     if (checkedValues.indexOf(item.productLineCode) < 0) {
    //         item.productLineCode = ""
    //     }
    // })
    // this.setState({
    //     cases
    // })
  }
  // 专业级别选中方法
  onSelect5 = (val, option) => {
    // 若专业级别选中项与之前选中数据不同 则专业服务分类已选中项、案例数据中专业服务分类已选中项为空
    let preVal = this.state.proableLevel;
    if (preVal != val) {
      this.setState({
        serviceItemCodes: [],
        proableLevel: val,
        competenceLevelId: option.key
      })
      // let cases = this.state.cases;
      // cases.forEach((item) => {
      //     item.serviceItemCode = ""
      // })
      // this.setState({
      //     cases
      // })
    }
  }
  //表格
  getTable = (flag = 1) => {
    this.setState({ loading: true });
    let obj = Object.assign(
      {},
      {
        regionalName: this.state.regionalName,
        departmentName: this.state.departmentName,
        userName: this.state.userName,
        productType: this.state.productCategory,	//产品类别
        skillType: this.state.skillTypeCode,	//技术方向
        brand: this.state.brandCode,	//品牌
        productLineLevel: this.state.productLineLevelCode,	//产品线级别
        productLine: this.state.productLineCodes.join(','),	//产品线 []
        proableLevel: this.state.proableLevel,	//专业能力级别
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

    this.setState({
      visible: false,
    });
  };
  //弹出框
  handleCancel = (e) => {

    this.setState({
      visible: false,
    });
  };

  //导出按钮
  exportObtn = () => {
    let currentDay = moment().format("YYYYMMDD");
    let fileName = "工程师技能评价报告_" + currentDay + ".xlsx";
    const hide = message.loading("报表数据正在检索中,请耐心等待。。。", 0);
    GetexportAssessReportList().then((res) => {
      console.log(res.data)
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
  // 导出工程师技能评价报告
  downFile = () => {
    let currentDay = moment().format("YYYYMMDD");
    let fileName = "工程师技能评价报告_" + currentDay + ".xlsx";
    const hide = message.loading("报表数据正在检索中,请耐心等待。。。", 0);
    getAssessLeaderReport().then((res) => {
      console.log(res.data)
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
  reset = async (regionalName, departmentName, userName, productCategory, skillTypeCode, brandCode, productLineLevelCode, productLineCodes, proableLevel) => {
    // productType: this.state.productCategory,	//产品类别
    // skillType: this.state.skillTypeCode,	//技术方向
    // brand: this.state.brandCode,	//品牌
    // productLineLevel: this.state.productLineLevelCode,	//产品线级别
    // productLine: this.state.productLineCodes.join(','),	//产品线 []
    // competenceLevel: this.state.proableLevel,	//专业能力级别
    await this.setState({
      // loading: true,
      regionalName: null,
      departmentName: null,
      userName: null,
      productCategory: null,
      skillTypeCode: null,
      brandCode: null,
      productLineLevelCode: null,
      productLineCodes: null,
      proableLevel: null

    })

    // this.getTable();




  };
  render = (_) => {
    // 接受组件外传递的数据
    let { productCategoryData, baseData } = this.state;
    const { h, selectedRowKeys } = this.state;
    let { productLine, competenceLevel, serviceClassSoft, serviceClassHard, skillType, brand } = baseData;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      type: "radio",
    };
    // 通过下拉框选择项过滤后的产品
    let productLineDatas = [];
    if (this.state.brandId && this.state.productLineLevelCode && this.state.productCategory == 2) {
      productLineDatas = productLine.filter((item) => {
        return item.parentId == this.state.brandId && item.strValue1 == this.state.productLineLevelCode;
      })
    } else if (this.state.brandId && this.state.productCategory == 1) {
      productLineDatas = productLine.filter((item) => {
        return item.parentId == this.state.brandId
      })
    }
    // productLineDatas.length ? productIsTrue = true : productIsTrue = false;
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

          {/* //202171 */}
          <div className="formRow" style={{ display: "flex", }}>
            <div className="formCol" style={{ margin: "0 15px" }}>
              <span >产品类别:&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <Select className="formVal" bordered={false} style={{ width: "170px", }} value={this.state.productCategory} onSelect={this.onSelect0} addonBefore="产品类别">

                <Option value="" style={{ outline: "none" }}>请选择</Option>
                {
                  productCategoryData.map((item) => {
                    return <Option key={item.itemCode} value={item.itemCode}>{item.itemValue}</Option>
                  })
                }
              </Select>
            </div>
            <div className="formCol" style={{ margin: "0 15px" }}>
              <span >技术方向:&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <Select className="formVal" style={{ width: "170px" }} value={this.state.skillTypeCode} onSelect={this.onSelect1}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }>
                <Option value="">请选择</Option>
                {
                  !this.state.productCategory ? "" : skillType.filter((item) => {
                    return item.strValue4 == this.state.productCategory;
                  }).map((item) => {
                    return <Option key={item.id} value={item.code}>{item.name}</Option>
                  })
                }
              </Select>
            </div>
            <div className="formCol" style={{ margin: "0 15px" }} >
              <span >品牌:&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <Select className="formVal" style={{ width: "170px" }} value={this.state.brandCode} onSelect={this.onSelect2}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }>
                <Option value="">请选择</Option>
                {
                  !this.state.skillTypeCode ? "" : (brand.filter((item) => {
                    return item.parentId == this.state.skillTypeId;
                  }).map((item, index) => {
                    return <Option key={item.id} value={item.code}>{item.name}</Option>
                  }))
                }
              </Select>
            </div>
            {
              this.state.productCategory == "" || this.state.productCategory == 1 ? "" : <div className="formRow">
                <div className="formCol" style={{ margin: "0 15px" }} >

                  <span >产品线级别:&nbsp;&nbsp;&nbsp;&nbsp;</span>

                  <Select className="formVal" style={{ width: "170px" }} value={this.state.productLineLevelCode} onSelect={this.onSelect3}>
                    <Option value="">请选择</Option>
                    {
                      this.state.baseData.productLineLevel.map((item) => {
                        return <Option key={item.id} value={item.code}>{item.name}</Option>
                      })
                    }
                    {/* <Option value="1">高端</Option>
                          <Option value="0">中低端</Option> */}
                  </Select>
                </div>
                {/* <div className="formCol"></div>
                <div className="formCol"></div> */}
              </div>
            }
            <div className="formRow">
              <div className="formCol" style={{ margin: "0 15px" }} >

                <span>专业能力级别:&nbsp;&nbsp;&nbsp;&nbsp;</span>



                <Select className="formVal" style={{ width: "170px" }} value={this.state.proableLevel} onSelect={this.onSelect5}>
                  <Option value="">请选择</Option>
                  {
                    competenceLevel.map((item) => {
                      return <Option key={item.strValue1} value={item.code}>{item.name}</Option>
                    })
                  }
                </Select>
              </div>
              {/* <div className="formCol"></div>
              <div className="formCol"></div> */}
            </div>
          </div>
          {/* 选中品牌展示复选框数据 */}
          <div style={{ margin: '15px 15px' }}>
            {productLineDatas.length ? <Card>
              <Checkbox.Group style={{ width: '100%' }} value={this.state.productLineCodes} onChange={this.onChange4} >
                <Row>
                  {
                    this.state.productCategory == 1 ? (this.state.brandId ? (productLineDatas.map((item, index) => {
                      return <Col span={6} key={index} >
                        <Tooltip title={item.name}>
                          <Checkbox value={item.code} style={{
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}>{item.name}</Checkbox>
                        </Tooltip>
                      </Col>
                    })) : "") : (this.state.brandId && this.state.productLineLevelCode ? (productLineDatas.map((item, index) => {
                      return <Col span={6} key={index} >
                        <Tooltip title={item.name}>
                          <Checkbox value={item.code} style={{
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}>{item.name}</Checkbox>
                        </Tooltip>
                      </Col>
                    })) : "")

                  }
                </Row>
              </Checkbox.Group>
            </Card> : ""}

          </div>
          {/* 202172大区 */}
          <div className="formRow" style={{ display: "flex", margin: "15px 0" }}>
            <div className="formCol" style={{ margin: "0 15px" }}>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;大区:&nbsp;</span>
              <Input

                placeholder="请输入"
                value={this.state.regionalName}
                onChange={this.inputChange.bind(this, "regionalName")}
                style={{ width: "170px", margin: "0 15px" }}
              />
            </div>
            <div className="formCol" style={{ margin: "0 15px" }}>
              <span>&nbsp;&nbsp;&nbsp;部门:</span>

              <Input

                placeholder="请输入"
                value={this.state.departmentName}
                onChange={this.inputChange.bind(this, "departmentName")}
                style={{ width: "170px", margin: "0 15px" }}
              />
            </div>
            <div className="formCol" >
              <span>姓名:</span>
              <Input

                placeholder="请输入"
                value={this.state.userName}
                onChange={this.inputChange.bind(this, "userName")}
                style={{ width: "170px", margin: "0 15px" }}
              />
            </div>
            <Button type="primary" style={{ margin: "0 15px" }} onClick={() => this.search()}>
              查询
                </Button>
            <Button type="primary" style={{ margin: "0 15px" }} onClick={() => this.exportObtn()}>
              导出
                </Button>
            <Button
              type="primary"
              style={{ margin: "0 15px" }}
              onClick={() => this.reset()}
            >
              重置
                </Button>
            <Button
              type="primary"
              onClick={this.downFile}
              style={{
                margin: "0 15px"
              }}
            >
              导出工程师评定结果
                 </Button>
          </div>
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
              tableLayout: "fixed",
              marginTop: "20px",
              zoom: "1",
              marginTop: "16px",
              overflowY: "Auto",
              padding: "0 15px",
              borderCollapse: "separate",
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
