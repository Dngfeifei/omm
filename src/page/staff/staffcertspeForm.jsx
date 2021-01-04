import React, { Component } from 'react'
import { Modal, Input, Form, Select, Button, message, Upload, Icon, DatePicker, Row, Col } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
import { addStaffCert } from '/api/staff'
import moment from 'moment'

class staffcertSpeItem extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					certVender: {value: mes.certVender},
					certName: {value: mes.certName},
					certNick: {value: mes.certNick},
					certLevel: {value: mes.certLevel},
					certCode: {value: mes.certCode},
					getDate: {value: mes.getDate ? moment(mes.getDate) : ''},
					overDate: {value: mes.overDate ? moment(mes.overDate) : ''},
					certType: {value: mes.certType},
					hasoriginal: {value: mes.hasoriginal},
					remark: {value: mes.remark}
				})
			}
		}
	}
	state = {
		certs: [],
		cert2s: [],
		certtypes: [
			{code: '电子', name: '电子'},
			{code: '纸质', name: '纸质'}
		],
		rules: [{
			label: '证书厂商',
			key: 'certVender',
			span: 24,
			labelspan: 4,
			option: {
				rules: [{
		        	required: true, message: '请输入证书厂商',
			    }]
			},
		  render: _ => <Input style={{width: 200}}/>
		},{
			label: '证书全称',
			key: 'certName',
			span: 24,
			labelspan: 4,
			option: {
				rules: [{
		        	required: true, message: '请输入证书全称',
			    }]
			},
		  render: _ => <Input style={{width: 200}}/>
		},{
			label: '证书简称',
			key: 'certNick',
			option: {
				rules: [{
		        	required: true, message: '请输入证书简称',
			    }]
			},
		  render: _ => <Input style={{width: 200}}/>
		},{
			label: '证书级别',
			key: 'certLevel',
			option: {
				rules: [{
		        	required: true, message: '请输入证书级别',
			    }]
			},
		  render: _ => <Input style={{width: 200}}/>
		},{
			label: '证书编号',
			key: 'certCode',
		  render: _ => <Input style={{width: 200}}/>
		},{
			label: '资质获得日期',
			key: 'getDate',
			option: {
				rules: [{
		        	required: true, message: '资质获得日期',
			    }]
			},
		  render: _ => <DatePicker placeholder="资质获得日期" style={{width: 200}} />
		},{
			label: '资质到期日期',
			key: 'overDate',
		  render: _ => <DatePicker placeholder="资质到期日期" style={{width: 200}} />
		},{
			label: '证书类型',
			key: 'certType',
			option: {
				rules: [{
		        	required: true, message: '请选择证书类型',
			    }]
			},
		  render: _ => <Select size='small' style={{width: 200}}>
				    {this.state.certtypes.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '原件在公司',
			key: 'hasoriginal',
		  render: _ => <Select style={{width: 200}}>
		    		<Option value={0}>否</Option>
				    <Option value={1}>是</Option>
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

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({staffId: this.props.staffId, type: 2}, val)
					if(this.props.config.item && this.props.config.item.id) params.id = this.props.config.item.id
					if(params.certVenderCode) params.certVender = this.state.certs.filter(i => i.code == params.certVenderCode)[0].name
					if(params.certNameCode) params.certName = this.state.cert2s.filter(i => i.code == params.certNameCode)[0].name
					params.getDate = params.getDate ? params.getDate.format('YYYY-MM-DD')	: ''
					params.overDate = params.overDate ? params.overDate.format('YYYY-MM-DD') : ''
					addStaffCert(params)
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
				<Row gutter={24}>
	        {this.state.rules.map((val, index) => <Col key={index} span={val.span || 12} style={{ display: 'block'}}><FormItem  
	        label={val.label} labelCol={{span: val.labelspan || 8}} >
	          	{getFieldDecorator(val.key, val.option)(val.render())}
	        </FormItem></Col>)}
        </Row>
    	</Form>	
		</Modal>
	}
}

const staffcertSpeForm = Form.create()(staffcertSpeItem)
export default staffcertSpeForm