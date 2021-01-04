import React, { Component } from 'react'
import { Modal, Input, Form, Row, Col, Button, message, Upload, Icon } from 'antd'
const FormItem = Form.Item
import { addResumeTemplate, editResumeTemplate, uploadTemplate } from '/api/resume'

class ResumeTemplateItem extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			let token = localStorage.getItem('token') || ''
      this.setState({ token })
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
				this.setState({fileName: '', fileList: [] })
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					name: {value: mes.name},
					tips: {value: mes.tips}
				})
				if(mes.path){
					this.setState({fileName: mes.path, fileList: [{
						uid: mes.path,
				    name: '简历模版.docx',
				    status: 'done'
					}]})
				}
			}
		}
	}
	state = {
		token: '',
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
			label: '备注',
			key: 'tips',
			option: { rules: [] },
		    render: _ => <Input style={{width: 200}}/>
		}],
		loading: false,
		lock: false,
		fileName: '',
		fileList: []
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
			return editResumeTemplate(params)
		}
		return addResumeTemplate(params)
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val)
					if (!params.tips) delete params.tips
					if (!this.state.fileName) {
						message.error('请先上传简历模版!')
						return
					}else{
						params.path = this.state.fileName
					}
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
	// 上传前检查
	beforeUpload = file => {
		let type = file.name.substr(file.name.lastIndexOf('.') + 1);
		const isJpgOrPng = type === 'docx';
		if (!isJpgOrPng) {
			message.error('只能上传 docx 格式的word文档!');
			const fileList = this.state.fileList.filter(e => e.uid !== file.uid)
			this.setState({fileList})
		}
		return isJpgOrPng;
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
      	<Upload 
      	className="attr-upload"
      	action={uploadTemplate}
      	headers={{Authorization: `Bearer ${this.state.token}`}}
      	onChange={this.handleChange}
		beforeUpload={this.beforeUpload}
      	fileList={this.state.fileList}>
			    <Button>
			      <Icon type="upload" /> 上传模版
			    </Button>
			  </Upload>
		</Modal>
	}
}

const ResumeTemplateForm = Form.create()(ResumeTemplateItem)
export default ResumeTemplateForm