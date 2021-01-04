import React, { Component } from 'react'
import { Modal, Input, Form, Select, message, DatePicker } from 'antd'
const { MonthPicker } = DatePicker
const FormItem = Form.Item
const Option = Select.Option
import { addStaffEdu} from '/api/staff'
import moment from 'moment'
import { getDictSelectMuti } from '/api/dict'

class staffeduItem extends Component{

	componentWillMount () {
		this.getDictDatas()
	}

	componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					enterDate: {value: mes.enterDate ? moment(mes.enterDate) : ''},
					overDate: {value: mes.overDate ? moment(mes.overDate) : ''},
					graduated: {value: mes.graduated},
					specialty: {value: mes.specialty},
					witness: {value: mes.witness},
					witnessPhone: {value: mes.witnessPhone},
					xlxz: {value: mes.xlxz},
					xl: {value: mes.xl}
				})
			}
		}
	}
	state = {
		eduxlxzs: [],
		eduxls: [],
		rules: [{
			label: '入校时间',
			key: 'enterDate',
			option: {
				rules: [{
		        	required: true, message: '请输入入校时间',
			    }]
			},
		  render: _ => <MonthPicker placeholder="入校时间" style={{width: 200}} />
		},{
			label: '毕业时间',
			key: 'overDate',
			option: {
				rules: [{
		        	required: true, message: '请输入毕业时间',
			    }]
			},
		  render: _ => <MonthPicker placeholder="毕业时间" style={{width: 200}} />
		},{
			label: '毕业院校',
			key: 'graduated',
			option: {
				rules: [{
		        	required: true, message: '请输入毕业院校',
			    }]
			},
		  render: _ => <Input style={{width: 300}} maxLength={200}/>
		},{
			label: '专业',
			key: 'specialty',
			option: {
				rules: [{
		        	required: true, message: '请输入专业',
			    }]
			},
		  render: _ => <Input style={{width: 300}} maxLength={200}/>
		},{
			label: '学历性质',
			key: 'xlxz',
			option: {
				rules: []
			},
			render: _ => <Select style={{width: 200}}>
				{this.state.eduxlxzs.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
			</Select>
		},{
			label: '学历',
			key: 'xl',
			option: {
				rules: []
			},
			render: _ => <Select style={{width: 200}}>
				{this.state.eduxls.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
			</Select>
		}],
		loading: false,
		lock: false
	}

	getDictDatas = _ => {
		let codeList = ['eduxlxzs', 'eduxls']
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
					let params = Object.assign({staffId: this.props.staffId}, val)
					if(this.props.config.item && this.props.config.item.id) params.id = this.props.config.item.id
					if (params.enterDate) params.enterDate = params.enterDate.format('YYYY-MM')	
					if (params.overDate) params.overDate = params.overDate.format('YYYY-MM')	
					addStaffEdu(params)
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