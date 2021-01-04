import React from 'react'
import { Input, Button, Icon, Modal, message } from 'antd'
import { getcontemp } from '/api/contsale'
import { downloadURL } from '/api/contapply'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import { dealBlob, downloadByUrl } from '/api/tools'

class Contemp extends Common{
	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({condition: ''}, this.state.pageconf),
		columns: [{
			title: '编号',
			dataIndex: 'code'
		},{
			title: '申请人',
			dataIndex: 'username'
		},{
			title: '项目名称',
			dataIndex: 'vprojname'
		},{
			title: '项目编号',
			dataIndex: 'projname'
		},{
			title: '开标时间',
			dataIndex: 'openDate'
		},{
			title: '创建时间',
			dataIndex: 'createTime'
		},{
			title: '备注',
			dataIndex: 'remark'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			render: (t, r) => <a style={{display: 'inline-block', width: 60}} onClick={ _ => this.download(r)}>下载</a>
		}],
		selected: {},
		loading: true,
		tabledata: [],
	})


	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		if (!search.name) delete search.name
		return getcontemp(search)
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

	addapply = _ => {
		let pane = {
			title: '案例下载单',
			key: 'contempForm',
			url: 'contempForm',
		}
		window.add(pane)
	}

	editapply = _ => {
		if (this.state.selected.selectedKeys && this.state.selected.selectedKeys.length) {
			let item = this.state.selected.selectedItems[0]
			let pane = {
				title: '案例下载单',
				key: 'contempForm',
				url: 'contempForm',
				params: {item}
			}
			window.add(pane)
		} else {
			message.warning('请选中表格中的某一记录！')
		}
	}

	//下载
	download = r => {
		let url = downloadURL + `?id=${r.id}&token=` + localStorage.getItem('token')
		downloadByUrl(url)
	}


	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<Input 
			value={this.state.search.name}
			allowClear
			onChange={e => this.changeSearch({name: e.target.value})}
			addonBefore="项目名称" placeholder="项目名称、项目编号" />
			<Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
		</div>
	</div>

	renderBtn = _ => <div>
	<ButtonGroup>
		<Button 
		onClick={_ => this.addapply()}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editapply()}
		type="primary" icon="edit">修改</Button>
	</ButtonGroup>
	</div>

	rendermodal = _ => <div></div>

}

export default Contemp