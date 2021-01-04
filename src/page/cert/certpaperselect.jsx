import React from 'react'
import { Input, Button, Icon, Modal, message, TreeSelect, Select } from 'antd'
import { getCertPaperList, getCertColumns } from '/api/cert'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import { getDictSelect } from '/api/dict'
import { handleTreeData } from '/api/tools'

class CertPaperSelect extends Common{
	async componentWillMount () {
		this.search()
		this.getTypeTreeData()
		this.getCompanys()
	}

	state = Object.assign({}, this.state, {
		typeTreeData: [],
		companys: [],
		search: Object.assign({typeCode: ''}, this.state.pageconf),
		columns: [{
			title: '证书类型',
			dataIndex: 'typeName'
		},{
			title: '名称',
			width: 260,
			dataIndex: 'name'
		},{
			title: '登记号',
			dataIndex: 'code'
		},{
			title: '公司',
			dataIndex: 'corpName'
		},{
			title: '纸质证书',
			dataIndex: 'paperName'
		},{
			title: '总数量',
			dataIndex: 'paperNum'
		},{
			title: '可用数量',
			dataIndex: 'paperNumAble'
		},{
			title: '备注',
			dataIndex: 'remark'
		}],
		selectedtable: true,
		selecttype: 'checkbox',
		pagesizechange: true,
		loading: true,
		tabledata: [],
		modalconf: {visible: false, item: {}}
	})

	getTypeTreeData = _ => {
		getDictSelect({dictcode: 'aptitude'}).then(res => {
			let treeData = handleTreeData(res.data, 'name', 'code', 'children', true)
			this.setState({typeTreeData: treeData})
		})
	}
	getCompanys = _ => {
		getDictSelect({dictcode: 'companys'}).then(res => {
			this.setState({companys: res.data})
		})
	}

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		return getCertPaperList(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.paperId })
				return baseItem
			}))(res.data.records)
			this.setState({
				tabledata: data, 
				loading: false,
				pagination: Object.assign({}, this.state.pagination, {
					total: Number(res.data.total),
					current: Number(res.data.current)
				})
			})
			console.log(res.data)
			//如果按证书分类查询，则显示所有内容
			if(search.typeCode) this.addCustomColumns(search.typeCode)
		})
	}
	//动态添加自定义字段
	addCustomColumns = typeCode => {
		getCertColumns({code: typeCode}).then(res => {
			let columns = []
			this.state.columns.map(t => {
				if(!t.custom) columns.push(t)
			})
			res.data.forEach(item => {
				columns.splice(-1, 0, {title: item.name, dataIndex: item.id, custom: true})
			})
			this.setState({columns})
		})

		if(this.state.tabledata.length > 0){
			let tabledata = []
			this.state.tabledata.forEach(item => {
				item.certDetails.forEach(t => {
					item[t.columnId+''] = t.content
				})
				tabledata.push(item)
			})
			this.setState({tabledata})
		}
	}

	selectdone = _ => {
		this.props.selectdone(this.state.selected.selectedItems)
		this.props.onCancel()
	}

	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<TreeSelect style={{ width: 200 }} allowClear={true}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={this.state.typeTreeData}
        placeholder="选择证书类型"
        treeDefaultExpandAll
        onChange={e => this.changeSearch({typeCode: e})} />
      <Select style={{ width: 300 }} allowClear={true} placeholder="选择公司" onChange={e => this.changeSearch({pkCorp: e})}>
			    {this.state.companys.map(t => <Option key={t.code} value={t.code}>{t.name}</Option>) }
			  </Select>
			<Input 
			value={this.state.search.name}
			allowClear
			onChange={e => this.changeSearch({name: e.target.value})}
			addonBefore="关键字" placeholder="证书名称、登记号" />   

			<Button 
		style={{ marginRight: '15px' }}
		onClick={this.search}
		type="primary" icon="search">搜索</Button>
		<Button 
		onClick={this.selectdone}
		type="primary" icon="check">选择</Button> 
		</div>
	</div>

	rendermodal = _ => <div></div>

}

export default CertPaperSelect