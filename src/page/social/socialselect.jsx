import React, { Component } from 'react'
import { Button, Modal, Input, Icon, Select, DatePicker } from 'antd'
const { MonthPicker } = DatePicker
const Option = Select.Option
import { getsociallist } from '/api/social'
import Common from '/page/common.jsx'

class Contselect extends Common{

	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({username: '', city: ''}, this.state.pageconf),
		columns: [{
			title: '月份',
			dataIndex: 'month'
		},{
			title: '缴纳地',
			dataIndex: 'city'
		},{
			title: '创建时间',
			dataIndex: 'createTime'
		}],
		busitypelist: [],
		servtypelist: [],
		type: 'social',
		selectedtable: true,
		selecttype: 'checkbox',
		pagesizechange: true,
		modalConf: {visible: false, item: {}},
		picmodelConf: {visible: false, item: {}}
	})

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		if(search.start) search.start = search.start.format('YYYY-MM')
		if(search.end) search.end = search.end.format('YYYY-MM')
		return getsociallist(search)
		.then(res => {
			let data = res.data.records.map(val => Object.assign({}, val, {key: val.id}))
			this.setState({
				tabledata: data, 
				loading: false,
				pagination: Object.assign({}, this.state.pagination, {
					total: Number(res.data.total),
					current: Number(res.data.current)
				}),
				selected: {selectedKeys: this.props.selectedkey}
			})
		})
	}

	selectdone = _ => {
		this.props.selectdone(this.state.selected.selectedItems)
		this.props.onCancel()
	}

	renderSearch = _ => <div className="mgrSearchBar">
		<div className="mgrSearchBar">
			<Input 
			style={{width: 200}}
			value={this.state.search.username}
			allowClear
			onChange={e => this.changeSearch({username: e.target.value})}
			addonBefore="人员" placeholder="人员" />
			<Input 
			style={{width: 200}}
			value={this.state.search.city}
			allowClear
			onChange={e => this.changeSearch({city: e.target.value})}
			addonBefore="缴纳地" placeholder="缴纳地" />
			<MonthPicker placeholder="开始月份" onChange={v => this.changeSearch({start: v})} />
			<MonthPicker placeholder="截止月份" onChange={v => this.changeSearch({end: v})}/>
		<Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
		</div>
		<Button 
			onClick={this.selectdone}
			type="primary" icon="check">选择</Button>
	</div>


}

export default Contselect