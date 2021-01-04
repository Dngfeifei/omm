import React from 'react'
import { Input, Button, Icon, Modal, message, TreeSelect, Select, Upload } from 'antd'
import { getCertList, deleteCert, getCertColumns, exportCert, exportCertPaper, importListURL } from '/api/cert'
import { getPaperList } from '/api/global'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import CertForm from '/page/cert/certForm.jsx'
import CertOccupy from '/page/cert/certOccupy.jsx'
import PaperWall from '/components/PaperWall.jsx'
import { getDictSelect } from '/api/dict'
import { handleTreeData, dealBlob } from '/api/tools'

class Cert extends Common{

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
			width: 100,
			dataIndex: 'typeName'
		},{
			title: '名称',
			width: 200,
			dataIndex: 'name'
		},{
			title: '编号',
			width: 200,
			dataIndex: 'code'
		},{
			title: '发证日期',
			width: 100,
			dataIndex: 'startDate',
		},{
			title: '到期日',
			width: 100,
			dataIndex: 'overDate'
		},{
			title: '公司',
			width: 240,
			dataIndex: 'corpName'
		},{
			title: '备注',
			dataIndex: 'remark'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			align: 'center',	
			width: '60px',
			render: (t, r) => <div>
			<a style={{display: 'inline-block'}} onClick={_ => this.openPicModel(r.id, r.path, r.thumb)}>附件</a></div>
		}],
		type: 'certe',
		selected: {},
		loading: true,
		tabledata: [],
		modalconf: {visible: false, item: {}},
		picmodelConf: {visible: false, item: {}},
		occupyconf: {visible: false, item: {}},
		uploadconf: {visible: false, item: {}},
		loading2: false,
		loading3: false,
		loading4: false
	})
  //打开附件页面
	openPicModel = (id, path, thumb) => {
		getPaperList({bid: id, type: this.state.type}).then(res => {
			 if(res.code == 200){
			 		this.setState({id, path, thumb, fileList: res.data})
					this.setState({picmodelConf: {visible: true}})
			 }
		})
	}

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
	//查询
	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		return getCertList(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.id })
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
			//如果按证书分类查询，则显示所有内容
			if(search.typeCode){
				this.addCustomColumns(search.typeCode)
			}else{
				this.setState({columns: this.state.columns.filter(t => !t.custom)})
			}
		})
	}
	//导出
	export = _ => {
		this.setState({loading2: true})
		let search = Object.assign({}, this.state.search)
		exportCert(search).then(blob => {
			if(blob) dealBlob(blob, '资质证书导出.xlsx')
			this.setState({loading2: false})
		})
	}
	//导出原件
	exportPaper = _ => {
		this.setState({loading3: true})
		let search = Object.assign({}, this.state.search)
		exportCertPaper(search).then(blob => {
			if(blob) dealBlob(blob, '资质证书原件.zip')
			this.setState({loading3: false})
		})
	}
	//导入列表
	importList = _ => {
		let token = localStorage.getItem('token') || ''
		this.setState({token, uploadconf: {visible: true, fileList: []}})
	}
	//动态添加自定义字段
	addCustomColumns = typeCode => {
		getCertColumns({code: typeCode}).then(res => {
			let columns = this.state.columns.filter(t => !t.custom)
			res.data.forEach(item => {
				let obj = {title: item.name, dataIndex: item.id, width:100, custom: true}
				if(item.tag == 'number'){
					obj.render = (t, r, i) => t ? <a style={{display: 'inline-block', width: 60}} onClick={_ => this.showHistory(r.id, item.id)}>{t}</a> : t
				}
				columns.splice(-1, 0, obj)
			})
			this.setState({columns})
		})

		if(this.state.tabledata.length > 0){
			let tabledata = []
			this.state.tabledata.forEach(item => {
				item.certDetails.forEach(t => {
					let content = t.content
					if(t.columnTag == 'number' && content && Number(content)>0){
						content = content + '(' + (Number(content) - t.lockNum) + ')' 
					}
					item[t.columnId+''] = content
				})
				tabledata.push(item)
			})
			this.setState({tabledata})
		}
	}
	//查看占用明细
	showHistory = (certId, formId) => {
		this.setState({occupyconf: {visible: true, certId: certId, formId: formId}})
	}

	deleteback = _ => {
		this.search()
	}
	delete = _ => {
		this.handleOk(deleteCert, 'id', '删除', 'deleteback')
	}

	done = async _ => {
		let type = this.state.modalconf.type
		let config = {}
		config.modalconf = {visible: false, item: {}}
		this.setState(config)
		if (type == 'add') {
			this.search()
		} else {
			await this.setState({selected: {}})
			this.search()
		}
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
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
		</div>
	</div>

	renderBtn = _ => <div>
	<ButtonGroup>
		<Button 
		onClick={_ => this.addmodal('modalconf', '添加字段')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('modalconf', '编辑字段')}
		type="primary" icon="edit">修改</Button>
		<Button 
		onClick={this.changemodel}
		type="primary" icon="close">删除</Button>
		<Button 
		onClick={this.export}
		type="primary" icon="download" loading={this.state.loading2}>导出</Button>
		<Button 
		onClick={this.exportPaper}
		type="primary" icon="download" loading={this.state.loading3}>导出原件</Button>
		<Button 
		onClick={this.importList}
		type="primary" icon="upload" loading={this.state.loading4}>导入列表</Button>
	</ButtonGroup>
	</div>

	rendermodal = _ => <div>
		<PaperWall onCancel={_ => this.cancelform('picmodelConf')}
		id={this.state.id}
		type={this.state.type}
		path={this.state.path}
		thumb={this.state.thumb}
		fileList={this.state.fileList}
		config={this.state.picmodelConf} />
		<CertForm 
		onCancel={_ => this.cancelform('modalconf')}
		done={_ => this.done()}
		config={this.state.modalconf} />
		<CertOccupy 
		onCancel={_ => this.setState({occupyconf: {visible: false}})}
		config={this.state.occupyconf}  />
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
		</Modal><Modal title="导入列表"
		  visible={this.state.uploadconf.visible}
		  footer={null}
		  mask={true}
		  width={500}
		  onCancel={_ => this.setState({uploadconf: {visible: false}})}
		>
			<Upload className='attr-upload'
					action={`${importListURL}`}
					headers={{Authorization: `Bearer ${this.state.token}`}}
					onChange = {this.handleChange}
					fileList = {this.state.uploadconf.fileList}
					multiple={false} >
						<Button>
							<Icon type="upload" /> 导入数据
						</Button>
			</Upload>
		</Modal></div>

}

export default Cert