import React, { Component } from 'react'
import { Modal, Input, Form, Select, Button, message, InputNumber, DatePicker } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
import { addStaffPic } from '/api/staff'
import moment from 'moment'
import { getDictSelectMuti } from '/api/dict'

class staffpicItem extends Component{

	componentWillMount () {
		this.getPicTypes()
	}

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					startDate: {value: mes.startDate ? moment(mes.startDate) : ''},
					overDate: {value: mes.overDate ? moment(mes.overDate) : ''},
					period: {value: mes.period},
					conttype: {value: mes.conttype},
					contflag: {value: mes.contflag},
					memo: {value: mes.memo},
				})
				if(mes.conttype === '续订'){
					this.props.form.setFields({renewflag: {value: mes.renewflag}})
				}
			}
		}
	}
	state = {
		staffpics: [],
		conttypes: [],
		contflags: [],
		renewflags: [],
		rules: [{
			label: '开始日期',
			key: 'startDate',
			render: _ => <DatePicker placeholder="到期日期" style={{width: 200}} />
		},{
			label: '截止日期',
			key: 'overDate',
		  render: _ => <DatePicker placeholder="到期日期" style={{width: 200}}
					   onChange={t => this.props.form.setFields({period: {value: t && this.props.form.getFieldValue('startDate') ? -this.props.form.getFieldValue('startDate').diff(t, 'month') : ''}})} />
		},{
			label: '合同期限（月）',
			key: 'period',
			render: _ => <InputNumber style={{width: 200}} />
		},{
			label: '合同类型',
			key: 'conttype',
			render: _ => <Select size='small' style={{width: 200}}>
				{this.state.conttypes.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
			</Select>
		},{
			label: '合同标识',
			key: 'contflag',
			render: _ => <Select size='small' style={{width: 200}} onChange={e => this.changeFlag(e)}>
				{this.state.contflags.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
			</Select>
		},{
			label: '续签次数',
			key: 'renewflag',
			hidden: true,
			render: _ => <Select size='small' style={{width: 200}}>
				{this.state.renewflags.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
			</Select>
		},{
			label: '再入职情况',
			key: 'memo',
			option: { rules: [] },
		    render: _ => <Input style={{width: 300}}/>
		}],
		loading: false,
		lock: false
	}
	//
	changeFlag = e => {
		const rules = [...this.state.rules]
		const obj = rules.filter(e => e.key === 'renewflag')[0]
		if(e === '续订'){
			obj.hidden = false
		}else{
			obj.hidden = true
			this.props.form.setFields({renewflag: ''})
		}
		this.setState({rules})
	}

	getPicTypes = _ => {
		let codeList = ['staffpics', 'conttypes', 'contflags', 'renewflags']
		getDictSelectMuti({codeList}).then(res => {
			codeList.forEach(key => {
				this.setState(res.data)
			})
		})
	}


	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({staffId: this.props.staffId, type: '劳动合同'}, val)
					params.startDate = params.startDate ? params.startDate.format('YYYY-MM-DD') : ''
					params.overDate = params.overDate ? params.overDate.format('YYYY-MM-DD') : ''

					if (this.props.config.type == 'edit') {
						params.id = this.props.config.item.id
					}
					addStaffPic(params)
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
		width={900}
		style={{top: 20, marginBottom: 50}}
		okText="提交"
		cancelText="取消">
			<Form>
	        {this.state.rules.map((val, index) => val.hidden ? null : <FormItem
	        label={val.label} labelCol={{span: val.labelspan || 8}} >
	          	{getFieldDecorator(val.key, val.option)(val.render())}
	        </FormItem>)}
    	</Form>	
		</Modal>
	}
}

const staffpicForm = Form.create()(staffpicItem)
export default staffpicForm