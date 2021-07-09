import React, { Component } from 'react'
import {Modal, message, Button, Input, Select, Card, DatePicker, TimePicker, Tooltip, Tabs, Icon, Form } from 'antd'
import { SaveActivitiAuditData } from '/api/initiate'


class SimulationForm extends Component {

  constructor(props){
    super(props)
    if(props.onRef){//如果父组件传来该方法 则调用方法将子组件this指针传过去
      props.onRef(this)
    }
  }
    
  saveForm = (callback) => { 
    // this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
    //     if (!err || !Object.getOwnPropertyNames(err).length) {//校验完成执行的逻辑 发起后台请求
    //       SaveActivitiAuditData(val)
    //         .then(data => {
    //             if (data && data.success) {
    //               callback(data.businessTable, data.businessId)
    //             }
    //         })
    //     }
    //  })
    callback("test_simulation", "123456")
  }
  
  render = _ => {

    const { getFieldDecorator } = this.props.form;

    return (
       
      <Form  className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        
      </Form>
    );
  }

}

const SimulationPage = Form.create()(SimulationForm)
export default SimulationPage

