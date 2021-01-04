import React, { Component } from 'react'
import { Modal, Input, Form, Row, Col, Button, Select, TreeSelect, message, InputNumber } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
import { addMenu, editMenu } from '/api/menu'
import { handleTreeTop } from '/api/tools'

class MenuItem extends Component{


	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					name: {value: mes.name},
					code: {value: mes.code},
					icon: {value: mes.icon},
					pcode: {value: mes.pcode !== undefined && mes.pcode !== '' ? mes.pcode.toString() : undefined},
					ismenu: {value: mes.ismenu},
					num: {value: mes.num},
					ismenu: {value: mes.ismenu},
					tips: {value: mes.tips}
				})
			}
		}
	}
	state = {
		rules: [{
			label: '名称',
			key: 'name',
			option: {
				rules: [{
		        	required: true, message: '请输入菜单名称!',
			    }]
			},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '编号',
			key: 'code',
			option: {
				rules: [{
			        required: true, message: '菜单编号不能为空!',
			    }]
			},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '上级菜单',
			key: 'pcode',
		    option: {
				rules: [{
			        required: true, message: '请选择上级!',
			    }]
		    },
		    render: _ => <TreeSelect
		        style={{ width: 200 }}
		        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
		        treeData={handleTreeTop(this.props.treeMenu)}
		        placeholder="请选择上级"
		        treeDefaultExpandAll/>
		},{
			label: '是否菜单',
			key: 'ismenu',
			option: {
    	initialValue: 1,
			rules: [{
		        required: true, message: '请选择',
		    }]
	    },
	    render: _ => <Select style={{width: 120}}>
	      	<Option value={1}>是</Option>
	      	<Option value={0}>否</Option>
	    </Select>
		},{
			label: '排序',
			key: 'num',
			option: { rules: [] },
		    render: _ => <InputNumber style={{width: 200}}/>
		},{
			label: '图标',
			key: 'icon',
			option: { rules: [] },
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '备注',
			key: 'tips',
			option: { rules: [] },
		    render: _ => <Input style={{width: 200}}/>
		}],
		loading: false,
		lock: false
	}

	handleFetch = params => {
		if (this.props.config.type == 'edit') {
			params.id = this.props.config.item.id
			return editMenu(params)
		}
		return addMenu(params)
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val)
					if (!params.tips) delete params.tips
					if (!params.num) delete params.num
					//console.log(params)
					this.handleFetch(params)
					.then(res => {
						if (res.code == 200 || res === true) {
							message.success('操作成功')
							this.props.getTree()
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
		width={800}
		style={{top: 50, marginBottom: 100}}
		okText="提交"
		cancelText="取消">
			<Form className="flex-form">
			 <Row gutter={24}>
		        {this.state.rules.map((val, index) => <Col key={index} span={12} style={{ display: 'block'}}>
		        	<FormItem
		        label={val.label} labelCol={{span: 7}}>
		          	{getFieldDecorator(val.key, val.option)(val.render())}
		        </FormItem></Col>)}
		  </Row>      
	      	</Form>
		</Modal>
	}
}

const MenuForm = Form.create()(MenuItem)
export default MenuForm