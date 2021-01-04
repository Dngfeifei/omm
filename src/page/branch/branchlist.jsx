import React from 'react'
import { Input, Button, Icon, Modal, message, Popconfirm } from 'antd'
import { listbranch, addbranch, deletebranch, branchFinish } from '/api/branch'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import BranchForm from '/page/branch/branchForm.jsx'

class BranchList extends Common{
	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({condition: ''}, this.state.pageconf),
		columns: [{
			title: '区域',
			dataIndex: 'branchArea'
		},{
			title: '分公司名称',
			dataIndex: 'branchName'
		},{
			title: '公司法人',
			dataIndex: 'legalName'
		},{
			title: '法人电话',
			dataIndex: 'legalPhone'
		},{
			title: '地址',
			dataIndex: 'address'
		},{
			title: '备注',
			dataIndex: 'remark'
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
		selected: {},
		loading: true,
		modalconf: {visible: false, item: {}},
		picmodelConf: {visible: false, item: {}}
	})


	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		if (!search.condition) delete search.condition
		return listbranch(search)
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
		branchFinish({id: r.id, isend: state}).then(res => {
			if(res.code == 200){
				this.search()
			}
		})
	}

	deleteback = _ => {
		this.search()
	}
	delete = _ => {
		this.handleOk(deletebranch, 'id', '删除', 'deleteback')
	}

	addpanel = async r => {
		await window.remove('branchForm')
		let pane = {
				title: `分支机构:${r.branchName}`,
				key: 'branchForm',
				url: 'branchForm',
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
			addonBefore="名称" placeholder="区域/分支机构名称" />
			<Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
		</div>
	</div>

	renderBtn = _ => <div>
	<ButtonGroup>
		<Button 
		onClick={_ => this.addmodal('modalconf', '添加分支机构')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('modalconf', '编辑分支机构')}
		type="primary" icon="edit">修改</Button>
		<Button 
		onClick={this.changemodel}
		type="primary" icon="close">删除</Button>
	</ButtonGroup>
	</div>

	rendermodal = _ => <div><BranchForm 
		onCancel={_ => this.cancelform('modalconf')}
		done={_ => this.done()}
		config={this.state.modalconf} />
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