import React, { Component } from 'react'
import { Modal, Table } from 'antd'
import { getContractOccupys } from '/api/contsale'
import moment from 'moment'
import { StatusMap } from '/api/tools'

class ContractOccupy extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible && nextprops.config.contsaleId) {
			console.log(99)
			this.search(nextprops.config.contsaleId)
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
	search = (contsaleId) => {
		getContractOccupys({contsaleId}).then(res => {
			let tabledata = res.data.map(t => Object.assign(t, { key: t.id }))
			this.setState({tabledata})
		})
	}



	render = _ => {
		return <Modal title='纸质合同占用明细'
		onOk={this.handleOk}
		footer= {null}
		visible={this.props.config.visible}
		confirmLoading={this.state.loading}
		onCancel={this.props.onCancel}
		width={1000}
		style={{top: 50, marginBottom: 100}}>
			<Table dataSource={this.state.tabledata} columns={this.state.columns} />
		</Modal>
	}
}

export default ContractOccupy