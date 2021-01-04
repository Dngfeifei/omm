import React from 'react'
import { Input, Button, Icon, Modal, message, Divider, InputNumber } from 'antd'
import { getPaperList } from '/api/global'
import { listbranchpaper, changePaperNum } from '/api/branch'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import PaperWall from '/components/PaperWall.jsx'

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
			title: '原件数量',
			dataIndex: 'paperNum',
			render: (t, r) => r.type === 'ZZ' ? <a style={{display: 'inline-block'}} onClick={async _ => {this.changeNumModel(r)}}>{t}</a> : null 
		},{
			title: '备注',
			dataIndex: 'remark'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			render: (t, r) => <div><a style={{display: 'inline-block'}} onClick={async _ => {this.openPicModel(r)}}>编辑资料</a>
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
		numId: '',
		num: 0,
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
	//打开原件数量维护页
	changeNumModel = r => {
		this.setState({visible: true, numId: r.id, num: r.paperNum})
	}
	changeNum = r => {
		changePaperNum({id: this.state.numId, num: this.state.num}).then(res => {
			if(res.code == 200){
				this.setState({visible: false})
				this.search()
			}
		})
	}

	rendermodal = _ => <div>
		<PaperWall onCancel={_ => this.cancelform('picmodelConf')}
		id={this.state.id}
		type={this.state.type}
		path={this.state.path}
		thumb={this.state.thumb}
		fileList={this.state.fileList}
		config={this.state.picmodelConf} />
		<Modal title="修改原件数量"
		  visible={this.state.visible}
		  onOk={this.changeNum}
		  mask={false}
		  width={400}
		  onCancel={_ => this.setState({visible: false})}
		  okText="确认"
		  cancelText="取消"
		>
			<InputNumber style={{width: 200}} 
			value={this.state.num}
			onChange={e => this.setState({num: e})}
			addonBefore="原件数量"
			min={0} max={50} placeholder="录入原件数量" />
		</Modal>
		</div>

}

export default BranchPaper