import React from 'react'
import { Input, Button, Icon, Modal, message, TreeSelect, Select } from 'antd'
import { listcontract } from '/api/branch'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group

class BranchSelect extends Common{
	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		typeTreeData: [],
		companys: [],
		search: Object.assign({}, this.state.pageconf),
		columns: [{
			title: '公司名称',
			dataIndex: 'branchName'
		},{
			title: '公司法人',
			dataIndex: 'legalName'
		},{
			title: '地址',
			dataIndex: 'address'
		},{
			title: '起租日期',
			dataIndex: 'startDate'
		},{
			title: '原件数量',
			dataIndex: 'paperNum'
		},{
			title: '借出数量',
			dataIndex: 'lockNum'
		},{
			title: '备注',
			dataIndex: 'remark'
		}],
		selectedtable: true,
		selecttype: 'checkbox',
		selected: {},
		loading: true,
		tabledata: [],
		modalconf: {visible: false, item: {}}
	})

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		return listcontract(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({code: '租房合同'}, val, { key: val.id })
				return baseItem
			}))(res.data.records)
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
	
	selectdone = _ => {
		this.props.selectdone(this.state.selected.selectedItems)
		message.success('已选择')
	}

	renderSearch = _ => <div>
		<div className="mgrSearchBar">  
			<Input 
			value={this.state.search.name}
			allowClear
			onChange={e => this.changeSearch({name: e.target.value})}
			style={{width: 300}}
			addonBefore="公司" placeholder="" />
			<Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button> 
			<Button 
			onClick={this.selectdone}
			type="primary" icon="check">选择</Button> 
			</div>
	</div>

}

export default BranchSelect