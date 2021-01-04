import React from 'react'
import { Button, Modal, Input, Icon, message, Select, Upload, Divider, Carousel } from 'antd'
import { invoicelist } from '/api/invoice'
import { getPaperList } from '/api/global'
import Common from '/page/common.jsx'

import Invoicedetail from '/page/invoice/invoicedetail.jsx'


class Invoice extends Common{

	async componentWillMount () {
		// console.log(this.props.params)
		let type = Number(this.props.params.type)
		await this.setState({type})
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({}, this.state.pageconf),
		ncsynctime: '',
		columns: [{
			title: '发票号码',
			dataIndex: 'invoiceCode'
		},{
			title: '发票代码',
			dataIndex: 'invoiceNo'
		},{
			title: '开票日期',
			dataIndex: 'invoiceDate'
		},{
			title: '发票类型',
			dataIndex: 'invoceType'
		},{
			title: '类型',
			dataIndex: 'type',
			render: t => t == 1 ? '销项发票' : '进项发票'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			align: 'center',	
			render: (t, r) => <div>
			<a style={{display: 'inline-block', width: 40}} onClick={async _ => {this.setState({detailConf: {visible: true, item: r}})}}>查看</a><Divider type="vertical" />
				<a style={{display: 'inline-block', width: 40}} onClick={async _ => {this.openItemPic(r)}}>照片</a><Divider type="vertical" />
							</div>
		}],
		type: 0,
		loading: false,
		selectedtable: false,
		detailConf: {visible: false, item: {}},
		picconf: {visibles: false, items: []}
	})

	search = async t => {
		if(!this.state.search.projcode && !this.state.search.projname && !this.state.search.cusmname){
			message.error('请录入至少一个查询条件')
			return
		}
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({type: this.state.type}, this.state.search)
		return invoicelist(search)
		.then(res => {
			let data = res.data.records.map(val => Object.assign({}, val, {key: val.id}))
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
	//打开图片
	openItemPic = (r) => {
		getPaperList({bid: r.id, type: 'invoice'}).then(res => {
			 if(res.code == 200){
			 		if(res.data.length > 0){
			 			console.log(res.data)
			 			this.setState({picconf: {visible: true, items: res.data}})
			 		}else{
			 			message.error('没有上传发票照片')
			 		}
			 }
		})
	}


	renderSearch = _ => <div className="mgrSearchBar">
		<Input 
		value={this.state.search.projcode}
		allowClear
		onChange={e => this.changeSearch({projcode: e.target.value})}
		style={{width: 300}}
		addonBefore="项目编号" placeholder="项目编号" />
		<Input 
		value={this.state.search.projname}
		allowClear
		onChange={e => this.changeSearch({projname: e.target.value})}
		style={{width: 300}}
		addonBefore="项目名称" placeholder="项目名称" />
		<Input 
		value={this.state.search.cusmname}
		allowClear
		onChange={e => this.changeSearch({cusmname: e.target.value})}
		style={{width: 300}}
		addonBefore="客商名称" placeholder="客商名称" />
		<Button 
		onClick={this.search}
		type="primary" icon="search">搜索</Button>
	</div>

	rendermodal = _ => <div>
	<Invoicedetail 
		onCancel={_ => this.setState({detailConf: {visible: false, item: {}}})}
		config={this.state.detailConf}
	/>		
	<Modal title="图片查看"
		  visible={this.state.picconf.visible}
		  footer={null}
		  mask={true}
		  width={600}
		  onCancel={_ => this.setState({picconf: {visible: false}})}
		>
		<Carousel style={{height: 600, width: 760, background: '#364d79', textAlign: 'center'}}>
    {this.state.picconf.items ? this.state.picconf.items.map(e => <div style={{width: 600, height: 760, background: '#364d79'}}>
    	<img alt={e.name} style={{ width: "98%",height:'auto' }} src={e.url} /></div>) : null}
  	</Carousel>
	 </Modal>
		</div>
	
}

export default Invoice