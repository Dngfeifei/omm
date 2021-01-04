import React, { Component } from 'react'
import { Modal, Input, Form, Button, TreeSelect, message, InputNumber } from 'antd'
const FormItem = Form.Item
import { connect } from 'react-redux'
import { addRole, editRole } from '/api/role'
import { handleTreeTop } from '/api/tools'


class Role extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				console.log(mes)
				this.props.form.setFields({
					name: {value: mes.name},
					tips: {value: mes.tips},
					num: {value: mes.num}
				})
			}
		}
	}
	state = {
		rules: [{
			label: '角色名称',
			key: 'name',
			option: {
				rules: [{
		        	required: true, message: '请输入角色名称!',
			    }]
			},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '排序',
			key: 'num',
			option: { rules: [] },
		    render: _ => <InputNumber style={{width: 200}}/>
		},{
			label: '说明',
			key: 'tips',
			option: { rules: []},
		  render: _ => <Input style={{width: 200}}/>
		}],
		loading: false,
		lock: false
	}

	handleFetch = params => {
		if (this.props.config.type == 'edit') {
			params.id = this.props.config.item.id
			return editRole(params)
		}
		return addRole(params)
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true, loading: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val)
					if (!params.deptid) delete params.deptid
					if (!params.num) delete params.num

					this.handleFetch(params)
					.then(res => {
						if (res.code == 200) {
							message.success('操作成功')
							this.props.done()
						}
						this.setState({lock: false, loading: false})
					})
				} else {
					this.setState({lock: false, loading: false})
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

		return <Modal title={this.props.config.title}
		onOk={this.handleOk}
		visible={this.props.config.visible}
		confirmLoading={this.state.loading}
		onCancel={this.props.onCancel}
		style={{top: 50, marginBottom: 100}}
		okText="提交"
		cancelText="取消">
			<Form>
		        {this.state.rules.map((val, index) => <FormItem 
		        {...formItemLayout} 
		        key={index}
		        label={val.label}>
		          	{getFieldDecorator(val.key, val.option)(val.render())}
		        </FormItem>)}
	      	</Form>
		</Modal>
	}
}

const RoleForm = Form.create()(Role)
export default RoleForm