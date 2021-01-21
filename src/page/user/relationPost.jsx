import React, { Component } from 'react'
import { Modal, Input, Form, Row, Button, message, Card, Tree, Table } from 'antd'
import { GetPostData, RelationPeople, UnRelationPost } from '/api/post'
import Pagination from '/components/pagination'

class People extends Component {
	async componentWillMount() {
		// 请求全量岗位数据
		this.GetAllPost()
	}
	async componentWillReceiveProps(nextprops) {
		// 判断参数变化
		// 1 参数visible为ture  窗口显示
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			// 获取用户ID
			let params = nextprops.config.ID
			this.setState({
				userId: params
			})
			console.log(params, 147)
			// 获取已关联数据
			this.GetRelation({ userId: params })
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
		userId: null,
		// 表格配置
		tableColumns: [
			{
				title: '岗位编码',
				dataIndex: 'positionCode',
			},
			{
				title: '岗位名称',
				dataIndex: 'positionName',
			},
			{
				title: '岗位描述',
				dataIndex: 'description',
			}

		],
		searchPostName: "",
		// 全量岗位数据
		allPostTable: [],
		//全量岗位数据选中项
		allPostSeletct: [],
		//人员下的岗位数据
		userPostTable: [],
		//人员岗位数据选中项
		userPostSeletct: []
	}
	// 请求全量岗位数据
	GetAllPost = (params = {}) => {
		params = Object.assign({}, this.state.pageConf, { positionName: this.state.searchPostName }, params)
		GetPostData(params).then(res => {
			if (res.success == 1) {
				let pagination = {
					pageSize: res.data.size,
					current: res.data.current,
					total: res.data.total,
				}
				let pageConf = {
					limit: res.data.size,
					offset: (res.data.current - 1) * 10
				}
				this.setState({ allPostTable: res.data.records, pagination: pagination, pageConf: pageConf })
			}
		})
	}
	//获取查询参数 岗位名称
	getPostName = (e) => {
		this.setState({
			searchPostName: e.target.value
		})
	}
	// 全量表格选中后
	onAllTabSelect = selectedRowKeys => {
		//获取table选中项
		this.setState({
			allPostSeletct: selectedRowKeys[0]
		})
	};
	// 已关联表格选中后
	onUserTabSelect = selectedRowKeys => {
		//获取table选中项
		this.setState({
			userPostSeletct: selectedRowKeys
		})
	};
	//请求用户下已关联的岗位数据
	GetRelation = (params) => {
		let param = Object.assign({}, this.state.pageConf2, { userId: this.state.userId }, params)
		GetPostData(param).then(res => {
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
				this.setState({ userPostTable: res.data.records, pagination2: pagination, pageConf2: pageConf })
			} else {
				message.error("请求失败,请重试！")
			}
		})
	}
	// 岗位关联人员
	relationPost = _ => {
		let positionId = this.state.allPostSeletct;
		if (positionId == "" || positionId == null) {
			message.warning('请选中表格中的某一记录！')
			return
		}
		let userId = this.state.userId;
		console.log(positionId)
		RelationPeople({ userId: userId, positionId: positionId }).then(res => {
			if (res.success == 1) {
				this.GetRelation()
			}
		})
	}
	// 解除关联人员
	unRelationPost = _ => {
		let positionId = this.state.userPostSeletct;
		if (positionId == "" || positionId.length == 0) {
			message.warning('请选中表格中的某一记录！')
			return
		}
		let userId = this.state.userId;
		let params = { positionIds: positionId.join(","), userId: userId };
		UnRelationPost(params).then(res => {
			if (res.success == 1) {
				this.GetRelation()
			}
		})
	}

	// 分页页码变化
	pageIndexChange = (current, pageSize) => {
		let pageConf = Object.assign({}, this.state.pageConf, { offset: (current - 1) * 10 });
		this.GetAllPost(pageConf)
	}
	// 分页条数变化
	pageSizeChange = (current, pageSize) => {
		let pageConf = Object.assign({}, this.state.pageConf, { limit: pageSize });
		this.GetAllPost(pageConf)
	}
	// 分页页码变化
	pageIndexChange2 = (current, pageSize) => {
		let pageConf = Object.assign({}, this.state.pageConf, { offset: (current - 1) * 10 });
		this.GetRelation(pageConf)
	}
	// 分页条数变化
	pageSizeChange2 = (current, pageSize) => {
		let pageConf = Object.assign({}, this.state.pageConf2, { limit: pageSize });
		this.GetRelation(pageConf)
	}
	render = _ => {
		return <div>
			<Modal
				visible={this.props.config.visible}
				onCancel={this.props.done}
				width={1000}
				footer={[<Button key="back" onClick={this.props.done}>关闭</Button>]}
			>
				<div >
					<Card style={{ height: "300px" }}>
						<Row style={{ marginBottom: "5px" }}>
							<Input
								value={this.state.searchPostName}
								style={{ width: 280 }}
								allowClear
								addonBefore="岗位名称" placeholder="请输入"
								onChange={this.getPostName}
							/>
							<Button
								onClick={this.GetAllPost}
								type="info" icon="search">搜索</Button>
							<Button
								style={{ float: "right" }}
								onClick={this.relationPost}
								type="primary">关联</Button>
						</Row>
						<Table style={{ height: "180px" }} size="small" scroll={{ y: 140 }} bordered rowSelection={{ onChange: this.onAllTabSelect, type: "radio" }} columns={this.state.tableColumns} dataSource={this.state.allPostTable} pagination={false} rowKey="id" />
						<Pagination current={this.state.pagination.current} pageSize={this.state.pagination.pageSize} total={this.state.pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} />
					</Card>

					<Card title="已关联岗位" style={{ marginTop: "20px", height: "360px" }} extra={<Button
						style={{ float: "right" }}
						onClick={this.unRelationPost}
						type="primary">取消关联</Button>}>
						<Table bordered  style={{ height: "200px" }} size="small"   scroll={{ y: 160 }} rowSelection={{ onChange: this.onUserTabSelect }} columns={this.state.tableColumns} dataSource={this.state.userPostTable} pagination={false} rowKey="id" />
						<Pagination current={this.state.pagination2.current} pageSize={this.state.pagination2.pageSize} total={this.state.pagination2.total} onChange={this.pageIndexChange2} onShowSizeChange={this.pageSizeChange2} />
					</Card>
				</div>
			</Modal>
		</div>

	}
}

const postArea = Form.create()(People)
export default postArea

