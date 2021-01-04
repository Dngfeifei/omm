import React from 'react'
import { Button, Modal, Input, Icon } from 'antd'
import Common from '/page/common.jsx'

const itypeMap = {
	0: '负责人',
	1: '成员'
}
class ProjectUser extends Common{

	async componentWillMount () {
		this.search()
	}
	state = Object.assign({}, this.state, {
		selectedtable: false,
		columns: [{
			title: '编码',
			dataIndex: 'psncode'
		},{
			title: '名称',
			dataIndex: 'psnname'
		},{
			title: '分工',
			dataIndex: 'vsplitwork'
		},{
			title: '预计贡献度',
			dataIndex: 'nbudgnum'
		},{
			title: '类别',
			dataIndex: 'itype',
			render: t => itypeMap[t]
		},{
			title: '备注',
			dataIndex: 'vmemo'
		}]
	})

	search = async _ => {
		let data = this.props.mems.map(val => Object.assign({}, val, {key: val.psncode}))
		this.setState({
			tabledata: data,
			loading: false
		})
	}

}

export default ProjectUser