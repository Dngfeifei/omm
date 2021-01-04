import React from 'react'
import { Input, Button, Icon, Modal, Divider } from 'antd'
import { getResumeTemplateList, deleteResumeTemplate, downloadFile, downloadTempFile } from '/api/resume'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import DictForm from '/page/resume/resumetemplateForm.jsx'
import { dealBlob } from '/api/tools'

class ResumeTemplate extends Common{
	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({condition: ''}, this.state.pageconf),
		columns: [{
			title: '名称',
			dataIndex: 'name'
		},{
			title: '创建人',
			dataIndex: 'createUserName'
		},{
			title: '创建时间',
			dataIndex: 'createTime'
		},{
			title: '备注',
			dataIndex: 'tips'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			render: (t, r) => <div><a style={{display: 'inline-block', width: 60}} onClick={async _ => {this.downloadTemplate(r.path, r.name)}}>导出模版</a>
			<Divider type="vertical" />
				<a style={{display: 'inline-block', width: 60}} onClick={async _ => {this.download(r.path, r.name)}}>导出样例</a>
			</div>
		}],
		selected: {},
		loading: true,
		tabledata: [],
		modalconf: {visible: false, item: {}}
	})
	// 导出样例
	download = (path, name) => {
		downloadFile({path}).then(blob => {
			dealBlob(blob, `${name}样例.doc`)
		})
  }
  // 导出模版
  downloadTemplate = (path, name) => {
		downloadTempFile({path}).then(blob => {
			dealBlob(blob, `${name}.doc`)
		})
  }

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		console.log(search)
		if (!search.condition) delete search.condition
		return getResumeTemplateList(search)
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

	deleteback = _ => {
		this.search()
	}
	delete = _ => {
		this.handleOk(deleteResumeTemplate, 'id', '删除', 'deleteback')
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

	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<Input 
			value={this.state.search.condition}
			allowClear
			onChange={e => this.changeSearch({condition: e.target.value})}
			addonBefore="名称" placeholder="输入模版名称" />
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
	</ButtonGroup>
	</div>

	rendermodal = _ => <div><DictForm 
		onCancel={_ => this.cancelform('modalconf')}
		done={_ => this.done()}
		getTree={_ => this.search()}
		config={this.state.modalconf} />
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
		</Modal></div>

}

export default ResumeTemplate