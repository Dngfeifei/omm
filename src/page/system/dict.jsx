import React from 'react'
import { Input, Button, Icon, Modal } from 'antd'
import { getDictList, deleteDict } from '/api/dict'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import DictForm from '/components/dict/dictForm.jsx'

class Dict extends Common{
	async componentWillMount () {
		this.search()
	}

	state = {
		columns: [{
			title: '字典名称',
			dataIndex: 'name'
		},{
			title: '字典编号',
			dataIndex: 'code'
		},{
			title: '是否树形结构',
			dataIndex: 'isTree',
			render: (t) => Number(t) == 0 ? '否' : Number(t) == 1 ? '是' : ''
		},{
			title: '备注',
			dataIndex: 'tips'
		},{
			title: '备用字段1',
			dataIndex: 'field1'
		},{
			title: '备用字段2',
			dataIndex: 'field2'
		},{
			title: '备用字段3',
			dataIndex: 'field3'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			render: (t, r) => <a style={{display: 'inline-block', width: 60}} onClick={async _ => {this.toDataForm(r.name,r.id,r.isTree)}}>编辑数据</a>
		}],
		selectedtable: true,
		selected: {},
		loading: true,
		tabledata: [],
		modalconf: {visible: false, item: {}},
		search: {condition: ''},
		treeMenu: []
	}

	toDataForm = async (n,i,tree) => {
		await window.remove('dictdata')
		let name = n.length > 4 ? (n.substring(0,4)+'..') : n
    let pane = {
        title: '字典:' + name, 
        key: 'dictdata',
        url: 'dictdata',
        params: {
        	dictid: i,
        	istree: tree,
        	dictname: n
        }
    }
    parent.add(pane)
  }

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		if (!search.condition) delete search.condition
		return getDictList(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.id })
				return baseItem
			}))(res.data)
			this.setState({
				tabledata: data, 
				loading: false
			})
		})
	}

	deleteback = _ => {
		this.search()
	}
	delete = _ => {
		this.handleOk(deleteDict, 'dictId', '删除', 'deleteback')
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
			addonBefore="名称" placeholder="输入数据字典名称" />
			
			<Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
		</div>
	</div>

	renderBtn = _ => <div>
	<ButtonGroup>
		<Button 
		onClick={_ => this.addmodal('modalconf', '添加数据字典')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('modalconf', '编辑数据字典')}
		type="primary" icon="edit">修改</Button>
		<Button 
		onClick={this.changemodel}
		type="primary" icon="close">删除</Button>
	</ButtonGroup>
	</div>

	rendermodal = _ => <div><DictForm 
		onCancel={_ => this.cancelform('modalconf')}
		done={_ => this.done()}
		getTree={_ => this.search()}
		config={this.state.modalconf} />,
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

export default Dict