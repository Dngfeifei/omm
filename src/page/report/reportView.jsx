import React, { Component } from 'react'
import { Button, Icon, Modal, message, Form, Row, Col, Spin } from 'antd'
import { getReportData, getReportSearch } from '/api/report'
import { ReportMap, dealBlob, equalObj } from '/api/tools'
import ReportSearchDom from '/components/report/reportSearch.jsx'
import { getDictSelect } from '/api/dict'

class ReportList extends Component{
	async componentWillMount () {
		let id = this.props.params.id
		if(this.props.params.params){
			await this.setState({search: Object.assign({}, this.props.params.params)})
		}
		this.getSearchColumn(id)
		this.setState({id})
		this.search()
	}

	async componentWillReceiveProps(nextProps){
    if(this.props.asCom && !equalObj(nextProps.params, this.props.params)){
    		// console.log(189)
        let id = nextProps.params.id
				if(nextProps.params.params){
					await this.setState({search: Object.assign({}, nextProps.params.params)})
				}
				this.getSearchColumn(id)
				this.setState({id})
				this.search()
    }
	}

	state = Object.assign({}, this.state, {
		id: '',
		search: {},
		selectedtable: false,
		dict: {},
		name: '',
		hideColumns: null,
		searchdoms: [],
		loading: false,
		loading2: false,
		tabledata: [],
		modalconf: {visible: false, item: {}}
	})

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

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({rid09: this.state.id}, this.state.search)
    this.state.searchdoms.forEach(t => {
    	if(t.showType == 2){
    		if (search[t.arg]) search[t.arg] = search[t.arg].format('YYYY-MM-DD')
    	}
    })
		if(search.offset || search.offset == 0) delete search.offset
		if(search.limit) delete search.limit
		return getReportData(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val)
				return baseItem
			}))(res.data.page.records)
			this.setState({
				hideColumns: res.data.report.hideColumns,
				tabledata: data, 
				loading: false,
				name: res.data.report.name,
				pagination: Object.assign({}, this.state.pagination, {
					total: res.data.page.total,
					current: res.data.page.current
				})
			})
		})
	}

	changeInput = (t, v) => {
		let obj = {}
		obj[t] = v
		let search = Object.assign({}, this.state.search, obj)
		this.setState({search})
	}

	getFields() {
    let data = []
    let obj = this.state.tabledata[0]
    let arr = this.state.hideColumns ? this.state.hideColumns.split(',') : []
    for (let k in obj) {
    	if(arr.length > 0 && arr.indexOf(k) > -1) continue
      let value = obj[k]
      data.push({label: k, value})
    }
    const children = [];
    for (let i = 0; i < data.length; i++) {
      children.push(
        <Col span={8} key={i} style={{ display: 'block'}}>
          <Form.Item label={data[i].label}>
            <span>{data[i].value}</span>
          </Form.Item>
        </Col>
      );
    }
    return children;
  }

	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<ReportSearchDom dict={this.state.dict} searchdoms={this.state.searchdoms} search={this.state.search} changeInput={this.changeInput}  />
			{this.state.searchdoms.length > 0 ? <Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button> : null}
		</div>
	</div>

	render = _ => {
		return <div className="mgrWrapper">
			{this.renderSearch()}
			<Spin spinning={this.state.loading} >
			<Form className="ant-advanced-search-form">
        <Row gutter={24}>{this.getFields()}</Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}></Col>
        </Row>
      </Form>
      </Spin>
		</div>
	}

}

export default ReportList