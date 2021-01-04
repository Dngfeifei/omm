import React from 'react'
import { Button, Modal, Icon, Select, Input, DatePicker, message, Popconfirm, InputNumber, Tooltip } from 'antd'
const { TextArea } = Input
const ButtonGroup = Button.Group
import { getBorrowPaperList, returnPaper, renewPaper, renewMutiPaper, returnMutiPaper } from '/api/branch'
import Common from '/page/common.jsx'
import moment from 'moment'
import { StatusMap } from '/api/tools'
import { getParam } from '/api/global'

class BranchOriginal extends Common{

	async componentWillMount () {
		this.search()
		getParam({code: 'cert_renew_days'}).then(res => {
			this.setState({cert_renew_days: Number(res.data) })
		})
	}

	state = Object.assign({}, this.state, {
		isAdmin: false,
		cert_renew_days: 5,
		states: [{
			code: 0,
			value: '申请中'
		},{
			code: 1,
			value: '已借出'
		},{
			code: 3,
			value: '续借中'
		}],
		search: Object.assign({}, this.state.pageconf),
		columns: [{
			title: '资料',
			dataIndex: 'name'
		},{
			title: '流程编号',
			dataIndex: 'contcode'
		},{
			title: '项目编号',
			dataIndex: 'projcode'
		},{
			title: '项目名称',
			dataIndex: 'projname'
		},{
			title: '借用人',
			dataIndex: 'username'
		},{
			title: '借用时间',
			dataIndex: 'borrowdate',
			render: t => t ? moment(t).format('YYYY-MM-DD') : ''
		},{
			title: '归还时间',
			dataIndex: 'returndate',
			render: t => t ? moment(t).format('YYYY-MM-DD') : ''
		},{
			title: '状态',
			dataIndex: 'status',
			render: (t, r) => this.getStatusName(r)
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			align: 'center',	
			render: (t, r) => this.getOperate(r)
		}],
		selectedtable: true,
		selecttype: 'checkbox', //单选还是多选
		renewnum: 0,
		renewdays: '',
		reason: '',
		rvisible: false
	})
	//获得操作按钮合集
	getOperate = r => {
		if (this.state.isAdmin){
			if ((r.status == 1 || r.status == 3) && r.papernum > r.backnum) 
				return <a style={{display: 'inline-block', width: 50}} onClick={_ => this.returnPaper(r)}>归还</a>
		}else{
			if ((r.status == 1 || r.status == 3) && r.papernum > r.backnum)
				return r.renew == 0 ? 
						<a style={{display: 'inline-block', width: 50}} onClick={_ => this.openmodal(r)}>续借</a>
					: null
		}
	}

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		if(search.fromDate) search.fromDate = search.fromDate.format('YYYY-MM-DD')
		if(search.toDate) search.toDate = search.toDate.format('YYYY-MM-DD')
		return getBorrowPaperList(search)
		.then(res => {
			let data = res.data.page.records.map(val => Object.assign({}, val, {key: val.id}))
			this.setState({
				tabledata: data, 
				loading: false,
				isAdmin: res.data.isAdmin,
				pagination: Object.assign({}, this.state.pagination, {
					total: Number(res.data.page.total),
					current: Number(res.data.page.current)
				})
			})
		})
	}
	//获得状态
	getStatusName = r => {
		if (r.papernum == r.backnum){//借用数量等于归还数量
			return '已归还'
		}else if(r.status==1 && r.renew == 1 ){
			return <Tooltip title={`续借原因:${r.remark}`}><span>续借中</span></Tooltip>
		}else if(r.status==0){
			//return StatusMap[r.status]
			return '申请中'
		}else if(r.status==1){
			return '已借出'
		}
	}
	//归还
	returnPaper = r => {
		returnPaper({detailId: r.id}).then(res => {
			if(res.code == 200){
				message.success('操作成功')
				this.state.tabledata.forEach(item => {
					if(item.id == r.id) item.backnum = 1
				})
				this.setState({tabledata: this.state.tabledata})
			}
		})
	}
	//批量归还
	returnMutiPaper = _ => {
		returnMutiPaper({detailIds: this.state.selected.selectedKeys}).then(res => {
			if(res.code == 200){
				message.success('操作成功')
				this.search()
			}
			this.setState({rvisible: false})
		})
	}
	//批量续借
	renewMutiPaper = _ => {
		if(!this.state.renewdays){
			message.error('请录入续借天数')
			return
		}
		if(!this.state.reason){
			message.error('请录入续借原因')
			return
		}
		renewMutiPaper({detailIds: this.state.selected.selectedKeys, days: this.state.renewdays, reason: this.state.reason}).then(res => {
			if(res.code == 200){
				message.success('操作成功')
				this.changemodel()
				this.search()
			}
		})
	}
	//批量续借窗口
	openmodal = async r => {
		let legal = true
		if(r){
			this.setState({renewnum: 1})
			await this.setselect(r)
		}else if(this.state.selected.selectedItems){
			this.setState({renewnum: this.state.selected.selectedItems.length})
			this.state.selected.selectedItems.forEach(r => { //判断是否满足续借要求
				if (r.papernum > r.backnum && r.renew == 0 && r.status!=0 && r.status!=2){
				}else{
					legal = false
					message.error(`证书:${r.name}; 不符合续借条件`)
				}
			})
		}
		if(legal){
			this.setState({days: '', reason: ''})
			this.changemodel()
		}
	}
	//批量归还窗口
	openrvisible = _ => {
		let legal  = true
		if(this.state.selected.selectedItems 
			&& this.state.selected.selectedItems.length>0){
			this.state.selected.selectedItems.forEach(r => {
				if (r.papernum > r.backnum && r.status!=0 && r.status!=2){
				}else{
					legal = false
					message.error(`证书:${r.name}; 不符合归还条件`)
				}})
		}else{
			legal = false
			message.error('请先选择表格中的记录')
		}
		if(legal){
			this.setState({rvisible: true})
		}
	}


	renderSearch = _ => <div className="mgrSearchBar">
		<Input 
			value={this.state.search.name}
			allowClear
			onChange={e => this.changeSearch({name: e.target.value})}
			style={{width: 300}}
			addonBefore="关键字" placeholder="证书/登记号/流程编号/项目编号" />
	  { this.state.isAdmin ? <Input
			value={this.state.search.userName}
			onChange={e => this.changeSearch({userName: e.target.value})}
			style={{width: 200}}
			addonBefore="借用人" placeholder="借用人" /> : null}
		<Select
	    allowClear = {true}
	    style={{ width: 200}}
	    onChange={t=> this.changeSearch({state: t})}
	    placeholder="状态"
	  >
	    {this.state.states.map(t => <Option value={t.code} key={t.code}>{t.value}</Option>)}
	  </Select>	
	  <DatePicker onChange={e => this.changeSearch({fromDate: e})} placeholder="归还日期起" />
		<DatePicker onChange={e => this.changeSearch({toDate: e})} placeholder="归还日期止" />
		<Button 
		onClick={this.search}
		type="primary" icon="search">搜索</Button>
		<ButtonGroup>
			{this.state.isAdmin ? 
			<Button 
			onClick={_ => this.openrvisible()}
			type="primary" icon="select">归还</Button> : 
			<Button 
			onClick={_ => this.openmodal(null)}
			type="primary" icon="plus">续借</Button>}
		</ButtonGroup>
	</div>

	rendermodal = _ => <div>
		<Modal title={`续借 共${this.state.renewnum}条记录`}
		  visible={this.state.visible}
		  onOk={this.renewMutiPaper}
		  mask={true}
		  width={400}
		  onCancel={this.changemodel}
		  okText="确认"
		  cancelText="取消"
		>
			<InputNumber value={this.state.renewdays} min={1} max={5} placeholder="续借天数" onChange={e => this.setState({renewdays: e})} />
			<TextArea value={this.state.reason} rows={3} placeholder="续借原因" style={{marginTop: 20}} length={200} onChange={e => this.setState({reason: e.target.value})} />
		</Modal>
		<Modal title="归还"
		  visible={this.state.rvisible}
		  onOk={this.returnMutiPaper}
		  mask={false}
		  width={400}
		  onCancel={_ => this.setState({rvisible: false})}
		  okText="确认"
		  cancelText="取消"
		>
		<p>共选择{this.state.selected.selectedItems ? this.state.selected.selectedItems.length : 0}条记录</p>
		{this.state.selected.selectedItems ? this.state.selected.selectedItems.map(item => <p key={item.id}>{item.name}</p>) : null}
		<p>确认归还吗</p>
		</Modal>
		</div>

}

export default BranchOriginal