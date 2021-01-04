import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Icon, Modal, Select, message, Popconfirm } from 'antd'
import { getStaffCertList, deleteStaffCert, checkDoneCert, setCheckDesp } from '/api/staff'
const Option = Select.Option
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import StaffcertForm from '/page/staff/staffcertForm.jsx'
import { getPaperList } from '/api/global'
import PaperWall from '/components/PaperWall.jsx'
import PreviewWall from '/components/previewWall.jsx'
@connect(state => ({
	thisrole: state.global.thisrole,
}))
class StaffCert extends Common{
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
			title: '证书厂商',
			dataIndex: 'certVender',
			width: 50,
		},{
			title: '证书全称',
			dataIndex: 'certName',
			width: 300,
			render: t => <div style={{ width: 240 }}>{t}</div>
		},{
			title: '证书简称',
			dataIndex: 'certNick',
			width: 100,
		},{
			title: '证书级别',
			dataIndex: 'certLevel',
			width: 50,
		},{
			title: '证书编号',
			dataIndex: 'certCode',
			width: 200,
			render: t => <div style={{ width: 200 }}>{t}</div>
		},{
			title: '资质获得日期',
			dataIndex: 'getDate',
			width: 100,
		},{
			title: '资质到期日期',
			dataIndex: 'overDate',
			width: 100,
		},{
			title: '证书类型',
			dataIndex: 'certType',
			width: 100,
		},{
			title: '原件在公司',
			dataIndex: 'hasoriginal',
			width: 100,
			render: (t, r) => Number(t) == 0 ? '否' : (r.lockNum == 1 ? '是(已借)' : '是')
		},{
			title: '备注',
			dataIndex: 'remark',
			width: 100,
		},{
			title: ' 附件 ',
			dataIndex: 'operate',
			align: 'center',	
			render: (t, r) => !this.props.readonly ? <a style={{display: 'inline-block', width: 40}} onClick={async _ => {this.openPicModel(r.id, r.path, r.thumb)}}>附件</a>
			: <a style={{display: 'inline-block', width: 40}} onClick={async _ => {this.openPreview(r.id, r.path, r.thumb)}}>预览附件</a>
		}],
		pcolumns: [{
			title: '复核',
			dataIndex: 'checkstate',
			render: (t, r) =>  t == 0 ? <Popconfirm
		    title="复核后不可恢复，是否继续复核?"
		    onConfirm={_ => {this.checkDone(r.id)}}
		    okText="是"
		    cancelText="否"
		  ><a href='#'>未复核</a></Popconfirm> : '已复核'
		},{
			title: '未复核说明',
			dataIndex: 'checkdesp',
			render: (t, r) => r.checkstate == 0 ? <Select style={{width: 110}} defaultValue={t || '无验证账户'} onChange={e => this.setCheckDesp(r.id, e)}>
							    		<Option value='无验证渠道'>无验证渠道</Option>
									    <Option value='无验证账户'>无验证账户</Option>
									  </Select> : null
		}],
		type: 'cert',
		pagination: false,
		selectedtable: !this.props.readonly,
		selected: {},
		loading: false,
		tabledata: [],
		modalconf: {visible: false, item: {}},
		fileList: [],
		picmodelConf: {visible: false, item: {}},
		previewConf: {visible: false, item: {}}
	})

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		return getStaffCertList({staffId: this.props.staffId, type: 1})
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.id })
				return baseItem
			}))(res.data)
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

	//复核
	checkDone = id => {
		checkDoneCert({id}).then(res => {
			if(res.code == 200){
				message.success('复核成功')
				this.search()
			}
		})
	}
	//设置未复核原因
	setCheckDesp = (id, v) => {
		setCheckDesp({id, desp:v}).then(res => {})
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
		this.handleOk(deleteStaffCert, 'id', '删除', 'deleteback')
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
		onClick={_ => this.props.staffId ? this.addmodal('modalconf', '添加证书') : message.error('请先保存人员基础信息')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('modalconf', '修改证书')}
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
	<StaffcertForm 
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

export default StaffCert