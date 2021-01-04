import React from 'react'
import { Button, Modal, Icon, message, Upload, Divider } from 'antd'
import { getcontsalelist, exportEqs, importURL, changeIsEnabled, exportConTemplate, importConsaleURL, syncContsale, getConSyncDate, highSearch } from '/api/contsale'
import { getPaperList, getPermission } from '/api/global'
import Common from '/page/common.jsx'
import ContractIndex from '/page/contract/contractIndex.jsx'
import PaperWall from '/components/PaperWall.jsx'
import { vbillMap,  iprojMap, dealBlob } from '/api/tools'
import SearchCom from '/page/contract/searchCom.jsx'
import SearchComHigh from '/page/contract/searchComHigh.jsx'
import ContractOccupy from '/page/contract/contractOccupy.jsx'
import ContractEdit from '/page/contract/contractEdit.jsx'

class Contract extends Common{

	async componentWillMount () {
		this.search()
		await getPermission({}).then(res => {
			if(res.data.indexOf('anli_contract') > -1){
				this.setState({conauth: true})
			}
			if(res.data.indexOf('anli_project') > - 1){
				this.setState({projauth: true})
			}
		})
		this.findConTime()
	}

	state = Object.assign({}, this.state, {
		synctime: '',
		conauth: false,
		projauth: false,
		highvisible: false,
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
			sorter: true
		},{
			title: '合同金额',
			dataIndex: 'ncontmny',
			sorter: true
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
			title: '可申请',
			dataIndex: 'isEnabled',
			render: t => Number(t) == 0 ? '否' : '是'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			align: 'center',	
			width: '140px',
			render: (t, r) => <div><a style={{display: 'inline-block'}} onClick={_ => this.editcontsale(r)}>维护</a>
			<Divider type="vertical" />
			<a style={{display: 'inline-block'}} onClick={_ => this.addpane(r)}>查看</a>
			{this.state.projauth ? <Divider type="vertical" /> : null}
			{this.state.projauth ? <a style={{display: 'inline-block'}} onClick={_ => this.openPicModel(r.pkContsale, r.vbillno, r.vbillno)}>附件</a> : null}</div>
		}],
		type: 'contsale',
		selectedtable: false,
		uploadconf: {visible: false, fileList: []},
		conuploadconf: {visible: false, fileList: []},
		hytypelist: [],
		servtypelist: [],
		modalConf: {visible: false, item: {}},
		editconf: {visible: false, item: {}},
		picmodelConf: {visible: false, item: {}},
		occupyconf: {visible: false, item: {}},
		loading2: false,
		fileList: [],
		ishigh: false,
		searchprops: [{key: 1,leftc: '(', column: '', compare: '', value: '', rightc: ')', logic: ''}]
	})

	atSearch = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		if (search.fromDate) search.fromDate = search.fromDate.format('YYYY-MM-DD')
		if (search.toDate) search.toDate = search.toDate.format('YYYY-MM-DD')	
		return getcontsalelist(search)
		.then(res => {
			let data = res.data.records.map(val => Object.assign({}, val, {key: val.pkContsale}))
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

	search = async _ => {
		if(this.state.ishigh){
			this.highSearch()
		}else{
			this.atSearch()
		}
	}

	openPicModel = (id, path, thumb) => {
		getPaperList({bid: id, type: this.state.type}).then(res => {
			 if(res.code == 200){
			 		this.setState({id, path, thumb, fileList: res.data})
					this.setState({picmodelConf: {visible: true}})
			 }
		})
	}
  //维护
	editcontsale = r => {
		this.setState({editconf: {visible: true, title: r.vcontname, item: r}})
	}

	//查看借用记录
	showHistory = t => {
		this.setState({occupyconf: {visible: true, contsaleId: t}})
	}
	done = async _ => {
		let editconf = {visible: false, item: {}}
		await this.setState({ editconf })
		this.search()
	}

	addpane = async r => {
		await window.remove('contractIndex')
		let pane = {
			title: '合同明细',
			key: 'contractIndex',
			url: 'contractIndex',
			params: {
				id: r.pkContsale,
				readonly: !this.state.projauth
			}
		}
		window.add(pane)
	}

	openupload = _ => {
		let token = localStorage.getItem('token') || ''
		this.setState({token, uploadconf: {visible: true, fileList: []}})
	}
	//下载设备模版清单
	downloadTemplate = _ => {
		exportEqs().then(blob => {
			dealBlob(blob, '设备清单模版.xlsx')
		})
	}
	//导入
	handleChange = ({ file, fileList }) => { 
    if(file.status == 'done'){
    	//console.log(file)
  		if(file.response.data && file.response.data.length>0){
  			message.error(file.response.data.map((t, i) => <p key={i}>{t}</p>))
  		}else{
  			message.success('导入成功')
  		}
    }
    this.setState({uploadconf: {visible: true, fileList}})
  }
  //获得导入配置
  openconupload = _ => {
		let token = localStorage.getItem('token') || ''
		this.setState({token, conuploadconf: {visible: true, fileList: []}})
	}
	//下载模版
	downloadConTemplate = _ => {
		exportConTemplate().then(blob => {
			dealBlob(blob, '案例导入模版.xlsx')
		})
	}
	//导入案例
	handleConChange = ({ file, fileList }) => { 
    if(file.status == 'done'){
  		if(file.response.data && file.response.data.length>0){
  			message.error(file.response.data.map((t, i) => <p key={i}>{t}</p>))
  		}else{
  			message.success('导入成功')
  		}
    }
    this.setState({conuploadconf: {visible: true, fileList}})
  }

  //同步
	syncData = _ => {
		if(!this.state.loading2){
			this.setState({loading2: true})
			syncContsale().then(res => {
				if(res.code == 200){
					message.success('同步完成')
					this.search()
					this.findConTime()
				}
				this.setState({loading2: false})
			})
		}
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
	//获得上次同步时间
	findConTime = _ =>{
		return getConSyncDate().then(res => {
			this.setState({synctime : res.data})
		})
	}


	renderSearch = _ => <div className="mgrSearchBar">
	<SearchCom search={this.state.search} changeSearch={this.changeSearch} />
		<Button 
		onClick={this.atSearch}
		type="primary" icon="search">搜索</Button>
		<Button 
		onClick={this.openSearch}
		type="primary" icon="search">高级搜索</Button>
		{this.state.projauth ? <Button 
		onClick={_ => this.syncData()}
		type="primary" icon="sync" loading={this.state.loading2}>同步</Button> : null}
		{this.state.projauth ? <Button 
		onClick={this.openconupload}
		type="primary" icon="upload">导入案例</Button> : null}
		{this.state.projauth ? <Button 
		onClick={this.openupload}
		type="primary" icon="upload">导入设备</Button> : null}
		<span>上次同步时间为:{this.state.synctime}</span>
	</div>


	rendermodal = _ => <div>
		<PaperWall onCancel={_ => this.cancelform('picmodelConf')}
		id={this.state.id}
		type={this.state.type}
		path={this.state.path}
		thumb={this.state.thumb}
		fileList={this.state.fileList}
		config={this.state.picmodelConf} />
		<ContractEdit 
		onCancel={_ => this.cancelform('editconf')}
		done={_ => this.done()}
		conauth={this.state.conauth}
		projauth={this.state.projauth}
		config={this.state.editconf} />
		<ContractOccupy 
		onCancel={_ => this.setState({occupyconf: {visible: false}})}
		config={this.state.occupyconf}  />
		<Modal title="高级搜索"
		  visible={this.state.highvisible}
		  footer={null}
		  mask={true}
		  width={1000}
		  onCancel={_ => this.setState({highvisible: false})}
		>
		<SearchComHigh data={this.state.searchprops} handler={this.highSearch} />
 		</Modal>
		<Modal title="设备清单导入"
		  visible={this.state.uploadconf.visible}
		  footer={null}
		  mask={true}
		  width={500}
		  onCancel={_ => this.setState({uploadconf: {visible: false}})}
		>
		<p>设备清单导入，<a onClick={this.downloadTemplate}>模版下载</a></p>
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
		<Modal title="案例导入"
		  visible={this.state.conuploadconf.visible}
		  footer={null}
		  mask={true}
		  width={500}
		  onCancel={_ => this.setState({conuploadconf: {visible: false}})}
		>
		<p>案例导入，<a onClick={this.downloadConTemplate}>模版下载</a></p>
			<Upload className='attr-upload'
					action={`${importConsaleURL}`}
					data={{dictid: this.state.dictid}}
					headers={{Authorization: `Bearer ${this.state.token}`}}
					onChange = {this.handleConChange}
					fileList = {this.state.conuploadconf.fileList}
					multiple={false} >
						<Button>
							<Icon type="upload" /> 导入数据
						</Button>
			</Upload>
		</Modal>
		</div>

}

export default Contract