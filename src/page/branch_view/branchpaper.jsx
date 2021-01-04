import React from 'react'
import { Input, Button, Icon, Modal, message, Divider } from 'antd'
import { getPaperList } from '/api/global'
import { listbranchpaper } from '/api/branch'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import PreviewWall from '/components/previewWall.jsx'

class BranchPaper extends Common{
	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({condition: ''}, this.state.pageconf),
		columns: [{
			title: '资料名称',
			dataIndex: 'name'
		},{
			title: '备注',
			dataIndex: 'remark'
		},{
			title: '可用数量',
			dataIndex: 'paperNum',
			render: (t, r) => r.type === 'CS' ? '' : (r.paperNum - r.lockNum)
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			render: (t, r) => <div><a style={{display: 'inline-block'}} onClick={async _ => {this.openPicModel(r)}}>查看资料</a>
			</div>
		}],
		selectedtable: false,
		pagination: false,
		loading: true,
		id: undefined,
		type: 'branch-paper',
		path: '',
		thumb: '',
		fileList: [],
		modalconf: {visible: false, item: {}},
		picmodelConf: {visible: false, item: {}}
	})


	search = async _ => {
		await this.setState({loading: true})
		let search = {branchId: this.props.branchId}
		return listbranchpaper(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.id })
				return baseItem
			}))(res.data)
			this.setState({
				tabledata: data, 
				loading: false,
			})
		})
	}

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

	deleteback = _ => {
		this.search()
	}
	delete = _ => {
		this.handleOk(deleteProfile, 'id', '删除', 'deleteback')
	}


	rendermodal = _ => <div>
		<PreviewWall onCancel={_ => this.cancelform('picmodelConf')}
		id={this.state.id}
		type={this.state.type}
		path={this.state.path}
		thumb={this.state.thumb}
		fileList={this.state.fileList}
		config={this.state.picmodelConf} /></div>

}

export default BranchPaper