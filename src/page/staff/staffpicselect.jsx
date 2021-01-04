import React, { Component } from 'react'
import { Button, Modal, Input, Icon, Select } from 'antd'
const Option = Select.Option
import { getpicselect } from '/api/staff'
import Common from '/page/common.jsx'
import { getDictSelectMuti } from '/api/dict'

class Staffpicselect extends Common{

	async componentWillMount () {
		this.getPicTypes()
		this.search()
	}

	state = Object.assign({}, this.state, {
		staffpics: [],
		search: Object.assign({}, this.state.pageconf),
		columns: [{
			title: '人员',
			dataIndex: 'username'
		},{
			title: '类型',
			dataIndex: 'type'
		},{
			title: '备注',
			dataIndex: 'remark'
		}],
		type: 'staffpic',
		selectedtable: true,
		selecttype: 'checkbox',
		pagesizechange: true
	})

	getPicTypes = _ => {
		let codeList = ['staffpics']
		getDictSelectMuti({codeList}).then(res => {
			codeList.forEach(key => {
				this.setState(res.data)
			})
		})
	}

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		return getpicselect(search)
		.then(res => {
			let data = res.data.records.map(val => Object.assign({}, val, {key: val.id}))
			this.setState({
				tabledata: data, 
				loading: false,
				pagination: Object.assign({}, this.state.pagination, {
					total: Number(res.data.total),
					current: Number(res.data.current)
				}),
				selected: {selectedKeys: this.props.selectedkey}
			})
		})
	}

	selectdone = _ => {
		this.props.selectdone(this.state.selected.selectedItems)
		this.props.onCancel()
	}

	renderSearch = _ => <div className="mgrSearchBar">
		<Select onChange={t => this.changeSearch({type: t})}
			placeholder="选择类型" 
  		style={{width: 200}}>
	    {this.state.staffpics.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
	  </Select>
		<Input 
		value={this.state.search.username}
		onChange={e => this.changeSearch({username: e.target.value})}
		style={{width: 200}}
		addonBefore="人员" placeholder="人员名称" />
		<Button 
		style={{ marginRight: '15px' }}
		onClick={this.search}
		type="primary" icon="search">搜索</Button>
		<Button 
		onClick={this.selectdone}
		type="primary" icon="check">选择</Button>
	</div>


}

export default Staffpicselect