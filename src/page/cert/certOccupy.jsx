import React, { Component } from 'react'
import { Modal, Table } from 'antd'
import { getCertOccupys } from '/api/cert'
import moment from 'moment'

const StatusMap = {
	0:'申请中', 
	1:'已通过',
	2:'已驳回',
	3:'已续借',
	4:'已归还'
}
class CertOccupy extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible && nextprops.config.certId) {
			this.search(nextprops.config.certId, nextprops.config.formId)
		}
	}
	state = {
		columns: [{
			title: '借用人',
			dataIndex: 'applyname'
		},{
			title: '项目',
			dataIndex: 'projname'
		},{
			title: '借用时间',
			dataIndex: 'borrowDate',
			render: t => t ? moment(t).format('YYYY-MM-DD') : ''
		},{
			title: '归还时间',
			dataIndex: 'returnDate',
			render: t => t ? moment(t).format('YYYY-MM-DD') : ''
		},{
			title: '状态',
			dataIndex: 'status',
			render: t => StatusMap[t]
		}],
		tabledata: [],
		loading: false,
		lock: false
	}

	//获得证书占用情况
	search = (certId, formId) => {
		getCertOccupys({certId, formId}).then(res => {
			let tabledata = res.data.map(t => Object.assign(t, { key: t.id }))
			this.setState({tabledata})
		})
	}



	render = _ => {
		return <Modal title='证书占用明细'
		onOk={this.handleOk}
		footer= {null}
		visible={this.props.config.visible}
		confirmLoading={this.state.loading}
		onCancel={this.props.onCancel}
		width={1000}
		style={{top: 50, marginBottom: 100}}>
			<Table dataSource={this.state.tabledata} columns={this.state.columns} pagination={false}/>
		</Modal>
	}
}

export default CertOccupy