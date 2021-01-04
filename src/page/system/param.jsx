import React from 'react'
import { Input, Button, Icon, Modal, message } from 'antd'
import { getparam, deleteparam } from '/api/param'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import ParamForm from '/components/param/paramForm.jsx'

class Param extends Common{
	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({condition: ''}, this.state.pageconf),
		columns: [{
			title: '参数',
			dataIndex: 'code'
		},{
			title: '参数值',
			dataIndex: 'value'
		},{
			title: '说明',
			dataIndex: 'remark'
		}],
		selected: {},
		loading: true,
		tabledata: [],
		modalconf: {visible: false, item: {}}
	})


	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		if (!search.condition) delete search.condition
		return getparam(search)
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

	deleteback = _ => {
		this.search()
	}
	delete = _ => {
		this.handleOk(deleteparam, 'id', '删除', 'deleteback')
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
			addonBefore="关键字" placeholder="说明" />
			<Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
		</div>
	</div>

	renderBtn = _ => <div>
	<ButtonGroup>
		<Button 
		onClick={_ => this.addmodal('modalconf', '添加参数')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('modalconf', '编辑参数')}
		type="primary" icon="edit">修改</Button>
		<Button 
		onClick={this.changemodel}
		type="primary" icon="close">删除</Button>
	</ButtonGroup>
	</div>

	rendermodal = _ => <div><ParamForm 
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

export default Param