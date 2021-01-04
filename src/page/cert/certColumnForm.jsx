import React, { Component } from 'react'
import { Modal, Input, InputNumber, Form, Button, message, Icon, Select, TreeSelect } from 'antd'
const FormItem = Form.Item
import { addCertColumn } from '/api/cert'
import { getDictSelect } from '/api/dict'
import { handleTreeData } from '/api/tools'

class CertColumnItem extends Component{

	async componentWillMount () {
		this.getTypeTreeData()
	}

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.setState({hiddenRules: {dictCode: true}})
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					typeCode: {value: mes.typeCode},
					name: {value: mes.name},
					tag: {value: mes.tag},
					num: {value: mes.num}
				})
				if(mes.tag == 'select'){
					this.setState({hiddenRules: {dictCode: false}})
					this.props.form.setFields({dictCode: {value: mes.dictCode}})
				}else{
					this.setState({hiddenRules: {dictCode: true}})
				}
			}
		}else if(!nextprops.config.visible){
			this.setState({hiddenRules: {dictCode: false}})
		}
	}
	state = {
		typeTreeData: [],
		hiddenRules:{
			dictCode: false
		},
		rules: [{
			label: '证书类型',
			key: 'typeCode',
			option: { rules: [{
		        	required: true, message: '请选择证书类型',
			    }] },
		    render: _ => <TreeSelect style={{ width: 200 }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={this.state.typeTreeData}
        placeholder="选择证书类型"
        treeDefaultExpandAll
        onChange={this.onChange} />
		},{
			label: '名称',
			key: 'name',
			option: {
				rules: [{
		        	required: true, message: '请输入字段名称',
			    }]
			},
		  render: _ => <Input style={{width: 200}}/>
		},{
			label: '顺序',
			key: 'num',
			option: { rules: [{
		        	required: true, message: '请输入顺序',
			    }] },
		    render: _ => <InputNumber style={{width: 200}}/>
		},{
			label: '类型',
			key: 'tag',
			option: { rules: [{
		        	required: true, message: '请选择字段类型',
			    }] },
	    render: _ => <Select style={{ width: 200 }} placeholder="选择字段类型" onChange={this.columnTypeChange}>
			    <Option value='input'>文本</Option>
			    <Option value='number'>证书数量</Option>
			    <Option value='date'>日期</Option>
			    <Option value='select'>档案</Option>
			  </Select>
		},{
			label: '档案编号',
			key: 'dictCode',
			option: { rules: [] },
		    render: _ => <Input style={{width: 200}}/>
		}],
		loading: false,
		lock: false
	}

	getTypeTreeData = _ => {
		getDictSelect({dictcode: 'aptitude'}).then(res => {
			let treeData = handleTreeData(res.data, 'name', 'code', 'children', true)
			this.setState({typeTreeData: treeData})
		})
	}

	columnTypeChange = t => {
		if(t == 'select'){
			this.setState({hiddenRules: {dictCode: false}})
		}else{
			this.setState({hiddenRules: {dictCode: true}})
		}
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			//console.log(this.props.form)
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val)
					if (this.props.config.type == 'edit') {
						params.id = this.props.config.item.id
					}
					addCertColumn(params)
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
	        {this.state.rules.map((val, index) => !this.state.hiddenRules[val.key] ? <FormItem  
	        label={val.label} labelCol={{span: 4}}>
	          	{getFieldDecorator(val.key, val.option)(val.render())}
	        </FormItem> : null)}
      	</Form>
		</Modal>
	}
}

const CertColumnForm = Form.create()(CertColumnItem)
export default CertColumnForm