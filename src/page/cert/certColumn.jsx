import React from 'react'
import { Input, Button, Icon, Modal, message, TreeSelect } from 'antd'
import { getCertColumnList, deleteCertColumn } from '/api/cert'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import CertColumnForm from '/page/cert/certColumnForm.jsx'
import { getDictSelect } from '/api/dict'
import { handleTreeData } from '/api/tools'
const TagMap = {
	input: '文本',
	number: '证书数量',
	date: '日期',
	select: '档案'
}
class CertColumn extends Common{
	async componentWillMount () {
		this.search()
		this.getTypeTreeData()
	}

	state = Object.assign({}, this.state, {
		typeTreeData: [],
		search: Object.assign({}, this.state.pageconf),
		columns: [{
			title: '名称',
			dataIndex: 'name'
		},{
			title: '类型',
			dataIndex: 'tag',
			render: t => TagMap[t]
		},{
			title: '顺序',
			dataIndex: 'num'
		},{
			title: '证书类型',
			dataIndex: 'typeName'
		}],
		selected: {},
		loading: true,
		tabledata: [],
		modalconf: {visible: false, item: {}}
	})

	getTypeTreeData = _ => {
		getDictSelect({dictcode: 'aptitude'}).then(res => {
			let treeData = handleTreeData(res.data, 'name', 'code', 'children', true)
			this.setState({typeTreeData: treeData})
		})
	}

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		return getCertColumnList(search)
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
		this.handleOk(deleteCertColumn, 'id', '删除', 'deleteback')
	}

	done = async _ => {
		let type = this.state.modalconf.type
		let config = {}
		config.modalconf = {visible: false, item: {}}
		this.setState(config)
		if (type == 'add') {
			this.search()
		} else {
			await this.setState({selected: {}})
			this.search()
		}
	}

	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<TreeSelect style={{ width: 200 }} allowClear={true}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={this.state.typeTreeData}
        placeholder="选择证书类型"
        treeDefaultExpandAll
        onChange={e => this.changeSearch({typeCode: e})} />
			<Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
		</div>
	</div>

	renderBtn = _ => <div>
	<ButtonGroup>
		<Button 
		onClick={_ => this.addmodal('modalconf', '添加字段')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('modalconf', '编辑字段')}
		type="primary" icon="edit">修改</Button>
		<Button 
		onClick={this.changemodel}
		type="primary" icon="close">删除</Button>
	</ButtonGroup>
	</div>

	rendermodal = _ => <div><CertColumnForm 
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

export default CertColumn