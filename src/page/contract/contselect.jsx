import React from 'react'
import {Button, Modal, message, Select, Divider} from 'antd'
import { getcontsalelist, getcontsaleall, highSearch } from '/api/contsale'
import { getPaperList } from '/api/global'
import Common from '/page/common.jsx'
import SearchCom from '/page/contract/searchCom.jsx'
import PreviewWall from '/components/previewWall.jsx'
import SearchComHigh from '/page/contract/searchComHigh.jsx'

class Contselect extends Common{

	async componentWillMount () {
		this.search()
	}

	async componentWillReceiveProps (nextprops) {
		if (nextprops.visible != this.props.visible && nextprops.visible) {
			this.search()
		}
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({}, this.state.pageconf, {fromDateTy: 'ge', toDateTy: 'le'}),
		columns: [{
			title: '归档号',
			dataIndex: 'fileno'
		},{
			title: '项目号',
			dataIndex: 'pkProjectCode'
		},{
			title: '合同名称',
			dataIndex: 'vcontname',
			width: '25%',
		},{
			title: '行业类型',
			dataIndex: 'pkHyname'
		},{
			title: '服务类型',
			dataIndex: 'pkServname'
		},{
			title: '签订日期',
			dataIndex: 'dsigndate',
			sorter: true
		},{
			title: '合同金额',
			dataIndex: 'ncontmny',
			sorter: true
		},{
			title: '合同份数',
			dataIndex: 'ncontnum',
			render: (t, r) => `${t}(${t-r.lockNum})`
		},{
			title: '验收报告',
			dataIndex: 'isaccept',
			render: t => t ? (t == 'Y' ? '有' : '无') : '未知'
		},{
			title: '中标通知',
			dataIndex: 'checkNotice',
			render: t => t ? (Number(t) == 1 ? '有' : '无') : '未知'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			align: 'center',
			render: (t, r) => <div><a style={{display: 'inline-block'}} onClick={async _ => {this.openPicModel(r.pkContsale, r.vbillno, r.vbillno)}}>预览</a></div>
		}],
		busitypelist: [],
		servtypelist: [],
		type: 'contsale',
		selectedtable: true,
		selecttype: 'checkbox',
		pagesizechange: true,
		modalConf: {visible: false, item: {}},
		picmodelConf: {visible: false, item: {}},
		highvisible: false,
		ishigh: false,
		searchprops: [{key: 1,leftc: '', column: '', compare: '', value: '', rightc: '', logic: ''}]
	})

	atSearch = async _ => {
		await this.setState({loading: true, selected: {}})
			let search = Object.assign({isEnabled: 1}, this.state.search)
			if (search.fromDate) search.fromDate = search.fromDate.format('YYYY-MM-DD')
			if (search.toDate) search.toDate = search.toDate.format('YYYY-MM-DD')
			if (this.props.isOriginal) search.minFileNum = 1
			return getcontsalelist(search)
			.then(res => {
				let data = res.data.records.map(val => Object.assign({}, val, {key: val.pkContsale}))
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
	// 预览
	openPicModel = (id, path, thumb) => {
		getPaperList({bid: id, type: this.state.type, thum: 'N'}).then(res => {
			if(res.code == 200){
				this.setState({id, path, thumb, fileList: res.data})
				this.setState({picmodelConf: {visible: true}})
			}
		})
	}

	search = async _ => {
		if(this.state.ishigh){
			this.highSearch()
		}else{
			this.atSearch()
		}
	}
	//选择
	selectdone = _ => {
		this.props.selectdone(this.state.selected.selectedItems)
		message.success('已选择')
	}
	//选择全部
	selectalldone = _ => {
		this.setState({loading: true})
		let search = Object.assign({isEnabled: 1}, this.state.search)
		if (search.fromDate) search.fromDate = search.fromDate.format('YYYY-MM-DD')
		if (search.toDate) search.toDate = search.toDate.format('YYYY-MM-DD')
		if(this.props.isOriginal) search.minFileNum = 1
		return getcontsaleall(search)
		.then(res => {
			if(res.code == 200){
				let data = res.data.map(val => Object.assign({}, val, {key: val.pkContsale}))
				console.log('data', data)
				this.props.selectdone(data)
				this.props.onCancel()
			}else{
				this.setState({loading: false})
			}
		})
	}

	//高级搜索
	openSearch = _ => {
		this.setState({highvisible: true})
	}
	//高级搜索
	highSearch = async _ => {
		await this.setState({loading: true, selected: {}})
		let param = Object.assign({searchprops: JSON.stringify(this.state.searchprops), group: '1'}, 
			{limit: this.state.search.limit, offset: this.state.search.offset, group: this.state.search.group, 
				sortField: this.state.search.sortField,
				sortOrder: this.state.search.sortOrder})
		param.isEnabled = 1
		highSearch(param).then(res => {
			if(res.code == 200){
				let data = res.data.records.map(val => Object.assign({}, val, {key: val.pkContsale}))
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

	renderSearch = _ => <div className="mgrSearchBar">
		<SearchCom search={this.state.search} changeSearch={this.changeSearch} />
		<Button 
		style={{ marginRight: '15px' }}
		onClick={this.atSearch}
		type="primary" icon="search">搜索</Button>
		<Button 
		onClick={this.openSearch}
		type="primary" icon="search">高级搜索</Button>
		<Button 
		style={{ marginRight: '15px' }}
		onClick={this.selectdone}
		type="primary" icon="check">选择</Button>
		{/** <Button
		style={{ marginRight: '15px' }}
		onClick={this.selectalldone}
		type="primary" icon="check">全选</Button> **/}
		<p style={{width: 170, float: 'right'}}>【已选择数量：{this.props.selectedkey.length}】</p>
	</div>


	rendermodal = _ => <div>
		<Modal title="高级搜索"
		  visible={this.state.highvisible}
		  footer={null}
		  mask={true}
		  width={1000}
		  onCancel={_ => this.setState({highvisible: false})}
		>
		<SearchComHigh data={this.state.searchprops} handler={this.highSearch} />
 		</Modal>
		<PreviewWall onCancel={_ => this.cancelform('picmodelConf')}
					 id={this.state.id}
					 type={this.state.type}
					 path={this.state.path}
					 thumb={this.state.thumb}
					 fileList={this.state.fileList}
					 config={this.state.picmodelConf} />
		</div>


}

export default Contselect