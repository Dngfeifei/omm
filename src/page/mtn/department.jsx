import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Icon, Modal, Select, message } from 'antd'
import { listDept, selectMembers, saveDepManager } from '/api/mtn'
import Common from '/page/common.jsx'


class Department extends Common{
	async componentWillMount () {
		this.search()
	}

	state = {
		columns: [{
			title: '部门名称',
			dataIndex: 'name'
		}, {
			title: '部门代码',
			dataIndex: 'code'
		}, {
			title: '修改时间',
			dataIndex: 'updateTime'
		}, {
			title: '部门主管',
			dataIndex: 'depManagerName'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			render: (t, r) => <a style={{display: 'inline-block', width: 60}} onClick={async _ => {this.openModel(r)}}>编辑</a>
		}],
		members: [],
		depmanager: '',
		depid: '',
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
		return listDept(search)
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

	openModel = r => {
		if(this.state.members.length == 0){
			selectMembers().then(res => {
				this.setState({members : res.data})
			})
		}
		this.setState({visible: true, depid: r.id, depmanager: r.depManager})
	}

	saveDepManager = _ => {
		saveDepManager({depid: this.state.depid, depmanager: this.state.depmanager}).then(res => {
			if(res.code == 200){
				message.success('保存成功')
				this.search()
				this.setState({visible: false})
			}
		})
	}

	rendermodal = _ => <Modal title="部门主管"
		  visible={this.state.visible}
		  onOk={this.saveDepManager}
		  mask={false}
		  width={400}
		  onCancel={_ => this.setState({visible: false})}
		  okText="确认"
		  cancelText="取消"
		>
			<Select
						value = {this.state.depmanager}
				    showSearch
				    style={{ width: 300 }}
				    placeholder="部门主管"
				    optionFilterProp="children"
				    onChange={t => this.setState({depmanager: t})}
				    filterOption={(input, option) => option.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0}
				  >
				    {this.state.members.map(t => <Option value={t.id} key={t.id}>{t.name}({t.code})</Option>)}
				  </Select>
		</Modal>

}

export default Department