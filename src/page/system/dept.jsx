import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Icon, Modal } from 'antd'
import { getdeptTree } from '/api/mgr'
import { deleteDept } from '/api/dept'
import { GET_DEPT_TREE } from '/redux/action'
import Common from '/page/common.jsx'

import DeptForm from '/components/dept/deptForm.jsx'

@connect(state => ({}), dispath => ({
	getTree(){dispath({type: GET_DEPT_TREE})},
}))
class Dept extends Common{
	async componentWillMount () {
		this.search()
	}

	state = {
		columns: [{
			title: 'id',
			dataIndex: 'id'
		}, {
			title: '部门简称',
			dataIndex: 'simplename'
		}, {
			title: '部门全称',
			dataIndex: 'fullname'
		}, {
			title: '排序',
			dataIndex: 'num'
		}, {
			title: '备注',
			dataIndex: 'tips'
		}],
		selected: {},
		loading: true,
		tabledata: [],
		modalconf: {visible: false, item: {}},
		search: {},
	}

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		if (!search.condition) delete search.condition
		return getdeptTree(search)
		.then(res => {
			let data

			data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.id })
				if (val.childrenDepts && val.childrenDepts.length) {
					let item = Object.assign({}, baseItem, {
						children: f(f)(val.childrenDepts)
					})
					delete item.childrenDepts
					return item
				}
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
		this.props.getTree()
	}
	delete = _ => {
		this.handleOk(deleteDept, 'deptId', '删除', 'deleteback')
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

	renderBtn = _ => <div className="mgrToolBar">
		<Button 
		onClick={_ => this.addmodal('modalconf', '添加角色')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('modalconf', '编辑角色')}
		type="primary" icon="edit">修改</Button>
		<Button 
		onClick={this.changemodel}
		type="primary" icon="close">删除</Button>
	</div>

	rendermodal = _ => [<DeptForm 
		onCancel={_ => this.cancelform('modalconf')}
		done={_ => this.done()}
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
		</Modal>]

}

export default Dept