import React, { Component } from 'react'
import { Modal, Input, Form, Select, Button, message, Upload, Icon, DatePicker } from 'antd'
const { MonthPicker } = DatePicker
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
import { addStaffTrain} from '/api/staff'
import moment from 'moment'

class staffeduItem extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					trainDate: {value: mes.trainDate ? moment(mes.trainDate) : ''},
					overDate: {value: mes.overDate ? moment(mes.overDate) : ''},
					trainName: {value: mes.trainName},
					content: {value: mes.content},
					cert: {value: mes.cert},
					witness: {value: mes.witness},
					witnessPhone: {value: mes.witnessPhone}
				})
			}
		}
	}
	state = {
		rules: [{
			label: '培训日期',
			key: 'trainDate',
			option: {
				rules: [{
		        	required: true, message: '请输入培训日期',
			    }]
			},
		  render: _ => <MonthPicker placeholder="培训日期" style={{width: 200}} />
		},{
			label: '结业日期',
			key: 'overDate',
			option: {
				rules: [{
		        	required: true, message: '请输入结业日期',
			    }]
			},
		  render: _ => <MonthPicker placeholder="结业日期" style={{width: 200}} />
		},{
			label: '培训机构',
			key: 'trainName',
			option: {
				rules: [{
		        	required: true, message: '请输入培训机构',
			    }]
			},
		  render: _ => <Input style={{width: 300}} maxLength={200}/>
		},{
			label: '培训内容',
			key: 'content',
			option: {
				rules: [{
		        	required: true, message: '请输入培训内容',
			    }]
			},
		  render: _ => <Input style={{width: 300}} maxLength={200}/>
		},{
			label: '获得证书',
			key: 'cert',
			option: {
				rules: [{
		        	required: true, message: '请输入获得证书',
			    }]
			},
		  render: _ => <Input style={{width: 300}} maxLength={200}/>
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
					if (params.trainDate) params.trainDate = params.trainDate.format('YYYY-MM')	
					if (params.overDate) params.overDate = params.overDate.format('YYYY-MM')	
					addStaffTrain(params)
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

const staffeduForm = Form.create()(staffeduItem)
export default staffeduForm