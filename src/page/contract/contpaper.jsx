import React from 'react'
import { Button, Modal, Icon, Select, Input, DatePicker, message, Popconfirm } from 'antd'
import { getcontpaperlist, returnPaper, renewPaper } from '/api/contsale'
import Common from '/page/common.jsx'
import ContractIndex from '/page/contract/contractIndex.jsx'
import moment from 'moment'
import { StatusMap } from '/api/tools'
import { getParam } from '/api/global'

class Contpaper extends Common{

	async componentWillMount () {
		this.search()
		getParam({code: 'cont_renew_days'}).then(res => {
			this.setState({cont_renew_days: Number(res.data) })
		})
	}

	state = Object.assign({}, this.state, {
		isAdmin: false,
		cont_renew_days: 5,
		states: [{
			code: 1,
			value: '借用中'
		}],
		search: Object.assign({}, this.state.pageconf),
		columns: [{
			title: '合同号',
			dataIndex: 'vbillno'
		},{
			title: '合同名称',
			dataIndex: 'vcontname'
		},{
			title: '流程编号',
			dataIndex: 'contcode'
		},{
			title: '项目编号',
			dataIndex: 'projcode'
		},{
			title: '项目名称',
			dataIndex: 'projname'
		},{
			title: '借用人',
			dataIndex: 'username'
		},{
			title: '借用时间',
			dataIndex: 'borrowdate',
			render: t => t ? moment(t).format('YYYY-MM-DD') : ''
		},{
			title: '归还时间',
			dataIndex: 'returndate',
			render: t => t ? moment(t).format('YYYY-MM-DD') : ''
		},{
			title: '状态',
			dataIndex: 'status',
			render: (t, r) => this.getStatusName(r)
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			align: 'center',	
			render: (t, r) => this.getOperate(r)
		}],
		selectedtable: false
	})

	//获得操作按钮合集
	getOperate = r => {
		if (this.state.isAdmin){
			if ((r.status == 1 || r.status == 3) && r.papernum > r.backnum) 
				return <a style={{display: 'inline-block', width: 50}} onClick={_ => this.returnPaper(r)}>归还</a>
		}else{
			if ((r.status == 1 || r.status == 3) && r.papernum > r.backnum)
				return r.renew == 0 ? <Popconfirm title={`确认续借${this.state.cont_renew_days}天吗`} onConfirm={_ => this.renewPaper(r)} okText="确认" cancelText="取消">
						<a style={{display: 'inline-block', width: 50}}>续借</a>
					</Popconfirm> : '已续借'
		}
	}

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		if(search.fromDate) search.fromDate = search.fromDate.format('YYYY-MM-DD')
		if(search.toDate) search.toDate = search.toDate.format('YYYY-MM-DD')
		return getcontpaperlist(search)
		.then(res => {
			let data = res.data.page.records.map(val => Object.assign({}, val, {key: val.id}))
			this.setState({
				tabledata: data, 
				loading: false,
				isAdmin: res.data.isAdmin,
				pagination: Object.assign({}, this.state.pagination, {
					total: Number(res.data.page.total),
					current: Number(res.data.page.current)
				})
			})
		})
	}
	//获得状态
	getStatusName = r => {
		if (r.papernum == r.backnum){//借用数量等于归还数量
			return '已归还'
		}else{
			return StatusMap[r.status]
		}
	}
	//归还
	returnPaper = r => {
		returnPaper({detailId: r.id}).then(res => {
			if(res.code == 200){
				message.success('操作成功')
				this.state.tabledata.forEach(item => {
					if(item.id == r.id) item.backnum = 1
				})
				this.setState({tabledata: this.state.tabledata})
			}
		})
	}
	//续借
	renewPaper = r => {
		renewPaper({detailId: r.id, days: this.state.cont_renew_days}).then(res => {
			if(res.code == 200){
				message.success('操作成功')
				this.search()
			}
		})
	}

	renderSearch = _ => <div className="mgrSearchBar">
		<Input 
			value={this.state.search.name}
			allowClear
			onChange={e => this.changeSearch({name: e.target.value})}
			style={{width: 300}}
			addonBefore="关键字" placeholder="合同号/合同名称/流程编号/项目编号" />
	  { this.state.isAdmin ? <Input
			value={this.state.search.userName}
			onChange={e => this.changeSearch({userName: e.target.value})}
			style={{width: 200}}
			addonBefore="借用人" placeholder="借用人" /> : null}
		<Select
	    allowClear = {true}
	    style={{ width: 200}}
	    onChange={t=> this.changeSearch({state: t || ''})}
	    placeholder="状态"
	  >
	    {this.state.states.map(t => <Option value={t.code} key={t.code}>{t.value}</Option>)}
	  </Select>	
	  <DatePicker onChange={e => this.changeSearch({fromDate: e})} placeholder="归还日期起" />
		<DatePicker onChange={e => this.changeSearch({toDate: e})} placeholder="归还日期止" />
		<Button 
		onClick={this.search}
		type="primary" icon="search">搜索</Button>
	</div>

}

export default Contpaper