import React, { Component } from 'react'
import { Modal, Input, InputNumber, Form, Button, message, Select, Icon } from 'antd'
const FormItem = Form.Item
import { addfinanceinvoice } from '/api/finance'

class FinanceBankItem extends Component{

	componentWillMount () {
		const companys = [...this.props.companys]
		companys.push({code: '2222', name: '嘉兴数云投资管理有限公司'})
		this.setState({companys})
	}

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					pkcorp: {value: mes.pkcorp},
					bank: {value: mes.bank},
					phone: {value: mes.phone},
					account: {value: mes.account},
					taxno: {value: mes.taxno},
					address: {value: mes.address},
				})
			}
		}
	}
	state = {
		companys: [],
		rules: [{
			label: '公司名称',
			key: 'pkcorp',
			option: {
				rules: [{
		        	required: true, message: '请选择公司!',
			    }]
			},
	    render: _ => <Select style={{width: 260}} placeholder="选择公司">
								    {this.state.companys.map(r => <Option key={r.code} value={r.code}>{r.name}</Option>)}
								  </Select>
		},{
			label: '纳税识别号',
			key: 'taxno',
			option: {rules: [{required: true, message: '请录入纳税识别号!'}]},
		  render: _ => <Input style={{width: 300}} />
		},{
			label: '地址',
			key: 'address',
			option: {rules: [{required: true, message: '请录入地址!'}]},
		  render: _ => <Input style={{width: 300}} />
		},{
			label: '电话',
			key: 'phone',
			option: {rules: [{required: true, message: '请录入电话!'}]},
		  render: _ => <Input style={{width: 300}} />
		},{
			label: '开户行',
			key: 'bank',
			option: {rules: [{required: true, message: '请录入开户行!'}]},
		  render: _ => <Input style={{width: 300}} />
		},{
			label: '账号',
			key: 'account',
			option: {rules: [{required: true, message: '请录入账号!'}]},
		  render: _ => <Input style={{width: 300}} />
		}],
		loading: false,
		lock: false
	}

	handleFetch = params => {
		if (this.props.config.type == 'edit') {
			params.id = this.props.config.item.id
		}
		return addfinanceinvoice(params)
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val)
					if(params.pkcorp){
						params.pkcorpname = this.state.companys.filter(e => e.code === params.pkcorp)[0].name
					}
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

const FinanceBankForm = Form.create()(FinanceBankItem)
export default FinanceBankForm