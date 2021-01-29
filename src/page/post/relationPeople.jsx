import React, { Component } from 'react'
import { Modal, Input, Form, Row, Button, message, Card, Tree, Table } from 'antd'
import { GetOrgTree, GetPeople, RelationPeople, UnRelationPeople } from '/api/post'
import Pagination from '/components/pagination'

class People extends Component {
	async componentWillMount() {
		// 请求全量机构树数据
		this.searchAllOrgData()
	}
	async componentWillReceiveProps(nextprops) {
		// 判断参数变化
		// 1 参数visible为ture  窗口显示
		if (nextprops.windowData != this.props.windowData && nextprops.windowData.visible) {
			// 获取岗位ID
			let params = nextprops.windowData.ID
			this.setState({
				positionId: params
			})
			// 获取已关联数据
			this.getUsers({ positionId: params })
		}
	}
	state = {
		// 分页参数
		pageConf: {
			limit: 10,
			offset: 0
		},
		// 分页配置
		pagination: {
			pageSize: 10,
			current: 1,
			total: 0,
		},
		// 分页参数
		pageConf2: {
			limit: 10,
			offset: 0
		},
		// 分页配置
		pagination2: {
			pageSize: 10,
			current: 1,
			total: 0,
		},
		// 岗位ID
		positionId: null,
		// 机构树
		windowTreeData: [
		],
		// 表格配置
		allTableColumns: [
			{
				title: '用户名',
				dataIndex: 'realName',
			},
			{
				title: '员工号',
				dataIndex: 'userNum',
			},
			{
				title: '账户',
				dataIndex: 'userName',
			}, {
				title: '所属机构',
				dataIndex: 'orgFullName',
			},

		],
		// 当前机构id
		currentOrgID: null,
		// 查询项 用户名
		searchUserName: "",
		// 机构下人员
		unRelationTable: [],
		//未关联表格选中项
		unRelRabSelecteds: null,
		// 已关联人员
		relationTable: [],
		//关联表格选中项
		relRabSelecteds: []
	}
	// 请求全量机构树数据
	searchAllOrgData = _ => {
		GetOrgTree().then(res => {
			if (res.success == 1) {
				this.setState({
					windowTreeData: res.data
				})
			}
		})
	}

	// 树选中后
	onTreeSelect = (selectedKeys, info) => {
		//不是选中操作 返回不做其它逻辑操作
		if (!info.selected) { return }
		let data = info.selectedNodes[0].props
		this.setState({
			currentOrgID: data.id,
			pageConf: Object.assign({}, this.state.pageConf, { offset: 0 })
		})
		// 通过机构id请求机构用户数据
		this.searchUser({ orgId: data.id, offset: 0 })

	}
	//获取查询参数 用户名
	getSearchUserName = (e) => {
		this.setState({
			searchUserName: e.target.value
		})
	}
	// 全量表格选中后
	onUnRelTabSelect = selectedRowKeys => {
		//获取table选中项
		this.setState({
			unRelRabSelecteds: selectedRowKeys[0]
		})
	};
	// 已关联表格选中后
	onRelTabSelect = selectedRowKeys => {
		//获取table选中项
		this.setState({
			RelRabSelecteds: selectedRowKeys
		})
	};
	// 通过用户名请求机构用户数据
	searchUserByName = _ => {
		let params = { realName: this.state.searchUserName, orgId: this.state.currentOrgID }
		this.searchUser(params)
	}
	//请求机构用户数据
	searchUser = (params = {}) => {
		let param = Object.assign({}, this.state.pageConf, params)
		GetPeople(param).then(res => {
			if (res.success == 1) {
				// 分页参数
				let pagination = {
					pageSize: res.data.size,
					current: res.data.current,
					total: res.data.total,
				}
				let pageConf = {
					limit: res.data.size,
					offset: (res.data.current - 1) * res.data.size
				}
				this.setState({ unRelationTable: res.data.records, pagination: pagination, pageConf: pageConf })
			} else {
				message.error("请求失败,请重试！")
			}
		})
	}
	// 岗位关联人员
	relationPost = _ => {
		let userId = this.state.unRelRabSelecteds;
		if (userId == "" || userId == null) {
			message.warning('请选中表格中的某一记录！')
			return
		}
		let positionId = this.props.windowData.ID;
		RelationPeople({ userId: userId, positionId: positionId,flag:"position"}).then(res => {
			if (res.success == 1) {
				this.getUsers({ positionId: this.state.positionId })
			}
		})
	}
	// 解除关联人员
	unRelationPost = _ => {
		let userId = this.state.RelRabSelecteds;
		if (!userId || userId.length == 0) {
			message.warning('请选中表格中的某一记录！')
			return
		}
		let positionId = this.props.windowData.ID;
		let params = { userIds: userId.join(","), positionId: positionId };
		UnRelationPeople(params).then(res => {
			if (res.success == 1) {
				this.getUsers({ positionId: this.state.positionId })
			}
		})
	}
	// 请求已关联岗位人员数据
	getUsers = (params = {}) => {
		let param = Object.assign({}, this.state.pageConf2, {positionId:this.state.positionId},params)
		GetPeople(param).then(res => {
			if (res.success == 1) {
				// 分页参数
				let pagination = {
					pageSize: res.data.size,
					current: res.data.current,
					total: res.data.total,
				}
				let pageConf = {
					limit: res.data.size,
					offset: (res.data.current - 1) * res.data.size
				}
				this.setState({
					relationTable: res.data.records,
					pagination2:pagination,
					pageConf2:pageConf
				})
			}
		})
	}


	// 分页页码变化
	pageIndexChange = (current, pageSize) => {
		let pageConf = Object.assign({}, this.state.pageConf, { offset: (current - 1) * pageSize });
		let orgId = this.state.currentOrgID;
		let params = Object.assign({}, pageConf, { orgId: orgId, realName: this.state.searchUserName })
		this.searchUser(params)
	}
	// 分页条数变化
	pageSizeChange = (current, pageSize) => {
		let pageConf = Object.assign({}, this.state.pageConf, { limit: pageSize });
		let orgId = this.state.currentOrgID;
		let params = Object.assign({}, pageConf, { orgId: orgId, realName: this.state.searchUserName })
		this.searchUser(params)
	}
	// 分页页码变化
	pageIndexChange2 = (current, pageSize) => {
		let pageConf = Object.assign({}, this.state.pageConf, { offset: (current - 1) * pageSize });
		this.getUsers(pageConf)
	}
	// 分页条数变化
	pageSizeChange2 = (current, pageSize) => {
		let pageConf = Object.assign({}, this.state.pageConf2, { limit: pageSize });
		this.getUsers(pageConf)
	}
	render = _ => {
		return <div>
			<Modal title="关联人员"
	     	    destroyOnClose={true}
				visible={this.props.windowData.visible}
				onCancel={this.props.done}
				width={1000}
				footer={[<Button key="back" onClick={this.props.done}>关闭</Button>]}
			>
				<div style={{ display: 'flex' }}>
					<Card style={{ flex: 1, marginRight: "20px", height: "300px", overflow: "auto" }}>
						<Tree
							onSelect={this.onTreeSelect}
							defaultExpandAll={true}
							treeData={this.state.windowTreeData}
						/>
					</Card>
					<Card style={{ flex: 2, height: "300px" }}>
						<Row style={{ marginBottom: "5px" }}>
							<Input
								value={this.state.searchUserName}
								style={{ width: 280 }}
								allowClear
								addonBefore="用户名" placeholder="请输入"
								onChange={this.getSearchUserName}
							/>
							<Button
								onClick={this.searchUserByName}
								type="primary" icon="search">查询</Button>
							<Button
								style={{ float: "right" }}
								onClick={this.relationPost}
								type="primary">关联</Button>
						</Row>
						<Table style={{height:"180px"}} size="small"  scroll={{y: 140 }} bordered rowSelection={{ onChange: this.onUnRelTabSelect, type: "radio" }} columns={this.state.allTableColumns} dataSource={this.state.unRelationTable}  pagination={false} rowKey="id" />
						<Pagination current={this.state.pagination.current} pageSize={this.state.pagination.pageSize} total={this.state.pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} />
					</Card>
				</div>
				<div>
					<Card size="small" title="已关联人员" style={{ marginTop: "20px", height: "360px" }} extra={<Button
								style={{ float: "right" }}
								onClick={this.unRelationPost}
								type="primary">取消关联</Button>}>
						<Table bordered  style={{height:"240px"}} size="small"  scroll={{y: 200 }}  rowSelection={{ onChange: this.onRelTabSelect }} columns={this.state.allTableColumns} dataSource={this.state.relationTable}  pagination={false} rowKey="id" />
						<Pagination current={this.state.pagination2.current} pageSize={this.state.pagination2.pageSize} total={this.state.pagination2.total} onChange={this.pageIndexChange2} onShowSizeChange={this.pageSizeChange2} />
					</Card>
				</div>
			</Modal>
		</div>

	}
}

const postArea = Form.create()(People)
export default postArea

