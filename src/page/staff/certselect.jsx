import React, { Component } from 'react'
import { Button, Modal, Input, Icon, Select, message } from 'antd'
const Option = Select.Option
import { getcertselect } from '/api/staff'
import Common from '/page/common.jsx'
import { getParam } from '/api/global'

class Contselect extends Common{

	async componentWillMount () {
		this.search()
		getParam({code: 'staff_stop_days'}).then(res => {
			this.setState({staff_stop_days: Number(res.data) })
		})
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({}, this.state.pageconf),
		staff_stop_days: 30,
		columns: [{
			title: '证书厂商',
			dataIndex: 'certVender'
		},{
			title: '证书全称',
			dataIndex: 'certName',
			width: '40%',
		},{
			title: '人员',
			dataIndex: 'username'
		},{
			title: '证书级别',
			dataIndex: 'certLevel'
		},{
			title: '资质到期日',
			dataIndex: 'overDate'
		},{
			title: '原件是否在公司',
			dataIndex: 'hasoriginal',
			render: (t, r) => Number(t) == 0 ? '否' : (r.lockNum == 1 ? '是(已借)' : '是')
		}],
		type: 'cert',
		selectedtable: true,
		selecttype: 'checkbox',
		pagesizechange: true
	})

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		return getcertselect(search)
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
		let legal = true
		this.state.selected.selectedItems.forEach(item => {
			if(item.overDate && moment(item.overDate).diff(new Date(), 'days') < 30){
				legal = false
			}
		})
		if(!legal) {
			message.error(`证书到期前${this.state.staff_stop_days}天不能申请`)
		}else{
			this.props.selectdone(this.state.selected.selectedItems)
			this.props.onCancel()
		}
	}

	renderSearch = _ => <div className="mgrSearchBar">
		<Input 
		value={this.state.search.name}
		onChange={e => this.changeSearch({name: e.target.value})}
		style={{width: 300}}
		addonBefore="证书" placeholder="证书全称/简称/级别/厂商" />
		<Input 
		value={this.state.search.username}
		onChange={e => this.changeSearch({username: e.target.value})}
		style={{width: 200}}
		addonBefore="人员" placeholder="人员名称" />
		<Button 
		style={{ marginRight: '15px' }}
		onClick={this.search}
		type="primary" icon="search">搜索</Button>
		<Button 
		onClick={this.selectdone}
		type="primary" icon="check">选择</Button>
	</div>


}

export default Contselect