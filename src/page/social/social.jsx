import React from 'react'
import { Input, Button, Icon, Modal, message, DatePicker, Upload, Select, Divider } from 'antd'
import { getsociallist, deletesocial, exportSocials, importURL, syncSocialData  } from '/api/social'
import { getPaperList } from '/api/global'
const { MonthPicker } = DatePicker
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import SocialForm from '/page/social/socialForm.jsx'
import SocialDetailForm from '/page/social/socialDetailForm.jsx'
import PaperWall from '/components/PaperWall.jsx'
import { dealBlob } from '/api/tools'
import { getDictSelectMuti } from '/api/dict'

class Social extends Common{
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
			render: (t, r) => <div><a style={{display: 'inline-block'}} onClick={async _ => {this.openDetail(r.id)}}>缴纳名单</a>
			<Divider type="vertical" />
			<a style={{display: 'inline-block'}} onClick={async _ => {this.openPicModel(r.id, r.path, r.thumb, 1)}}>社保凭证</a>
			<Divider type="vertical" />
			<a style={{display: 'inline-block'}} onClick={async _ => {this.openPicModel(r.id, `${r.path}-detail`, `${r.thumb}-detail`, 2)}}>社保明细</a>
			</div>
		}],
		selected: {},
		loading: true,
		tabledata: [],
		id: undefined,
		type: 'social',
		path: '',
		thumb: '',
		fileList: [],
		uploadconf: {visible: false, fileList: []},
		modalconf: {visible: false, item: {}},
		detailconf: {visible: false, item: {}},
		picmodelConf: {visible: false, item: {}},
		month: '',
		syncmodel: {visible: false}
	})


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

	getcompanys = _ => {
		let codeList = ['companys']
		getDictSelectMuti({codeList}).then(res => {
			codeList.forEach(key => {
				this.setState(res.data)
			})
		})
	}

	openDetail = (id) => {
		this.setState({detailconf: {visible: true, item: {id}}})
	}

	openPicModel = (id, path, thumb, flag) => {
		const type = flag == 1 ? 'social' : 'social-detail'
		this.setState({type})
		getPaperList({bid: id, type: type}).then(res => {
			 if(res.code == 200){
			 		this.setState({id, path, thumb, fileList: res.data})
					this.setState({picmodelConf: {visible: true}})
			 }
		})
	}

	deleteback = _ => {
		this.search()
	}
	delete = _ => {
		this.handleOk(deletesocial, 'id', '删除', 'deleteback')
	}

	done = async _ => {
		let type = this.state.modalconf.type
		let config = {}
		config.modalconf = {visible: false, item: {}}
		this.setState(config)
		if (type == 'add') {
			this.research()
		} else {
			await this.setState({selected: {}})
			this.search()
		}
	}

	openupload = _ => {
		let token = localStorage.getItem('token') || ''
		this.setState({token, uploadconf: {visible: true, fileList: []}})
	}

	downloadTemplate = _ => {// 导出模版
		exportSocials({dictid: 0}).then(blob => {
			if(blob) dealBlob(blob, '社保信息导入模版.xlsx')
		})
	}

	handleChange = ({ file, fileList }) => { 
    if(file.status == 'done'){
  		if(file.response.data && file.response.data.length>0){
  			message.error(file.response.data.map((t, i) => <p key={i}>{t}</p>))
  		}else{
  			message.success('导入成功')
  		}
    }
    this.setState({uploadconf: {visible: true, fileList}})
  }

  //同步数据
  syncData = _ => {
  	if(this.state.month){
  		syncSocialData({month: this.state.month.format('YYYY-MM')}).then(res => {
  			if(res.code == 200) {
  				message.success('同步成功')
  				this.setState({syncmodel: {visible: false}})
  				this.search()
  			}
  		})
  	}else{
  		message.error('请先选择同步月份')
  	}
  }

	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<Select allowClear={true} style={{width: 200}} placeholder="选择公司" onChange={t =>this.changeSearch({pkCorp: t})}>
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
			allowClearÏ		
			onChange={e => this.changeSearch({city: e.target.value})}
			addonBefore="缴纳地" placeholder="缴纳地" />
			<MonthPicker placeholder="开始月份" onChange={v => this.changeSearch({start: v})} />
			<MonthPicker placeholder="截止月份" onChange={v => this.changeSearch({end: v})}/>
			<Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
		</div>
	</div>

	renderBtn = _ => <div>
	<ButtonGroup>
		<Button 
		onClick={_ => this.addmodal('modalconf', '添加模版')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('modalconf', '编辑模版')}
		type="primary" icon="edit">修改</Button>
		<Button 
		onClick={this.changemodel}
		type="primary" icon="close">删除</Button>
		<Button 
		onClick={this.openupload}
		type="primary" icon="upload">导入</Button>
		<Button 
		onClick={_ => this.setState({syncmodel: {visible: true}})}
		type="primary" icon="sync">同步</Button>
	</ButtonGroup>
	</div>

	rendermodal = _ => <div><SocialForm 
		onCancel={_ => this.cancelform('modalconf')}
		done={_ => this.done()}
		config={this.state.modalconf} />
		<SocialDetailForm 
		onCancel={_ => this.setState({detailconf: {visible: false, item: {}}})}
		done={_ => this.done()}
		config={this.state.detailconf} />
		<PaperWall onCancel={_ => this.cancelform('picmodelConf')}
		id={this.state.id}
		type={this.state.type}
		path={this.state.path}
		thumb={this.state.thumb}
		fileList={this.state.fileList}
		config={this.state.picmodelConf} />
		<Modal title="信息"
		  visible={this.state.visible}
		  onOk={this.delete}
		  mask={false}
		  width={400}
		  onCancel={this.changemodel}
		  okText="确认"
		  cancelText="取消"
		>
			<p>是否删除？</p>
		</Modal>
		<Modal title="同步社保缴纳地数据"
		  visible={this.state.syncmodel.visible}
		  onOk={this.syncData}
		  mask={false}
		  width={400}
		  onCancel={_ => this.setState({syncmodel: {visible: false}})}
		  okText="确认"
		  cancelText="取消"
		>
			<MonthPicker placeholder="同步月份" style={{width: 200}} onChange={t => this.setState({month: t})} />
		</Modal>
		<Modal title="导入"
		  visible={this.state.uploadconf.visible}
		  footer={null}
		  mask={true}
		  width={500}
		  onCancel={_ => this.setState({uploadconf: {visible: false}})}
		>
		<p>社保信息导入，<a onClick={this.downloadTemplate}>模版下载</a></p>
			<Upload className='attr-upload'
					action={`${importURL}`}
					data={{dictid: this.state.dictid}}
					headers={{Authorization: `Bearer ${this.state.token}`}}
					onChange = {this.handleChange}
					fileList = {this.state.uploadconf.fileList}
					multiple={false} >
						<Button>
							<Icon type="upload" /> 导入数据
						</Button>
			</Upload>
		</Modal>
		</div>
}

export default Social