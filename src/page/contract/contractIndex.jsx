import React, { Component } from 'react'
import { Tabs, Spin } from 'antd'
const TabPane = Tabs.TabPane

import ContractForm from '/page/contract/contractForm.jsx'
import ContractMachine from '/page/contract/contractMachine.jsx'
import ContractCity from '/page/contract/contractCity.jsx'

import { getcontsaledetail } from '/api/contsale'

class ContractIndex extends Component{

	componentWillMount = async _ => {
		let id = this.props.params.id
		let readonly = this.props.params.readonly
		await this.setState({id, readonly})
		this.search()
	}

	async componentWillReceiveProps (nextprops) {
		if (nextprops.params != this.props.params && nextprops.params.visible) {
			let id = nextprops.params.id
			let readonly = nextprops.params.readonly
			await this.setState({id, readonly})
			this.search()
		}
	}

	state = {
		active: 1,
		id: undefined,
		readonly: true,
		loading: false,
		item: {},
		eqs: []
	}


	search = async _ => {
		if(!this.state.id){
			return
		}
		await this.setState({loading: true})
		return getcontsaledetail({id: this.state.id})
		.then(res => {
			this.setState({
				loading: false,
				item: res.data.item,
				eqs: res.data.eqs,
				cities: res.data.cities
			})
		})
	}

	render = _ => <div style={{padding: '0 15px', height: '100%'}}>
	<Spin spinning={this.state.loading}>
		<Tabs 
		className={'goodTabs'}
		defaultActiveKey="1">
			<TabPane tab="基本信息" key="1">
				<div style={{paddingBottom: 76}}>
					<ContractForm item={this.state.item} />
				</div>
			</TabPane>
			<TabPane tab="设备信息" key="2">
				<div style={{paddingBottom: 76}}>
					<ContractMachine eqs={this.state.eqs} refresh={this.search} readonly={this.state.readonly} contsaleId={this.state.id} />
				</div>
			</TabPane>
			<TabPane tab="技术区域" key="3">
				<div style={{paddingBottom: 76}}>
					<ContractCity cities={this.state.cities} />
				</div>
			</TabPane>
		</Tabs>
	</Spin>	
	</div>
}

export default ContractIndex