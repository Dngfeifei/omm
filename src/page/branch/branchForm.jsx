import React, { Component } from 'react'
import { Modal, Input, Form, Row, Col, Button, message, Upload, Icon } from 'antd'
const FormItem = Form.Item
import { addbranch } from '/api/branch'

class BranchItem extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					branchArea: {value: mes.branchArea},
					branchName: {value: mes.branchName},
					legalName: {value: mes.legalName},
					legalPhone: {value: mes.legalPhone},
					address: {value: mes.address},
					remark: {value: mes.remark}
				})
			}
		}
	}
	state = {
		rules: [{
			label: '区域',
			key: 'branchArea',
			option: {
				rules: [{
		        	required: true, message: '请输入区域!',
			    }]
			},
		    render: _ => <Input style={{width: 200}} palceholder='区域与备件库区域保持一致'/>
		},{
			label: '分公司名称',
			key: 'branchName',
			option: {
				rules: [{
		        	required: true, message: '请输入分公司名称!',
			    }]
			},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '公司法人',
			key: 'legalName',
			option: {
				rules: [{
		        	required: true, message: '请输入公司法人!',
			    }]
			},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '法人电话',
			key: 'legalPhone',
			option: {
				rules: [{
		        	required: true, message: '请输入公司法人电话!',
			    }]
			},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '地址',
			key: 'address',
			option: {
				rules: [{
		        	required: true, message: '请输入地址!',
			    }]
			},
		    render: _ => <Input style={{width: 200}}/>
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
		}
		return addbranch(params)
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
		return <Modal title={this.props.config.title}
		onOk={this.handleOk}
		visible={this.props.config.visible}
		confirmLoading={this.state.loading}
		onCancel={this.props.onCancel}
		width={500}
		style={{top: 50, marginBottom: 100}}
		okText="提交"
		cancelText="取消">
			<Form>
	        {this.state.rules.map((val, index) => <FormItem  
	        label={val.label} labelCol={{span: 6}}>
	          	{getFieldDecorator(val.key, val.option)(val.render())}
	        </FormItem>)}
      	</Form>
		</Modal>
	}
}

const BranchForm = Form.create()(BranchItem)
export default BranchForm