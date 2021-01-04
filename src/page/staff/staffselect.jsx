import React from 'react'
import {Input, Button, message, Modal, Icon, Drawer, TreeSelect} from 'antd'
const InputGroup = Input.Group
import { getStaffList, highSearch } from '/api/staff'
import { getCompanys } from '/api/dict'
import { handleTreeData } from '/api/tools'
import Common from '/page/common.jsx'
import StaffForm from '/page/staff/staffForm.jsx'
import StaffSearchHigh from '/page/staff/staffSearchHigh.jsx'

class Staffselect extends Common{
	async componentWillMount () {
		this.search()
		//获得公司信息
		getCompanys({}).then(res => {
			this.setState({companys: handleTreeData(res.data, 'name', 'code', 'children')})
		})
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({pkCorp: '1002'}, this.state.pageconf),
		companys: [],
		columns: [{
			title: '名称',
			dataIndex: 'name'
		},{
			title: '公司',
			dataIndex: 'corpName'
		},{
			title: '部门',
			dataIndex: 'deptName'
		},{
			title: '职务',
			dataIndex: 'postName'
		},{
			title: '工作省份',
			dataIndex: 'province'
		},{
			title: '地市',
			dataIndex: 'city'
		},{
			title: '入职时间',
			dataIndex: 'entryDate'
		}, {
			title: '预览',
			dataIndex: 'operator',
			render: (t, r) => <a title="预览" ><Icon type="search" onClick={_ => this.showView(r.id)} /></a>
		}],
		selected: {},
		loading: true,
		tabledata: [],
		selectedtable: true,
		selecttype: 'checkbox',
		pagesizechange: true,
		modalconf: {visible: false, item: {}},
		ishigh: false,
		highvisible: false,
		activitId: null,
		searchprops: [{key: 0, leftc: '(', rightc: ')', logic: 'and'}],
		searchchilds: [[{key: 0, leftc: '(', rightc: ')', logic: 'and'}]],
	})
	//预览信息
	showView = id => {
		this.setState({activitId: id, dvisible: true})
	}
	atSearch = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({mpstatus: '在职'}, this.state.search)
		return getStaffList(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.id })
				return baseItem
			}))(res.data.records)
			this.setState({
				ishigh: false,
				tabledata: data, 
				loading: false,
				pagination: Object.assign({}, this.state.pagination, {
					total: Number(res.data.total),
					current: Number(res.data.current)
				})
			})
		})
	}

	search = _ => {
		if(this.state.ishigh){
			this.highSearch()
		}else{
			this.atSearch()
		}
	}

	selectdone = _ => {
		this.props.selectdone(this.state.selected.selectedItems)
		// this.props.onCancel()
		message.success('已选择')
	}

	//高级查询
	//高级搜索
	highSearch = async _ => {
		await this.setState({loading: true, selected: {}})
		const searchprops = [...this.state.searchprops]
		//未选择公司时，默认股份
		const pkcorps = searchprops.filter(e => e.column === 'pk_corp');
		if(pkcorps.length === 0){
			searchprops.splice(0, 0, {key: 0, leftc: '(', column:'pk_corp', compare: '=',
				value : '1002',  rightc: ')', logic: 'and'});
		}
		let param = Object.assign({searchprops: JSON.stringify(searchprops),
				childs: JSON.stringify(this.state.searchchilds)},
			{limit: this.state.search.limit, offset: this.state.search.offset})
		highSearch(param).then(res => {
			if(res.code == 200){
				let data = res.data.records.map(val => Object.assign({}, val, {key: val.id}))
				this.setState({
					ishigh: true,
					tabledata: data,
					loading: false,
					pagination: Object.assign({}, this.state.pagination, {
						total: Number(res.data.total),
						current: Number(res.data.current)
					})
				})
				this.setState({highvisible: false})
			}
		})
	}

	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<TreeSelect size='small' style={{ width: 260 }} allowClear
						dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
						value={this.state.search.pkCorp}
						onChange={e => this.changeSearch({pkCorp: e})}
						treeData={this.state.companys}
						placeholder="请选择公司"
						treeDefaultExpandAll/>
			<Input
			style={{width: 200}}
			value={this.state.search.name}
			allowClear
			onChange={e => this.changeSearch({name: e.target.value})}
			addonBefore="名称" placeholder="输入名称" />
			<Input
			style={{width: 200}}
			value={this.state.search.city}
			onChange={e => this.changeSearch({city: e.target.value})}
			addonBefore="工作地市" placeholder="" />
			<Input
			style={{width: 200}}
			value={this.state.search.dept}
			onChange={e => this.changeSearch({dept: e.target.value})}
			addonBefore="部门" placeholder="" />
			<Input
			style={{width: 200}}
			value={this.state.search.socialinsure}
			onChange={e => this.changeSearch({socialinsure: e.target.value})}
			addonBefore="社保缴纳地" placeholder="" />
			<InputGroup compact style={{width: 300, display: 'inline-block'}}>
        <Input value={this.state.search.minyear} type='number'
        	onChange={e => this.changeSearch({minyear: e.target.value})}
        style={{ width: 100, textAlign: 'center' }} placeholder="工作年限" />
        <Input
          style={{
            width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff',
          }}
          placeholder="~"
          disabled
        />
        <Input value={this.state.search.maxyear} type='number'
        	onChange={e => this.changeSearch({maxyear: e.target.value})}
        style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="工作年限" />
      </InputGroup>
			<Input
			style={{width: 300}}
			value={this.state.search.certname}
			allowClear
			onChange={e => this.changeSearch({certname: e.target.value})}
			addonBefore="证书" placeholder="输入证书名称/简称/厂商" />
			<Button 
			onClick={this.atSearch}
			type="primary" icon="search">搜索</Button>
			<Button
				onClick={_ => this.setState({highvisible: true})}
				type="primary" icon="search">高级搜索</Button>
			<Button 
			onClick={this.selectdone}
			type="primary" icon="check">选择</Button>
			<p style={{width: 170, float: 'right'}}>【已选择数量：{this.props.selectedkey.length}】</p>
		</div>
	</div>

	rendermodal = _ => <div>
		<Modal title="高级搜索"
			   visible={this.state.highvisible}
			   footer={null}
			   mask={true}
			   width={1000}
			   onCancel={_ => this.setState({highvisible: false})} >
			<StaffSearchHigh   data={this.state.searchprops}	 childs={this.state.searchchilds}
							   handler={this.highSearch}
							   refresh={_ => this.setState({searchprops: [...this.state.searchprops]})}
							   refreshChild={_ => this.setState({searchchilds: [...this.state.searchchilds]})} />
		</Modal>
		<Drawer
			width={940}
			placement="right"
			closable={true}
			onClose={_ => this.setState({dvisible: false})}
			visible={this.state.dvisible}
		><StaffForm params={{id: this.state.activitId, readonly: true}} /></Drawer>
	</div>

}

export default Staffselect