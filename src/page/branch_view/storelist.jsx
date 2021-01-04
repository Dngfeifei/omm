import React from 'react'
import { Input, Button, Icon, Modal, message, Popconfirm } from 'antd'
import { liststore, storeFinish, exportStore, getStorePics } from '/api/branch'
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
			dataIndex: 'area'
		},{
			title: '仓库名称',
			dataIndex: 'storname'
		},{
			title: '联系人',
			dataIndex: 'linkName'
		},{
			title: '联系电话',
			dataIndex: 'phone'
		},{
			title: '座机号码',
			dataIndex: 'zphone'
		},{
			title: '邮编',
			dataIndex: 'zcode'
		},{
			title: '到货地址',
			dataIndex: 'address'
		},{
			title: '上传完毕',
			dataIndex: 'isend',
			render: (t, r) => t == 1 ? '是' : '否'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			render: (t, r) => <a style={{display: 'inline-block', width: 60}} onClick={async _ => {this.addpanel(r)}}>查看</a>
		}],
		selecttype: 'checkbox',
		btnLoading: false,
		picLoading: false,
		selected: {},
		loading: true,
		modalconf: {visible: false, item: {}},
	})


	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		if (!search.condition) delete search.condition
		return liststore(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.storid })
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


	addpanel = async r => {
		await window.remove('storeForm_view')
		let pane = {
				title: `备件库:${r.area}`,
				key: 'storeForm_view',
				url: 'storeForm_view',
				params: r
			}
		window.add(pane)
	}

	//申请备件清单
	openStorage = async _ => {
		await window.remove('storage_apply')
		let pane = {
				title: `备件清单申请`,
				key: 'storage_apply',
				url: 'storage_apply',
				params: r
			}
		window.add(pane)
	}
	//导出
	exportExcel = _ => {
		this.setState({btnLoading: true})
		exportStore({}).then(blob => {
			dealBlob(blob, '备件库信息.xlsx')
			this.setState({btnLoading: false})
		})
	}
	//多份资料打包下载
  downloadMuti = async _ => {
		if (this.state.selected.selectedKeys && this.state.selected.selectedKeys.length) {
			let params
			await getStorePics({ids: this.state.selected.selectedKeys.join(',')}).then(res => {
				params = res.data
			})
			let names = []
			this.state.selected.selectedItems.forEach(e => {
				names.push(e.area)
			})
			this.setState({picLoading: true})
			downloadMutiMarkZip(params).then(res => {
	      const name = `备件库电子资料_${names.join(',')}.zip`
	      this.setState({picLoading: false})
	      let url = downloadPathURL + `?path=${res.data}&name=${name}&token=` + localStorage.getItem('token')
				downloadByUrl(url)
	    })
		} else {
			message.warning('请至少选中表格中的一条记录！')
		}
  }

	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<Input 
			value={this.state.search.condition}
			allowClear
			onChange={e => this.changeSearch({condition: e.target.value})}
			addonBefore="名称" placeholder="输入名称" />
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
			onClick={this.openStorage}
			type="primary" icon="file">备件清单申请</Button>
		</div>
	</div>

	renderBtn = _ => <div>
	</div>

	rendermodal = _ => <div></div>

}

export default BranchList