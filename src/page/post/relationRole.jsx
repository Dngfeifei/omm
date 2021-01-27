import React, { Component } from 'react'
import { Modal, Input, Form, Row, Button, message, Card, Tree, Table } from 'antd'
import { GetRoleGroup, GetRoleData, RelationRole, UnRelationRole } from '/api/post'
import Pagination from '/components/pagination'
const assignment = (data) => {
    data.forEach((list, i) => {
        list.key = list.id;
        if (list.hasOwnProperty("roleCategoryName")) {
            list.title = list.roleCategoryName;
        } 
        if (list.hasOwnProperty("children")) {
            if (list.children.length > 0) {
                assignment(list.children)
            }
        } else {
            return
        }
    });
}
class People extends Component {
	async componentWillMount() {
		// 请求全量机构树数据
		this.searchRoleGroup()

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
		windowTreeData: [],
		// 表格配置
		allTableColumns: [
			{
				title: '角色名称',
				dataIndex: 'roleName',
				align:"center"
			},
		],
		// 当前机构id
		currentroleCategoryId: null,
		// 查询项 用户名
		searchUserName: "",
		// 机构下人员
		unRelationTable: [

		],
		//未关联表格选中项
		unRelRabSelecteds: null,
		// 已关联人员
		relationTable: [],
		//关联表格选中项
		relRabSelecteds: []
	}
	// 请求全量机构树数据
	searchRoleGroup = _ => {
		GetRoleGroup().then(res => {
			console.log(res.data,999)
			if (res.success == 1) {
				assignment(res.data)
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
			currentroleCategoryId: data.id,
			pageConf: Object.assign({}, this.state.pageConf, { offset: 0 })
		})
		// 通过机构id请求机构用户数据
		this.searchUser({ roleCategoryId: data.id, offset: 0 })

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
		let params = { roleName: this.state.searchUserName, roleCategoryId: this.state.currentroleCategoryId }
		this.searchUser(params)
	}
	//请求机构用户数据
	searchUser = (params = {}) => {
		let param = Object.assign({}, this.state.pageConf, params)
		GetRoleData(param).then(res => {
			if (res.success == 1) {
				// 分页参数
				let pagination = {
					pageSize: res.data.size,
					current: res.data.current,
					total: res.data.total,
				}
				let pageConf = {
					limit: res.data.size,
					offset: (res.data.current - 1) * 10
				}
				this.setState({ unRelationTable: res.data.records, pagination: pagination, pageConf: pageConf })
			} else {
				message.error("请求失败,请重试！")
			}
		})
	}
	// 岗位关联人员
	relationPost = _ => {
		let roleId = this.state.unRelRabSelecteds;
		if (roleId == "" || roleId == null) {
			message.warning('请选中表格中的某一记录！')
			return
		}
		let positionId = this.props.windowData.ID;
		RelationRole({ roleId: roleId, positionId: positionId }).then(res => {
			if (res.success == 1) {
				this.getUsers({ positionId: this.state.positionId })
			}
		})
	}
	// 解除关联人员
	unRelationPost = _ => {
		let roleId = this.state.RelRabSelecteds;
		if (!roleId || roleId.length == 0) {
			message.warning('请选中表格中的某一记录！')
			return
		}
		let positionId = this.props.windowData.ID;
		let params = { roleIds: roleId.join(","), positionId: positionId };
		UnRelationRole(params).then(res => {
			if (res.success == 1) {
				this.getUsers({ positionId: this.state.positionId })
			}
		})
	}
	// 请求已关联岗位人员数据
	getUsers = (params = {}) => {
		let param = Object.assign({}, this.state.pageConf2, {positionId:this.state.positionId},params)
		GetRoleData(param).then(res => {
			if (res.success == 1) {
				// 分页参数
				let pagination = {
					pageSize: res.data.size,
					current: res.data.current,
					total: res.data.total,
				}
				let pageConf = {
					limit: res.data.size,
					offset: (res.data.current - 1) * 10
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
		let pageConf = Object.assign({}, this.state.pageConf, { offset: (current - 1) * 10 });
		let roleCategoryId = this.state.currentroleCategoryId;
		let params = Object.assign({}, pageConf, { roleCategoryId: roleCategoryId, roleName: this.state.searchUserName })
		this.searchUser(params)
	}
	// 分页条数变化
	pageSizeChange = (current, pageSize) => {
		let pageConf = Object.assign({}, this.state.pageConf, { limit: pageSize });
		let roleCategoryId = this.state.currentroleCategoryId;
		let params = Object.assign({}, pageConf, { roleCategoryId: roleCategoryId, roleName: this.state.searchUserName })
		this.searchUser(params)
	}
	// 分页页码变化
	pageIndexChange2 = (current, pageSize) => {
		let pageConf = Object.assign({}, this.state.pageConf, { offset: (current - 1) * 10 });
		this.getUsers(pageConf)
	}
	// 分页条数变化
	pageSizeChange2 = (current, pageSize) => {
		let pageConf = Object.assign({}, this.state.pageConf2, { limit: pageSize });
		this.getUsers(pageConf)
	}
	render = _ => {
		return <div>
			<Modal title="关联角色"
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
					<Card title="已关联角色" style={{ marginTop: "20px", height: "360px" }} extra={<Button
								style={{ float: "right" }}
								onClick={this.unRelationPost}
								type="primary">取消关联</Button>}>
						<Table bordered   style={{height:"205px"}} size="small"  scroll={{y: 165 }}  rowSelection={{ onChange: this.onRelTabSelect }} columns={this.state.allTableColumns} dataSource={this.state.relationTable}  pagination={false} rowKey="id" />
						<Pagination current={this.state.pagination2.current} pageSize={this.state.pagination2.pageSize} total={this.state.pagination2.total} onChange={this.pageIndexChange2} onShowSizeChange={this.pageSizeChange2} />
					</Card>
				</div>
			</Modal>
		</div>

	}
}

const postArea = Form.create()(People)
export default postArea

