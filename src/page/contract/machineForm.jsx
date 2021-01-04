import React, { Component } from 'react'
import { Modal, Input, Form, Select, Button, message, Upload, Icon, DatePicker } from 'antd'
const { MonthPicker } = DatePicker
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
import { addMachine } from '/api/contsale'
import moment from 'moment'

class MachineItem extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					invname: {value: mes.invname},
					invspec: {value: mes.invspec},
					invclassname: {value: mes.invclassname},
					nquantity: {value: mes.nquantity},
					vmemo: {value: mes.vmemo}
				})
			}
		}
	}
	state = {
		rules: [{
			label: '设备PN号',
			key: 'invname',
			option: {
				rules: [{
		        	required: true, message: '请输入设备PN号',
			    }]
			},
		  render: _ => <Input style={{width: 300}} maxLength={200}/>
		},{
			label: '设备分类',
			key: 'invclassname',
			option: {
				rules: [{
		        	required: true, message: '请输入设备分类',
			    }]
			},
		  render: _ => <Input style={{width: 300}} maxLength={200}/>
		},{
			label: '设备描述',
			key: 'invspec',
			option: {
				rules: [{
		        	required: true, message: '请输入设备描述',
			    }]
			},
		  render: _ => <Input style={{width: 300}} maxLength={200}/>
		},{
			label: '数量',
			key: 'nquantity',
			option: {
				rules: []
			},
		  render: _ => <Input style={{width: 200}} maxLength={10}/>
		},{
			label: '备注',
			key: 'vmemo',
			option: {
				rules: []
			},
		  render: _ => <Input style={{width: 200}} maxLength={200}/>
		}],
		loading: false,
		lock: false
	}


	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val)
					if(this.props.config.item && this.props.config.item.pkContsaleEq) params.pkContsaleEq = this.props.config.item.pkContsaleEq
					params.pkContsale = this.props.contsaleId
					//console.log(params)
					addMachine(params)
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
		style={{top: 20, marginBottom: 50}}
		okText="提交"
		cancelText="取消">
			<Form>
	        {this.state.rules.map((val, index) => <FormItem  
	        label={val.label} labelCol={{span: 7}} key={index} >
	          	{getFieldDecorator(val.key, val.option)(val.render())}
	        </FormItem>)}
      	</Form>
		</Modal>
	}
}

const MachineForm = Form.create()(MachineItem)
export default MachineForm