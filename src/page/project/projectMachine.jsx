import React from 'react'
import { Button, Modal, Input, Icon } from 'antd'
import Common from '/page/common.jsx'

class ProjectMachine extends Common{

	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		selectedtable: false,
		columns: [{
			title: '系列',
			dataIndex: 'vseries'
		},{
			title: '型号',
			dataIndex: 'vtype'
		},{
			title: '数量',
			dataIndex: 'nquantity'
		},{
			title: '备注',
			dataIndex: 'vmemo'
		}],
		modalConf: {visible: false, item: {}}
	})

	search = _ => {
		let data = this.props.eqs.map(val => Object.assign({}, val, {key: val.pkProjitemEq}))
		this.setState({
			tabledata: data,
			loading: false
		})
	}

}

export default ProjectMachine