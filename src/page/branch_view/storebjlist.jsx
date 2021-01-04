import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Icon, Modal } from 'antd'
import { liststorage } from '/api/branch'
import Common from '/page/common.jsx'

const ButtonGroup = Button.Group

class Storebjlist extends Common{
	async componentWillMount () {
		 this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({}, this.state.pageconf),
		columns: [{
			title: '存货分类',
			dataIndex: 'invclassname'
		}, {
			title: '存货编码',
			dataIndex: 'invcode'
		}, {
			title: '存货名称',
			dataIndex: 'invname'
		}, {
			title: '规格',
			dataIndex: 'invspec'
		}, {
			title: '对应主机',
			dataIndex: 'invshortname'
		}, {
			title: '计量单位',
			dataIndex: 'measname'
		}, {
			title: '结存数量',
			dataIndex: 'nonhandnum'
		}],
		selectedtable: false,
		loading: false,
	})

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({storeId: this.props.storeId}, this.state.search)
		return liststorage(search)
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

export default Storebjlist