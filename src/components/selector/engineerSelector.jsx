import React, { Component } from 'react'
import { Input, Form, Row, Button, message, Card, Table, Select } from 'antd'
const { Option } = Select;

// 导入请求接口
import { GetOrgTree, GetPeople } from '/api/post'
// 引入 分页组件
import Pagination from '/components/pagination'
// 引入 Tree树形组件
import TreeParant from "@/components/tree/index.jsx"
// 引入 弹窗组件组件
import ModalParant from "@/components/modal/index.jsx"

class People extends Component {
	async componentWillMount() {
		// 请求全量机构树数据
		this.searchAllOrgData()
	}
	async componentWillReceiveProps(nextprops) {
	
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
		// 机构树
		mechanismTree: [],
		// 表格配置不包含状态
		tableColumns: [
			{
				title: '用户名',
				dataIndex: 'realName',
				align: 'center',
			},
			{
				title: '账户',
				dataIndex: 'userName',
				align: 'center',
			},
			{
				title: '员工号',
				dataIndex: 'userNum',
				align: 'center',
			},
		],
		// 表格配置包含状态
		tableColumns2: [
			{
				title: '用户名',
				dataIndex: 'realName',
				align: 'center',
			},
			{
				title: '账户',
				dataIndex: 'userName',
				align: 'center',
			},
			{
				title: '员工号',
				dataIndex: 'userNum',
				align: 'center',
			},
			{
				title: '状态',
				dataIndex: 'status',
				align: 'center',
				render: (t, r) => {
					if (t == 1) {
						return "启用"
					} else if (t == 0) {
						return "禁用"
					}
				}
			},

		],
		// 当前机构id
		currentOrgID: null,
		// 查询参数
		searchParams: {
			// 查询项 用户名
			userName: null,
			status: null
		},
		// 机构下人员
		staffTable: [],
		//选中项ID
		resultID: [],
		result: [],

	}
	// 设置默认props
	static defaultProps = {
		// 表格默认单选
		type: "radio",
		// status 默认不存在
		status: false,
	}

	// 请求全量机构树数据
	searchAllOrgData = _ => {
		GetOrgTree().then(res => {
			if (res.success == 1) {
				this.setState({
					mechanismTree: res.data
				})
			}
		})
	}

	// 树选中后
	onTreeSelect = (selectedKeys, info) => {
		//不是选中操作 返回不做其它逻辑操作
		if (!info.selected) { return }
		let ID = selectedKeys[0]
		this.setState({
			currentOrgID: ID,
			pageConf: Object.assign({}, this.state.pageConf, { offset: 0 }),
		}, () => {
			this.searchUser()
		})
		// 通过机构id请求机构用户数据


	}
	//获取查询参数 用户名
	getUserName = (e) => {
		let { searchParams } = this.state;
		let realName = e.target.value
		this.setState({
			searchParams: Object.assign({}, searchParams, { realName })
		})
	}
	//获取查询参数 状态
	getStatus = (e) => {
		let { searchParams } = this.state;
		let status = e;
		this.setState({
			searchParams: Object.assign({}, searchParams, { status })
		})
	}
	// 工程师表格选中后
	onRowSelect = (selectedRowKeys, info) => {
		let array = this.state.result.concat(info);
		var newArr = [];
		var obj = {};
		//去重
		for (var i = 0; i < array.length; i++) {
			if (!obj[array[i].id]) {
				newArr.push(array[i]);
				obj[array[i].id] = true;
			}
		}
		// 过滤
		let result = newArr.filter((item) => {
			return selectedRowKeys.indexOf(item.id) >= 0
		})
		//获取table选中项
		this.setState({
			resultID: selectedRowKeys,
			result
		})
	};
	//点击行选中选框
	// onRow = (record) => {
	// 	return {
	// 		onClick: () => {
	// 			// let selectedKeys = [record.id], selectedItems = [record];
	// 			this.setState({
	// 				resultID: record.id,
	// 				result: record
	// 			})
	// 		}
	// 	}
	// }
	// 通过查询参数请求机构用户数据
	searchUserByParams = _ => {
		this.searchUser(this.state.searchParams)
	}
	//请求机构用户数据
	searchUser = (params = {}) => {
		let param = Object.assign({}, this.state.pageConf, { orgId: this.state.currentOrgID }, params)
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
				// this.setState({ staffTable: res.data.records, pagination: pagination, pageConf: pageConf, resultID: null, result: null })
				this.setState({ staffTable: res.data.records, pagination: pagination, pageConf: pageConf })
			} else {
				message.destroy()
				message.error(res.message)
			}
		})
	}
	// 分页页码变化
	pageIndexChange = (current, pageSize) => {
		let pageConf = Object.assign({}, this.state.pageConf, { offset: (current - 1) * pageSize });
		let orgId = this.state.currentOrgID;
		let params = Object.assign({}, pageConf, { orgId }, this.state.searchParams)
		this.searchUser(params)
	}
	// 分页条数变化
	pageSizeChange = (current, pageSize) => {
		let pageConf = Object.assign({}, this.state.pageConf, { limit: pageSize });
		let orgId = this.state.currentOrgID;
		let params = Object.assign({}, pageConf, { orgId }, this.state.searchParams)
		this.searchUser(params)
	}
	onSubmit = () => {
		let { resultID, result } = this.state;
		if (resultID.length > 0) {
			this.props.onOk(resultID, result)
		} else {
			message.destroy()
			message.error("未选择数据")
		}
	}
	render = _ => {
		// 接受组件外传递的数据
		const { type, status, onOk, onCancel } = this.props;
		let { mechanismTree, currentOrgID, resultID, searchParams, pagination, tableColumns, tableColumns2, staffTable } = this.state
		let rowSelection = {
			onChange: this.onRowSelect,
			type: type,
			selectedRowKeys: resultID
		}
		console.log(mechanismTree,"mechanismTree")
		// 若存在状态 则显示状态选择框和状态列
		let tableColumnConfig = status ? tableColumns2 : tableColumns;
		return <div>
			<ModalParant title="选择工程师"
				destroyOnClose={true}
				visible={true}
				onOk={this.onSubmit}//若无选中数据 执行关闭方法
				onCancel={onCancel}
				width={1000}
			>
				<div style={{ display: 'flex', height: "400px" }}>
					<Card bodyStyle={{ height: "100%" }} style={{ flex: 1, marginRight: "20px", overflow: "auto" }}>
						<TreeParant
							edit={false}
							onSelect={this.onTreeSelect}
							defaultExpandAll={true}
							autoExpandParent={true}
							treeData={mechanismTree}
							selectedKeys={[currentOrgID]}
						/>
					</Card>
					<Card style={{ flex: 2 }}>
						<Row style={{ marginBottom: "5px" }}>
							<Input
								value={searchParams.realName}
								style={{ width: 280, marginRight: "8px" }}
								allowClear
								addonBefore="用户名" placeholder="请输入"
								onChange={this.getUserName}
							/>
							{status ?
								<Select value={searchParams.status} style={{ width: 120 }} onChange={this.getStatus}>
									<Option value="">请选择</Option>
									<Option value={1}>启用</Option>
									<Option value={0}>禁用</Option>
								</Select> : ""
							}
							<Button
								onClick={this.searchUserByParams}
								type="primary" icon="search">查询</Button>
						</Row>
						<Table style={{ height: "280px" }} size="small" scroll={{ y: 240 }} bordered rowSelection={rowSelection} columns={tableColumnConfig} dataSource={staffTable} pagination={false} rowKey="id" />
						<Pagination current={pagination.current} pageSize={pagination.pageSize} total={pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} />
					</Card>
				</div>
			</ModalParant>
		</div>

	}
}

const postArea = Form.create()(People)
export default postArea

