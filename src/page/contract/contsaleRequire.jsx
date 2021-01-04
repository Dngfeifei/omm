import React, { Component } from 'react'
import { Modal, Input, Form, Button, message, Upload, Icon, InputNumber } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input

class ContsaleRequire extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					name: {value: mes.name},
					descrip: {value: mes.descrip},
					pagenum: {value: mes.pagenum},
					listnum: {value: mes.listnum},
					picnum: {value: mes.picnum},
					papernum: {value: mes.papernum}
				})
			}
		}
	}
	state = {
		rules: [{
			label: '需求名',
			key: 'name',
			option: {
				rules: [{
		        	required: true, message: '请输入需求名称!',
			    },{
			    	max: 200, message: '最长录入200字符'
			    }]
			},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '需求描述',
			key: 'descrip',
			option: {
				rules: [{
		        	required: true, message: '请输入需求描述!',
			    },{
			    	max: 500, message: '最长录入500字符'
			    }]
			},
		    render: _ => <TextArea rows={4} style={{width: 260}} />
		},{
			label: '页码',
			key: 'pagenum',
			option: { rules: [] },
		    render: _ => <InputNumber min={0} max={9999} style={{width: 200}} placeholder="需求在招标文件页码" />
		},{
			label: '案例列表数量',
			key: 'listnum',
			option: { rules: [] },
		    render: _ => <InputNumber min={0} max={999} style={{width: 120}}/>
		},{
			label: '扫描件数量',
			key: 'picnum',
			option: { rules: [] },
		    render: _ => <InputNumber min={0} max={999} style={{width: 120}}/>
		},{
			label: '原件数量',
			key: 'papernum',
			option: { rules: [] },
		    render: _ => <InputNumber min={0} max={999} style={{width: 120}}/>
		},{
			label: '发票扫描件数量',
			key: 'invoicenum',
			option: { rules: [] },
		    render: _ => <InputNumber min={0} max={999} style={{width: 120}}/>
		},{
			label: '发票原件数量',
			key: 'invoicepapernum',
			option: { rules: [] },
		    render: _ => <InputNumber min={0} max={999} style={{width: 120}}/>
		}],
		loading: false,
		lock: false
	}


	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					if (this.props.config.type == 'edit') {
						let obj = Object.assign({key: this.props.config.item.key}, val)
						let index = 0,i=0;
						while(i < this.props.requireList.length){
							if(this.props.requireList[i].key == obj.key){
								index = i
							}
							i++
						}
						this.props.requireList.splice(index,1,obj)
					}else{
						let timestamp = new Date().getTime()
						let params = Object.assign({key: timestamp}, val)
						this.props.requireList.push(params)
					}
					this.setState({lock: false})
					this.props.onCancel()
				} else {
					this.setState({lock: false})
				}
			})
		}
	}

	render = _ => {
		const { getFieldDecorator } = this.props.form
		return <Modal title="需求明细"
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

const ContsaleRequireForm = Form.create()(ContsaleRequire)
export default ContsaleRequireForm