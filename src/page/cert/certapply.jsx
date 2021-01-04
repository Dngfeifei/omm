import React from 'react'
import { Input, Button, Icon, Modal, message, TreeSelect, Select, Spin } from 'antd'
import { getCertApplyList, getCertColumns, exportCertApply } from '/api/cert'
import { getPaperList, downloadMarkZip } from '/api/global'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import CertForm from '/page/cert/certForm.jsx'
import CertOccupy from '/page/cert/certOccupy.jsx'
import PreviewWall from '/components/previewWall.jsx'
import { getDictSelect } from '/api/dict'
import { handleTreeData, dealBlob } from '/api/tools'

class CertApply extends Common{
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
			dataIndex: 'typeName'
		},{
			title: '名称',
			maxWidth: 240,
			dataIndex: 'name'
		},{
			title: '编号',
			maxWidth: 240,
			dataIndex: 'code'
		},{
			title: '发证日期',
			dataIndex: 'startDate'
		},{
			title: '到期日',
			dataIndex: 'overDate'
		},{
			title: '公司',
			dataIndex: 'corpName'
		},{
			title: '备注',
			dataIndex: 'remark'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			align: 'center',	
			width: '60px',
			render: (t, r) => <div><Spin spinning={r.loading}><a style={{display: 'inline-block'}} onClick={_ => {this.downloadOk(r)}}>下载</a></Spin>
			</div>
		}],
		type: 'certe',
		selectedtable: false,
		selected: {},
		loading: true,
		loading2: false,
		tabledata: [],
		modalconf: {visible: false, item: {}},
		picmodelConf: {visible: false, item: {}},
		occupyconf: {visible: false, item: {}}
	})
	//附件查看
	openPicModel = (id, path, thumb) => {
		getPaperList({bid: id, type: this.state.type, thum: 'Y'}).then(res => {
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

	//直接下载加水印文件
	downloadOk = r => {
		const datas = [...this.state.tabledata]
		datas.filter(e => e.key == r.key)[0].loading = true
		this.setState({tabledata: datas})
    downloadMarkZip({ type: this.state.type, bid: r.id }).then(blob => {
      dealBlob(blob, `${r.name}.zip`)
      datas.filter(e => e.key == r.key)[0].loading = false
      this.setState({tabledata: datas})
    })
  }

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		return getCertApplyList(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({loading: false}, val, { key: val.id })
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
			//console.log(res.data)
			//如果按证书分类查询，则显示所有内容
			if(search.typeCode) this.addCustomColumns(search.typeCode)
		})
	}
	//动态添加自定义字段
	addCustomColumns = typeCode => {
		getCertColumns({code: typeCode}).then(res => {
			let columns = this.state.columns.filter(t => !t.custom)
			res.data.forEach(item => {
				let obj = {title: item.name, dataIndex: item.id, custom: true}
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

	//导出
	export = _ => {
		this.setState({loading2: true})
		let search = Object.assign({}, this.state.search)
		exportCertApply(search).then(blob => {
			if(blob) dealBlob(blob, '资质证书导出.xlsx')
			this.setState({loading2: false})
		})
	}

	//申请资质证书
	applyCert = _ => {
		let pane = {
			title: '资质证书申请',
			key: 'certapplyForm',
			url: 'certapplyForm',
		}
		if (parent.add) {
			parent.add(pane)
		} else {
			this.props.add(pane)
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
			<Button 
			onClick={this.export}
			type="primary" icon="download" loading={this.state.loading2}>导出</Button>
			<Button 
			onClick={this.applyCert}
			type="primary" icon="profile">申请资质证书</Button>
		</div>
	</div>

	rendermodal = _ => <div>
		<PreviewWall onCancel={_ => this.cancelform('picmodelConf')}
		id={this.state.id}
		type={this.state.type}
		path={this.state.path}
		thumb={this.state.thumb}
		fileList={this.state.fileList}
		config={this.state.picmodelConf} />
		<CertOccupy 
		onCancel={_ => this.setState({occupyconf: {visible: false}})}
		config={this.state.occupyconf}  />
	</div>

}

export default CertApply