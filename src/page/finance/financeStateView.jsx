import React from 'react'
import { Input, Button, Icon, Modal, message, Select } from 'antd'
import { getNData } from '/api/finance'
import { getCompanys } from '/api/dict'
import { numSep, percentSep } from '/api/tools'
import Common from '/page/common.jsx'


class FinanceStateView extends Common{
	async componentWillMount () {
	}

	state = Object.assign({}, this.state, {
		search: {},
		columns: [],
		selected: {},
		loading: false,
		selectedtable: false,
		pagination: false
	})


	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({type: this.state.type}, this.state.search)
		return getNData(search).then(res => {
			this.setHeader(res.data.headers)
			this.setState({loading: false, tabledata: res.data.bodys})
		})
	}


	setHeader = headers => {
		const columns = headers.map(r => {
			let obj = {title: r.title, dataIndex: r.dataIndex}
			if(r.type === 'double'){
				obj.render = (t, p) => p.type == 'number' ? numSep(t) : (p.type == 'percent' && t ? `${t}%` : null)
			}
			return obj
		})
		console.log(columns)
		this.setState({columns})
	}	


	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<Select allowClear={true} style={{width: 260}} placeholder="选择公司" onChange={t =>this.changeSearch({pkcorp: t})}>
		    {this.props.companys.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
		  </Select>
			<Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
		</div>
	</div>

}

export default FinanceStateView