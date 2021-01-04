import React, { Component } from 'react'
import { Modal, Input, Form, Select, Button, message, Upload, Icon, DatePicker } from 'antd'
const FormItem = Form.Item
import { addStaffWork } from '/api/staff'
import moment from 'moment'

class staffworkItem extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					startDate: {value: mes.startDate ? moment(mes.startDate) : ''},
					overDate: {value: mes.overDate ? moment(mes.overDate) : ''},
					address: {value: mes.address},
					unit: {value: mes.unit},
					post: {value: mes.post},
					witness: {value: mes.witness},
					witnessPhone: {value: mes.witnessPhone},
					leaveReason: {value: mes.leaveReason}
				})
			}
		}
	}
	state = {
		rules: [{
			label: '入职时间',
			key: 'startDate',
			option: {
				rules: [{
		        	required: true, message: '请输入入职时间',
			    }]
			},
		  render: _ => <DatePicker placeholder="入职时间" style={{width: 200}} />
		},{
			label: '离职时间',
			key: 'overDate',
			option: {
				rules: [{
		        	required: true, message: '请输入离职时间',
			    }]
			},
		  render: _ => <DatePicker placeholder="离职时间" style={{width: 200}} />
		},{
			label: '工作地点',
			key: 'address',
			option: {
				rules: [{
		        	required: true, message: '请输入工作地点',
			    }]
			},
		  render: _ => <Input style={{width: 300}} maxLength={200}/>
		},{
			label: '工作单位',
			key: 'unit',
			option: {
				rules: [{
		        	required: true, message: '请输入工作单位',
			    }]
			},
		  render: _ => <Input style={{width: 300}} maxLength={200}/>
		},{
			label: '岗位',
			key: 'post',
			option: {
				rules: [{
		        	required: true, message: '请输入岗位',
			    }]
			},
		  render: _ => <Input style={{width: 300}} maxLength={200}/>
		},{
			label: '证明人',
			key: 'witness',
			option: {
				rules: []
			},
		  render: _ => <Input style={{width: 300}} maxLength={20}/>
		},{
			label: '联系方式',
			key: 'witnessPhone',
			option: {
				rules: []
			},
		  render: _ => <Input style={{width: 300}} maxLength={20}/>
		},{
			label: '离职原因',
			key: 'leaveReason',
			option: {
				rules: []
			},
			render: _ => <Input style={{width: 300}} maxLength={100}/>
		}],
		loading: false,
		lock: false
	}


	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({staffId: this.props.staffId}, val)
					if(this.props.config.item && this.props.config.item.id) params.id = this.props.config.item.id
					if (params.startDate) params.startDate = params.startDate.format('YYYY-MM-DD')	
					if (params.overDate) params.overDate = params.overDate.format('YYYY-MM-DD')	
					addStaffWork(params)
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

const staffworkForm = Form.create()(staffworkItem)
export default staffworkForm