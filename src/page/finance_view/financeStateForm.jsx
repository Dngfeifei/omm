import React, { Component } from 'react'
import { Modal, Input, InputNumber, Form, Button, message, Select, Icon, DatePicker } from 'antd'
const FormItem = Form.Item
import { saveNData } from '/api/finance'
import { getDictSelect } from '/api/dict'
import { numSep } from '/api/tools'

const { MonthPicker } = DatePicker;

class FinancePaperItem extends Component{

	componentWillMount () {
		this.getRules()
	}

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			let mes = nextprops.config.item.ndata
			console.log(mes)
			if (!mes) {
				this.props.form.resetFields()
			} else {
				let obj = JSON.parse(mes)
				let values = {}
				this.state.rules.forEach(e => {
					values[e.key] = {value: obj[e.key]}
				})
				this.props.form.setFields(values)
			}
		}
	}
	state = {
		rules: [],
		loading: false,
		lock: false
	}

	//获得字段
	getRules = _ => {
		const rules = []
		getDictSelect({dictcode: 'financestate'}).then(res => {
				this.assignRules(rules , res.data)
		})
	}
	//获得对应的字段格式
	getRender = e => {
		if(!e.tips){
			return <p></p>
		}else if(e.tips === 'number'){
			return <InputNumber style={{width: 200}} 
			formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      parser={v => v.replace(/\$\s?|(,*)/g, '')} />
		}else if(e.tips === 'percent'){
			return <InputNumber style={{width: 200}} 
      formatter={v => v && `${v}%`}
      parser={v => v.replace('%', '')} />
		}
	}

	//装配rules字段
	assignRules = (rules, datas) => {
		datas.forEach(e => {
			rules.push({
				label: e.name,
				key: e.code,
				option: {rules: !!e.tips ? [{required: true, message: `请输入${e.name}!`}] : null,  initialValue: ''},
		    render: _ => this.getRender(e)
			})
			if(e.children && e.children.length > 0){
				this.assignRules(rules, e.children)
			}
		})
		this.setState({rules})
	}


	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err) {
					let params = {}
					params.ndata = JSON.stringify(val)
					params.id = this.props.config.item.id
					saveNData(params)
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
		width={660}
		style={{top: 50, marginBottom: 100}}
		okText="提交"
		cancelText="取消">
			<Form>
	        {this.state.rules.map((val, index) => <FormItem  
	        label={val.label} labelCol={{span: 14}}>
	          	{getFieldDecorator(val.key, val.option)(val.render())}
	        </FormItem>)}
      	</Form>
		</Modal>
	}
}

const FinancePaperForm = Form.create()(FinancePaperItem)
export default FinancePaperForm