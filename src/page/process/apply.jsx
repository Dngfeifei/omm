import React from 'react'
import { Input, Button, Icon, Modal, message, DatePicker, Tag, Spin, Divider } from 'antd'
import { getMineList, getTodoList, getDoneList, getProcessImg, cancelProcess, downloadURL, retrievePass } from '/api/process'
import { getRoleNames } from '/api/mgr'
import Common from '/page/common.jsx'
import ApplyForm from '/page/process/applyForm.jsx'
import ApplyContsaleForm from '/page/process/applyContsaleForm.jsx'
import ApplyStaffForm from '/page/process/applyStaffForm.jsx'
import ApplyStoreForm from '/page/process/applyStoreForm.jsx'
const { RangePicker } = DatePicker
import { downloadByUrl } from '/api/tools'
import moment from "moment";


class Apply extends Common{

	async componentWillMount () {
		let pathname=this.props.params.grpath
		if(pathname.indexOf('applymine') > -1){
			this.setState({pathName: 'applymine',auth: false, searchFun: getMineList})
		}else if(pathname.indexOf('applytodo') > -1){
			this.setState({pathName: 'applytodo',auth: true, searchFun: getTodoList})
		}else {
			this.setState({pathName: 'applydone',auth: false, searchFun: getDoneList})
		}
		this.setState({userId: localStorage.getItem('userid')})
		this.search()
		//获得检查权限的信息
		this.getAuth()
	}

	state = Object.assign({}, this.state, {
		userId: '',//当前登录人
		pathName: '',
		auth: false,
		roleobj: {},
		searchFun: '',
		search: Object.assign({condition: ''}, this.state.pageconf),
		columns: [{
			title: '状态',
			dataIndex: 'status',
			render: t => {
				if (t == '审核中'){
					return <Tag color="blue">{t}</Tag>
				}else if (t == '已拒绝' || t == '已撤回'){
					return <Tag color="volcano">{t}</Tag>	
				}else{
					return <Tag color="lime">{t}</Tag>
				}
			}
		},{
			title: '停留时间',
			dataIndex: 'waitTime'
		},{
			title: '流程标题',
			dataIndex: 'instanceName',
			width: '260px'
		},{
			title: '流程编号',
			dataIndex: 'instanceCode',
			render: (t, r) => r.contApply ? r.contApply.code : ''
		},{
			title: '提交人',
			dataIndex: 'createUser'
		},{
			title: '提交时间',
			dataIndex: 'createTime'
		},{
			title: '希望反馈时间',
			dataIndex: 'backDate',
			render: (t, r) => r.contApply ? <span>{r.contApply.backDate}{r.contApply.urgent == 1 ? <Tag color="red">加急</Tag> : null}</span> : null
		},{
			title: '当前节点',
			dataIndex: 'taskName'
		},{
			title: '流程图',
			dataIndex: 'process-pic',
			render: (t, r) => r.status == '审核中' ? <Icon type="eye" onClick={async _ => {this.showProcessPic(r)}} /> : null
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			width: '100px',
			render: (t, r) => <Spin spinning={this.state.spins[r.id] == '1'}><a style={{display: 'inline-block'}} onClick={async _ => {this.openForm(r)}}>查看</a>
				<Divider type="vertical" />
				{this.getOperate(r)}
			</Spin>
		}],
		selectedtable: false,
		loading: true,
		tabledata: [],
		spins: [],
		concelconf: {visible: false, item: {}},
		modalconf: {visible: false, item: {}},
		contsaleconf: {visible: false, item: {}},
		staffconf: {visible: false, item: {}},
		storeconf: {visible: false, item: {}},
		picmodelConf: {visible: false, item: {}},
		processimg: {visible: false, src: null}
	})


	search = async () => {
		await this.setState({loading: true})
		let search = Object.assign({}, this.state.search)
		this.handleTime(search, 'startDate')
		this.handleTime(search, 'endDate')
		return this.state.searchFun(search)
		.then(res => {
			let spins = {}
			let data = res.data.records.map(val => {
				let baseItem = Object.assign({}, val, { key: val.id })
				spins[val.id] = 0
				return baseItem
			})
			this.setState({
				tabledata: data, 
				loading: false,
				pagination: Object.assign({}, this.state.pagination, {
					total: Number(res.data.total),
					current: Number(res.data.current)
				}),
				spins
			})
		})
	}
	//获得用户权限
	getAuth = _ => {
		getRoleNames().then(res => {
			this.setState({roleobj: res.data})
		})
	}
  //查看流程图
	showProcessPic = r => {
		getProcessImg({id: r.id}).then(res => {
      var url = URL.createObjectURL(res);
      this.setState({processimg: {visible: true, src: url}})
		})
	}
	//我的申请完成后的后续操作按钮
	getOperate = r => {
		if(this.props.params.grpath.indexOf('applymine') > -1 && r.status == '已完成'){//我的申请并且已完成
			if(r.contApply && (r.contApply.type == 'certp' || r.contApply.type == 'staffp') ){
				return null
			}else { //在有效期内
				return <a style={{display: 'inline-block'}} onClick={async _ => {this.download(r)}}>下载</a>
			}
		}
		if(this.props.params.grpath.indexOf('applymine') > -1 && r.status == '审核中' && r.starting == 1){//我的申请刚开始，无审核
			return <a style={{display: 'inline-block'}} onClick={async _ => {this.cancelApply(r)}}>撤回</a>
		}
	}

	//打开详情
	openForm = r => {
		//打开案例页面
		if(r.contApply && r.contApply.type == 'contsale'){
			// 合同管理员可以勾选原件
			r.paperEdit = this.state.roleobj.roles.indexOf('合同管理员') > -1
			r.canedit = (this.state.roleobj.roles.indexOf('项目管理员') > -1 || r.paperEdit) && this.state.auth
			//是否是申请人本人
			r.ismine = r.contApply.userId == this.state.userId
			this.setState({contsaleconf: {visible: true, title: r.instanceName, item: r}})			
		}else if(r.contApply && r.contApply.type == 'allstaff' ){
			r.paperEdit = this.state.roleobj.roles.indexOf('人员资质原件审核人') > -1
			r.canedit = (this.state.roleobj.roles.indexOf('人员资质扫描件审核人') > -1 || r.paperEdit) && this.state.auth
			//是否是申请人本人
			r.ismine = r.contApply.userId == this.state.userId
			r.contApply.canedit = r.canedit
			this.setState({staffconf: {visible: true, title: r.instanceName, item: r}})
		}else if(r.contApply && r.contApply.type == 'storageexcel'){
			r.canedit = this.state.roleobj.roles.indexOf('备件库审核人') > -1 && this.state.auth
			r.contApply.canedit = r.canedit
			//是否是申请人本人
			r.ismine = r.contApply.userId === this.state.userId
			this.setState({storeconf: {visible: true, title: r.instanceName, item: r}})
		}else{
			this.setState({modalconf: {visible: true, title: r.instanceName, item: r}})
		}
	}

	//撤回
	cancelApply = r => {
		if(!this.state.concelconf.visible){
			this.setState({concelconf: {visible: true, item: r}})
			return
		}
		cancelProcess({processId: this.state.concelconf.item.id}).then(res => {
			if(res.code == 200){
				message.success('撤回成功')
				this.setState({concelconf: {visible: false, item: {}}})
				this.search()
			}
		})
	}

	done = _ => {
		this.search()
	}
	//下载
	download = r => {
		if(r.contApply && r.contApply.endTime && moment(new Date).diff(r.contApply.endTime, 'day') > 7){
			// console.log(moment(new Date).diff(r.contApply.endTime, 'day'))
			message.error('资料申请审核通过后，7天内下载有效')
			return
		}
		let spins =  Object.assign({}, this.state.spins)
		spins[r.id] = '1'
		this.setState({spins})
		this.downloadZip(r)
		
	}
	clearSpin = r => {
		let spins =  Object.assign({}, this.state.spins)
    spins[r.id] = '0'
		this.setState({spins})
	}
	//下载压缩影像文件
	downloadZip = r => {
		let url = downloadURL + `?id=${r.id}&token=` + localStorage.getItem('token')
		downloadByUrl(url)
		setTimeout(_ => this.clearSpin(r), 3000);
	}


	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<RangePicker 
			onChange={dates => this.changeSearch({startDate: dates[0], endDate: dates[1]})}
			value={[this.state.search.startDate, this.state.search.endDate]}
			className="search"
			placeholder={['开始日期', '结束日期']} />
			<Input 
			value={this.state.search.condition}
			allowClear
			onChange={e => this.changeSearch({condition: e.target.value})}
			addonBefore="关键字" placeholder="流程标题/流程编号/申请人" />
			<Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
			<p style={{color: 'red', display: 'inline-block'}}>资料申请审核通过后，7天内下载有效</p>
		</div>
	</div>

	renderBtn = _ => <div>

	</div>

	rendermodal = _ => <div>
	<ApplyStaffForm config={this.state.staffconf} 
		auth={this.state.auth}
		onCancel={_ => this.cancelform('staffconf')}
		done={this.done}  />
	<ApplyContsaleForm config={this.state.contsaleconf} 
		auth={this.state.auth}
		onCancel={_ => this.cancelform('contsaleconf')}
		done={this.done}  />
	<ApplyStoreForm config={this.state.storeconf}
		auth={this.state.auth}
		onCancel={_ => this.cancelform('storeconf')}
		done={this.done}  />
	<ApplyForm config={this.state.modalconf}
			   auth={this.state.auth}
			   onCancel={_ => this.cancelform('modalconf')}
			   done={this.done}  />
	<Modal title="信息" visible={this.state.concelconf.visible} onOk={this.cancelApply}
		   mask={false} width={400} onCancel={_ => this.setState({concelconf: {visible: false, item: {}}})}
		   okText="确认" cancelText="取消">
		<p>撤回后流程直接中止，是否确认撤销？</p>
	</Modal>
	<Modal title="流程图"
		  visible={this.state.processimg.visible}
		  footer={null}
		  mask={true}
		  width={1100}
		  onCancel={_ => this.setState({processimg:{visible: false}})}
		>
			<img src={this.state.processimg.src} />
		</Modal></div>

}

export default Apply