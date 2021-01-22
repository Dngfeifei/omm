import React from 'react'
import { Input, Button, Modal, message, Row } from 'antd'
import { GetPostData, DelPost } from '/api/post'
import Common from '/page/common.jsx'
const { confirm } = Modal;
import People from '/page/post/relationPeople.jsx'
import Role from '/page/post/relationRole.jsx'
import PostForm from '/page/post/postForm.jsx'


class Post extends Common {
	async componentWillMount() {
		// 1 岗位表格初始化数据 查询all
		this.search()
	}
	state = Object.assign({}, this.state, {
		loading: false,
		// 查询条件
		search: Object.assign({
			positionName: '',
		}, this.state.pageconf),
		// 岗位表格配置
		columns: [
			{
				title: '编码',
				width: 120,
				align: 'center',
				dataIndex: 'positionCode'
			}, {
				title: '名称',
				width: 120,
				align: 'center',
				dataIndex: 'positionName'
			}, {
				title: '描述',
				width: 120,
				align: 'center',
				dataIndex: 'description'
			}],
		selecttype: 'radio', //单选还是多选
		// 岗位表格数据
		tabledata: [],
		// 岗位表格当前选中项数据
		selected: {},
		modalconf: { visible: false, item: {} },
		// 岗位弹窗
		windowPost: {
			title: "新增岗位",
			visible: false,
			type: 'add',
			item: null
		},
		// 关联人员弹窗
		windowPeople: {
			visible: false,
			ID: null
		},
		// 关联角色弹窗
		windowRole: {
			visible: false,
			ID: null
		}
	})
	//查询岗位数据
	search = async _ => {
		let params = this.state.search
		GetPostData(params)
			.then(res => {
				if (res.success != 1) {
					alert("请求错误")
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
	//新增岗位
	addPost = _ => {
		this.setState({
			windowPost: {
				title: "新增岗位",
				visible: true,
				type: 'add',
				item: null
			}
		})
	}
	//修改岗位
	editPost = _ => {
		if (this.state.selected.selectedKeys && this.state.selected.selectedKeys.length) {
			this.setState({
				windowPost: {
					title: "修改岗位",
					visible: true,
					type: 'edit',
					item: this.state.selected.selectedItems[0]
				}
			})
		} else {
			message.warning('请选中表格中的某一记录！')
		}
	}
	//删除
	deleteItem = async () => {
		let _this = this
		if (this.state.selected.selectedKeys && this.state.selected.selectedKeys.length) {
			let param = this.state.selected.selectedItems[0].id
			confirm({
				title: '删除后不可恢复,确定删除吗？',
				onOk() {
					DelPost({ id: param })
						.then(res => {
							if (res.success == 0) {
								message.error('操作失败')
							} else {
								_this.search();
								_this.setState({ selected: {} })
							}
						})
				}
			})

		} else {
			message.warning('请选中表格中的某一记录！')
		}
	}
	// 关联人员
	relationPeople = _ => {
		if (this.state.selected.selectedKeys && this.state.selected.selectedKeys.length) {
			let currentID = this.state.selected.selectedItems[0].id
			this.setState({
				windowPeople: {
					visible: true,
					ID: currentID
				}
			})
		} else {
			message.warning('请选中表格中的某一记录！')
		}
	}
	// 关联角色
	relationRole = _ => {
		if (this.state.selected.selectedKeys && this.state.selected.selectedKeys.length) {
			let currentID = this.state.selected.selectedItems[0].id
			this.setState({
				windowRole: {
					visible: true,
					ID: currentID
				}
			})
		} else {
			message.warning('请选中表格中的某一记录！')
		}
	}
	//弹窗内逻辑完成
	done = (type) => {
		if (type == "post") {
			//新增或修改岗位逻辑完成
			this.setState({
				windowPost: {
					title: "",
					visible: false,
					type: '',
					item: null
				}
			})
		} else if (type == "people") {
			//关联人员逻辑完成
			this.setState({
				windowPeople: {
					title: "",
					visible: false,
					item: null
				}
			})
		} else if (type == "role") {
			//关联角色逻辑完成
			this.setState({
				windowRole: {
					title: "",
					visible: false,
					item: null
				}
			})
		}
		this.search()
	}

	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<Input
				value={this.state.search.positionName}
				style={{ width: 280 }}
				allowClear
				onChange={e => this.changeSearch({ positionName: e.target.value })}
				addonBefore="岗位名称" placeholder="请输入" />
			<Button
				onClick={this.search}
				type="primary" icon="search">搜索</Button>
		</div>
	</div>

	renderBtn = _ => <div>
		<Row style={{ display: 'flex', margin: "10px 0",padding:"0 10px" }}>
			<div style={{ flex: 3 }}>
				<Button
					onClick={_ => this.addPost()}
					type="primary">新增</Button>
				<Button style={{ margin: "0px 10px" }}
					onClick={_ => this.editPost()}
					type="primary">修改</Button>
				<Button
					onClick={this.deleteItem}
					type="primary">删除</Button>
			</div>
			<div style={{ flex: 2, textAlign: "right" }}>
				<Button
					type="primary" onClick={_ => this.relationPeople()}>关联人员</Button>
				<Button style={{ margin: "0px 10px" }}
					type="primary" onClick={_ => this.relationRole()}>关联角色</Button>
			</div>
		</Row>
	</div>

	rendermodal = _ => <div>
		<PostForm
			windowData={this.state.windowPost}
			done={_ => this.done("post")} />
		<People
			windowData={this.state.windowPeople}
			done={_ => this.done("people")} />
		<Role
			windowData={this.state.windowRole}
			done={_ => this.done("role")} />
	</div>

}

export default Post