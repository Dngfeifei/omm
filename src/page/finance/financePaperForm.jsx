import React, { Component } from 'react'
import { Modal, Input, InputNumber, Form, Button, message, Select, Icon, DatePicker } from 'antd'
const FormItem = Form.Item
import { addpaper } from '/api/finance'
const { MonthPicker } = DatePicker;

const PaperType = {
	SJTB: '审计报告（投标版）',
	SJWZ: '审计报告（完整版）',
	NS: '公司纳税凭证',
	CW: '公司财务信息',
}

class FinancePaperItem extends Component{

	componentWillMount () {
		this.getRules()
	}

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			this.getRules()

			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					pkcorp: {value: mes.pkcorp},
					remark: {value: mes.remark},
				})
				if(this.props.type === 'NS'){
					this.props.form.setFields({month: {value: moment(mes.month)}})
				}else{
					this.props.form.setFields({year: {value: mes.year}})
					if(this.props.type === 'SJWZ'){
						this.props.form.setFields({paperNum: {value: mes.paperNum}})
					}
				}
			}
		}
	}
	state = {
		rules: [],
		baseRules: [{
			label: '公司',
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
			label: '年份',
			key: 'year',
			option: {
				rules: [{
		        	required: true, message: '请输入年份!',
			    }]
			},
		    render: _ => <InputNumber style={{width: 200}} min={2000} max={2040} />
		},{
			label: '月份',
			key: 'month',
			option: {
				rules: [{
		        	required: true, message: '请选择月份!',
			    }]
			},
	    render: _ => <MonthPicker placeholder="请选择月份" />
		},{
			label: '原件数量',
			key: 'paperNum',
			option: {
				rules: [{
		        	required: true, message: '请录入原件数量!',
			    }]
			},
	    render: _ => <InputNumber style={{width: 200}} min={0} max={50} />
		},{
			label: '备注',
			key: 'remark',
		  render: _ => <Input style={{width: 200}} />
		}],
		loading: false,
		lock: false
	}

	//获得字段
	//NS: '公司纳税凭证'按月填写，其他信息按年填写
	getRules = _ => {
		let rules = []
		if(this.props.type === 'NS'){
			rules = this.state.baseRules.filter(e => e.key !== 'year' && e.key !== 'paperNum')
		}else if(this.props.type === 'SJWZ'){
			rules = this.state.baseRules.filter(e => e.key !== 'month')
		}else{
			rules = this.state.baseRules.filter(e => e.key !== 'month' && e.key !== 'paperNum')
		}
		this.setState({rules})	
	}

	handleFetch = params => {
		if (this.props.config.type == 'edit') {
			params.id = this.props.config.item.id
		}
		return addpaper(params)
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({type: this.props.type}, val)
					if(params.pkcorp){
						params.pkcorpname = this.props.companys.filter(e => e.code === params.pkcorp)[0].name
					}
					if (params.month) params.month = params.month.format('YYYY-MM')	
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

const FinancePaperForm = Form.create()(FinancePaperItem)
export default FinancePaperForm