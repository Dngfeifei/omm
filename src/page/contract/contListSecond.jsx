import React from 'react'
import { Button, Icon, message, Input, Select, DatePicker } from 'antd'
import { getContListSecond } from '/api/contsale'
import Common from '/page/common.jsx'
import { vbillMap,  iprojMap, dealBlob } from '/api/tools'
import { getDictSelectMuti } from '/api/dict'
const { RangePicker } = DatePicker

class ContListSecond extends Common{

	async componentWillMount () {
		this.getAllDocs()
	}

	state = Object.assign({}, this.state, {
		provinces: [],
		hytype: [],
		search: {},
		pagination: false,
		selectedtable: false, //是否可以选择
		loading: false,
		columns: [{
			title: '开始时间',
			dataIndex: 'startDate'
		},{
			title: '结束时间',
			dataIndex: 'endDate'
		},{
			title: '区域',
			dataIndex: 'city'
		},{
			title: '行业',
			dataIndex: 'hytype'
		},{
			title: '金额',
			dataIndex: 'amount'
		},{
			title: '数量',
			dataIndex: 'count'
		}]
	})
	//获得行业类别
	// gethyandservlist = _ => {
	// 	getDictSelectMuti({codeList: ['hytype']}).then(res => {
	// 		this.setState({hytypelist: res.data.hytype})
	// 	})
	// }

	getAllDocs = _ => {
		let codeList = ['provinces', 'hytype']
		getDictSelectMuti({codeList}).then(res => {
			codeList.forEach(key => {
				this.setState(res.data)
			})
		})
	}

	search = async _ => {
		let search = Object.assign({}, this.state.search)
		if(!this.state.search.city && this.state.search.city.length < 2){
			message.error('请输入正确的技术区域')
			return
		}
		if(!this.state.search.hytype){
			message.error('请选择行业类别')
			return
		}
		if(!this.state.search.fromDate || !this.state.search.toDate){
			message.error('请选择时间区间')
			return
		}else{
			search.fromDate = search.fromDate.format('YYYY-MM-DD')
			search.toDate = search.toDate.format('YYYY-MM-DD')
		}
		await this.setState({loading: true, selected: {}})
		return getContListSecond(search)
		.then(res => {
			let data = []
			if(res.data){
				data = res.data.map(val => Object.assign({}, val, {key: val.pkContsale}))
			}
			this.setState({
				tabledata: data, 
				loading: false
				// pagination: Object.assign({}, this.state.pagination, {
				// 	total: Number(res.data.total),
				// 	current: Number(res.data.current)
				// })
			})
		})
	}


	renderSearch = _ => <div className="mgrSearchBar">
		<DatePicker onChange={e => this.changeSearch({fromDate: e})} placeholder="日期-起" />
		<DatePicker onChange={e => this.changeSearch({toDate: e})} placeholder="日期-止" />
		<Select
	 		showSearch
	    optionFilterProp="children"
	    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
	    style={{ width: 260}}
	    onChange={t=> this.changeSearch({city: t || '' })}
	    placeholder="选择技术区域"
	  >
	    {this.state.provinces.map(t => <Option value={t.name} key={t.name}>{t.name}</Option>)}
	  </Select>
		<Select
	    style={{ width: 260}}
	    onChange={t=> this.changeSearch({hytype: t || '' })}
	    placeholder="选择行业类型"
	  >
	    {this.state.hytype.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
	  </Select>
		<Button 
		onClick={this.search}
		type="primary" icon="search">搜索</Button>
	</div>



}

export default ContListSecond