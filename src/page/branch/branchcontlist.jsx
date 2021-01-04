import React from 'react'
import { Input, Button, Icon, Modal, message, Divider } from 'antd'
import { getPaperList } from '/api/global'
import Common from '/page/common.jsx'
import { listbranchcont, deletebranchcont } from '/api/branch'
const ButtonGroup = Button.Group
import PaperWall from '/components/PaperWall.jsx'
import BranchContForm from '/page/branch/branchcontForm.jsx'

class BranchContList extends Common{
	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({condition: ''}),
		columns: [{
			title: '合同地址',
			dataIndex: 'address'
		},{
			title: '面积',
			dataIndex: 'area'
		},{
			title: '月租金',
			dataIndex: 'monthRent'
		},{
			title: '年租金',
			dataIndex: 'yearRent'
		},{
			title: '押金',
			dataIndex: 'deposit'
		},{
			title: '违约金',
			dataIndex: 'damages'
		},{
			title: '可使用费用',
			dataIndex: 'fee'
		},{
			title: '起租日期',
			dataIndex: 'startDate'
		},{
			title: '终止日期',
			dataIndex: 'overDate'
		},{
			title: '原件数量',
			dataIndex: 'paperNum'
		},{
			title: '是否特批',
			dataIndex: 'specially',
			render: t => t == '1' ? '是' : '否'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			render: (t, r) => <div>
			<a style={{display: 'inline-block'}} onClick={_ => this.openPicModel(r, 'cont')}>合同</a>
			<Divider type="vertical" />
			<a style={{display: 'inline-block'}} onClick={_ => this.openPicModel(r, 'bill')}>发票</a>
			</div>
		}],
		pagination: false,
		selected: {},
		loading: true,
		id: undefined,
		fileList: [],
		modalconf: {visible: false, item: {}},
		picmodelConf: {visible: false, item: {}}
	})


	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = {branchId: this.props.branchId}
		return listbranchcont(search)
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

	openPicModel = (r, cls) => {
		let id = r.id
		let type = 'branch-' + cls
		let path = type + '-' + r.id
		let thumb = type + '-' + r.id
		getPaperList({bid: id, type}).then(res => {
			 if(res.code == 200){
			 		this.setState({id, type, path, thumb, fileList: res.data})
					this.setState({picmodelConf: {visible: true}})
			 }
		})
	}

	deleteback = _ => {
		this.search()
	}
	delete = _ => {
		this.handleOk(deletebranchcont, 'id', '删除', 'deleteback')
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

	renderBtn = _ => <div>
	{this.props.readonly ? null : <ButtonGroup>
		<Button 
		onClick={_ => this.addmodal('modalconf', '添加租房合同')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('modalconf', '编辑租房合同')}
		type="primary" icon="edit">修改</Button>
		<Button 
		onClick={this.changemodel}
		type="primary" icon="close">删除</Button>
	</ButtonGroup>
	}	
	</div>

	rendermodal = _ => <div>
		<PaperWall onCancel={_ => this.cancelform('picmodelConf')}
		id={this.state.id}
		type={this.state.type}
		path={this.state.path}
		thumb={this.state.thumb}
		fileList={this.state.fileList}
		config={this.state.picmodelConf} />
		<BranchContForm 
		onCancel={_ => this.cancelform('modalconf')}
		done={_ => this.done()}
		branchId={this.props.branchId}
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

export default BranchContList