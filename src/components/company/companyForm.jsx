import React, { Component } from 'react'
import { Modal, Input, Form, Button, TreeSelect, message, InputNumber } from 'antd'
const FormItem = Form.Item
import { connect } from 'react-redux'
import { addCompany } from '/api/company'
import { handleTreeTop } from '/api/tools'

class CompanyItem extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					name: {value: mes.name},
					code: {value: mes.code},
					remark: {value: mes.remark},
					pid: {value: mes.pid !== undefined && mes.pid !== '' ? mes.pid.toString() : undefined}
				})
			}
		}
	}
	state = {
		rules: [{
			label: '公司编码',
			key: 'code',
			option: {
				rules: [{
		        	required: true, message: '请输入公司编码',
			    }]
			},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '公司名称',
			key: 'name',
			option: {
				rules: [{
			        required: true, message: '请输入公司名称',
			    }]
			},
		    render: _ => <Input style={{width: 300}}/>
		},{
			label: '上级公司',
			key: 'pid',
		    option: {
				rules: [{
			        required: true, message: '请选择上级',
			    }]
		    },
		    render: _ => <TreeSelect
		        style={{ width: 300 }}
		        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
		        treeData={handleTreeTop(this.props.tree)}
		        placeholder="请选择上级"
		        treeDefaultExpandAll/>
		},{
			label: '备注',
			key: 'remark',
			option: { rules: [] },
		    render: _ => <Input style={{width: 200}}/>
		}],
		loading: false,
		lock: false
	}

	handleFetch = params => {
		if (this.props.config.type == 'edit') {
			params.id = this.props.config.item.id
			return addCompany(params)
		}
		return addCompany(params)
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val)
					this.handleFetch(params)
					.then(res => {
						if (res.code == 200 || res === true) {
							message.success('操作成功')
							this.props.done()
						}
						this.setState({lock: false})
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

const CompanyForm = Form.create()(CompanyItem)
export default CompanyForm