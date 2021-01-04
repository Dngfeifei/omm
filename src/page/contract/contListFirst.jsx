import React from 'react'
import { Button, Icon, message, Input } from 'antd'
import { getContListFirst } from '/api/contsale'
import Common from '/page/common.jsx'
import { vbillMap,  iprojMap } from '/api/tools'

class ContListFirst extends Common{

	async componentWillMount () {
		// this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({}, this.state.pageconf, {}),
		selectedtable: false, //是否可以选择
		loading: false,
		columns: [{
			title: '项目号',
			dataIndex: 'pkProjectCode'
		},{
			title: '合同名称',
			dataIndex: 'vcontname',
			width: '16%',
		},{
			title: '客户',
			dataIndex: 'pkCumanname',
			width: '16%',
		},{
			title: '行业类型',
			dataIndex: 'pkHyname'
		},{
			title: '服务类型',
			dataIndex: 'pkServname'
		},{
			title: '签订日期',
			dataIndex: 'dsigndate',
			sorter: true
		},{
			title: '合同金额',
			dataIndex: 'ncontmny',
			sorter: true
		},{
			title: '合同份数',
			dataIndex: 'ncontnum'
		},{
			title: '验收报告',
			dataIndex: 'isaccept',
			render: t => t ? (t == 'Y' ? '有' : '无') : '未知'
		},{
			title: '中标通知',
			dataIndex: 'checkNotice',
			render: t => t ? (Number(t) == 1 ? '有' : '无') : '未知'
		},{
			title: '可申请',
			dataIndex: 'isEnabled',
			render: t => Number(t) == 0 ? '否' : '是'
		}]
	})

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		return getContListFirst(search)
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

export default ContListFirst