import React, { Component } from 'react'
import { Modal, Input, Form, Select, Button, message, Upload, Icon, DatePicker } from 'antd'
const { MonthPicker } = DatePicker
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
import { addStaffProj } from '/api/staff'
import moment from 'moment'

class staffprojItem extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					projType: {value: mes.projType},
					projDate: {value: mes.projDate ? moment(mes.projDate) : ''},
					projendDate: {value: mes.projendDate ? moment(mes.projendDate) : ''},
					projName: {value: mes.projName},
					duty: {value: mes.duty},
					surrounding: {value: mes.surrounding},
					software: {value: mes.software},
					work: {value: mes.work},
					remark: {value: mes.remark}
				})
			}
		}
	}
	state = {
		projtypes: [
			{code: '集成', name: '集成'},
			{code: 'MA运维', name: 'MA运维'},
			{code: '驻场运维', name: '驻场运维'},
			{code: '搬迁', name: '搬迁'},
			{code: '软件', name: '软件'},
			{code: '咨询', name: '咨询'}
		],
		rules: [{
			label: '项目类型',
			key: 'projType',
			option: {
				rules: [{
		        	required: true, message: '请选择项目类型',
			    }]
			},
		  render: _ => <Select size='small' style={{width: 200}}>
				    {this.state.projtypes.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '项目开始日期',
			key: 'projDate',
			option: {
				rules: [{
		        	required: true, message: '请选择项目开始日期',
			    }]
			},
		  render: _ => <MonthPicker placeholder="项目开始日期" style={{width: 200}} />
		},{
			label: '项目结束日期',
			key: 'projendDate',
		  render: _ => <MonthPicker placeholder="项目结束日期" style={{width: 200}} />
		},{
			label: '项目名称',
			key: 'projName',
			option: {
				rules: [{
		        	required: true, message: '请输入项目名称',
			    }]
			},
		  render: _ => <Input style={{width: 300}} maxLength={225}/>
		},{
			label: '职责',
			key: 'duty',
			option: {
				rules: [{
		        	required: true, message: '请输入职责',
			    }]
			},
		  render: _ => <TextArea row={2} style={{width: 300}} maxLength={600}/>
		},{
			label: '环境描述',
			key: 'surrounding',
			option: {
				rules: [{
		        	required: true, message: '请输入环境描述',
			    }]
			},
		  render: _ => <TextArea row={2} style={{width: 300}} maxLength={600}/>
		},{
			label: '软件描述',
			key: 'software',
		  render: _ => <TextArea row={2} style={{width: 300}} maxLength={600}/>
		},{
			label: '工作描述',
			key: 'work',
			option: {
				rules: [{
		        	required: true, message: '请输入工作描述',
			    }]
			},
		  render: _ => <TextArea row={2} style={{width: 300}} maxLength={600}/>
		},{
			label: '备注',
			key: 'remark',
			option: { rules: [] },
		    render: _ => <Input style={{width: 200}}/>
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
					if (params.projDate) params.projDate = params.projDate.format('YYYY-MM')
					if (params.projendDate) params.projendDate = params.projendDate.format('YYYY-MM')
					addStaffProj(params)
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

const staffprojForm = Form.create()(staffprojItem)
export default staffprojForm