import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Icon, Modal, message } from 'antd'
import { listStorage } from '/api/mtn'
import Common from '/page/common.jsx'

const ButtonGroup = Button.Group

class BranchStorage extends Common{
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
			title: '现存数量',
			dataIndex: 'nonhandnum'
		}],
		selectedtable: false,
		loading: false,
		editModalConf: {visible: false, item: {}},
		roleModal: {visible: false, item: {}},
	})

	search = async _ => {
		let search = Object.assign({}, this.state.search)
		if(!this.state.search.invname){
			message.warn('请录入存货名称')
			return
		}
		await this.setState({loading: true, selected: {}})
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
		value={this.state.search.invname}
		allowClear
		onChange={e => this.changeSearch({invname: e.target.value})}
		addonBefore="存货名称" />
		<Button 
		onClick={this.search}
		type="primary" icon="search">搜索</Button>
	</div>


}

export default BranchStorage