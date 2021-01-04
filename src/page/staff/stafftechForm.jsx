import React, { Component } from 'react'
import { Modal, Input, Form, Select, Button, message, Upload, Icon } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
import { addStaffTech } from '/api/staff'
import { getDictSelectMuti } from '/api/dict'

class stafftechItem extends Component{

	componentWillMount () {
		this.getTechs()
	}

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					techTypeCode: {value: mes.techTypeCode},
					techNameCode: {value: mes.techNameCode},
					techDescrip: {value: mes.techDescrip},
					remark: {value: mes.remark}
				})
				if(mes.techTypeCode) this.techchange(mes.techTypeCode)
			}
		}
	}
	state = {
		techs: [],
		tech2s: [],
		techlevel: [],
		rules: [{
			label: '技能方向(大类)',
			key: 'techTypeCode',
			option: {
				rules: [{
		        	required: true, message: '请选择技能方向(大类)',
			    }]
			},
		  render: _ => <Select onChange={this.techchange}
		    		style={{width: 200}}>
				    {this.state.techs.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '技能方向(小类)',
			key: 'techNameCode',
			option: {
				rules: [{
		        	required: true, message: '请选择技能方向(小类)',
			    }]
			},
		  render: _ => <Select
		    		style={{width: 200}}>
				    {this.state.tech2s.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '技能程度',
			key: 'techDescrip',
			option: {
				rules: [{
		        	required: true, message: '请选择技能程度',
			    }]
			},
		  render: _ => <Select onChange={this.techchange}
		    		style={{width: 200}}>
				    {this.state.techlevel.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '备注',
			key: 'remark',
			option: { rules: [] },
		    render: _ => <Input style={{width: 200}}/>
		}],
		loading: false,
		lock: false
	}

	getTechs = _ => {
		let codeList = ['techs', 'techlevel']
		getDictSelectMuti({codeList}).then(res => {
			codeList.forEach(key => {
				this.setState(res.data)
			})
		})
	}

	//技能联动
	techchange = t => {
		this.state.techs.forEach( item => {
			if(item.code == t){
				this.setState({tech2s: item.children})
			}
		})
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({staffId: this.props.staffId}, val)
					if(this.props.config.item && this.props.config.item.id) params.id = this.props.config.item.id
					if(params.techTypeCode) params.techType = this.state.techs.filter(i => i.code == params.techTypeCode)[0].name
					if(params.techNameCode) params.techName = this.state.tech2s.filter(i => i.code == params.techNameCode)[0].name
					addStaffTech(params)
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

const stafftechForm = Form.create()(stafftechItem)
export default stafftechForm