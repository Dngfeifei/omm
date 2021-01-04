import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Icon, Modal } from 'antd'
import { listmachine } from '/api/branch'
import Common from '/page/common.jsx'


class Storezjlist extends Common{
	async componentWillMount () {
		 this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({}, this.state.pageconf),
		columns: [{
			title: '设备名称',
			dataIndex: 'invname'
		}, {
			title: '设备型号',
			dataIndex: 'invcode'
		}, {
			title: 'Model号',
			dataIndex: 'modelcode'
		}, {
			title: '整机序列号',
			dataIndex: 'serailno'
		}, {
			title: '内存',
			dataIndex: 'memory'
		}, {
			title: 'CPU',
			dataIndex: 'cpu'
		}, {
			title: '完好状态',
			dataIndex: 'fullstate'
		}],
		selectedtable: false,
		loading: false,
	})

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({areaName: this.props.areaName}, this.state.search)
		return listmachine(search)
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



}

export default Storezjlist