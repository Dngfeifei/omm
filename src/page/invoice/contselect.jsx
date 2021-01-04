import React, { Component } from 'react'
import { Button, Modal, Input, Icon, message, Select, List, Table } from 'antd'
import { getcontsalelist, getcontbuylist, getcontepiblist, getlinklist, savelink } from '/api/invoice'
import Common from '/page/common.jsx'
import PaperWall from '/components/PaperWall.jsx'


class ContSelect extends Component {

	async componentWillReceiveProps(nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			let type = nextprops.config.item.type
			let cname = type == 1 ? nextprops.config.item.buyerName : nextprops.config.item.sellerName
			cname = cname.replace(/股份/g, '').replace(/有限/g, '').replace(/公司/g, '').replace(/中国/g, '')
			await this.setState({ id: nextprops.config.item.id, search: Object.assign({ type, cname }, this.state.pageconf) })
			this.getItemList(nextprops.config.item.id)
			this.search()
		}
	}

	state = Object.assign({}, this.state, {
		pageconf: { limit: 10, offset: 0 }, //分页信息
		search: {},
		ncsynctime: '',
		columns: [{
			title: '项目编码',
			dataIndex: 'pkProjectCode',
			render : (t, r) => t || r.pkProjitem
		}, {
			title: '项目名称',
			dataIndex: 'pkProjectName'
		}, {
			title: '合同编号',
			dataIndex: 'vbillno'
		}, {
			title: '合同名称',
			dataIndex: 'vcontname'
		}, {
			title: '客商',
			dataIndex: 'cumandocname'
		}, {
			title: '合同金额',
			dataIndex: 'ncontmny'
		}, {
			title: '开始日期',
			dataIndex: 'dstartdate'
		}, {
			title: '结束日期',
			dataIndex: 'denddate'
		}, {
			title: ' 操作 ',
			dataIndex: 'operate',
			align: 'center',
			render: (t, r) => <div>{this.checkSame(r) ? '已添加' : <a style={{ display: 'inline-block', width: 60 }} onClick={async _ => { this.addItem(r) }}>添加</a>}
			</div>
		}],
		tabledata: [],
		search: {},
		pagination: {
			total: 0,
			showTotal: total => `共${total}条`,
			size: 'small',
			total: 1,
			current: 1,
			pageSize: 10
		},
		bloading: false,
		loading: false,
		selectedtable: false,
		items: []
	})

	//获得已添加记录
	getItemList = id => {
		getlinklist({ id }).then(res => {
			let data = res.data.map(val => Object.assign({}, val, { key: val.contid }))
			this.setState({ items: data })
		})
	}

	//检查是否添加
	checkSame = r => {
		let arr = this.state.items.filter(e => e.key === r.key)
		return arr.length > 0
	}

	//表格参数变化
	handleTableChange = async (pagination, filters, sorter) => {
		await this.setState({
			search: Object.assign({}, this.state.search,
				{
					offset: (pagination.current - 1) * pagination.pageSize,
					limit: pagination.pageSize
				})
		})
		this.search()
	}
	//查询
	search = async _ => {
		await this.setState({ loading: true, selected: {} })
		let search = Object.assign({}, this.state.search)
		const searchfun = search.type == 1 ? getcontsalelist : (search.type == 2 ? getcontbuylist : getcontepiblist)
		return searchfun(search)
			.then(res => {
				let data = res.data.records.map(val => Object.assign({ type: search.type }, val, { key: val.pkContsale || val.pkContbuy || val.pkContepiboly },
					{ dstartdate: val.dstartdate || val.dsigndate },
					{ cumandocname: val.cumandocname || val.pkCumanname }))
				this.setState({
					tabledata: data,
					loading: false,
					pagination: Object.assign({}, this.state.pagination, {
						total: Number(res.data.total),
						current: Number(res.data.current)
					})
				})
			})
	}

	//添加
	addItem = r => {
		const items = this.state.items
		items.push(r)
		this.setState({ items })
	}
	removeItem = r => {
		const items = this.state.items.filter(e => e.key != r.key)
		this.setState({ items })
	}

	changeSearch = val => {
		let search = Object.assign({}, this.state.search, val, this.state.pageconf)
		this.setState({ search })
	}

	//保存关联记录
	handleOk = _ => {
		if (!this.state.bloading) {
			this.setState({ bloading: true })
			let datas = this.state.items.map(e => {
				e.invoiceid = this.state.id
				e.contid = e.key
				return e
			})
			savelink(datas).then(res => {
				this.setState({ bloading: false })
				if (res.code == 200) {
					message.success('关联成功')
					this.props.done()
				}
			})
		}
	}

	renderSearch = _ => <div className="mgrSearchBar">
		<Select defaultValue={this.state.search.type} style={{ width: 120, marginRight: 20 }} onChange={t => this.changeSearch({ type: t || '' })} placeholder="选择类型">
			{this.state.search.type == 1 ? <Option value={1}>销售合同</Option> : ""}
			{this.state.search.type == 2 ? <Option value={3}>外包合同</Option> : ""}
			{this.state.search.type == 2 ? <Option value={2}>采购合同</Option> : ""}
		</Select>
		<Input
			value={this.state.search.cname}
			allowClear
			onChange={e => this.changeSearch({ cname: e.target.value })}
			style={{ width: 400, marginRight: 20 }}
			addonBefore="关键字" placeholder="项目编码/项目名称/合同编号/合同名称/客商名称" />
		<Button
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
	</div>


	render = _ => {
		return <Modal title={
			(this.props.config.item.type == 1 ? this.props.config.item.buyerName : this.props.config.item.sellerName) + `\t发票代码:${this.props.config.item.invoiceNo}\t发票号码:${this.props.config.item.invoiceCode}`
		}
			onOk={this.handleOk}
			visible={this.props.config.visible}
			confirmLoading={this.state.bloading}
			onCancel={this.props.onCancel}
			width={1350}
			style={{ top: 50, marginBottom: 100 }}
			okText="提交"
			cancelText="取消">
			<div style={{ display: 'inline-block', width: '1000px' }}>
				{this.renderSearch()}
				<Table
					size={'small'}
					bordered
					loading={this.state.loading}
					columns={this.state.columns}
					pagination={this.state.pagination}
					locale={{ emptyText: '暂无数据' }}
					dataSource={this.state.tabledata}
					onChange={this.handleTableChange} />
			</div>
			<List
				style={{ float: 'right', width: '300px' }}
				header={<div>已选合同</div>}
				bordered
				locale={{ emptyText: '暂无数据' }}
				dataSource={this.state.items}
				renderItem={item => (
					<List.Item actions={[<a key="list-loadmore-edit" onClick={_ => this.removeItem(item)}>删除</a>]}>
						{item.vcontname}({item.vbillno})
					</List.Item>
				)}
			/>

		</Modal>
	}
}


export default ContSelect