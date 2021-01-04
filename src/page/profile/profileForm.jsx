import React, { Component } from 'react'
import { Modal, Input, Form, Row, Col, Button, message, Upload, Icon } from 'antd'
const FormItem = Form.Item
import { addProfile, editProfile } from '/api/profile'

class ProfileItem extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					name: {value: mes.name},
					code: {value: mes.code}
				})
			}
		}
	}
	state = {
		rules: [{
			label: '名称',
			key: 'name',
			option: {
				rules: [{
		        	required: true, message: '请输入模版名称!',
			    }]
			},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '编码',
			key: 'code',
			option: { rules: [] },
		    render: _ => <Input style={{width: 200}}/>
		}],
		loading: false,
		lock: false
	}

	handleChange = ({fileList}) => {
		this.setState({ fileList: fileList.slice(-1) })
		let file = fileList[fileList.length-1];
		if(file && file.status == 'done') {
			//console.log(file.response.data)
			this.setState({fileName: file.response.data})
		}
	}

	handleFetch = params => {
		if (this.props.config.type == 'edit') {
			params.id = this.props.config.item.id
			return editProfile(params)
		}
		return addProfile(params)
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val)
					if (!params.code) delete params.code
					this.handleFetch(params)
					.then(res => {
						if (res.code == 200 || res === true) {
							message.success('操作成功')
							this.props.getTree()
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

const ProfileForm = Form.create()(ProfileItem)
export default ProfileForm