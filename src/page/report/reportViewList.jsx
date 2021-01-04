import React from 'react'
import { Input, Button } from 'antd'
import { getReportData, getReportSearch, getReportHref, getDetail, exportReport } from '/api/report'
import { dealBlob, equalObj } from '/api/tools'
import ReportSearchDom from '/components/report/reportSearch.jsx'
import { getDictSelect } from '/api/dict'
import Common from '/page/common.jsx'

class ReportList extends Common{
	async componentWillMount () {
		let id = this.props.params.id
		if(this.props.params.params){
			await this.setState({search: Object.assign({}, this.state.pageconf, this.props.params.params)})
		}
		if(this.props.disableExport){
			this.setState({exportable : false})
		}
		this.getReport(id)
	}

	async componentWillReceiveProps(nextProps){
		// console.log(nextProps.params)
		// console.log(this.props.params)
    if(this.props.asCom && !equalObj(nextProps.params, this.props.params)){
    		let id = nextProps.params.id
				if(nextProps.params.params){
					await this.setState({search: Object.assign({}, this.state.pageconf, nextProps.params.params)})
				}
				this.getReport(id)
    }
	}

	state = Object.assign({}, this.state, {
		id: '',
		exportable: true,
		search: Object.assign({}, this.state.pageconf),
		selectedtable: false,
		columns: [{
			title: '无数据',
			dataIndex: 'name'
		},{
			title: '无数据',
			dataIndex: 'code'
		}],
		dict: {},
		name: '',
		searchdoms: [],
		loading: false,
		loading2: false,
		tabledata: [],
		modalconf: {visible: false, item: {}},
	})
	//get detail of report
	getReport = id => {
		getDetail({id}).then(async res => {
			if(res.data.isPage == 0){
				let se = this.props.params.params || {}
				if(se.offset || se.offset == 0) delete se.offset
				if(se.limit) delete se.limit
				await this.setState({pagination: false, search: Object.assign({}, se)})
			}
			this.getSearchColumn(id)
			this.setState({id})
			if(id != 17 && id != 23){ // 后期改成可配置的，是否需要初始页面时就加载数据 -- todo
				this.search()
			}
		})
	}

	assignColumns = (data, hideColumns, highColumns) => {
		let arr = hideColumns ? hideColumns.split(',') : []
		let higharr = highColumns ? highColumns.split(',') : []
		let columns = []
		if(data.length > 0){
			for(let t in data[0]){
				if(t == 'key' || arr.indexOf(t) > -1) continue
				let o = {title: t, dataIndex: t}	
				if(higharr.indexOf(t) > -1){
					o.className = 'col-high'
				}
				columns.push(o)
			}
		}
		let num = columns.length
		if(num > 12){  // 后期改成可配置的
			columns[0].fixed = 'left'
			columns[0].width = 100
			columns[1].fixed = 'left'
			columns[1].width = 100
			columns[2].fixed = 'left'
			columns[2].width = 120

			columns[num - 1].fixed = 'right'
			columns[num - 1].width = 100
		}
		this.setState({columns, scroll: {x: num * 100}})
		this.getHrefColumn(this.state.id)
	}
  //获得搜索条件
	getSearchColumn = id => {
		getReportSearch({id}).then(res => {
			// console.log(res.data)
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
	//获得超链接
	getHrefColumn = id => {
		let columns = this.state.columns
		getReportHref({id}).then(res => {
			res.data.forEach(t => {
				columns.forEach(e => {
					if (e.dataIndex.toLowerCase() == t.name.toLowerCase()) {
						e.render = (x, y) => <a onClick={_ => this.goToHref(y, t)}>{x}</a>
					}
				})
				this.setState({columns})
			})
		})
	}

	//跳转超链接
	goToHref = async (r, t) => {
		await window.remove('gotoreport')
		getDetail({id: t.content}).then(res => {
			for(let i in r){
				r[i.toLowerCase()] = r[i]
			}
			let pane = {
				title: res.data.name,
				key: 'gotoreport',
				url: res.data.type == 11 ? 'report_group' : 'report_view_list',
				params: {
					id: Number(t.content),
					params: Object.assign(r, this.state.search)
				}
			}
			window.add(pane)
		})
	}

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({rid09: this.state.id}, this.state.search)
    this.state.searchdoms.forEach(t => {
    	if(t.showType == 2){
    		if (search[t.arg]) search[t.arg] = search[t.arg].format('YYYY-MM-DD')
    	}
    })
		return getReportData(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.id })
				return baseItem
			}))(res.data.page.records)
			this.assignColumns(data, res.data.report.hideColumns, res.data.report.highColumns)// 设置表头
			this.setState({
				tabledata: data, 
				loading: false,
				name: res.data.report.name,
				pagination: this.state.pagination ? Object.assign({}, this.state.pagination, {
					total: res.data.page.total,
					current: res.data.page.current
				}) : false
			})
		})
	}

	changeInput = (t, v) => {
		let obj = {}
		obj[t] = v
		let search = Object.assign({}, this.state.search, obj, this.state.pageconf)
		this.setState({search})
	}
	// 导出
	export = _ => {
		this.setState({loading2: true})
		let search = Object.assign({rid09: this.state.id}, this.state.search)
		exportReport(search).then(blob => {
			if(blob) dealBlob(blob, `${this.state.name}.xlsx`)
			this.setState({loading2: false})
		})
	}

	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<ReportSearchDom dict={this.state.dict} searchdoms={this.state.searchdoms} search={this.state.search} changeInput={this.changeInput}  />
			{this.state.searchdoms.length > 0 ? <Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button> : null}
			{this.state.exportable ? <Button 
			onClick={this.export}
			type="primary" icon="export" loading={this.state.loading2}>导出</Button> : null}
		</div>
	</div>

}

export default ReportList