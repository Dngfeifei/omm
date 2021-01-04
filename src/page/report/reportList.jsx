import React from 'react'
import { Input, Button, Modal } from 'antd'
import { getReportList, deleteReport } from '/api/report'
import { ReportMap } from '/api/tools'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import ReportForm from '/page/report/reportForm.jsx'

class ReportList extends Common{
	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({condition: ''}, this.state.pageconf),
		columns: [{
			title: '编号',
			dataIndex: 'id'
		},{
			title: '名称',
			dataIndex: 'name'
		},{
			title: '类型',
			dataIndex: 'type',
			render: t => ReportMap[t]
		},{
			title: '是否菜单',
			dataIndex: 'isMenu',
			render: t => t == 0 ? '否' : '是'
		},{
			title: '说明',
			dataIndex: 'remark'
		},{
			title: '创建时间',
			dataIndex: 'creatTime'
		}],
		loading: true,
		tabledata: [],
		modalconf: {visible: false, item: {}}
	})


	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		//console.log(search)
		if (!search.condition) delete search.condition
		return getReportList(search)
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
		this.handleOk(deleteReport, 'id', '删除', 'deleteback')
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
	<ButtonGroup>
		<Button 
		onClick={_ => this.addmodal('modalconf', '添加报表')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('modalconf', '编辑报表')}
		type="primary" icon="edit">修改</Button>
		<Button 
		onClick={this.changemodel}
		type="primary" icon="close">删除</Button>
	</ButtonGroup>
	</div>

	rendermodal = _ => <div><ReportForm 
		onCancel={_ => this.cancelform('modalconf')}
		done={_ => this.done()}
		getTree={_ => this.search()}
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

export default ReportList