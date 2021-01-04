import React from 'react'
import { Input, Button, } from 'antd'
import { gettriallist } from '/api/trial'
import Common from '/page/common.jsx'

class TrialList extends Common{
	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({}, this.state.pageconf),
		companys: [],
		columns: [{
			title: '项目名称',
			dataIndex: 'name'
		},{
			title: '项目编号',
			dataIndex: 'jobcode'
		},{
			title: '服务类别',
			dataIndex: 'servname'
		},{
			title: '业务员',
			dataIndex: 'psnname'
		},{
			title: '操作',
			dataIndex: 'd1',
			render: (t, r) => <div>
			<a style={{display: 'inline-block'}} onClick={_ => this.openTrial(r)}>查看</a></div>
		}],
		selectedtable: false,
		loading: false,
		tabledata: [],
		modalconf: {visible: false, item: {}}
	})


	search = async _ => {
		await this.setState({loading: true})
		let search = Object.assign({}, this.state.search)
		return gettriallist(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.id })
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
	//添加、编辑资金规划
	openTrial = async item => {
		await window.remove('trial_detail')
		let pane = {
				title: '资金计划',
				key: 'trial_detail',
				url: 'trial_detail',
				params: {}
			}
		pane.title = `资金计划`
		// let item = this.state.selected.selectedItems[0]
		pane.params = {...item}
		window.add(pane)
	}


	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<Input 
			value={this.state.search.projName}
			allowClear
			onChange={e => this.changeSearch({projName: e.target.value})}
			addonBefore="项目名称" placeholder="录入项目名称" />
			<Input 
			value={this.state.search.projCode}
			allowClear
			onChange={e => this.changeSearch({projCode: e.target.value})}
			addonBefore="项目编号" placeholder="录入项目编号" />
			<Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
		</div>
	</div>

	renderBtn = _ => <div>
	
	</div>

	rendermodal = _ => <div>
		</div>
}

export default TrialList