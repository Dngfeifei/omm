import React, { Component } from 'react'
import { Row, Input, Button, Form, message, Modal, Icon, Checkbox } from 'antd'
const FormItem = Form.Item
import { login, getCode, } from '/api/login'
import { hashHistory } from 'react-router'
import { onKey } from '@/assets/js/publicMethod'
import { SET_LOGINSTATUS } from '/redux/action'
import { connect } from 'react-redux'
@connect(state => ({
	loginStatus: state.global.loginStatus,
}), dispath => ({
	setLogin(data) { dispath({ type: SET_LOGINSTATUS, data: data }) },
}))
class Login extends Component {


	state = {
		lock: false,
		visible: false,
		account: '',
		tips: '',
		email: '',
		buttonName: '确认',
		code: '', // 验证码
		uuId: '',  // 获取验证码接口返回的随机字符串
	}

	componentWillMount() {
		let querys = Object.assign({}, this.props.location.query)
		if (querys.hasOwnProperty("ticket")) {
			let ticketVal = querys["ticket"];
			login({ "ticket": ticketVal }).then(async res => {
				await this.setState({ lock: false })
				if (res.status == '200') {
					// message.success('登录成功')
					let user = res.data
					let name = '';
					if (process.env.NODE_ENV == 'production') {
						name = process.env.ENV_NAME + '_'
					}
					localStorage.setItem(`${name}token`, user.token)
					localStorage.setItem(`${name}userid`, user.userId)
					localStorage.setItem(`${name}username`, user.userName)
					localStorage.setItem(`${name}realName`, user.realName)
					this.props.setLogin(false)
					localStorage.setItem(`loginStatus`, 2)
					hashHistory.push('/')
				} else {
					message.error(res.message)
				}
			})
		} else {
			console.log(this.props, "querys1")
			this.init();   // 获取验证码
		}
	}


	init = () => {
		// 获取验证码
		getCode().then(res => {
			if (res.success == 1) {
				this.setState({
					code: res.data.code,
					uuId: res.data.uuId
				})
			} else {
				message.error(res.message);
			}
		})
	}

	// 刷新验证码事件
	RefreshCode = () => {
		this.init();   // 获取验证码
	}

	// 登录--事件按钮
	submit = async _ => {
		if (!this.state.lock) {
			await this.setState({ lock: true })
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val, { uuId: this.state.uuId })

					login(params).then(async res => {
						await this.setState({ lock: false })
						if (res.status == '200') {
							message.success('登录成功')
							let user = res.data
							let name = '';
							if (process.env.NODE_ENV == 'production') {
								name = process.env.ENV_NAME + '_'
							}
							await localStorage.setItem(`${name}token`, user.token)
							await localStorage.setItem(`${name}userid`, user.userId)
							await localStorage.setItem(`${name}username`, user.userName)
							await localStorage.setItem(`${name}realName`, user.realName)
							// 判断此用户是否是首次登陆  true-是，false-否

							if (user.firstLogin) {
								// 跳转到【首次修改密码】页面  
								this.props.setLogin(true)
								localStorage.setItem(`loginStatus`, 1)
								hashHistory.push('/ChangePassForm')
							} else {
								this.props.setLogin(false)
								localStorage.setItem(`loginStatus`, 2)
								hashHistory.push('/')
							}

						} else {
							message.error(res.message)
						}
					})
				} else {
					this.setState({ lock: false })
				}
			})
		}
	}

	forgetPwd = () => {
		// this.setState({visible: true})
		// 跳转到【重置密码】页面  
		hashHistory.push('/initPassForm')
	}

	sendInfo = () => {
		if (this.state.buttonName == '发送') {
			sendemail({ account: this.state.account }).then(res => {
				if (res.code == 200) {
					message.success('邮件发送成功!')
					this.setState({ visible: false })
				}
			})
		} else {
			getaccountemail({ account: this.state.account }).then(res => {
				if (res.data) {
					this.setState({ tips: `您绑定的邮箱为：${res.data}，点击发送按钮发送找回密码链接`, email: res.data, buttonName: '发送' })
				} else {
					this.setState({ tips: `没有找到您绑定的邮箱，请联系管理员处理` })
				}
			})
		}
	}

	render = _ => {
		const { getFieldDecorator } = this.props.form

		return <div className='loginWrapper' style={{ backgroundImage: 'url(static/images/bg.png)' }}>
			<div className="login-mask">
				<div className='loginContent'>
					{/* <img src='/static/images/logo.png' /> */}
					<div style={{ marginBottom: '25px' }}>
						<img src="static/images/userLog.png" alt="" />
						<span className='logintitle'>欢迎登陆</span>
					</div>

					<FormItem>
						{getFieldDecorator('userName', {
							rules: [{
								required: true, message: '用户名不能为空!',
							}]
						})(
							<Input onKeyDown={(e) => onKey(e, this.submit)} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入用户名"
							/>,
						)}
					</FormItem>
					<FormItem>
						{getFieldDecorator('password', {
							rules: [{
								required: true, message: '密码不能为空!',
							}]
						})(
							<Input onKeyDown={(e) => onKey(e, this.submit)} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码"
							/>,
						)}
					</FormItem>
					<FormItem style={{ marginBottom: '6px' }}>
						<Row style={{ display: 'flex' }}>
							{getFieldDecorator('code', {
								rules: [{
									required: true, message: '验证码不可以为空!',
								}]
							})(
								<Input onKeyDown={(e) => onKey(e, this.submit)} prefix={<Icon type="safety-certificate" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder="验证码" className="code-input" />,

							)}
							<div className="identify_box" onClick={this.RefreshCode}>
								<img src={'data:image/jpg;base64,' + this.state.code} alt="" />
							</div>
						</Row>

					</FormItem>

					<a onClick={this.forgetPwd} style={{ display: 'block', textAlign: 'right', fontSize: '12px', marginBottom: '15px' }}>忘记密码?</a>
					<Button onClick={this.submit} type='primary' className="loginButton">登录</Button>
				</div>
			</div>
			<Modal title="找回密码"
				visible={this.state.visible}
				onOk={this.sendInfo}
				mask={false}
				width={400}
				onCancel={_ => this.setState({ visible: false })}
				okText={this.state.buttonName}
				cancelText="取消"
			>
				<p>您可以通过邮箱找回密码，请先输入登录账号后点击确认按钮,登录账号为OA账号</p>
				<Input size="small" addonBefore="登录账号"
					placeholder="同OA登录账号" onChange={e => this.setState({ account: e.target.value })} />
				<p>{this.state.tips}</p>
			</Modal>
		</div>
	}
}

const LoginForm = Form.create()(Login)
export default LoginForm