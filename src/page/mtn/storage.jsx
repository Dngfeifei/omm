import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Icon, Modal } from 'antd'
import { listStorage } from '/api/mtn'
import Common from '/page/common.jsx'

const ButtonGroup = Button.Group

class Storage extends Common{
	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({}, this.state.pageconf),
		columns: [{
			title: '公司',
			dataIndex: 'unitname'
		}, {
			title: '库存组织',
			dataIndex: 'bodyname'
		}, {
			title: '仓库',
			dataIndex: 'storname'
		}, {
			title: '存货分类',
			dataIndex: 'invclassname'
		}, {
			title: '存货编码',
			dataIndex: 'invcode'
		}, {
			title: '存货名称',
			dataIndex: 'invname'
		}, {
			title: '规格',
			dataIndex: 'invspec'
		}, {
			title: '对应主机',
			dataIndex: 'invshortname'
		}, {
			title: '计量单位',
			dataIndex: 'measname'
		}, {
			title: '结存数量',
			dataIndex: 'nonhandnum'
		}],
		selectedtable: false,
		editModalConf: {visible: false, item: {}},
		roleModal: {visible: false, item: {}},
	})

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		if (!search.condition) delete search.condition
		return listStorage(search)
		.then(res => {
			let data
			data = res.data.records.map(val => Object.assign({}, val, {key: val.id}))
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


	renderSearch = _ => <div className="mgrSearchBar">
		<Input 
		value={this.state.search.unitname}
		allowClear
		onChange={e => this.changeSearch({unitname: e.target.value})}
		addonBefore="公司" />
		<Input 
		value={this.state.search.bodyname}
		allowClear
		onChange={e => this.changeSearch({bodyname: e.target.value})}
		addonBefore="库存组织" />
		<Input 
		value={this.state.search.storname}
		allowClear
		onChange={e => this.changeSearch({storname: e.target.value})}
		addonBefore="仓库" />
		<Input 
		value={this.state.search.invclassname}
		allowClear
		onChange={e => this.changeSearch({invclassname: e.target.value})}
		addonBefore="存货分类" />
		<Input 
		value={this.state.search.invname}
		allowClear
		onChange={e => this.changeSearch({invname: e.target.value})}
		addonBefore="存货名称" />
		<Button 
		onClick={this.search}
		type="primary" icon="search">搜索</Button>
	</div>


}

export default Storage