import React, { Component } from 'react'
import { Modal, Input, Form, Button, message, InputNumber, Select, DatePicker } from 'antd'
const FormItem = Form.Item
import { editConsale } from '/api/contsale'
import Common from '/page/common.jsx'

class ContractItem extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			let mes = nextprops.config.item
			let params = {}
			if(!this.props.conauth){
				this.state.rules.forEach(item => {
					if(item.key == 'ncontnum' || item.key == 'isaccept' || item.key == 'checkNotice'){
						item.hidden = true
					}
				})
			}
			if(!this.props.projauth){
				this.state.rules.forEach(item => {
					if(item.key == 'isEnabled'){
						item.hidden = true
					}
				})
			}
			this.props.form.setFields({ncontnum: {value: mes.ncontnum},
					isaccept: {value: mes.isaccept},
					checkNotice: {value: mes.checkNotice},
					backdate: {value: mes.backdate && moment(mes.backdate)},
					isEnabled: {value: mes.isEnabled}})
		}
	}
	state = {
		rules: [{
			label: '合同份数',
			key: 'ncontnum',
			hidden: false,
			option: {
				rules: [{
		        	required: true, message: '请输入合同份数',
			    }]
			},
		    render: _ => <InputNumber style={{width: 200}}/>
		},{
			label: '验收报告',
			key: 'isaccept',
			hidden: false,
			option: { rules: [] },
		    render: _ => <Select style={{width: 200}} placeholder="选择有无">
									    <Option value='Y' key='Y'>有</Option>
									    <Option value='N' key='N'>无</Option>
									  </Select>
		},{
			label: '中标通知',
			key: 'checkNotice',
			hidden: false,
			option: { rules: [] },
		    render: _ => <Select style={{width: 200}} placeholder="选择有无">
									    <Option value={1} key={1}>有</Option>
									    <Option value={2} key={2}>无</Option>
									  </Select>
		},{
			label: '可申请',
			key: 'isEnabled',
			hidden: false,
			option: { rules: [] },
		    render: _ => <Select style={{width: 200}} placeholder="选择是否可以申请">
									    <Option value={1} key={1}>是</Option>
									    <Option value={0} key={0}>否</Option>
									  </Select>
		},{
			label: '回归日期',
			key: 'backdate',
			option: {
				rules: []
			},
		    render: _ => <DatePicker placeholder="合同文本回归日期" />
		}],
		loading: false,
		lock: false
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({pkContsale: this.props.config.item.pkContsale}, val)
					if (params.backdate) params.backdate = params.backdate.format('YYYY-MM-DD')	
					editConsale(params)
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
	        {this.state.rules.map((val, index) => val.hidden ? null : <FormItem  
	        label={val.label} labelCol={{span: 4}}>
	          	{getFieldDecorator(val.key, val.option)(val.render())}
	        </FormItem>)}
      	</Form>
		</Modal>
	}
}

const ContractEdit = Form.create()(ContractItem)
export default ContractEdit