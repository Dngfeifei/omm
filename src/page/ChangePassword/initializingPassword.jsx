/***
 *   首次登陆重置密码
 *   @author jxl
 */


import React, { Component } from 'react'
import {Row, Input, Button, Form} from 'antd'
const FormItem = Form.Item

const creatHistory = require("history").createHashHistory;
const history = creatHistory();//返回上一页这段代码


// 引入API接口
import {  } from '/api/login'
// 引入css
import "/assets/less/pages/resetPassword.css";

class ResetPassword extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,  // 加载态
            count:60,  // 次数
            counting:false,
            showPasswordHelp:true,    // 用于定义 【新密码的提示信息】
        }
    }


    // 组件将要挂载时触发的函数
    componentWillMount(){
        

    }


    // 组件将要挂载完成后触发的函数
    componentDidMount(){
        

    }


    // 确认事件
    handleSubmit=()=>{
        this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
            if (!err || !Object.getOwnPropertyNames(err).length) {
                let params = Object.assign({}, val)

                console.log(params)
            }
        })
    }

    setInterval = () => {
        this.timer = setInterval(this.countDown, 1000)
    }


    // 倒计时
    countDown = () => {
        const { count } = this.state;
        if (count === 1) {
            this.clearInterval();
            this.setState({ counting: false });
        } else {
            this.setState({ counting: true, count: count - 1 });
        }
    }
    // 清除定时器
    clearInterval = () => {
        clearInterval(this.timer)
    }

    // 发送验证码
    send=()=>{
        this.setInterval();
       
    }

    // 返回登录页
    back=()=>{
        history.goBack();  //返回上一页这段代码
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
        console.log("password", event.target.value);
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
    compareToFirstPassword = (rule, value, callback) => {
        if(!value){
            callback('新密码不可以为空!')
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
        let {count,counting} = this.state;

        return (
            <div className='editPasswordWrapper' style={{backgroundImage:'url(static/images/resetPsdBg.png)'}}>
                <div className="editContent">
                    <div className="title">
                        <img src='static/images/resetPsd.png' />
                        <span className='logintitle'>重置密码</span>
                    </div>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem label='系统账号' {...formItemLayout} hasFeedback>
                            {getFieldDecorator('userName', {
                                rules: [{
                                    required: true, message: '系统账号不能为空!',
                                },{
                                    message: "请按照字母或字母+数字的格式输入",
                                    pattern: "^[a-zA-Z][a-zA-Z0-9_]{0,}$",
                                    trigger: "blur",
                                }]
                            })(
                                <Input  style={{width: '90%'}} placeholder="请输入系统账号" />,
                            )}
                        </FormItem>
                        <FormItem label='设置新密码' {...formItemLayout} style={{marginBottom: '24px'}} hasFeedback>
                            {getFieldDecorator('password', {
                                rules: [{
                                    validator: this.compareToFirstPassword,
                                }]
                            })(
                                <Input.Password style={{width: '90%'}} placeholder="设置8位字符的密码" onChange={this.passwordInput} />,
                            )}
                            <div className="explain" style={{display:this.state.showPasswordHelp?'block':'none'}}>密码由大小写字母、数字或特殊字符任意三种字符组成</div>
                        </FormItem>
                        <FormItem label='再次输入密码' {...formItemLayout} hasFeedback>
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
                        <FormItem label='验证码' {...formItemLayout} style={{marginBottom: '24px'}} help="验证码将发送到系统账号本人企业邮箱" hasFeedback>
                            <Row style={{ display: 'flex' }}>
                                {getFieldDecorator('code', {
                                    rules: [{
                                        required: true, message: '验证码不可以为空!',
                                    }]
                                })(
                                    <Input type="text" style={{width: '57%'}} placeholder="请输入验证码" className="code-input" />,
                                    
                                )}
                                <div className="identify_box">
                                <Button type='primary' disabled={counting}  className="verificationCode" onClick={this.send} >{ counting? `${count}秒后重发` :'发送验证码'}</Button>
                                   {/* <Button type='primary' >发送验证码</Button> */}
                                </div>
                            </Row>
                           
                        </FormItem>
                        <FormItem>
                            <Button  onClick={this.back} type='primary' className="login-form-button" style={{marginRight:'8%'}}>取消</Button>
                            <Button  htmlType="submit" type='primary' className="login-form-button">确认</Button>
                        </FormItem>
                        
                    </Form>
                </div>
            </div>
        )
    }
}


const passwordForm = Form.create()(ResetPassword)
export default passwordForm