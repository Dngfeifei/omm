import React, { Component } from 'react'
import { Modal, Input, Form, Row, Col, Button, message, Card, Tree, Table } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input;
import { AddPost, EditPost } from '/api/post'



class postForm extends Component {
	async componentWillMount() {

	}
	async componentWillReceiveProps(nextprops) {
		if (nextprops.windowData != this.props.windowData && nextprops.windowData.visible) {
			if (nextprops.windowData.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.windowData.item
				console.log(mes, 987)
				this.props.form.setFields({
					positionCode: { value: mes.positionCode },
					positionName: { value: mes.positionName },
					description: { value: mes.description }
				})
			}
		}
	}
	state = {
		rules: [
			{
				label: '岗位名称',
				key: 'positionName',
				option: {
					rules: [
						{ required: true, message: "请输入岗位名称" },
					]
				},
				render: _ => <Input style={{ width: 240 }} />
			},
			{
				label: '岗位编码',
				key: 'positionCode',
				option: {
					rules: [
						{ required: true, message: "请输入岗位编码" },
						// {
						// 	message: "请输入至少2位数字的岗位编码",
						// 	pattern: "^[0-9]{2,}$",
						// 	trigger: "blur",
						// }
					]
				},
				render: _ => <Input style={{ width: 240 }} />
			},
			{
				label: '岗位描述',
				key: 'description',
				// option: {
				// 	rules: [
				// 		{
				// 			message: "请输入中英文的岗位描述",
				// 			pattern: "^[\u4E00-\u9FA5A-Za-z]+$",
				// 			trigger: "blur",
				// 		}
				// 	]
				// },
				render: _ => <TextArea rows={3} style={{ width: 240 }} />
			}
		],
		loading: false,
		lock: false,
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({ lock: true })
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {//校验完成执行的逻辑 发起后台请求
					let params = Object.assign({}, val)
					if (this.props.windowData.type == 'add') {
						console.log(params,1)
						AddPost(params)
							.then(res => {
								if (res.success == 1) {
									this.props.done()
									message.success('操作成功')
								} else {
									message.error(res.message)
								}
								this.setState({ lock: false })
							})
					} else {
						params = Object.assign({}, params, { id: this.props.windowData.item.id })
						EditPost(params)
							.then(res => {
								if (res.success == 1) {
									this.props.done()
									message.success('操作成功')
								} else {
									message.error(res.message)
								}
								this.setState({ lock: false })
							})
					}
				} else {
					this.setState({ lock: false })
				}
			})
		}
	}

	render = _ => {
		const { getFieldDecorator } = this.props.form
		return <div>
			<Modal title={this.props.windowData.title}
				visible={this.props.windowData.visible}
				okText="提交"
				cancelText="取消"
				onOk={this.handleOk}
				onCancel={this.props.done}
			>
				<Form>
					<Row gutter={24}>
						{this.state.rules.map((val, index) => <Col key={index} span={24} style={{ display: 'block' }}>
							<FormItem
								label={val.label} labelCol={{ span: 6 }}>
								{getFieldDecorator(val.key, val.option)(val.render())}
							</FormItem></Col>)}
					</Row>
				</Form>
			</Modal>
		</div>

	}
}

const postArea = Form.create()(postForm)
export default postArea

