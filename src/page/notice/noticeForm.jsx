import React, { Component } from 'react'
import { Modal, Input, Form, Row, Col, Button, message, Upload, Icon } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
import { addnotice } from '/api/notice'

class NoticeItem extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					title: {value: mes.title},
					content: {value: mes.content}
				})
			}
		}
	}
	state = {
		rules: [{
			label: '标题',
			key: 'title',
			option: {
				rules: [{
		        	required: true, message: '请输入公告标题',
			    }]
			},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '内容',
			key: 'content',
			option: { rules: [{
							required: true, message: '请输入公告内容',
				}]},
		    render: _ => <TextArea rows={4} style={{width: 300}}/>
		}],
		loading: false,
		lock: false
	}


	handleFetch = params => {
		if (this.props.config.type == 'edit') {
			params.id = this.props.config.item.id
			return addnotice(params)
		}
		return addnotice(params)
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val)
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
	        label={val.label} labelCol={{span: 4}}>
	          	{getFieldDecorator(val.key, val.option)(val.render())}
	        </FormItem>)}
      	</Form>
		</Modal>
	}
}

const NoticeForm = Form.create()(NoticeItem)
export default NoticeForm