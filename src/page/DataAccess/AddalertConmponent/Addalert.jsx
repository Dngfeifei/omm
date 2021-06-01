// /*1：新增弹出框
//  * @Author: mikey.wangxinyue
//  */
import React, { Component } from "react";
import { Modal, Checkbox, AutoComplete, Icon } from "antd";
import MyModa from "./quartersalert.jsx";
import { message, Form, Input } from "antd";

//3:配置属性复选框
import {
  GetAttributeList,
  GetFieldsRange,
  Addadd,
  Getupdate
} from "@/api/datajurisdiction.js";
import "@/assets/less/pages/addalert.less";
// 引入页面弹出框dataccess样式
import "/assets/less/pages/dataccess.css";

//1:antd模拟数据下拉框的形式
// const dataSource = ["Burns Bay Road", "Downing Street", "Wall Street"];
// 引入工程师选择器组件
import Selector from "/components/selector/engineerSelector.jsx";
class MyModal extends Component {
  // 是否用户信息，1-是，0-否，如果是人员信息，则取值范围调用人员选择器接口获取
  
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      title: "选择岗位",
      //权限点
      Seconddata: [
        { label: "查看", value: "select", checked: false },
        { label: "修改", value: "update", checked: false },
        { label: "删除", value: "delete", checked: false },
        { label: "发布", value: "publish", checked: false },
        { label: "作废", value: "nullify", checked: false },
      ],
      defaultValue: [],
      defaultOptions: [],
      //权限值
      authorValue: "",
      //配置属性
      plainOptions: [],
      plainValue: [],
      oldplainValue: [],
      //配置属性id 对应的数据
      fieldDate:[],
      //配置属性下面的盒子
      listOptions: [],
      attriteValue: [],
      attriteId: "",
      attriteVisible: false,
      station: "", // 岗位
      // 工程师选择器配置
      selector: {
        EngineerOff: false,
        fieldMeta: "",
      },
      username: "",
      userid: "",
    };
  }
  componentWillMount = (_) => {
    let {station, defaultValue, defaultOptions, plainValue, attriteValue} = this.state
    let name = "realName";
    let Id = "userid";
    if (process.env.NODE_ENV == "production") {
      name = `${process.env.ENV_NAME}_realName`;
      Id = `${process.env.ENV_NAME}_userId`;
    }
    console.log(!(process.env.NODE_ENV == "production"));
    let username = localStorage.getItem(name);
    let userid = localStorage.getItem(Id);

    this.setState({ username });
    this.setState({ userid });

    window.resetStore = this.props.reset;
    console.log(this.props, 'updataModal')
    if (this.props.updataModal) {
      defaultValue = this.props.updataModal.function.split(',')
      station = this.props.updataModal.positionName
      this.props.updataModal.fieldList.forEach(item => {
        defaultOptions.push(item.fieldMeta)
      })
      plainValue = this.props.updataModal.fieldList
      plainValue.forEach(item => {
        item.fieldName = item.fieldDataName
      })
      this.setState({
        defaultValue,
        station,
        defaultOptions,
        plainValue
      })
    }
    
  };
  //新增确定按钮     3权限点，4多个用逗号隔开  5属性列表
  handleOk = (info) => {
    // 1模型ID
    let { searchListID } = this.props;
    // 2岗位id
    let { positionId, authorValue, plainValue,fieldDate } = this.state;
    console.log(searchListID, authorValue, plainValue, fieldDate, '--------');
     let  fieldMetaid=[] 
    plainValue.forEach((item,index)=>{
      fieldMetaid.push( item.fieldMeta)
    })

    if (this.props.updataModal) {
      let fieldDate2 = []
      this.props.updataModal.fieldList.forEach(item => {
        let obj = {
          fieldMeta: item.fieldMeta,
          fieldData: item.fieldData
        }
        fieldDate2.push(obj)
      })
      let obj = {
        id: this.props.updataModal.id,
        businessKey: searchListID,
        position: positionId ? positionId : this.props.updataModal.position,
        function: authorValue ? authorValue : this.props.updataModal.function,
        feildAuthorizeList: fieldDate.length ? fieldDate : fieldDate2,
      };
      console.log(obj)
      Getupdate(obj).then((res) => {
        if (res.success != 1) {
          message.error("请求错误");
          return;
        }else{

          this.props.onCancel();
        }
      });
      

    } else {
      let obj = {
        businessKey: searchListID,
        position: positionId,
        function: authorValue,
        feildAuthorizeList:fieldDate,
      };
      Addadd(obj).then((res) => {
        if (res.success != 1) {
          message.error("请求错误");
          return;
        }else{
          this.props.onCancel();
        }
      });
    }
    
  };

  handleCancel = (e) => {
    console.log("cancel");
    this.props.onCancel();
  };

  //icon图标岗位
  onMyModaCance = () => {
    console.log("cancel");
    this.setState({
      oFF: false,
      key: Math.random(),
    });
  };
  //icon确定按钮岗位
  onMyModaOk = (info) => {
    let str = [];
    let positionId = [];
    info.forEach((item) => {
      str.push(item.positionName);
      positionId.push(item.id);
    });
    console.log(str, "station");
    this.setState(
      {
        station: str.join(","),
        positionId: positionId.join(","),
      },
      () => {
        console.log(
          this.state.station,
          this.state.positionId,
          "stastationtion123456"
        );
      }
    );
    this.onMyModaCance();
  };
  // icon图标弹出框岗位
  showConnet = () => {
    let oFF = this.state.oFF;
    this.setState({
      oFF: !oFF,
    });
  };
  //3：渲染配置属性 复选框
  componentDidMount = () => {
    const { searchListID } = this.props;
    console.log(this.props);
    let param = { metaCategoriesId: searchListID };
    GetAttributeList(param).then((res) => {
      if (res.success != 1) {
        message.error("请求错误");
        return;
      } else {
        let arr = [];
        res.data.forEach((item, index) => {
          let obj = {
            label: item.showName,
            value: item.fieldMeta,
          };
          arr.push(obj);
        });
        console.log(arr, "arr");
        this.setState({
          plainOptions: arr,
          listOptions: res.data,
        });
      }
    });
  };

  //权限事件
  authorHandle = (checkedValues) => {
    let listValue = []
    this.state.Seconddata.forEach((item) => {
      if (checkedValues.includes(item.value)) {
        listValue.push(item.value)
      }
    });
    this.setState({
      authorValue: listValue.join(","),
    },()=>{
        console.log(this.state.authorValue,listValue)
    });
  
  };
  //4：点击复选框
  onCheckobtn = (checkedValues) => {
    if (this.props.updataModal) {
      console.log(checkedValues, "checkedValues");
    } else {
      let listValue = this.state.listOptions.filter((item) => {
        if (checkedValues.includes(item.fieldMeta)) {
          return true;
        }
      });
      console.log(listValue, "listValue");
      this.setState(
        {
          plainValue: listValue,
        },
        () => {
          console.log(this.state.plainValue);
        }
      );
    }
  };
  //5点击属性弹出框
  attributeAlert = (id, isUser) => {
    if (isUser == "1") {
      //登录人
      this.setState({
        selector: {
          EngineerOff: true,
          fieldMeta: id,
        },
      });
    } else {
      GetFieldsRange({ fieldMeta: id }).then((res) => {
        if (res.success != 1) {
          message.error("请求错误");
          return;
        } else {
          let arr = [];
          res.data.forEach((item, index) => {
            let obj = { 
              label: item.name,
              value: item.id,
              checked: false,
            };
            arr.push(obj);
          });
          if (this.props.updataModal) {
            let newArr = []
            this.props.updataModal.fieldList.forEach(item => {
              if (item.fieldMeta === id) {
                newArr = item.fieldData.split(',')
              }
            })
            arr.forEach(item => {
              newArr.forEach(items => {
                if (item.value === items) {
                  item.checked = true
                }
              })
            })
            console.log(arr, '======')
          }
          this.setState({
            attriteValue: arr,
            attriteId: id,
            attriteVisible: true,
          });
          
        }


      });
    }
  };
  //第二个弹框选中的事件
  attriteOk = (info) => {
    let { attriteValue, plainValue, attriteId, fieldDate } = this.state;
    let obj={
      fieldMeta:attriteId,
      fieldData:[]
    }


    let checkedLabel = [];
    attriteValue.forEach((item, index) => {
      if (item.checked) {
        checkedLabel.push(item.label);
        obj.fieldData.push(item.value);
      }
    });
    obj.fieldData = obj.fieldData.join(',');
    let every = fieldDate.every(item => item.fieldMeta !== attriteId)
    if (every) {
      fieldDate.push(obj)
    } else {
      fieldDate.forEach((item,index) => {
        if (item.fieldMeta === attriteId) {
          fieldDate.splice(index, 1, obj)
        }
      })
    }

    this.setState({
      attriteVisible: false,
      fieldDate
    });
    // let newArr = plainValue;
    plainValue.map((item) => {
      if (item.fieldMeta === attriteId) {
        return (item.fieldName = checkedLabel.join(","));
      }
    });
    console.log(checkedLabel, "params");

    this.setState(
      {
        plainValue,
      },
      () => {
        console.log(plainValue, "plainValue2");
      }
    );

    this.attriteCancel();
  };
  //项目类别等复选框选中
  attritebtn = (index, e) => {
    let { plainValue } = this.state;
    let { attriteValue } = this.state;
    attriteValue[index].checked = e.target.checked;

    this.setState({ attriteValue });
  };
  //关闭
  attriteCancel = (e) => {
    this.setState({
      attriteVisible: false,
    });
  };

  // 工程师选择器确定方法
  onSelectorOK = (selectedKeys, selectedInfo) => {
    let { plainValue, selector, fieldDate } = this.state;
    var EngineerInputId = selectedKeys.join();
    let EngineerInputname = "";
    let obj={
      fieldMeta:selector.fieldMeta,
      fieldData:selectedKeys
    }
    obj.fieldData = obj.fieldData.join(',')
    let every = fieldDate.every(item => item.fieldMeta !== selector.fieldMeta)
    if (every) {
      fieldDate.push(obj)
    } else {
      fieldDate.forEach((item,index) => {
        if (item.fieldMeta === selector.fieldMeta) {
          fieldDate.splice(index, 1, obj)
        }
      })
    }
    selectedInfo.forEach((item, index) => {
      if (index) {
        EngineerInputname += "," + item.realName;
      } else {
        EngineerInputname += item.realName;
      }
    });
    plainValue.forEach((item) => {
      if (item.fieldMeta == selector.fieldMeta) {
        item.fieldData = EngineerInputId;
        item.fieldName = EngineerInputname;
      }
    });
    this.setState({
      plainValue,
      selector: {
        EngineerOff: false,
      },
      fieldDate
    });

    this.onSelectorCancel();
  };
  // 工程师选择器取消方法
  onSelectorCancel = (_) => {
    this.setState({
      selector: {
        EngineerOff: false,
      },
    });
  };
  //登录人事件
  showuser = (e) => {
    let { plainValue, oldplainValue } = this.state;
    let userOFF = e.target.checked;
    console.log(userOFF);
    if (userOFF) {
      oldplainValue = JSON.parse(JSON.stringify(plainValue));
      this.setState(
        {
          oldplainValue,
        },
        () => {
          plainValue.forEach((item, index) => {
            if (item.isUser === "1") {
              item.fieldName = this.state.username;
            }
          });
          this.setState({
            plainValue,
          });
        }
      );
    } else {
      this.setState({
        plainValue: oldplainValue,
      });
      console.log(oldplainValue);
    }
  };
  //所有的事件
  showAll = (e) => {
    console.log(e);
  };
  render = (_) => {
    var AttriteData = this.state.AttributeData;
    // const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8 },
    };
    return (
      <div>
        <Modal
          title={this.props.title}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div className="authorization">
            <p>授权对象</p>
            <div className="quarters" style={{ border: "none" }}>
              {/* 岗位: */}
              {/* <AutoComplete
                style={{ width: 200 }}
                dataSource={dataSource}
                placeholder=" 你好 "
                filterOption={(inputValue, option) =>
                  option.props.children
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
                //点击icon图标弹出框
              /> */}
              {/* <Icon
                type="solution"
                style={{ fontSize: "20px" }}
                onClick={this.showConnet}
              /> */}
              <Form.Item label={"岗位"} required={false}>
                <Input
                  // style={{ width: "75%", marginRight: 8 }}
                  suffix={
                    <Icon
                      type="solution"
                      style={{ cursor: "pointer", fontSize: "24px" }}
                      onClick={this.showConnet}
                    />
                  }
                  value={this.state.station}
                />
              </Form.Item>
              {/* <Checkbox onChange={this.showAll}>所有</Checkbox> */}
            </div>
          </div>
          <div className="Accesspoint">
            <p>权限点</p>
            {/* //2:复选框方便的从数组生成 Checkbox 组 */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                marginTop: "55px",
              }}
            >
              <Checkbox.Group
                options={this.state.Seconddata}
                defaultValue={this.state.defaultValue}
                onChange={this.authorHandle}
              />
            </div>
          </div>
          <div className="configurationProperties">
            <p>配置属性</p>
            {/* 3:复选框 */}
            <div className="PropertiesBox" style={{ border: "none" }}>
              <Checkbox.Group
                options={this.state.plainOptions}
                defaultValue={this.state.defaultOptions}
                onChange={this.onCheckobtn}
              />
            </div>
          </div>
          {/* //点击出现盒子 */}
          {this.state.plainValue.length !== 0 ? (
            <div
              className="plain"
              style={{
                width: "100%",
                border: "1px solid #ccc",
                overflowY: "scroll",
                height: "220px",
                marginTop: "15px",
                padding: "10px 20px",
              }}
            >
              {this.state.plainValue.map((k, index) => (
                <Form.Item
                  {...formItemLayout}
                  label={k.showName}
                  required={false}
                  key={k.fieldMeta}
                >
                  <Input
                    style={{ width: "75%", marginRight: 8 }}
                    suffix={
                      <Icon
                        type="unordered-list"
                        style={{ cursor: "pointer", fontSize: "24px" }}
                        onClick={(_) =>
                          this.attributeAlert(k.fieldMeta, k.isUser)
                        }
                      />
                    }
                    value={k.fieldName}
                  />
                  {/* // )} */}
                  {k.isUser === "1" ? (
                    <Checkbox onChange={this.showuser}>登录人</Checkbox>
                  ) : null}
                </Form.Item>
              ))}
            </div>
          ) : null}
        </Modal>
        {/* //第二个弹出框 */}
        <MyModa
          visible={this.state.oFF}
          title={this.state.title}
          onOk={this.onMyModaOk}
          onCance={this.onMyModaCance}
        ></MyModa>
        {/* //属性弹出框 */}
        <Modal
          title="请选择"
          visible={this.state.attriteVisible}
          onOk={this.attriteOk}
          onCancel={this.attriteCancel}
        >
          {this.state.attriteValue.map((item, index) => {
            return (
              <span key={index} style={{ marginRight: 15, marginBottom: 15 }}>
                <Checkbox
                  checked={item.checked}
                  style={{ marginRight: 8 }}
                  value={item.value}
                  name={item.label}
                  onChange={(e) => this.attritebtn(index, e)}
                />
                <label>{item.label}</label>
              </span>
            );
          })}
        </Modal>
        {/* //引入selector组件，获取工程师 */}
        {this.state.selector.EngineerOff ? (
          <Selector
            status={true}
            type={"Checkbox"}
            onOk={this.onSelectorOK}
            onCancel={this.onSelectorCancel}
          />
        ) : (
          ""
        )}
      </div>
    );
  };
}
export default Form.create()(MyModal);
