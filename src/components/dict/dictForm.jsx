import React, { Component } from 'react'
import { Modal, Input, Form, Row, Col, Button, Select, TreeSelect, message, InputNumber } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
import { connect } from 'react-redux'
import { addDict, editDict } from '/api/dict'
import { handleTreeTop } from '/api/tools'

class DictItem extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					name: {value: mes.name},
					code: {value: mes.code},
					isTree: {value: mes.isTree},
					tips: {value: mes.tips},
					field1: {value: mes.field1},
					field2: {value: mes.field2},
					field3: {value: mes.field3}
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
		        	required: true, message: '请输入数据字典名称!',
			    }]
			},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '编号',
			key: 'code',
			option: {
				rules: [{
			        required: true, message: '数据字典编号不能为空!',
			    }]
			},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '是否树形',
			key: 'isTree',
			option: {
    	initialValue: 0,
			rules: [{
		        required: true, message: '请选择',
		    }]
	    },
	    render: _ => <Select style={{width: 120}}>
	    		<Option value={0}>否</Option>
	      	<Option value={1}>是</Option>
	    </Select>
		},{
			label: '备注',
			key: 'tips',
			option: { rules: [] },
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '备用字段1',
			key: 'field1',
			option: { rules: [] },
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '备用字段2',
			key: 'field2',
			option: { rules: [] },
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '备用字段3',
			key: 'field3',
			option: { rules: [] },
		    render: _ => <Input style={{width: 200}}/>
		}],
		loading: false,
		lock: false
	}

	handleFetch = params => {
		if (this.props.config.type == 'edit') {
			params.id = this.props.config.item.id
			return editDict(params)
		}
		return addDict(params)
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val)
					if (!params.tips) delete params.tips
					if (!params.num) delete params.num
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
		        {this.state.rules.map((val, index) => <Col span={12} key={index} style={{ display: 'block'}}><FormItem  
		        label={val.label} labelCol={{span: 7}}>
		          	{getFieldDecorator(val.key, val.option)(val.render())}
		        </FormItem></Col>)}
		  </Row>      
	      	</Form>
		</Modal>
	}
}

const DictForm = Form.create()(DictItem)
export default DictForm