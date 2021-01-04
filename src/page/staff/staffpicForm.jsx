import React, { Component } from 'react'
import { Modal, Input, Form, Select, Button, message, Icon, DatePicker } from 'antd'
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
					type: {value: mes.type},
					remark: {value: mes.remark},
					overDate: {value: mes.overDate ? moment(mes.overDate) : ''}
				})
			}
		}
	}
	state = {
		staffpics: [],
		rules: [{
			label: '类型',
			key: 'type',
			option: {
				rules: [{
		        	required: true, message: '请选择类型',
			    }]
			},
		  render: _ => <Select onChange={this.certchange}
		    		style={{width: 200}}>
				    {this.state.staffpics.filter(e => e.name !== '劳动合同').map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '到期日',
			key: 'overDate',
		  render: _ => <DatePicker placeholder="到期日期" style={{width: 200}} />
		},{
			label: '备注',
			key: 'remark',
			option: { rules: [] },
		    render: _ => <Input style={{width: 200}}/>
		}],
		loading: false,
		lock: false
	}

	getPicTypes = _ => {
		let codeList = ['staffpics']
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
	        {this.state.rules.map((val, index) => <FormItem  
	        label={val.label} labelCol={{span: val.labelspan || 8}} >
	          	{getFieldDecorator(val.key, val.option)(val.render())}
	        </FormItem>)}
    	</Form>	
		</Modal>
	}
}

const staffpicForm = Form.create()(staffpicItem)
export default staffpicForm