import React, { Component } from 'react'
import { Input, Button } from 'antd'
import { getGroupReport, getReportSearch } from '/api/report'
import ReportSearchDom from '/components/report/reportSearch.jsx'
import ReportView from '/page/report/reportView.jsx'
import ReportViewList from '/page/report/reportViewList.jsx'
import { getDictSelect } from '/api/dict'

class ReportGroup extends Component{
	async componentWillMount () {
		let id = this.props.params.id
		//console.log(this.props.params)
		if(this.props.params.params){
			let obj = Object.assign({}, this.props.params.params)			
			await this.setState({params: obj, search: obj})
		}
		this.getSearchColumn(id)
		this.getGroupReport(id)
		this.setState({id})
	}

	state = Object.assign({}, this.state, {
		id: '',
		search: Object.assign({}),
		params: {},
		dict: {},
		name: '',
		searchdoms: [],
		loading: true,
		loading2: false,
		tabledata: [],
		reports: []
	})

	getGroupReport = id => {
		getGroupReport({id}).then(res => {
			console.log(res.data)
			this.setState({reports: res.data})
		})
	}

  //获得搜索条件
	getSearchColumn = id => {
		getReportSearch({id}).then(res => {
			this.setState({searchdoms: res.data.map(t => {
				t.key = t.id
				return t
			})})
			res.data.forEach(t => {
				if ((t.showType == 3 || t.showType == 4) && t.dictCode){
					getDictSelect({dictcode: t.dictCode}).then(res => {
						let dict = this.state.dict
						dict[t.dictCode] = res.data
						this.setState({dict})
					})
				}
			})
		})
	}

	search = _ => {
		this.setState({params: this.state.search})
	}

	isNotEmptyObj = r => {
		let result = false
		for(let i in this.state.params){
				if(!!this.state.params[i]){
					result = true
				}
		}
		console.log(result)
		return result
	}

	changeInput = (t, v) => {
		let obj = {}
		obj[t] = v
		let search = Object.assign({}, this.state.search, obj, this.state.pageconf)
		this.setState({search})
	}
	//
	getDom = t => {
		// console.log(this.state.params)
		if(t.type == 5){
			return <div><p style={{margin:0,textAlign:'center',fontSize:'20px'}}>{t.name}</p><ReportView asCom={true} params={{id: t.id, params: this.state.params}} /></div>
		}else if(t.type == 1){
			return <div><p style={{margin:0,textAlign:'center',fontSize:'20px'}}>{t.name}</p><ReportViewList asCom={true} disableExport={true} params={{id: t.id, params: this.state.params}} /></div>
		}

	}

	render = _ => <div className="mgrWrapper">
		<div className="mgrSearchBar">
			<ReportSearchDom dict={this.state.dict} searchdoms={this.state.searchdoms} search={this.state.search} changeInput={this.changeInput}  />
			{this.state.searchdoms.length > 0 ? <Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button> : null}
		</div>
		{this.isNotEmptyObj(this.state.params) ? this.state.reports.map(t => this.getDom(t)) : null}
	</div>

}

export default ReportGroup