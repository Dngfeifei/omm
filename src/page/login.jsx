import React, { Component } from 'react'
import { Input, Button, Form, message, Modal } from 'antd'
const FormItem = Form.Item
import { login, getaccountemail, sendemail } from '/api/login'
import { hashHistory } from 'react-router'
class Login extends Component {

	state = {
		lock: false,
		visible: false,
		account: '',
		tips: '',
		email: '',
		buttonName: '确认'
	}

	submit = async  _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val)
					login(params)
					.then(async res => {
						await this.setState({lock: false})
						if (res.code == 200) {
							message.success('登录成功')
							let user = res.data
							await localStorage.setItem('token', user.token)
							await localStorage.setItem('userid', user.userId)
							await localStorage.setItem('username', user.userName)
							hashHistory.push('/')
						}
					})
				} else {
					this.setState({lock: false})
				}
			})
		}
	}

	forgetPwd = () => {
		this.setState({visible: true})
	}

	sendInfo = () => {
		if(this.state.buttonName == '发送'){
			sendemail({account: this.state.account}).then(res => {
				if(res.code == 200){
					message.success('邮件发送成功!')
					this.setState({visible: false})
				}
			})
		}else{
			getaccountemail({account: this.state.account}).then(res => {
				if(res.data){
					this.setState({tips: `您绑定的邮箱为：${res.data}，点击发送按钮发送找回密码链接`,email: res.data, buttonName:'发送'})
				}else{
					this.setState({tips: `没有找到您绑定的邮箱，请联系管理员处理`})
				}
			})
		}
	}

	render = _ => {
		const { getFieldDecorator } = this.props.form

		return <div className='loginWrapper' style={{backgroundImage: "url('./static/images/backimg.jpg')" }}>
		<div className="login-mask">
			<div className='loginContent'>
			  <img src='./static/images/logo.png' />
				<span className='logintitle'>业务支持平台</span>
				<FormItem>
					{getFieldDecorator('userName', {
						rules: [{
					        required: true, message: '用户名不能为空!',
					    }]
				    })(<Input type='text'/>)}
				</FormItem>
				<FormItem style={{marginBottom: '6px'}}>
					{getFieldDecorator('password', {
						rules: [{
					        required: true, message: '密码不能为空!',
					    }]
				    })(<Input type='password'/>)}
				</FormItem>
				<a onClick={this.forgetPwd} style={{display: 'block', width: '50px', margin: '4px 0px 6px 200px',fontSize: '12px'}}>忘记密码</a>
				<Button 
				onClick={this.submit}
				type='primary'>登录</Button>
			</div>
		</div>
		<Modal title="找回密码"
		  visible={this.state.visible}
		  onOk={this.sendInfo}
		  mask={false}
		  width={400}
		  onCancel={_ => this.setState({visible: false})}
		  okText={this.state.buttonName}
		  cancelText="取消"
		>
			<p>您可以通过邮箱找回密码，请先输入登录账号后点击确认按钮,登录账号为OA账号</p>
			<Input size="small" addonBefore="登录账号" 
			 placeholder="同OA登录账号" onChange={e => this.setState({account: e.target.value})} />
			<p>{this.state.tips}</p>
		</Modal>
		</div>
	}
}

const LoginForm = Form.create()(Login)
export default LoginForm