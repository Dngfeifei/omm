import React from 'react'
import { Input, Button, Modal, message, Select, Upload, Row, Col } from 'antd'
import { getUserList, DisableUser, ResetPass, ExportFileModel, ExportFile } from '/api/user'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
const { confirm } = Modal;
const { Option } = Select;
import UserForm from '/page/user/userForm.jsx'
import PostForm from '/page/user/relationPost.jsx'
let token = localStorage.getItem('token')
class User extends Common {
	async componentWillMount() {
		this.search()
		// this.exportTemplate()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({
			realName: '',
			userName: '',
			userNum: '',
			status: "",
			duties: '',
			sex: "",
		}, this.state.pageconf),
		columns: [
			{
				title: '姓名',
				width: 120,
				align: 'center',
				dataIndex: 'realName'
			}, {
				title: '系统账号',
				width: 120,
				align: 'center',
				dataIndex: 'userName'
			}, {
				title: '员工号',
				width: 120,
				align: 'center',
				dataIndex: 'userNum'
			}, {
				title: '状态',
				width: 60,
				align: 'center',
				dataIndex: 'status',
				render: (t, r) => {
					if (t == 1) {
						return "启用"
					} else if (t == 0) {
						return "禁用"
					}
				}
			}, {
				title: '职务',
				width: 120,
				align: 'center',
				dataIndex: 'duties',

			}, {
				title: '性别',
				width: 60,
				align: 'center',
				dataIndex: 'sex',
				render: (t, r) => {
					if (typeof (t) == "string" && t == "") {
						return ""
					}
					if (typeof (t) == "number" && t == 1) {
						return "男"
					} else if (typeof (t) == "number" && t == 0) {
						return "女"
					}
				}
			}, {
				title: '所属组织',
				width: 120,
				align: 'center',
				dataIndex: 'orgFullName',
			}, {
				title: '入职时间',
				width: 120,
				align: 'center',
				dataIndex: 'entryDate'
			}],
		selected: {},
		selectedtable: true,
		selecttype: 'radio', //单选还是多选
		loading: true,
		tabledata: [],
		modalconf: { visible: false, item: {} },
		postWindow: { visible: false, ID: {} },
		// picmodelConf: { visible: false, item: {} },
		loading2: false,
		loading3: false,
		uploadConf: {//上传配置
			name: 'file',
			action: '/user/userUpload',
			headers: {
				'Authorization': `Bearer ${token}`
			},
			showUploadList: false,
			onChange(info) {
				if (info.file.status !== 'uploading') {
					console.log(info.file, info.fileList);
				}
				if (info.file.status === 'done') {
					message.success(`${info.file.name} 文件上传成功`);
				} else if (info.file.status === 'error') {
					message.error(`${info.file.name} 文件上传失败.`);
				}
			},
		}
	})
	//禁用
	disableItem = async () => {
		if (!this.state.selected.selectedKeys || !this.state.selected.selectedKeys.length) {
			message.destroy()
			message.warning("请选中后再进行操作！")
			return
		}
		let params = [this.state.selected.selectedKeys[0]]
		let _this = this
		confirm({
			title: '您确定要进行禁用操作吗？',
			onOk() {
				DisableUser(params)
					.then(res => {
						if (res.success == 0) {
							message.error("操作失败");
						} else {
							_this.search();
						}
					})
			}
		})
	}
	//重置密码
	handleReset = async () => {
		if (!this.state.selected.selectedKeys || !this.state.selected.selectedKeys.length) {
			message.destroy()
			message.warning("请选中后再进行操作！")
			return
		}
		let id = [this.state.selected.selectedKeys[0]]
		let _this = this
		confirm({
			title: '您确定要重置此用户密码吗？',
			onOk() {
				ResetPass({ id: id })
					.then(res => {
						if (res.success == 0) {
							message.error("重置密码失败");
						} else {
							_this.search();
						}
					})
			}
		})

	}
	//查询
	search = async (type = false) => {
		if (type) {
			this.setState({ selected: {} })
		}
		await this.setState({ loading: true })
		let search = Object.assign({}, this.state.search)
		return getUserList(search)
			.then(res => {
				// let data = (f => f(f))(f => list => list.map(val => {
				// 	let baseItem = Object.assign({}, val, { key: val.id })
				// 	return baseItem
				// }))(res.data.records)
				if (res.success != 1) {
					message.error("操作失败")
					return
				} else {
					this.setState({
						tabledata: res.data.records,
						loading: false,
						pagination: Object.assign({}, this.state.pagination, {
							total: Number(res.data.total),
							current: Number(res.data.current)
						})
					})
				}
			})
	}
	// 编辑用户
	editForm = async () => {
		console.log(this.state.selected)
		if (!this.state.selected.selectedKeys || !this.state.selected.selectedKeys.length) {
			message.destroy()
			message.warning("请选中后再进行操作！")
			return
		}
		let key = this.state.selected.selectedKeys[0];
		var result = this.state.tabledata.filter(el => { return el.id == key })
		let item = result[0]
		let conf = {}
		conf["modalconf"] = {
			title: '编辑人员信息',
			visible: true,
			type: 'edit',
			item: item
		}
		this.setState(conf)
	}
	// 编辑岗位
	editPost = async () => {
		if (!this.state.selected.selectedKeys || !this.state.selected.selectedKeys.length) {
			message.destroy()
			message.warning("请选中后再进行操作！")
			return
		}
		let id = [this.state.selected.selectedKeys[0]]
		let postWindow = {
			visible: true,
			ID: id
		}
		this.setState({ postWindow: postWindow })
	}
	//查询表单重置
	reset = _ => {
		let search = Object.assign({}, {
			realName: '',
			userName: '',
			userNum: '',
			status: "",
			duties: '',
			sex: "",
		},
			this.state.pageconf)
		this.setState({ search: search })
	}
	//选中数据导出
	exportData = _ => {
		ExportFile(this.state.search)
	}
	//模版下载
	exportTemplate = _ => {
		ExportFileModel()
	}
	//数据导入
	importList = _ => {
		this.setState({ uploadconf: { visible: true, fileList: [] } })
	}

	deleteback = _ => {
		this.search()
	}
	delete = _ => {
		this.handleOk(deleteCert, 'id', '删除', 'deleteback')
	}

	done = async _ => {
		let type = this.state.modalconf.type
		let config = {}
		config.modalconf = { visible: false, item: {} }
		this.setState(config)
		if (type == 'add') {
			this.search()
		} else {
			this.search()
		}
	}

	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<Input
				value={this.state.search.realName}
				style={{ width: 180, marginRight: "18px" }}
				allowClear
				onChange={e => this.changeSearch({ realName: e.target.value })}
				addonBefore="姓名" placeholder="请输入" />
			<Input
				value={this.state.search.userName}
				style={{ width: 180, marginRight: "18px" }}
				allowClear
				onChange={e => this.changeSearch({ userName: e.target.value })}
				addonBefore="帐号" placeholder="请输入" />
			<Input
				value={this.state.search.userNum}
				style={{ width: 180, marginRight: "18px" }}
				allowClear
				onChange={e => this.changeSearch({ userNum: e.target.value })}
				addonBefore="员工号" placeholder="请输入" />
			<label>状态：
				<Select style={{ width: 120, marginRight: "18px" }} allowClear={true} placeholder="请选择" value={this.state.search.status} onChange={e => this.changeSearch({ status: e })}>
					<Option key={""} value={""}>请选择</Option>
					<Option key={1} value={1}>启用</Option>
					<Option key={0} value={0}>禁用</Option>
				</Select>
			</label>
			<Input
				value={this.state.search.duties}
				style={{ width: 180, marginRight: "18px" }}
				allowClear
				onChange={e => this.changeSearch({ duties: e.target.value })}
				addonBefore="职务" placeholder="请输入" />
			<label>性别:
				<Select style={{ width: 120, marginRight: "20px" }} allowClear={true} placeholder="请选择" defaultValue={""} value={this.state.search.sex} onChange={e => this.changeSearch({ sex: e })}>
					<Option key={""} value={""}>请选择</Option>
					<Option key={1} value={1}>男</Option>
					<Option key={0} value={0}>女</Option>
				</Select>
			</label>
			<Button
				onClick={this.search} style={{ marginRight: "10px" }}
				type="primary" icon="search" >搜索</Button>
			<Button
				onClick={this.reset}
			>重置</Button>
		</div>
	</div>

	renderBtn = _ => <Row style={{ margin: "10px 0" }}>
		<Col span={12} >
			<Button
				onClick={this.exportTemplate} style={{ marginRight: "10px" }}
				type="info" loading={this.state.loading3}>模版下载</Button>
			<Upload {...this.state.uploadConf}>
				<Button type="info" style={{ marginRight: "10px" }}>数据导入</Button>
			</Upload>
			<Button
				onClick={this.exportData} style={{ marginRight: "10px" }}
				type="info" loading={this.state.loading2}>数据导出</Button>
			<Button style={{ marginRight: "10px" }} onClick={this.handleReset} type="info">重置密码</Button>

		</Col>
		<Col span={12} style={{ textAlign: "right" }}>
			
			<Button style={{ marginRight: "10px" }} onClick={this.disableItem} type="info">禁用</Button>
			<Button style={{ marginRight: "10px" }} onClick={this.editForm} type="info">修改</Button>
			<Button style={{ marginRight: "10px" }}
				onClick={_ => this.addmodal('modalconf', '新增人员信息')}
				type="primary">新增</Button>
			<Button style={{ marginRight: "10px" }} onClick={this.editPost} type="primary">关联岗位</Button>
		</Col>
	</Row>

	rendermodal = _ => <div>
		<UserForm
			onCancel={_ => this.cancelform('modalconf')}
			done={_ => this.done()}
			config={this.state.modalconf} />
		<PostForm
			onCancel={_ => this.cancelform('postWindow')}
			done={_ => this.cancelform('postWindow')}
			config={this.state.postWindow} />
		<Modal title="信息"
			visible={this.state.visible}
			onOk={this.delete}
			mask={false}
			width={400}
			onCancel={this.changemodel}
			okText="确认"
			cancelText="取消"
		>
			<p>是否删除？</p>
		</Modal></div>

}

export default User