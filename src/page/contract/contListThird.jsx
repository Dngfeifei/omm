import React from 'react'
import { Button, Icon, message, Input } from 'antd'
import { getProjListThird } from '/api/project'
import Common from '/page/common.jsx'
import { iprojMap } from '/api/tools'

class ContListThird extends Common{

	async componentWillMount () {
		// this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({}, this.state.pageconf, {}),
		selectedtable: false, //是否可以选择
		loading: false,
		columns: [{
			title: '客户名称',
			dataIndex: 'pkCumanname'
		},{
			title: '项目名称',
			dataIndex: 'vprojname'
		},{
			title: '业务类型',
			dataIndex: 'pkServname'
		},{
			title: '项目状态',
			dataIndex: 'iprojstatus',
			render: t => iprojMap[t]
		},{
			title: '业务员',
			dataIndex: 'pkPsnname'
		},{
			title: '立项时间',
			dataIndex: 'dbilldate'
		}]
	})

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		return getProjListThird(search)
		.then(res => {
			let data = []
			if(res.data.records){
				data = res.data.records.map(val => Object.assign({}, val, {key: val.pkContsale}))
			}
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
		value={this.state.search.name}
		allowClear
		onChange={e => this.changeSearch({name: e.target.value})}
		style={{width: 300}}
		addonBefore="关键字" placeholder="客户名称" />
		<Button 
		onClick={this.search}
		type="primary" icon="search">搜索</Button>
	</div>



}

export default ContListThird