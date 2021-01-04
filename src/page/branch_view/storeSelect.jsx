import React from 'react'
import { Input, Button, Icon, Modal, message, Popconfirm } from 'antd'
import { liststore } from '/api/branch'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import { dealBlob, downloadByUrl } from '/api/tools'

class StoreSelect extends Common{
	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({condition: ''}, this.state.pageconf),
		columns: [{
			title: '区域',
			dataIndex: 'area'
		},{
			title: '仓库名称',
			dataIndex: 'storname'
		},{
			title: '联系人',
			dataIndex: 'linkName'
		},{
			title: '联系电话',
			dataIndex: 'phone'
		}],
		selecttype: 'checkbox',
		selected: {},
		loading: true,
		modalconf: {visible: false, item: {}},
	})


	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		if (!search.condition) delete search.condition
		return liststore(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.storid })
				return baseItem
			}))(res.data.records)
			this.setState({
				tabledata: data, 
				loading: false,
				pagination: Object.assign({}, this.state.pagination, {
					total: res.data.total,
					current: res.data.current
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
			<Input 
			value={this.state.search.condition}
			allowClear
			onChange={e => this.changeSearch({condition: e.target.value})}
			addonBefore="名称" placeholder="输入名称" />
			<Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
			<Button 
			onClick={this.selectdone}
			type="primary" icon="check">选择</Button> 
		</div>
	</div>

	renderBtn = _ => <div>
	</div>

	rendermodal = _ => <div></div>

}

export default StoreSelect