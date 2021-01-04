import React from 'react'
import { Input, Button, Icon, Modal, message, Popconfirm } from 'antd'
import { liststore, storeFinish } from '/api/branch'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group

class BranchList extends Common{
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
		},{
			title: '座机号码',
			dataIndex: 'zphone'
		},{
			title: '邮编',
			dataIndex: 'zcode'
		},{
			title: '到货地址',
			dataIndex: 'address'
		},{
			title: '上传完毕',
			dataIndex: 'isend',
			render: (t, r) => t == 1 ? <Popconfirm title="是否取消已完毕?" onConfirm={_ => this.finish(r, 0)}
									    okText="确认" cancelText="取消" >
									    <a href="#">是</a>
									  </Popconfirm> : <Popconfirm title="是否已经上传完毕?" onConfirm={_ => this.finish(r, 1)}
									    okText="确认" cancelText="取消" >
									    <a href="#">否</a>
									  </Popconfirm>
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			render: (t, r) => <a style={{display: 'inline-block', width: 60}} onClick={async _ => {this.addpanel(r)}}>查看</a>
		}],
		selectedtable: false,
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

	//上传完毕
	finish = (r, state) => {
		storeFinish({id: r.storid, isend: state}).then(res => {
			if(res.code == 200){
				this.search()
			}
		})
	}

	addpanel = async r => {
		await window.remove('storeForm')
		let pane = {
				title: `备件库:${r.area}`,
				key: 'storeForm',
				url: 'storeForm',
				params: r
			}
		window.add(pane)
	}

	done = async _ => {
		let type = this.state.modalconf.type
		let config = {}
		config.modalconf = {visible: false, item: {}}
		this.setState(config)
		if (type == 'add') {
			this.research()
		} else {
			await this.setState({selected: {}})
			this.search()
		}
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
		</div>
	</div>

	renderBtn = _ => <div>
	</div>

	rendermodal = _ => <div>
		<Modal title="信息"
		  visible={this.state.visible}
		  onOk={this.delete}
		  mask={false}
		  width={400}
		  onCancel={this.changemodel}
		  okText="确认"
		  cancelText="取消"
		>
			<p>是否删除？</p>
		</Modal></div>

}

export default BranchList