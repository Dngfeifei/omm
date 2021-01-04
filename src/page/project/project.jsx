import React from 'react'
import { Button, Modal, Input, Icon, message } from 'antd'
import { getprojitemlist, syncProjItem, getNCSyncDate } from '/api/project'
import Common from '/page/common.jsx'


const vbillMap = {
	8: '自由',
	1: '已审批',
	2: '正在审批中',
	0: '审批未通过',
	5: '关闭'
}
const iprojMap = {
	0: '立项',
	1: '已签约',
	2: '强制关闭',
	3: '丢单关闭',
	4: '验收关闭'
}
class Project extends Common{

	async componentWillMount () {
		this.search()
		this.findNCTime()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({}, this.state.pageconf),
		ncsynctime: '',
		columns: [{
			title: '项目号',
			dataIndex: 'vbillno'
		},{
			title: '项目名称',
			dataIndex: 'vprojname',
			width: '24%',
		},{
			title: '业务类型',
			dataIndex: 'pkBusiname'
		},{
			title: '行业类别',
			dataIndex: 'pkHyname'
		},{
			title: '立项日期',
			dataIndex: 'dbilldate'
		},{
			title: '客户名称',
			dataIndex: 'pkCumanname'
		},{
			title: '单据状态',
			dataIndex: 'vbillstatus',
			render: t => vbillMap[t]
		},{
			title: '项目状态',
			dataIndex: 'iprojstatus',
			render: t => iprojMap[t]
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			align: 'center',	
			render: (t, r) => <a style={{display: 'inline-block', width: 60}} onClick={async _ => {this.addpane(r)}}>查看</a>
		}],
		selectedtable: false,
		loading2: false,
		modalConf: {visible: false, item: {}}
	})

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		return getprojitemlist(search)
		.then(res => {
			let data = res.data.records.map(val => Object.assign({}, val, {key: val.pkProjitem}))
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

	done = async _ => {
		let modalConf = {visible: false, item: {}}
		await this.setState({ modalConf })
		this.research()
	}

	addpane = async r => {
		await window.remove('projectIndex')
		let pane = {
			title: '项目立项明细',
			key: 'projectIndex',
			url: 'projectIndex',
			params: {
				id: r.pkProjitem
			}
		}
		window.add(pane)
	}
  //同步
	syncData = _ => {
		if(!this.state.loading2){
			this.setState({loading2: true})
			syncProjItem().then(res => {
				if(res.code == 200){
					message.success('同步完成')
					this.search()
					this.findNCTime()
				}
				this.setState({loading2: false})
			})
		}
	}
	//获得上次同步时间
	findNCTime = _ =>{
		return getNCSyncDate().then(res =>{
			this.setState({ncsynctime : res.data})
		})
	}

	renderSearch = _ => <div className="mgrSearchBar">
		<Input 
		value={this.state.search.name}
		allowClear
		onChange={e => this.changeSearch({name: e.target.value})}
		style={{width: 300}}
		addonBefore="项目名称" placeholder="项目名称/项目号" />
		<Button 
		onClick={this.search}
		type="primary" icon="search">搜索</Button>
		<Button 
		onClick={_ => this.syncData()}
		type="primary" icon="sync" loading={this.state.loading2}>同步</Button>
		<span>上次同步时间为:{this.state.ncsynctime}</span>
	</div>
	
}

export default Project