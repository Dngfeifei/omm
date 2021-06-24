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
  Getupdate,
} from "@/api/datajurisdiction.js";
import "@/assets/less/pages/addalert.less";
// 引入页面弹出框dataccess样式
import "/assets/less/pages/dataccess.css";
// 引入工程师选择器组件
import Selector from "/components/selector/engineerSelector.jsx";
class MyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      title: "选择岗位",
      AllOff: false,
      Allname: "所有人",
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
      //配置属性id 对应的数据
      fieldDate: [],
      //配置属性下面的盒子
      listOptions: [],
      attriteValue: [],
      attriteId: "",
      attriteVisible: false,
      station: "", // 岗位
      // logid: "", //登录人id
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
    let { station, defaultValue, defaultOptions, plainValue, attriteValue } =
      this.state;
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
    console.log(this.props, "updataModal");
    if (this.props.updataModal) {
      defaultValue = this.props.updataModal.function.split(",");
      station = this.props.updataModal.positionName;
      this.props.updataModal.fieldList.forEach((item) => {
        defaultOptions.push(item.fieldMeta);
      });
      plainValue = this.props.updataModal.fieldList;
      plainValue.forEach((item) => {
        item.fieldName = item.fieldDataName;
      });
      this.setState({
        defaultValue,
        station,
        defaultOptions,
        plainValue,
      });
    }
  };
  //新增确定按钮     3权限点，4多个用逗号隔开  5属性列表
  handleOk = (info) => {
    // 1模型ID
    let { searchListID } = this.props;
    // 2岗位id
    let { positionId, authorValue, plainValue, fieldDate, AllOff } = this.state;
    console.log(searchListID, authorValue, plainValue, fieldDate, "--------");
    let fieldMetaid = [];
    plainValue.forEach((item, index) => {
      fieldMetaid.push(item.fieldMeta);
    });

    if (this.props.updataModal) {
      // 修改要走的接口
      let fieldDate2 = [];
      let positionDate = "";
      this.props.updataModal.fieldList.forEach((item) => {
        let obj = {
          fieldMeta: item.fieldMeta,
          fieldData: item.fieldData,
        };
        fieldDate2.push(obj);
      });
      if (AllOff) {
        positionDate = 0;
      } else if (positionId) {
        positionDate = positionId;
      } else {
        positionDate = this.props.updataModal.position;
      }
      let obj = {
        id: this.props.updataModal.id,
        businessKey: searchListID,
        position: positionDate,
        function: authorValue ? authorValue : this.props.updataModal.function,
        feildAuthorizeList: fieldDate.length ? fieldDate : fieldDate2,
      };
      console.log(obj, '=========');
      Getupdate(obj).then((res) => {
        if (res.success != 1) {
          message.error("请求错误");
          return;
        } else {
          this.props.onCancel();
        }
      });
    } else {
      // 新增走的接口
      let obj = {
        businessKey: searchListID,
        position: AllOff ? 0 : positionId,
        function: authorValue,
        feildAuthorizeList: fieldDate,
      };
      Addadd(obj).then((res) => {
        if (res.success != 1) {
          message.error("请求错误");
          return;
        } else {
          this.props.onCancel();
        }
      });
    }
  };

  handleCancel = (e) => {
    this.props.onCancel();
  };

  //icon图标岗位
  onMyModaCance = () => {
    this.setState({
      oFF: false,
      key: Math.random(),
    });
  };
  //icon确定按钮岗位
  onMyModaOk = (info) => {
    debugger
    let str = [];
    let positionId = [];
    info.forEach((item) => {
      str.push(item.positionName);
      positionId.push(item.id);
    });
    console.log(str,positionId, "station");
     




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
  //点击复选框所有 事件
  showAll = (e) => {
    this.setState({
      AllOff: e.target.checked,
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
    debugger
    let listValue = [];
    this.state.Seconddata.forEach((item) => {
      if (checkedValues.includes(item.value)) {
        listValue.push(item.value);
      }
    });
    this.setState(
      {
        authorValue: listValue.join(","),
      },
      () => {
        console.log(this.state.authorValue, listValue);
      }
    );
  };
  //4：点击复选框
  onCheckobtn = (checkedValues) => {
    let { plainValue } = this.state;
    let listValue = this.state.listOptions.filter((item) => {
      if (checkedValues.includes(item.fieldMeta)) {
        return item;
      }
    });
    console.log(plainValue, "plainValue");
    if (this.props.updataModal) {
      debugger
      plainValue.forEach(item => {
        listValue.forEach((items, index) => {
          if (item.fieldMeta === items.fieldMeta) {
            listValue.splice(index, 1, item)
          }
        })
      })
      console.log(listValue, plainValue, "checkedValues");

      this.setState(
        {
          plainValue: listValue,
        }
      );
    } else {

      console.log(listValue, "listValue");
      this.setState(
        {
          plainValue: listValue,
        },
        () => {
          // console.log(plainValue);
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
       //fieldDate数组的长度为真，每项id匹配则复选框为真
      
    } else {
      let { fieldDate } = this.state;
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
            let newArr = [];
            this.props.updataModal.fieldList.forEach((item) => {
              if (item.fieldMeta === id) {
                newArr = item.fieldData.split(",");
              }
            });
            arr.forEach((item) => {
              newArr.forEach((items) => {
                if (item.value === items) {
                  item.checked = true;
                }
              });
            });
            console.log(arr, "======");
          }
          //fieldDate数组的长度为真，每项id匹配则复选框为真
          if (fieldDate.length) {
            fieldDate.forEach(item => {
              if (item.fieldMeta === id) {
                arr.forEach(items => {
                  if (item.fieldData.includes(items.value)) {
                    items.checked = true
                  }
                })
              }
            })
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
  attriteOk = () => {
    debugger
    let { attriteValue, plainValue, attriteId, fieldDate } = this.state;
    let newfieldDate = []

    let checkedLabel = [];
    let checkedValue = [];
    attriteValue.forEach((item, index) => {
      if (item.checked) {
        checkedLabel.push(item.label);
        checkedValue.push(item.value);
        // obj.fieldData.push(item.value);
      }
    });
    plainValue.forEach((item) => {
      if (item.fieldMeta === attriteId) {
        item.fieldName = checkedLabel.join(",");
        item.fieldData = checkedValue.join(",");
      }
      let obj = {
        fieldMeta: item.fieldMeta,
        fieldData: item.fieldData,
      };
      newfieldDate.push(obj);
    });
    // obj.fieldData = obj.fieldData.join(",");
    // let every = fieldDate.every((item) => item.fieldMeta !== attriteId);
    // if (every) {
    //   fieldDate.push(obj);
    // } else {
    //   fieldDate.forEach((item, index) => {
    //     if (item.fieldMeta === attriteId) {
    //       fieldDate.splice(index, 1, obj);
    //     }
    //   });
    // }

    // let newArr = plainValue;

    console.log(checkedLabel, "params");

    this.setState(
      {
        attriteVisible: false,
        fieldDate: newfieldDate,
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
    let newfieldDate = []
    // let obj = {
    //   fieldMeta: selector.fieldMeta,
    //   fieldData: selectedKeys,
    // };
    // obj.fieldData = obj.fieldData.join(",");
    // let every = fieldDate.every(
    //   (item) => item.fieldMeta !== selector.fieldMeta
    // );
    // if (every) {
    //   fieldDate.push(obj);
    // } else {
    //   fieldDate.forEach((item, index) => {
    //     if (item.fieldMeta === selector.fieldMeta) {
    //       fieldDate.splice(index, 1, obj);
    //     }
    //   });
    // }

    selectedInfo.forEach((item, index) => {
      if (index) {
        EngineerInputname += "," + item.realName;
      } else {
        EngineerInputname += item.realName;
      }
    });

    plainValue.forEach((item) => {
      if (item.fieldMeta == selector.fieldMeta) {
        if (item.fieldName === undefined) {
          item.fieldData = EngineerInputId;
          item.fieldName = EngineerInputname;
        } else {
          item.fieldName = item.fieldName.split(',')
          item.fieldData = item.fieldData.split(',')
          EngineerInputId = EngineerInputId.split(',')
          EngineerInputname = EngineerInputname.split(',')

          EngineerInputname.forEach((items, index) => {
            if (item.fieldName.indexOf(items) === -1) {
              item.fieldName.push(items)
            }
          })
          EngineerInputId.forEach((items, index) => {
            if (item.fieldData.indexOf(items) === -1) {
              item.fieldData.push(items)
            }
          })
          item.fieldName = item.fieldName.join(',')
          item.fieldData = item.fieldData.join(',')
        }
      }
      let obj = {
        fieldMeta: item.fieldMeta,
        fieldData: item.fieldData,
      };
      newfieldDate.push(obj);
    });
    this.setState({
      plainValue,
      selector: {
        EngineerOff: false,
      },
      fieldDate: newfieldDate,
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
    let { plainValue, username, userid, fieldDate } = this.state;
    let userOFF = e.target.checked;

    if (userOFF) {
      // oldplainValue = JSON.parse(JSON.stringify(plainValue));
      // this.setState(
      //   {
      //     oldplainValue,
      //   },
      //   () => {
      let arr = [];
      let num = [];
      plainValue.forEach((item, index) => {
        if (item.isUser === "1") {
            if (item.fieldName === undefined) {
              arr = username;
              item.fieldName = arr;
      
            } else {
             
              arr = item.fieldName.split(",");
              
              arr.push(username);
              //去除空字符串
              for(var i=0;i<arr.length;i++){
                if(arr[i]==''||arr[i]==null){
                     arr.splice(i,1);
                     i=i-1
                }
              }
              item.fieldName = arr.join(',');
           }
          
          if (item.fieldData === undefined) {
            num = userid;
            item.fieldData = num;
          } else {
            num = item.fieldData.split(",");
            num.push(userid);
            item.fieldData = num.join(',');
          }
          let obj = {
            fieldMeta: item.fieldMeta,
            fieldData: item.fieldData,
          };
          fieldDate.push(obj);
        }

      });
      
    } else {
      plainValue.forEach((item, index) => {
        if (item.isUser === "1") {
          item.fieldName = item.fieldName.split(',')
          item.fieldData = item.fieldData.split(',')
          item.fieldName.forEach((its, index) => {
            if (its === username) {
              item.fieldName.splice(index, 1)
            }
          })
          item.fieldData.forEach((its, index) => {
            if (its === userid) {
              item.fieldData.splice(index, 1)
            }
          })
          item.fieldName = item.fieldName.join(',')
          item.fieldData = item.fieldData.join(',');
          let obj = {
            fieldMeta: item.fieldMeta,
            fieldData: item.fieldData,
          };
          fieldDate.push(obj);
        }
      });
    }
    this.setState({
      plainValue,
    });
  };
  //清空数组的字
  Cleatinput=(e)=>{
    const {station}=this.state
     if(e.target.value){
       this.setState({
        station:e.target.value
       })
     }else{
       let clearinput= document.getElementsByClassName("clearInput").value = "";
       console.log(clearinput)
        this.myInput.focus()
     }
   
    //  //第二种方式
    //  this.setState({
    //   station:null
    //  })
    //  this.myInput.focus()
  
  }
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
            <div className="quarters" style={{ border: "none", width: "100%" }}>
              {/* 岗位: */}
              <div className="quartersBox">
                <Form.Item label={"岗位"} required={false}>
                  {this.state.AllOff ? (
                    <Input
                      ref="inputModelRef"
                      disabled
                      suffix={
                        <Icon
                          type="solution"
                          style={{ cursor: "pointer", fontSize: "24px" }}
                          onClick={this.showConnet}
                        />
                      }
                      value={this.state.Allname}
                      
                    />
                  ) : (
                      <Input
                        ref={myInput => this.myInput = myInput}
                        suffix={
                          <Icon
                            type="solution"
                            style={{ cursor: "pointer", fontSize: "24px" }}
                            onClick={this.showConnet}
                          />
                        }
                        className="clearInput"
                        value={this.state.station}
                        onChange={this.Cleatinput}
                      />
                    )}
                </Form.Item>
                <Checkbox
                  style={{ marginLeft: "12px" }}
                  onChange={this.showAll}
                >
                  所有人
                </Checkbox>
              </div>
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
            <div className="PropertiesBox" style={{}}>
              <Checkbox.Group
                options={this.state.plainOptions}
                defaultValue={this.state.defaultOptions}
                onChange={this.onCheckobtn}
              />
            </div>
            {/* //点击出现盒子 */}
            {this.state.plainValue.length !== 0 ? (
              <div className="plain">
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
          </div>
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
