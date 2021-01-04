import React, { Component } from 'react'
import { Modal, Input, Form, Row, Col, Button, message, Select, Icon, DatePicker, InputNumber } from 'antd'
const FormItem = Form.Item
import { addbranchcont } from '/api/branch'
import moment from 'moment'

class BranchContItem extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					address: {value: mes.address},
					area: {value: mes.area},
					monthRent: {value: mes.monthRent},
					yearRent: {value: mes.yearRent},
					deposit: {value: mes.deposit},
					damages: {value: mes.damages},
					fee: {value: mes.fee},
					startDate: {value: mes.startDate && moment(mes.startDate)},
					overDate: {value: mes.overDate && moment(mes.overDate)},
					specially: {value: mes.specially},
					paperNum: {value: mes.paperNum},
				})
			}
		}
	}
	state = {
		rules: [{
			label: '地址',
			key: 'address',
			option: {
				rules: [{
		        	required: true, message: '请输入地址!',
			    }]
			},
		    render: _ => <Input style={{width: 200}} />
		},{
			label: '面积',
			key: 'area',
	    render: _ => <Input style={{width: 200}}/>
		},{
			label: '月租金',
			key: 'monthRent',
			option: {rules: []},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '年租金',
			key: 'yearRent',
			option: {rules: []},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '押金',
			key: 'deposit',
			option: {rules: []},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '违约金',
			key: 'damages',
			option: {rules: []},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '可使用费用',
			key: 'fee',
			option: {rules: []},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '起租日期',
			key: 'startDate',
			option: {rules: []},
		    render: _ => <DatePicker placeholder="起租日期" />
		},{
			label: '终止日期',
			key: 'overDate',
			option: {rules: []},
		    render: _ => <DatePicker placeholder="终止日期" />
		},{
			label: '原件数量',
			key: 'paperNum',
	    render: _ => <InputNumber min={0} max={50} placeholder="录入原件数量" />
		},{
			label: '是否特批',
			key: 'specially',
	    render: _ => <Select style={{width: 120}} placeholder="是否特批">
								    <Option value='0' key='0'>否</Option>
								    <Option value='1' key='1'>是</Option>
								  </Select>
		}],
		loading: false,
		lock: false
	}

	handleFetch = params => {
		if (this.props.config.type == 'edit') {
			params.id = this.props.config.item.id
		}
		return addbranchcont(params)
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({branchId: this.props.branchId}, val)
					if(params.startDate) params.startDate = moment(params.startDate).format('YYYY-MM-DD')
					if(params.overDate) params.overDate = moment(params.overDate).format('YYYY-MM-DD')
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

const BranchContForm = Form.create()(BranchContItem)
export default BranchContForm