import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Icon, Modal } from 'antd'
import { listCompany, deleteCompany } from '/api/company'
import Common from '/page/common.jsx'
import CompanyForm from '/components/company/companyForm.jsx'
import { handleTreeData } from '/api/tools'

class Company extends Common{
	async componentWillMount () {
		this.search()
	}

	state = {
		tree: [],
		columns: [{
			title: '公司编码',
			dataIndex: 'code'
		}, {
			title: '公司',
			dataIndex: 'name'
		}, {
			title: '备注',
			dataIndex: 'remark'
		}],
		pagination: false,
		selectedtable: true,
		selected: {},
		loading: true,
		tabledata: [],
		modalconf: {visible: false, item: {}},
		search: {},
	}

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		return listCompany(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.id })
				return baseItem
			}))(res.data)
			console.log(data)
			this.setState({
				tabledata: data, 
				loading: false,
				tree: handleTreeData(data, 'name', 'id', 'children')
			})
		})
	}

	deleteback = _ => {
		this.search()
	}
	delete = _ => {
		this.handleOk(deleteCompany, 'id', '删除', 'deleteback')
	}

	done = async _ => {
		let config = {}
		config.modalconf = {visible: false, item: {}}
		this.setState(config)
		this.search()
	}

	renderBtn = _ => <div className="mgrToolBar">
		<Button 
		onClick={_ => this.addmodal('modalconf', '添加公司')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('modalconf', '编辑公司')}
		type="primary" icon="edit">修改</Button>
		<Button 
		onClick={this.changemodel}
		type="primary" icon="close">删除</Button>
	</div>

	rendermodal = _ => [<CompanyForm 
		onCancel={_ => this.cancelform('modalconf')}
		done={_ => this.done()}
		tree={this.state.tree}
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

export default Company