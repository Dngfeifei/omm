import React, { Component } from 'react'
import { Modal, Input, InputNumber, Form, Button, message, Select, Icon, DatePicker } from 'antd'
const FormItem = Form.Item
import { addstorepaper } from '/api/branch'

const StorePaperType = {
	BZ: '备件库照片',
	// BS: '备件库系统截图'
}

class StorePaperItem extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					year: {value: mes.year},
					quarter: {value: mes.quarter},
					type: {value: mes.type},
					remark: {value: mes.remark},
				})
			}
		}
	}
	state = {
		rules: [{
			label: '年份',
			key: 'year',
			option: {
				rules: [{
		        	required: true, message: '请输入年份!',
			    }]
			},
		    render: _ => <InputNumber style={{width: 200}} min={2000} max={2040} />
		},{
			label: '季度',
			key: 'quarter',
			option: {
				rules: [{
		        	required: true, message: '请选择季度!',
			    }]
			},
	    render: _ => <Select style={{width: 200}} placeholder="选择季度">
								    <Option value={1} key={1}>第一季度</Option>
								    <Option value={2} key={2}>第二季度</Option>
								    <Option value={3} key={3}>第三季度</Option>
								    <Option value={4} key={4}>第四季度</Option>
								  </Select>
		},{
			label: '备注',
			key: 'remark',
		  render: _ => <Input style={{width: 200}} />
		}],
		loading: false,
		lock: false
	}

	handleFetch = params => {
		if (this.props.config.type == 'edit') {
			params.id = this.props.config.item.id
		}
		return addstorepaper(params)
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({storeId: this.props.storeId, type: 'BZ', name: '备件库照片'}, val)
					// if(params.type) params.name = StorePaperType[params.type]
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

const StorePaperForm = Form.create()(StorePaperItem)
export default StorePaperForm