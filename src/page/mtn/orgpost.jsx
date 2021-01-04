import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Icon, Modal } from 'antd'
import { listOrgpost } from '/api/mtn'
import Common from '/page/common.jsx'

import RoleAuthority from '/components/role/roleAuthority.jsx'

const ButtonGroup = Button.Group

class Orgpost extends Common{
	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({}, this.state.pageconf),
		columns: [{
			title: '名称',
			dataIndex: 'name'
		}, {
			title: 'ID',
			dataIndex: 'id'
		}, {
			title: '修改时间',
			dataIndex: 'updateTime'
		}, {
			title: '是否启用',
			dataIndex: 'enabled',
			render: t => t ? '是' : '否'
		}],
		editModalConf: {visible: false, item: {}},
		roleModal: {visible: false, item: {}},
	})

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		if (!search.condition) delete search.condition
		return listOrgpost(search)
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

	deleteBack = async _ => {
		this.search()
		this.props.getRoleTree()
	}

	delete = _ => {
		this.handleOk(deleteRole, 'roleId', '删除', 'deleteBack')
	}

	done = async key => {
		let type = this.state.editModalConf.type
		let config = {}
		config[key] = {visible: false, item: {}}
		this.setState(config)
		if (type == 'add' && key == 'editModalConf') {
			this.research()
		} else {
			await this.setState({selected: {}})
			this.search()
		}
	}

	renderSearch = _ => <div className="mgrSearchBar">
		<Input 
		value={this.state.search.condition}
		allowClear
		onChange={e => this.changeSearch({condition: e.target.value})}
		addonBefore="岗位名称" />
		<Button 
		onClick={this.search}
		type="primary" icon="search">搜索</Button>
	</div>


}

export default Orgpost