import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Icon, Modal, Popconfirm, message } from 'antd'
import { getStaffPicList, deleteStaffPic } from '/api/staff'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import StaffpicContForm from '/page/staff/staffpicContForm.jsx'
import { getPaperList } from '/api/global'
import PaperWall from '/components/PaperWall.jsx'
import PreviewWall from '/components/previewWall.jsx'

@connect(state => ({
	thisrole: state.global.thisrole,
}))
class StaffPic extends Common{
	async componentWillMount () {
		if(this.props.staffId){
			this.search()
		}
		if(this.props.thisrole.filter(e => e == '人事管理员').length > 0){
			this.setState({columns: [...this.state.columns, ... this.state.pcolumns]})
		}
	}

	componentWillReceiveProps (nextprops) {
		if (this.props.staffId && nextprops.staffId !== this.props.staffId) {
			this.search()
		}
	}

	state = Object.assign({}, this.state, {
		columns: [{
			title: '类型',
			dataIndex: 'type'
		},{
			title: '起始日期',
			dataIndex: 'startDate'
		},{
			title: '终止日期',
			dataIndex: 'overDate'
		},{
			title: '合同期限',
			dataIndex: 'period'
		},{
			title: '合同类型',
			dataIndex: 'conttype'
		},{
			title: '合同标识',
			dataIndex: 'contflag'
		},{
			title: '续签次数',
			dataIndex: 'renewflag'
		},{
			title: '再入职情况',
			dataIndex: 'memo'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			align: 'center',	
			render: (t, r) => !this.props.readonly ? <a style={{display: 'inline-block', width: 60}} onClick={async _ => {this.openPicModel(r.id, r.path, r.thumb)}}>附件</a>
			: <a style={{display: 'inline-block', width: 60}} onClick={async _ => {this.openPreview(r.id, r.path, r.thumb)}}>预览附件</a>
		}],
		type: 'staffpic',
		pagination: false,
		selectedtable: !this.props.readonly,
		selected: {},
		loading: false,
		tabledata: [],
		modalconf: {visible: false, item: {}},
		fileList: [],
		picmodelConf: {visible: false, item: {}},
		previewConf: {visible: false, item: {}},
	})

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		return getStaffPicList({staffId: this.props.staffId})
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.id })
				return baseItem
			}))(res.data.filter(e => e.type === '劳动合同'))
			this.setState({
				tabledata: data, 
				loading: false
			})
		})
	}

	openPicModel = (id, path, thumb) => {
		getPaperList({bid: id, type: this.state.type}).then(res => {
			 if(res.code == 200){
			 		this.setState({id, path, thumb, fileList: res.data})
					this.setState({picmodelConf: {visible: true}})
			 }
		})
	}

	openPreview = (id, path, thumb) => {
		getPaperList({bid: id, type: this.state.type, thum: 'Y'}).then(res => {
			 if(res.code == 200){
			 		this.setState({id, path, thumb, fileList: res.data})
					this.setState({previewConf: {visible: true}})
			 }
		})
	}

	deleteback = _ => {
		this.search()
	}
	delete = _ => {
		this.handleOk(deleteStaffPic, 'id', '删除', 'deleteback')
	}

	done = async _ => {
		let type = this.state.modalconf.type
		let config = {}
		config.modalconf = {visible: false, item: {}}
		this.setState(config)
		this.research()
	}

	renderBtn = _ => !this.props.readonly ? <div>
	<ButtonGroup>
		<Button 
		onClick={_ => this.props.staffId ? this.addmodal('modalconf', '添加劳动合同') : message.error('请先保存人员基础信息')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('modalconf', '修改资料')}
		type="primary" icon="edit">修改</Button>
		<Button 
		onClick={this.changemodel}
		type="primary" icon="close">删除</Button>
	</ButtonGroup>
	</div> : null

	rendermodal = _ => <div>
	<PaperWall onCancel={_ => this.cancelform('picmodelConf')}
		id={this.state.id}
		type={this.state.type}
		path={this.state.path}
		thumb={this.state.thumb}
		fileList={this.state.fileList}
		config={this.state.picmodelConf} />
	<PreviewWall onCancel={_ => this.cancelform('previewConf')}
		id={this.state.id}
		type={this.state.type}
		path={this.state.path}
		thumb={this.state.thumb}
		fileList={this.state.fileList}
		config={this.state.previewConf} />		
	<StaffpicContForm
		staffId = {this.props.staffId}
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

export default StaffPic