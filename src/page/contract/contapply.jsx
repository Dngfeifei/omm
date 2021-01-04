import React from 'react'
import { Button, Modal, Icon, Divider } from 'antd'
import { getcontsalelist, exportContsales } from '/api/contsale'
import { getPaperList } from '/api/global'
import { vbillMap,  iprojMap, dealBlob } from '/api/tools'
import Common from '/page/common.jsx'
import ContractIndex from '/page/contract/contractIndex.jsx'
import PreviewWall from '/components/previewWall.jsx'
import SearchCom from '/page/contract/searchCom.jsx'
import ContractOccupy from '/page/contract/contractOccupy.jsx'

class Contapply extends Common{

	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({}, this.state.pageconf, {fromDateTy: 'ge', toDateTy: 'le'}),
		columns: [{
			title: '项目号',
			dataIndex: 'pkProjectCode'
		},{
			title: '合同名称',
			dataIndex: 'vcontname',
			width: '16%',
		},{
			title: '客户',
			dataIndex: 'pkCumanname',
			width: '16%',
		},{
			title: '行业类型',
			dataIndex: 'pkHyname'
		},{
			title: '服务类型',
			dataIndex: 'pkServname'
		},{
			title: '签订日期',
			dataIndex: 'dsigndate',
			render: (t, r) => this.getBlurryTime(t)
		},{
			title: '合同金额',
			dataIndex: 'ncontmny',
			render: (t, r) => this.getBlurryAmount(t)
		},{
			title: '合同份数',
			dataIndex: 'ncontnum',
			render: (t, r) => <a href="#" onClick={_ => this.showHistory(r.pkContsale)}>{t}({t-r.lockNum})</a>
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
			render: (t, r) => <div><a style={{display: 'inline-block'}} onClick={async _ => {this.addpane(r)}}>查看</a>
			<Divider type="vertical" />
			<a style={{display: 'inline-block'}} onClick={async _ => {this.openPicModel(r.pkContsale, r.vbillno, r.vbillno)}}>预览</a></div>
		}],
		type: 'contsale',
		loading2: false,
		selectedtable: false,
		modalConf: {visible: false, item: {}},
		occupyconf: {visible: false, item: {}},
		picmodelConf: {visible: false, item: {}}
	})

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({isEnabled: 1}, this.state.search)
		if (search.fromDate) search.fromDate = search.fromDate.format('YYYY-MM-DD')
		if (search.toDate) search.toDate = search.toDate.format('YYYY-MM-DD')
		return getcontsalelist(search)
		.then(res => {
			let data = res.data.records.map(val => Object.assign({}, val, {key: val.pkContsale}))
			this.setState({
				tabledata: data, 
				loading: false,
				pagination: Object.assign({}, this.state.pagination, {
					total: Number(res.data.total),
					current: Number(res.data.current)
				})
			})
		})
	}

	openPicModel = (id, path, thumb) => {
		// thum： 是否获得缩略图
		getPaperList({bid: id, type: this.state.type, thum: 'Y'}).then(res => {
			 if(res.code == 200){
			 		this.setState({id, path, thumb, fileList: res.data})
					this.setState({picmodelConf: {visible: true}})
			 }
		})
	}
	//查看借用记录
	showHistory = t => {
		this.setState({occupyconf: {visible: true, contsaleId: t}})
	}
	done = async _ => {
		let modalConf = {visible: false, item: {}}
		await this.setState({ modalConf })
		this.research()
	}

	//导出
	export = _ => {
		this.setState({loading2: true})
		let search = Object.assign({isEnabled: 1}, this.state.search)
		if (search.fromDate) search.fromDate = search.fromDate.format('YYYY-MM-DD')
		if (search.toDate) search.toDate = search.toDate.format('YYYY-MM-DD')
		exportContsales(search).then(blob => {
			if(blob) dealBlob(blob, '案例列表导出.xlsx')
			this.setState({loading2: false})
		})
	}
	//获得模糊时间
	getBlurryTime = t => {
		return moment(new Date()).diff(moment(new Date(t)), 'year') + 1 + '年内'
	}
	//获得模糊金额
	getBlurryAmount = t => {
		if(t < 50 * 10000){
			return '0-50万'
		}else if(t <= 100 * 10000){
			return '50-100万'
		}else if(t >= 1000 * 10000){
			return '1000万以上'
		}else {
			let floor = Math.floor(t/1000000) 
			let ceil = Math.ceil(t/1000000)
			if(ceil == floor) ceil = ceil + 1
			return `${floor}00万-${ceil}00万`
		}
	}

	addpane = async r => {
		await window.remove('contractIndex')
		let pane = {
			title: '合同明细',
			key: 'contractIndex',
			url: 'contractIndex',
			params: {
				id: r.pkContsale,
				readonly: true
			}
		}
		window.add(pane)
	}
	addapply = _ => {
		let pane = {
			title: '案例申请单',
			key: 'contapplyForm',
			url: 'contapplyForm',
		}
		window.add(pane)
	}

	renderSearch = _ => <div className="mgrSearchBar">
		<SearchCom search={this.state.search} changeSearch={this.changeSearch} />
		<Button 
		onClick={this.search}
		type="primary" icon="search">搜索</Button>
		<Button 
		onClick={this.export}
		type="primary" icon="download" loading={this.state.loading2}>导出列表</Button>
		<Button 
		onClick={this.addapply}
		type="primary" icon="profile">申请</Button> 
	</div>

	rendermodal = _ =><div>
	<ContractOccupy 
		onCancel={_ => this.setState({occupyconf: {visible: false}})}
		config={this.state.occupyconf}  /> 
		<PreviewWall onCancel={_ => this.cancelform('picmodelConf')}
		id={this.state.id}
		type={this.state.type}
		path={this.state.path}
		thumb={this.state.thumb}
		fileList={this.state.fileList}
		config={this.state.picmodelConf} /></div>

}

export default Contapply