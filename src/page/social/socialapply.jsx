import React from 'react'
import { Input, Button, Icon, Modal, message, DatePicker, Upload, Select } from 'antd'
import { getsociallist } from '/api/social'
import { getPaperList, downloadMutiMarkZip, downloadPathURL } from '/api/global'
const { MonthPicker } = DatePicker
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import SocialForm from '/page/social/socialForm.jsx'
import SocialDetailList from '/page/social/socialDetailList.jsx'
import { getDictSelectMuti } from '/api/dict'
import { dealBlob, downloadByUrl } from '/api/tools'

class Socialapply extends Common{
	async componentWillMount () {
		this.getcompanys()
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({username: '', city: ''}, this.state.pageconf),
		companys: [],
		columns: [{
			title: '公司',
			dataIndex: 'corpName'
		},{
			title: '月份',
			dataIndex: 'month'
		},{
			title: '缴纳地',
			dataIndex: 'city'
		},{
			title: '创建时间',
			dataIndex: 'createTime'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			render: (t, r) => <div><a style={{display: 'inline-block', width: 120}} onClick={async _ => {this.openDetail(r)}}>查看缴纳名单</a>
			</div>
		}],
		loading: false,
		tabledata: [],
		selectedtable: true,
		selecttype: 'checkbox',
		type: 'social',
		detailconf: {visible: false, item: {}},
		picmodelConf: {visible: false, item: {}}
	})

	getcompanys = _ => {
		let codeList = ['companys']
		getDictSelectMuti({codeList}).then(res => {
			codeList.forEach(key => {
				this.setState(res.data)
			})
		})
	}

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		if(search.start) search.start = search.start.format('YYYY-MM')
		if(search.end) search.end = search.end.format('YYYY-MM')
		return getsociallist(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.id })
				return baseItem
			}))(res.data.records)
			this.setState({
				tabledata: data, 
				loading: false,
				pagination: Object.assign({}, this.state.pagination, {
					total: res.data.total,
					current: res.data.current
				})
			})
		})
	}

	openDetail = r => {
		this.setState({detailconf: {visible: true, item: r}})
	}

	openPicModel = (id, path, thumb) => {
		getPaperList({bid: id, type: this.state.type, thum: 'Y'}).then(res => {
			 if(res.code == 200){
			 		this.setState({id, path, thumb, fileList: res.data})
					this.setState({picmodelConf: {visible: true}})
			 }
		})
	}
	// 暂时不使用
	addapply = _ => {
		let pane = {
			title: '社保申请单',
			key: 'socialapplyForm',
			url: 'socialapplyForm'
		}
		if (parent.add) {
			parent.add(pane)
		} else {
			this.props.add(pane)
		}
	}	
	//多份资料打包下载
  downloadMuti = async flag => {
  	const filename = flag == 1 ? '社保明细' : '社保凭证'
  	const btnname = flag == 1 ? 'picLoading1' : 'picLoading2'
		if (this.state.selected.selectedKeys && this.state.selected.selectedKeys.length) {
			const params = this.state.selected.selectedItems.map(e => {
				return {type: flag == 1 ? 'social-detail' : 'social', 
								bid: e.id, name: `${e.city}-${e.month}(${e.corpName})`}
			})
			var btnObj = {}
			btnObj[btnname] = true
			this.setState(btnObj)
			downloadMutiMarkZip(params).then(res => {
	      const name = filename + '电子资料.zip'
	      btnObj[btnname] = false
	      this.setState(btnObj)
	      let url = downloadPathURL + `?path=${res.data}&name=${name}&token=` + localStorage.getItem('token')
				downloadByUrl(url)
	    })
		} else {
			message.warning('请至少选中表格中的一条记录！')
		}
  }

	renderSearch = _ =>
		<div className="mgrSearchBar">
			<Select allowClear={true} style={{width: 200}} placeholder="选择公司" onChange={t =>this.changeSearch({pkCorp: t}) } >
		    {this.state.companys.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
		  </Select>
			<Input 
			style={{width: 200}}
			value={this.state.search.username}
			allowClear
			onChange={e => this.changeSearch({username: e.target.value})}
			addonBefore="人员" placeholder="人员" />
			<Input 
			style={{width: 200}}
			value={this.state.search.city}
			allowClear
			onChange={e => this.changeSearch({city: e.target.value})}
			addonBefore="缴纳地" placeholder="缴纳地" />
			<MonthPicker placeholder="开始月份" onChange={v => this.changeSearch({start: v})} />
			<MonthPicker placeholder="截止月份" onChange={v => this.changeSearch({end: v})}/>
			<Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
			<Button 
			onClick={_ => this.downloadMuti(1)}
			type="primary" icon="profile" loading={this.state.picLoading1}>下载社保明细</Button> 
			<Button 
			onClick={_ => this.downloadMuti(2)}
			type="primary" icon="profile" loading={this.state.picLoading2}>下载社保凭证</Button> 
		</div>


	rendermodal = _ => <div>
		<SocialDetailList 
		onCancel={_ => this.setState({detailconf: {visible: false, item: {}}})}
		config={this.state.detailconf} />
		</div>
}

export default Socialapply