import React from 'react'
import { Button, Modal, Input, Icon } from 'antd'
import Common from '/page/common.jsx'

class ContractCity extends Common{

	async componentWillMount () {
		this.search()
	}

	async componentWillReceiveProps (nextprops) {
		if (nextprops.cities != this.props.cities) {
			this.search(nextprops.cities)
		}
	}

	state = Object.assign({}, this.state, {
		selectedtable: false,
		pagination: false,
		columns: [{
			title: '省份',
			dataIndex: 'province'
		},{
			title: '城市',
			dataIndex: 'cityName'
		},{
			title: '合同金额',
			dataIndex: 'ncitiesmny'
		},{
			title: '备注',
			dataIndex: 'vmemo'
		}],
		modalConf: {visible: false, item: {}}
	})

	search = cs => {
		const cities = cs || this.props.cities
		let data = cities.map(val => Object.assign({}, val, {key: val.pkContsaleCities}))
		this.setState({
			tabledata: data,
			loading: false
		})
	}

}

export default ContractCity