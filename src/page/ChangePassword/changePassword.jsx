/***
 *   首次登陆重置密码
 *   @author jxl
 */

import React, { Component } from 'react'
import {message, Input, Button, Form} from 'antd'
const creatHistory = require("history").createHashHistory;
const history = creatHistory();//返回上一页这段代码
const FormItem = Form.Item


// 引入API接口
import { changepass } from '/api/login'
// 引入css
import "/assets/less/pages/resetPassword.css"



class ChangePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lock: false,
            showPasswordHelp:true,    // 用于定义 【新密码的提示信息】   
        }
    }

    // 组件将要挂载完成后触发的函数
    componentDidMount(){
        

    }


    // 密码验证 （小写字母）
    isLowletter=(a)=> {
        if (a.match(/([a-z])+/)) {
            return true;
        } else {
            return false;
        }
    }

    // 密码验证 （大写字母）
    isUpperletter=(a)=> {
        if (a.match(/([A-Z])+/)) {
            return true;
        } else {
            return false;
        }
    }

    // 密码验证 （纯数字）
    isNum=(a)=> {
        if (a.match(/([0-9])+/)) {
            return true;
        } else {
            return false;
        }
    }

    // 密码验证 （特殊字符）
    isSpecial=(a)=> {
        if (a.match(/[^a-zA-Z0-9]+/)) {
            return true;
        } else {
            return false;
        }
    }


    // 设置新密码--输入框
    passwordInput = (event) => {
        // 将【新密码的提示信息】的状态修改为false
        this.setState({
            showPasswordHelp:false
        })
        // 自定义
        this.props.form.setFieldsValue({
            password: event.target.value
        });
    };

    // 设置新密码--校验规则
    ComPassword = (rule, value, callback) => {
        if(!value){
            callback('设置新密码不能为空！');
        }else if (value.length <= 7) {
            callback('密码长度不可以小于8位')
        }else if (this.isLowletter(value) === false) {
            callback("需包含小写字母")
        }else if (this.isNum(value) === false) {
            callback("需要包含数字")
        }else if (this.isUpperletter(value) === false) {
            callback("需包含大写字母")
        }else if (this.isSpecial(value) === false) {
            callback("需包含特殊字符")
        }else {
            callback();
            // 将【新密码的提示信息】的状态修改为true
            this.setState({
                showPasswordHelp: true
            })
        }

    }


    // 确认密码--校验规则
    ConfirmPassword=(rule, value, callback)=>{
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
          callback('你输入的两个密码是不一致的！');
        } else {
          callback();
        }
    }



    // 确认  事件按钮
    handleSubmit =(e) => {
        e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, val) => {
            if (!err || !Object.getOwnPropertyNames(err).length) {
                let params = Object.assign({}, val)

                changepass({password:params.password}).then(async res => {
                    if (res.success == 1) {
                        message.success(res.message)
                        // 返回登录页，重新登录
                        history.goBack();  //返回上一页这段代码
                    }else if (res.success == 0) {
                        message.success(res.message)
                    }
                })
            } else {
                this.setState({lock: false})
            }
        })
	}




    render = _ => {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        }



        return (
            <div className='editPasswordWrapper' style={{backgroundImage:'url(static/images/resetPsdBg.png)'}}>
                <div className="editContent changePass">
                    <div className="title">
                        <img src='static/images/resetPsd.png' />
                        <span className='logintitle'>修改密码</span>
                    </div>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem label='设置新密码' {...formItemLayout} style={{marginBottom: '24px'}} >
                            {getFieldDecorator('password', {
                                rules: [{
                                    validator:this.ComPassword
                                }],
                            })(
                                <Input.Password style={{width: '90%'}} placeholder="设置8位字符的密码" onChange={this.passwordInput} />,
                            )}
                            <div className="explain" style={{display:this.state.showPasswordHelp?'block':'none'}}>密码由大小写字母、数字或特殊字符任意三种字符组成</div>
                        </FormItem>
                        <FormItem label='再次输入密码' {...formItemLayout}>
                            {getFieldDecorator('confPwd', {
                                rules: [{
                                    required: true, message: '密码确认不可以为空!',
                                },{
                                    validator: this.ConfirmPassword,
                                }]
                            })(
                                <Input.Password style={{width: '90%'}} placeholder="须与设置的密码一样" />,
                            )}
                        </FormItem>
                            <Button htmlType="submit" type='primary' className="change-button">确认</Button>
                        
                    </Form>
                </div>
            </div>
        )
    }

}


const ChangePassForm = Form.create()(ChangePassword)
export default ChangePassForm