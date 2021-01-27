import React, { Component } from 'react'
import { Modal, Input, InputNumber, DatePicker, Form, Row, Col, Button, message, Tabs, Icon, Select, TreeSelect } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input;
const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;
import { AddUser, EditUser, GetOrgList } from '/api/user'
import moment from 'moment'

class CertItem extends Component {
	async componentWillMount() {
		this.orgSearch()
	}

	async componentWillReceiveProps(nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.setState({ customeRules: [] })
				this.props.form.resetFields()
				this.props.form.setFields({
					entryDate: { value: moment() },
				})
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					userName: { value: mes.userName },
					status: { value: mes.status },
					userNum: { value: mes.userNum },
					realName: { value: mes.realName },
					idNumber: { value: mes.idNumber },
					sex: { value: mes.sex },
					mobilePhone: { value: mes.mobilePhone },
					email: { value: mes.email },
					fixedPhone: { value: mes.fixedPhone },
					orgId: { value: mes.orgId },
					duties: { value: mes.duties },
					entryDate: { value: (mes.entryDate ? moment(mes.entryDate) : '') },
					description: { value: mes.description }
				})
			}
		}
	}
	state = {
		treeData: [],
		treeSelectVal: [],
		rules: [
			{
				label: '系统账号',
				key: 'userName',
				option: {
					rules: [
						{ required: true, message: "请输入账号" },
						{
							message: "请按照字母或字母+数字的格式输入",
							pattern: "^[a-zA-Z][a-zA-Z0-9_]{0,}$",
							trigger: "blur",
						}]
				},
				render: _ => <Input style={{ width: 200 }} />
			},
			{
				label: '状态',
				key: 'status',
				render: _ => <Select
					style={{ width: 200 }}
					placeholder="请选择"
				>
					<Option value={1}>启用</Option>
					<Option value={0}>禁用</Option>
				</Select>
			},
			{
				label: '员工号',
				key: 'userNum',
				option: {
					rules: [
						{
							message: "请输入数字",
							pattern: /^[0-9]{0,}$/,
							trigger: "blur",
						}]
				},
				render: _ => <Input style={{ width: 200 }} />
			},
			{
				label: '姓名',
				key: 'realName',
				option: {
					rules: [
						{ required: true, message: "请输入账号" },
					]
				},
				render: _ => <Input style={{ width: 200 }} />
			}, {
				label: '身份证号',
				key: 'idNumber',
				option: {
					rules: [
						{ required: true, message: "请输入身份证号" },
						{
							message: "请输入正确身份证信息",
							pattern: /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|30|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/,
							trigger: "blur",
						}
					]
				},
				render: _ => <Input style={{ width: 200 }} />
			},
			{
				label: '性别',
				key: 'sex',
				render: _ => <Select
					style={{ width: 200 }}
					placeholder="请选择"
				>
					<Option value={1}>男</Option>
					<Option value={0}>女</Option>
				</Select>
			},
			{
				label: '移动电话',
				key: 'mobilePhone',
				option: {
					rules: [
						{
							message: "请输入正确的手机号码",
							pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
							trigger: "blur",
						}]
				},
				render: _ => <Input style={{ width: 200 }} />
			},
			{
				label: '邮箱',
				key: 'email',
				option: {
					rules: [
						{ required: true, message: "请输入" },
						{
							message: "请按照正确的邮箱格式输入",
							pattern: "^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$",
							trigger: "blur",
						}]
				},
				render: _ => <Input style={{ width: 200 }} />
			},
			{
				label: '固定电话',
				key: 'fixedPhone',
				option: {
					rules: [
						{
							message: "请按照'区号-固话号码的格式输入",
							pattern: /\d{3}-\d{8}|\d{4}-\d{7}/,
							trigger: "blur",
						}]
				},
				render: _ => <Input style={{ width: 200 }} />
			},
			{
				label: '所属组织',
				key: 'orgId',
				render: _ => {
					const tProps = {
						treeData: this.state.treeData,
						onChange: this.onTreeSelectValChange,
						style: {
							width: '200px',
						},
					};
					return <TreeSelect allowClear  {...tProps} />;
				}
			}, {
				label: '入职时间',
				key: 'entryDate',
				option: { rules: [] },
				render: _ => <DatePicker  style={{ width: 200 }} />
			},
			{
				label: '职务',
				key: 'duties',
				// option: {
				// 	rules: [
				// 		{
				// 			message: "请按照中英文的格式输入",
				// 			pattern: "^[\u4E00-\u9FA5A-Za-z]+$",
				// 			trigger: "blur",
				// 		}]
				// },
				render: _ => <Input style={{ width: 200 }} />
			},
			{
				label: '备注',
				key: 'description',
				option: { rules: [] },
				render: _ => <TextArea rows={2} style={{ width: 360 }} />
			}
		],
		customeRules: [],
		loading: false,
		lock: false,
	}
	//全量机构查询
	orgSearch = async () => {
		GetOrgList()
			.then(res => {
				if (res.success == 0) {
					alert("机构查询失败");
				} else {
					this.setState({ treeData: res.data })
				}
			})
	}
	//tree下拉框变化
	onTreeSelectValChange = (value, label, extra) => {
		console.log(value, label, extra, 456)
		this.setState({ treeSelectVal: value });
	};
	// onChange = t => this.getCustomForm(t)
	//获得自定义字段
	// getCustomForm = (t, v) => {
	// 	this.setState({ customeRules: [] })
	// 	getCertColumns({ code: t }).then(res => {
	// 		let customeRules = res.data.map(v => {
	// 			return {
	// 				label: v.name,
	// 				key: v.id,
	// 				type: v.tag,
	// 				render: _ => this.getDomByTag(v)
	// 			}
	// 		})
	// 		this.setState({ customeRules })
	// 		if (v && v.length > 0) {//修改时，回显
	// 			let obj = {}
	// 			v.forEach(item => {
	// 				let value = item.content
	// 				if (item.columnTag == 'date') value = value ? moment(value) : ''
	// 				obj[item.columnId] = { value }
	// 			})
	// 			this.props.form.setFields(obj)
	// 		}
	// 	})
	// }
	//获得不同类型的dom
	// getDomByTag = v => {
	// 	let tag = v.tag
	// 	if (tag == 'input') {
	// 		return <Input style={{ width: 200 }} />
	// 	} else if (tag == 'number') {
	// 		return <InputNumber style={{ width: 200 }} />
	// 	} else if (tag == 'select') {
	// 		this.setSelectColumn(v.dictCode)
	// 		return <Select style={{ width: 200 }} placeholder="请选择">
	// 			{this.state[v.dictCode] ? this.state[v.dictCode].map(t => <Option key={t.code} value={t.code}>{t.name}</Option>) : null}
	// 		</Select>
	// 	} else if (tag == 'date') {
	// 		return <DatePicker placeholder="选择日期" style={{ width: 200 }} />
	// 	}
	// }
	//动态自定义字段--档案类型获得备选项
	setSelectColumn = t => {
		if (!this.state[t]) {
			getDictSelect({ dictcode: t }).then(res => {
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
			if (t.type == 'date') {
				if (params[t.key]) params[t.key] = params[t.key].format('YYYY-MM-DD')
			}
			let obj = { columnId: t.key, content: params[t.key] }
			certDetails.push(obj)
			delete params[t.key]
		})
		// params.certDetails = certDetails
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({ lock: true })
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				console.log(err,125)
				if (!err || !Object.getOwnPropertyNames(err).length) {//校验完成执行的逻辑 发起后台请求
					let params = Object.assign({}, val)
					if (params.entryDate) { params.entryDate = params.entryDate.format('YYYY-MM-DD') };
					if (!params.orgId) { params.orgId = "" };
					this.dealDate(params)
					if (this.props.config.type == 'add') {
						AddUser(params)
							.then(res => {
								if (res.success == 1) {
									this.props.done()
									message.success('操作成功')
								}
								this.setState({ lock: false })
							})
					} else {
						let editparams = Object.assign({}, params, { id: this.props.config.item.id })
						EditUser(editparams)
							.then(res => {
								if (res.success == 1) {
									message.success('操作成功')
									this.props.done()
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
		return <Modal title={this.props.config.title}
			// onOk={this.handleOk}
			visible={this.props.config.visible}
			confirmLoading={this.state.loading}
			onCancel={this.props.onCancel}
			width={1000}
			style={{ top: 50, marginBottom: 100 }}
			footer={null}
		>
			<Form className="form-error">
				<Row gutter={24}>
					{this.state.rules.map((val, index) => val.key != 'description' ? <Col key={index} span={12} style={{ display: 'block' }}>
						<FormItem
							label={val.label} labelCol={{ span: 6 }}>
							{getFieldDecorator(val.key, val.option)(val.render())}
						</FormItem></Col> : <Col key={index} span={24} style={{ display: 'block' }}>
							<FormItem
								label={val.label} labelCol={{ span: 3 }}>
								{getFieldDecorator(val.key, val.option)(val.render())}
							</FormItem></Col>)}
				</Row>
				<Row gutter={24}>
					{this.state.customeRules.map((val, index) => <Col key={index} span={12} style={{ display: 'block' }}><FormItem
						label={val.label} labelCol={{ span: 6 }}>
						{getFieldDecorator(val.key, val.option)(val.render())}
					</FormItem></Col>)}
				</Row>
				<Row style={{ textAlign: 'right', paddingRight: '50px', paddingBottom: '20px' }}>
					<Button type="primary" onClick={this.handleOk}>保存</Button>
					<Button type="primary" onClick={this.props.onCancel} style={{ margin: '0 10px' }}>取消</Button>
				</Row>
			</Form>


		</Modal>
	}
}

const CertForm = Form.create()(CertItem)
export default CertForm

