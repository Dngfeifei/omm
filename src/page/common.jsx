import React, { Component } from 'react'
import { Table, message, LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { momentFormat } from '/api/tools'

class Common extends Component{
	state = {
		total: 0,
		columns: [],
		selectedtable: true, //是否可以选择
		selecttype: 'radio', //单选还是多选
		selected: {}, //已选择数据
		loading: true,
		tabledata: [],
		visible: false,
		search: {},
		pageconf: {limit: 10, offset: 0}, //分页信息
		sorter: {sortField: null, sortOrder: null},//排序信息
		pagination: {
			total: 0,
	  	showTotal: total => `共${total}条`,
			size: 'small',
			total: 1,
			current: 1,
			pageSize: 10
		},
		pagesizechange: true //每页条数是否可以变化
	}

	onselect = (selectedKeys, selectedItems) => {
		this.setState({selected: {
			selectedKeys,
			selectedItems
		}})
	}
	orderdetail = async item => {
		await this.setState({selected: {
			selectedKeys: [item.id],
			selectedItems: [item]
		}})
		this.addpane(1)
	}
	setselect = async (item, func) => {
		await this.setState({selected: {
			selectedKeys: [item.id],
			selectedItems: [item]
		}})
		if(func) func()
	}
	changeSearch = val => {
		let search = Object.assign({}, this.state.search, val, this.state.pageconf)
		this.setState({search})
	}
	handleTime = (search, key) => {
		if (!search[key]) {
			delete search[key]
		} else {
			search[key] = momentFormat(search[key])
		}
	}
	research = async _ => {
		await this.setState({search: Object.assign({}, this.state.pageconf), selected: {}})
		this.search()
	}
	changemodel = _ => {
		if (this.state.selected.selectedKeys && this.state.selected.selectedKeys.length) {
			this.setState({visible: !this.state.visible})
		} else {
			message.warning('请选中表格中的某一记录！')
		}
	}
	cancelform = key => {
		let config = {}
		config[key] = Object.assign({}, this.state[key], {visible: false, item: {}})
		this.setState(config)
	}
	addmodal = async (key, title) => {
		let conf = {}
		conf[key] = {
			title,
			visible: true,
			type: 'add'
		}
		this.setState(conf)
	}
	editmodal = async (key, title) => {
		if (this.state.selected.selectedKeys && this.state.selected.selectedKeys.length) {
			let conf = {}
			conf[key] = {
				title,
				visible: true,
				type: 'edit',
				item: this.state.selected.selectedItems[0]
			}
			this.setState(conf)
		} else {
			message.warning('请选中表格中的某一记录！')
		}
	}
	handleOk = async (func, key, mess, backFunc = 'search') => {
		if (this.state.selected.selectedKeys && this.state.selected.selectedKeys.length) {
			await this.setState({confirmLoading: true})
			let param = {}
			param[key] = this.state.selected.selectedKeys[0]
			func(param)
			.then(async res => {
				await this.setState({visible: false, confirmLoading: false})
				if (res.code == 200) {
					message.success(`${mess}成功`)
					this[backFunc]()
					return	
				}
			})
		} else {
			message.warning('请选中表格中的某一记录！')
		}
	}

	selectJudge = (func, type = false) => {
		let selected = this.state.selected
		if (selected.selectedKeys && selected.selectedKeys.length) {
			if (!type) {
				func(selected.selectedKeys[0], selected.selectedItems[0])
			} else {
				func(selected.selectedKeys, selected.selectedItems)
			}
		} else {
			message.warning('请选中表格中的某一记录！')
		}
	}

	//表格参数变化
	handleTableChange = async (pagination, filters, sorter) => {
    await this.setState({search: Object.assign({}, this.state.search, 
    	{offset: (pagination.current - 1) * pagination.pageSize, 
    		limit: pagination.pageSize, 
    sortField: sorter.field,
     sortOrder: sorter.order})})
    this.search()
  }

	renderSearch = _ => null
	renderBtn = _ => null
	renderBottomBtn = _ => null
	rendermodal = _ => null
	renderTable = (rowSelection, pagination = this.state.pagination) =>  <Table
	    rowKey={"id"}
		size={'small'}
		bordered
		defaultExpandAllRows={true}
		loading={this.state.loading}
		rowSelection={rowSelection}
		columns={this.state.columns}
		pagination={pagination}
		locale={{emptyText: '暂无数据'}}
		dataSource={this.state.tabledata}
		scroll={this.state.scroll || {}}
		onChange={this.handleTableChange}/>
	render = _ => {
		const rowSelection = {
			type: this.state.selecttype || 'radio',
			selectedRowKeys: this.state.selected.selectedKeys,
			onChange: this.onselect
		}
		const pagination = this.state.pagination && this.state.pagesizechange ? Object.assign({}, this.state.pagination, {
			showSizeChanger: true,
			pageSizeOptions: ['10', '30', '50', '100', '300', '500'],
			onShowSizeChange: async (current, size) => {
				await this.setState({
					pagination: Object.assign({}, this.state.pagination, {pageSize: size, current: 1}),
					pageconf: Object.assign({}, this.state.pageconf, {limit: size, offset: 0}),
				})
			}
		}) : this.state.pagination
		return <div className="mgrWrapper" style={{padding:"20px"}}>
			{this.renderSearch()}
			{this.renderBtn()}
			{this.renderTable(this.state.selectedtable ? rowSelection : null, pagination)}
			{this.renderBottomBtn()}
	        {this.rendermodal()}
		</div>
	}
}

export default Common