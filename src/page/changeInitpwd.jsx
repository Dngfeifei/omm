import React, { Component } from 'react'
import { Modal, Input, Form, Button, message, Upload, Icon } from 'antd'
import { changeinitpwd } from '/api/mgr'
const FormItem = Form.Item

class ProfileItem extends Component{

	componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			let mes = nextprops.config.data
			console.log(mes)
				this.props.form.setFields({
					email: {value: mes.email}
				})
		}
	}

	state = {
		rules: [{
			label: '新密码',
			key: 'pwd',
			option: {
				rules: [{
		        	required: true, message: '新密码不可以为空!',
		        	min: 6, message: '密码长度不可以小于6位'
			    }]
			},
		    render: _ => <Input style={{width: 200}} type='password'/>
		},{
			label: '密码确认',
			key: 'agpwd',
			option: { rules: [{
		        	required: true, message: '密码确认不可以为空!',
			    }] },
		    render: _ => <Input style={{width: 200}} type='password'/>
		},{
			label: '邮箱',
			key: 'email',
			option: { rules: [{
		        	required: true, message: '邮箱不可以为空!',
			    }] },
		    render: _ => <Input style={{width: 200}}/>
		}],
		loading: false
	}


	handleOk = async _ => {
		if (!this.state.loading) {
			await this.setState({loading: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val)
					if(params.pwd != params.agpwd){
						message.error('两次输入密码不一致!')
						this.setState({loading: false})
						return
					}
					changeinitpwd(params)
					.then(res => {
						if (res.code == 200) {
							message.success('操作成功')
							this.props.onCancel()
						}
						this.setState({loading: false})
					})
				} else {
					this.setState({loading: false})
				}
			})
		}
	}

	render = _ => {
		const { getFieldDecorator } = this.props.form
		return <Modal title="修改初始密码"
		visible={this.props.config.visible}
		closable={false}
		footer={[
            <Button key="Submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
              保存
            </Button>
          ]}
		width={400}
		style={{top: 50, marginBottom: 100}}>
			<Form>
	        {this.state.rules.map((val, index) => <FormItem  
	        label={val.label} labelCol={{span: 6}}>
	          	{getFieldDecorator(val.key, val.option)(val.render())}
	        </FormItem>)}
      	</Form>
		</Modal>
	}
}

const ProfileForm = Form.create()(ProfileItem)
export default ProfileForm