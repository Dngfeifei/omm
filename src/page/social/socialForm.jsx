import React, { Component } from 'react'
import { Modal, Input, Form, Button, message, DatePicker, Select, TreeSelect } from 'antd'
const FormItem = Form.Item
const { MonthPicker } = DatePicker
import { addsocial } from '/api/social'
import { getDictSelectMuti, getCompanys } from '/api/dict'
import { handleTreeData } from '/api/tools'

class SocialItem extends Component{

	componentWillMount () {
		this.getcities()
	}

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					pkCorp: {value: mes.pkCorp},
					month: {value: mes.month ? moment(mes.month) : ''},
					city: {value: mes.city}
				})
			}
		}
	}
	state = {
		companys: [],
		socialcities: [],
		rules: [{
			label: '公司',
			key: 'pkCorp',
			option: {
				rules: [{
		        	required: true, message: '请选择一个公司!',
			    }]
			},
		    render: _ => <TreeSelect
		        style={{ width: 260 }}
		        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
		        treeData={this.state.companys}
		        placeholder="请选择公司"
		        treeDefaultExpandAll/>
		},{
			label: '月份',
			key: 'month',
			option: {
				rules: [{
		        	required: true, message: '请选择月份!',
			    }]
			},
		    render: _ => <MonthPicker placeholder="选择月份" />
		},{
			label: '社保缴纳地',
			key: 'city',
			option: { rules: [{
		        	required: true, message: '请选择社保缴纳地!',
			    }] },
		    render: _ => <Select
				    showSearch
				    style={{ width: 200 }}
				    placeholder="选择社保缴纳地"
				    optionFilterProp="children"
				    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
				  >
				    {this.state.socialcities.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		}],
		loading: false,
		lock: false
	}

	getcities = _ => {
		getCompanys({}).then(res => {
			this.setState({companys: handleTreeData(res.data, 'name', 'code', 'children')})
		})
		let codeList = ['socialcities']
		getDictSelectMuti({codeList}).then(res => {
			codeList.forEach(key => {
				this.setState(res.data)
			})
		})
	}

	handleChange = ({fileList}) => {
		this.setState({ fileList: fileList.slice(-1) })
		let file = fileList[fileList.length-1];
		if(file && file.status == 'done') {
			this.setState({fileName: file.response.data})
		}
	}

	handleFetch = params => {
		if (this.props.config.type == 'edit') {
			params.id = this.props.config.item.id
		}
		return addsocial(params)
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val)
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

const SocialForm = Form.create()(SocialItem)
export default SocialForm