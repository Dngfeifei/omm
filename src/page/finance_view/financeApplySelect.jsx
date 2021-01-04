import React from 'react'
import { Input, Button, Icon, Modal, message, TreeSelect, Select } from 'antd'
import { listpaper } from '/api/finance'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group

class FinanceSelect extends Common{
	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		typeTreeData: [],
		companys: [],
		search: Object.assign({typeCode: ''}, this.state.pageconf),
		columns: [{
			title: '年份',
			dataIndex: 'year'
		},{
			title: '公司',
			dataIndex: 'pkcorpname'
		},{
			title: '资料名称',
			dataIndex: 'name'
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
		let search = Object.assign({type: 'SJWZ'}, this.state.search)
		return listpaper(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.id })
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
		this.props.onCancel()
	}

	renderSearch = _ => <div>
		<div className="mgrSearchBar">  
			<Button 
			onClick={this.selectdone}
			type="primary" icon="check">选择</Button> 
			</div>
	</div>

}

export default FinanceSelect