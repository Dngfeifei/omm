import React from 'react'
import { Input, Button, Icon, Modal, message, Divider, Spin } from 'antd'
import { getPaperList, downloadMarkZip, downloadMutiMarkZip, downloadPathURL } from '/api/global'
import { listpaper, deletepaper } from '/api/finance'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import PreviewWall from '/components/previewWall.jsx'
import { dealBlob, downloadByUrl } from '/api/tools'

/** 审计报告、纳税证明 **/
class FinancePaper extends Common{
	async componentWillMount () {
		const columns = this.state.baseColumns.filter(e => {
			if(this.props.type === 'NS'){
				return e.dataIndex !== 'year'
			}else{
				return e.dataIndex !== 'month'
			}
		})
		this.setState({columns})
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({condition: ''}, this.state.pageconf),
		columns: [],
		baseColumns: [{
			title: '年份',
			dataIndex: 'year'
		},{
			title: '月份',
			dataIndex: 'month',
		},{
			title: '公司',
			dataIndex: 'pkcorpname'
		},{
			title: '资料名称',
			dataIndex: 'name'
		},{
			title: '备注',
			dataIndex: 'remark'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			render: (t, r) => <div><Spin spinning={r.loading}><a style={{display: 'inline-block'}} onClick={_ => {this.downloadOk(r)}}>下载</a></Spin>
			</div>
		}],
		selectedtable: this.props.type == 'NS',
		selecttype: 'checkbox',
		loading: true,
		id: undefined,
		type: 'finance-paper',
		path: '',
		thumb: '',
		fileList: [],
		btnloading: false,
		modalconf: {visible: false, item: {}},
		picmodelConf: {visible: false, item: {}}
	})


	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({type: this.props.type}, this.state.search)
		return listpaper(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({loading: false}, val, { key: val.id })
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
	//预览文件 --暂时不使用
	openPicModel = r => {
		let id = r.id 
		let path = this.state.type + '-' + r.id
		let thumb = this.state.type + '-' + r.id
		getPaperList({bid: id, type: this.state.type}).then(res => {
			 if(res.code == 200){
			 		this.setState({id, path, thumb, fileList: res.data})
					this.setState({picmodelConf: {visible: true}})
			 }
		})
	}

	//直接下载加水印文件
	downloadOk = r => {
		const datas = [...this.state.tabledata]
		datas.filter(e => e.key == r.key)[0].loading = true
		this.setState({tabledata: datas})
    downloadMarkZip({ type: this.state.type, bid: r.id }).then(blob => {
      dealBlob(blob, `${r.name}-${r.month || r.year}(${r.pkcorpname}).zip`)
      datas.filter(e => e.key == r.key)[0].loading = false
      this.setState({tabledata: datas})
    })
  }
  //多份资料打包下载
  downloadMuti = async _ => {
		if (this.state.selected.selectedKeys && this.state.selected.selectedKeys.length) {
			await this.setState({btnLoading: true})
			const params = this.state.selected.selectedItems.map(e => {
				return {type: this.state.type, bid: e.id, name: `${e.name}-${e.month}(${e.pkcorpname})`}
			})
			downloadMutiMarkZip(params).then(res => {
	      const name = '公司纳税凭证.zip'
	      this.setState({btnLoading: false})
	      let url = downloadPathURL + `?path=${res.data}&name=${name}&token=` + localStorage.getItem('token')
				downloadByUrl(url)
	    })
		} else {
			message.warning('请至少选中表格中的一条记录！')
		}
  }

  //申请纸质审计报告
	applyPaper = _ => {
		let pane = {
			title: '资质证书申请',
			key: 'finance_apply_form',
			url: 'finance_apply_form',
		}
		if (parent.add) {
			parent.add(pane)
		} else {
			this.props.add(pane)
		}
	}

	renderBtn = _ => <div>
	{this.props.type == 'NS' ? <Button 
		onClick={this.downloadMuti}
		type="primary" icon="download" loading={this.state.btnLoading}>下载</Button> : null}
	{this.props.type == 'SJWZ' ? <Button 
		onClick={this.applyPaper}
		type="primary" icon="download" loading={this.state.btnLoading}>申请纸质资料</Button> : null}	
	</div>

	rendermodal = _ => <div>
		<PreviewWall onCancel={_ => this.cancelform('picmodelConf')}
		id={this.state.id}
		type={this.state.type}
		path={this.state.path}
		thumb={this.state.thumb}
		fileList={this.state.fileList}
		config={this.state.picmodelConf} /></div>
}

export default FinancePaper