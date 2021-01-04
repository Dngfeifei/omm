import React from 'react'
import { Input, Button, Icon, Modal, message, Popconfirm } from 'antd'
import { listbranch, addbranch, deletebranch, branchFinish, exportBranch, getBranchPics } from '/api/branch'
import { downloadMutiMarkZip, downloadPathURL } from '/api/global'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import { dealBlob, downloadByUrl } from '/api/tools'

class BranchList extends Common{
	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({condition: ''}, this.state.pageconf),
		columns: [{
			title: '区域',
			dataIndex: 'branchArea'
		},{
			title: '分公司名称',
			dataIndex: 'branchName'
		},{
			title: '公司法人',
			dataIndex: 'legalName'
		},{
			title: '法人电话',
			dataIndex: 'legalPhone'
		},{
			title: '地址',
			dataIndex: 'address'
		},{
			title: '备注',
			dataIndex: 'remark'
		},{
			title: '上传完毕',
			dataIndex: 'isend',
			render: (t, r) => t == 1 ? '是' : '否'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			render: (t, r) => <a style={{display: 'inline-block', width: 60}} onClick={async _ => {this.addpanel(r)}}>查看</a>
		}],
		selected: {},
		selecttype: 'checkbox',
		btnLoading: false,
		picLoading: false,
		loading: true,
		modalconf: {visible: false, item: {}},
		picmodelConf: {visible: false, item: {}}
	})


	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		if (!search.condition) delete search.condition
		return listbranch(search)
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
	//上传完毕
	finish = (r, state) => {
		branchFinish({id: r.id, isend: state}).then(res => {
			if(res.code == 200){
				this.search()
			}
		})
	}

	deleteback = _ => {
		this.search()
	}
	delete = _ => {
		this.handleOk(deletebranch, 'id', '删除', 'deleteback')
	}

	addpanel = async r => {
		await window.remove('branchForm_view')
		let pane = {
				title: `分支机构:${r.branchName}`,
				key: 'branchForm_view',
				url: 'branchForm_view',
				params: r
			}
		window.add(pane)
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

	//导出
	exportExcel = _ => {
		this.setState({btnLoading: true})
		exportBranch({}).then(blob => {
			dealBlob(blob, '分支机构信息.xlsx')
			this.setState({btnLoading: false})
		})
	}
	//多份资料打包下载
  downloadMuti = async _ => {
		if (this.state.selected.selectedKeys && this.state.selected.selectedKeys.length) {
			let params
			await getBranchPics({ids: this.state.selected.selectedKeys.join(',')}).then(res => {
				params = res.data
			})
			let names = []
			this.state.selected.selectedItems.forEach(e => {
				names.push(e.branchArea)
			})
			this.setState({picLoading: true})
			downloadMutiMarkZip(params).then(res => {
	      const name = `分支机构电子资料_${names.join(',')}.zip`
	      this.setState({picLoading: false})
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
			title: '营业执照/租房合同申请',
			key: 'branch_apply_form',
			url: 'branch_apply_form',
		}
		if (parent.add) {
			parent.add(pane)
		} else {
			this.props.add(pane)
		}
	}

	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<Input 
			value={this.state.search.condition}
			allowClear
			onChange={e => this.changeSearch({condition: e.target.value})}
			addonBefore="名称" placeholder="区域/分支机构名称" />
			<Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
			<Button 
			onClick={this.exportExcel}
			type="primary" icon="download" loading={this.state.btnLoading}>导出Excel</Button>
			<Button 
			onClick={this.downloadMuti}
			type="primary" icon="download" loading={this.state.picLoading}>导出电子资料</Button>
			<Button 
			onClick={this.applyPaper}
			type="primary" icon="file">申请原件</Button>
		</div>
	</div>

	renderBtn = _ => <div>
	</div>

	rendermodal = _ => <div></div>

}

export default BranchList