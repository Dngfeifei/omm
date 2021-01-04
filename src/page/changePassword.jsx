import React, { Component } from 'react'
import { Input, Button, Form, message } from 'antd'
const FormItem = Form.Item
import { changepass } from '/api/mgr'
import { hashHistory } from 'react-router'

class ChangePass extends Component {

	state = {
		lock: false
	}

	submit = async  _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val)

					console.log(params)

					changepass(params)
					.then(async res => {
						await this.setState({lock: false})
						if (res.code == 200) {
							message.success('修改密码成功')
						}
					})
				} else {
					this.setState({lock: false})
				}
			})
		}
	}

	render = _ => {
		const { getFieldDecorator } = this.props.form
		const formItemLayout = {
	      	labelCol: {
	        	xs: { span: 24 },
	        	sm: { span: 4 },
	      	},
	      	wrapperCol: {
		        xs: { span: 24 },
		        sm: { span: 20 },
	      	},
	    }

		return <div className='cpwrapper'>
			<FormItem
			{...formItemLayout}
			label='原密码'>
				{getFieldDecorator('old', {
					rules: [{
				        required: true, message: '原密码不能为空!',
				    }]
			    })(<Input style={{width: 200}} type='password'/>)}
			</FormItem>
			<FormItem
			{...formItemLayout}
			label='新密码'>
				{getFieldDecorator('now', {
					rules: [{
				        required: true, message: '新密码密码不能为空!',
				    }]
			    })(<Input style={{width: 200}} type='password'/>)}
			</FormItem>
			<FormItem
			label=' '
			colon={false}
			{...formItemLayout}>
				<Button 
				onClick={this.submit}
				type='primary'>修改密码</Button>
			</FormItem>
		</div>
	}
}

const ChangePassForm = Form.create()(ChangePass)
export default ChangePassForm