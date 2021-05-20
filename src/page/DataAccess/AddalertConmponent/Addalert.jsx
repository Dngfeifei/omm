// /*1：新增弹出框
//  * @Author: mikey.wangxinyue
//  */
import React, { Component } from "react";
import { Modal, Checkbox, AutoComplete,Icon  } from "antd";
import MyModa from './quartersalert.jsx'

// 引入页面弹出框dataccess样式
import "/assets/less/pages/dataccess.css";

//1:antd模拟数据下拉框的形式
const dataSource = ["Burns Bay Road", "Downing Street", "Wall Street"];
//2:antd 模拟的复选框内容
const plainOptions = ['Apple', 'Pear', 'Orange','发布','作废'];
//3:模拟配置属性 数组的形式
// const options = [
//   { label: 'Apple', value: 'Apple' },
//   { label: 'Pear', value: 'Pear' },
//   { label: 'Orange', value: 'Orange' },
//   { label: 'Orange', value: 'Orange' },
//   { label: 'Orange', value: 'Orange' },
//   { label: 'Orange', value: 'Orange' },
//   { label: 'Orange', value: 'Orange' },
//   { label: 'Orange', value: 'Orange' },
//   { label: 'Orange', value: 'Orange' },
//   { label: 'Orange', value: 'Orange' },
//   { label: 'Orange', value: 'Orange' },
// ];
export default class MyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: '选择岗位',
    

    };
  }
  //新增点击确定按钮
  handleOk = (e) => {
    console.log(e);
  };

  handleCancel = (e) => {
    console.log("cancel");
    this.props.onCancel();
  };
  onChange=(checkedValues)=>{
    console.log('checked = ', checkedValues);
  }
  //点击icon图标
  onCance= () => {
    console.log('cancel');
    this.setState({
      visible: false,
      key: Math.random()
    });
  }

  // 点击icon图标弹出框
  showConnet = () => {
    let visible = this.state.visible;
    this.setState({
      visible: !visible
    })
  }
  render = (_) =>  {
    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div className="authorization">
          <p>授权对象</p>
          <div className="quarters">
            岗位:
            <AutoComplete
              style={{ width: 200 }}
              dataSource={dataSource}
              placeholder=" 你好 "
              filterOption={(inputValue, option) =>
                option.props.children
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
              }
              //点击icon图标弹出框
            /><Icon type="solution"  style={{fontSize:"20px"}} onClick={this.showConnet}/> 
            <MyModa
            visible={this.state.visible}
            title={this.state.title}
            onCance={this.onCance}>
        </MyModa>
          </div>
        </div>
        <div className="Accesspoint">
          <p>权限点</p>
          {/* //2复选框方便的从数组生成 Checkbox 组 */}
           <Checkbox.Group options={plainOptions} defaultValue={['Apple']} className="checkboxs" />   

        </div>
        <div className="configurationProperties">
          <p>配置属性</p>
          {/* 3复选框 */}
           <div className="PropertiesBox">
           {/* <Checkbox.Group options={options} defaultValue={['Pear']}  /> */}
           </div>
        </div>
      </Modal>
    );
  }
}
