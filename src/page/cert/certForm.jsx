import React, { Component } from 'react'
import { Modal, Input, InputNumber, DatePicker, Form, Row, Col, Button, message, Icon, Select, TreeSelect } from 'antd'
const FormItem = Form.Item
import { addCert, getCertColumns } from '/api/cert'
import { getDictSelect, getCompanys } from '/api/dict'
import { handleTreeData } from '/api/tools'
import moment from 'moment'

class CertItem extends Component{

	async componentWillMount () {
		this.getTypeTreeData()
		this.getCompanys()
	}

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.setState({customeRules: []})
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				//console.log(mes)
				this.props.form.setFields({
					typeCode: {value: mes.typeCode},
					name: {value: mes.name},
					code: {value: mes.code},
					startDate: {value: mes.startDate ? moment(mes.startDate) : ''},
					overDate: {value: mes.overDate ? moment(mes.overDate) : ''},
					remark: {value: mes.remark},
					pkCorp: {value: mes.pkCorp}
				})
				this.getCustomForm(mes.typeCode, mes.certDetails)
			}
		}
	}
	state = {
		companys: [],
		typeTreeData: [],
		rules: [{
			label: '证书类型',
			key: 'typeCode',
			option: { rules: [{
		        	required: true, message: '请选择证书类型'
			    }] },
		    render: _ => <TreeSelect style={{ width: 200 }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={this.state.typeTreeData}
        placeholder="选择证书类型"
        treeDefaultExpandAll
        onChange={this.onChange} />
		},{
			label: '公司',
			key: 'pkCorp',
			option: { rules: [{
		        	required: true, message: '请选择公司',
			    }]},
			render: _ => <TreeSelect
		        style={{ width: 260 }}
		        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
		        treeData={this.state.companys}
		        placeholder="请选择公司"
		        treeDefaultExpandAll/>
		},{
			label: '名称',
			key: 'name',
			option: {
				rules: []
			},
		  render: _ => <Input style={{width: 200}}/>
		},{
			label: '编号',
			key: 'code',
			option: { rules: []},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '发证日期',
			key: 'startDate',
			option: {rules: []},
		  render: _ =>  <DatePicker placeholder="发证日期" style={{width: 200}} />
		},{
			label: '到期日',
			key: 'overDate',
			option: {rules: []},
		  render: _ =>  <DatePicker placeholder="到期日" style={{width: 200}} />
		},{
			label: '备注',
			key: 'remark',
			option: { rules: [] },
		    render: _ => <Input style={{width: 200}}/>
		}],
		customeRules: [],
		loading: false,
		lock: false
	}

	getCompanys = _ => {
		getCompanys({}).then(res => {
			this.setState({companys: handleTreeData(res.data, 'name', 'code', 'children')})
		})
	}

	getTypeTreeData = _ => {
		getDictSelect({dictcode: 'aptitude'}).then(res => {
			let treeData = handleTreeData(res.data, 'name', 'code', 'children', true)
			this.setState({typeTreeData: treeData})
		})
	}

	onChange = t => this.getCustomForm(t)
	//获得自定义字段
	getCustomForm = (t, v) => {
		//console.log(66)
		this.setState({customeRules: []})
		getCertColumns({code: t}).then(res => {
			let customeRules = res.data.map(v => {
				return {
					label: v.name,
					key: v.id,
					type: v.tag,
					render: _ => this.getDomByTag(v)
				}
			})
			this.setState({customeRules})
			if(v && v.length>0){//修改时，回显
				let obj = {}
				v.forEach(item => {
					let value = item.content
					if(item.columnTag == 'date') value =  value ? moment(value) : ''
					obj[item.columnId] = {value}
				})
				this.props.form.setFields(obj)
			}
		})
	}
	//获得不同类型的dom
	getDomByTag = v => {
		let tag = v.tag
		if(tag == 'input'){
			return <Input style={{width: 200}}/>
		}else if(tag == 'number'){
			return <InputNumber style={{width: 200}}/>
		}else if(tag == 'select'){
			this.setSelectColumn(v.dictCode)
			return <Select style={{ width: 200 }} placeholder="请选择">
			    {this.state[v.dictCode] ? this.state[v.dictCode].map(t => <Option key={t.code} value={t.code}>{t.name}</Option>) : null}
			  </Select>
		}else if(tag == 'date'){
			return <DatePicker placeholder="选择日期" style={{width: 200}} />
		}
	}
	//动态自定义字段--档案类型获得备选项
	setSelectColumn = t =>{
		if(!this.state[t]){
			getDictSelect({dictcode: t}).then(res => {
				let obj = {}
				obj[t] = res.data
				this.setState(obj)
			})
		}
	}
	//处理日期，将日期转为字符串,将自定义信息保存到MAP中
	dealDate = params => {
		let certDetails = []
		this.state.customeRules.forEach(t => {
			if(t.type == 'date'){
				if (params[t.key]) params[t.key] = params[t.key].format('YYYY-MM-DD')
			}
			let obj = {columnId: t.key, content: params[t.key]} 
			certDetails.push(obj)
			delete params[t.key]
		})
		params.certDetails = certDetails
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val)
					if (this.props.config.type == 'edit') {
						params.id = this.props.config.item.id
					}
					if (params.startDate) params.startDate = params.startDate.format('YYYY-MM-DD')
					if (params.overDate) params.overDate = params.overDate.format('YYYY-MM-DD')
					this.dealDate(params)
					addCert(params)
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
		width={1000}
		style={{top: 50, marginBottom: 100}}
		okText="提交"
		cancelText="取消">
			<Form>
			<Row gutter={24}>
	        {this.state.rules.map((val, index) => <Col key={index} span={12} style={{ display: 'block'}}><FormItem  
	        label={val.label} labelCol={{span: 6}}>
	          	{getFieldDecorator(val.key, val.option)(val.render())}
	        </FormItem></Col>)}
	    </Row>  
	    <Row gutter={24}>
	        {this.state.customeRules.map((val, index) => <Col key={index} span={12} style={{ display: 'block'}}><FormItem  
	        label={val.label} labelCol={{span: 6}}>
	          	{getFieldDecorator(val.key, val.option)(val.render())}
	        </FormItem></Col>)}
	    </Row>  
    	</Form>
		</Modal>
	}
}

const CertForm = Form.create()(CertItem)
export default CertForm