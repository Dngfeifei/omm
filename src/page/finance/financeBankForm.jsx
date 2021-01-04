import React, { Component } from 'react'
import { Modal, Input, InputNumber, Form, Button, message, Select, Icon } from 'antd'
const FormItem = Form.Item
import { addfinancebank } from '/api/finance'

class FinanceBankItem extends Component{

	componentWillMount () {
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
					account: {value: mes.account},
					bankno: {value: mes.bankno},
					address: {value: mes.address},
				})
			}
		}
	}
	state = {
		rules: [{
			label: '收款单位',
			key: 'pkcorp',
			option: {
				rules: [{
		        	required: true, message: '请选择公司!',
			    }]
			},
	    render: _ => <Select style={{width: 260}} placeholder="选择公司">
								    {this.props.companys.map(r => <Option key={r.code} value={r.code}>{r.name}</Option>)}
								  </Select>
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
		},{
			label: '行号',
			key: 'bankno',
			option: {rules: [{required: true, message: '请录入行号!'}]},
		  render: _ => <Input style={{width: 300}} />
		},{
			label: '银行地址',
			key: 'address',
			option: {rules: [{required: true, message: '请录入银行地址!'}]},
		  render: _ => <Input style={{width: 300}} />
		}],
		loading: false,
		lock: false
	}

	handleFetch = params => {
		if (this.props.config.type == 'edit') {
			params.id = this.props.config.item.id
		}
		return addfinancebank(params)
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val)
					if(params.pkcorp){
						params.pkcorpname = this.props.companys.filter(e => e.code === params.pkcorp)[0].name
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