import React from 'react'
import { Input, Button, Icon, Modal, message, Divider } from 'antd'
import { getPaperList } from '/api/global'
import { listpaper, deletepaper } from '/api/finance'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import PaperWall from '/components/PaperWall.jsx'
import FinancePaperForm from '/page/finance/financePaperForm.jsx'

class FinancePaper extends Common{
	async componentWillMount () {
		const columns = this.state.baseColumns.filter(e => {
			if(this.props.type === 'NS'){
				return e.dataIndex !== 'year' && e.dataIndex !== 'paperNum'
			}else if(this.props.type === 'SJWZ'){
				return e.dataIndex !== 'month'
			}else{
				return e.dataIndex !== 'month' && e.dataIndex !== 'paperNum'
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
			render: (t, r) => <div><a style={{display: 'inline-block'}} onClick={async _ => {this.openPicModel(r)}}>编辑资料</a>
			</div>
		}],
		selected: {},
		loading: true,
		id: undefined,
		type: 'finance-paper',
		path: '',
		thumb: '',
		fileList: [],
		modalconf: {visible: false, item: {}},
		picmodelConf: {visible: false, item: {}}
	})


	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({type: this.props.type}, this.state.search)
		return listpaper(search)
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
		this.handleOk(deletepaper, 'id', '删除', 'deleteback')
	}

	done = async _ => {
		this.search()
		this.cancelform('modalconf')
	}

	renderBtn = _ => <div>
	<ButtonGroup>
		<Button 
		onClick={_ => this.addmodal('modalconf', '添加资料')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('modalconf', '编辑资料')}
		type="primary" icon="edit">修改</Button>
		<Button 
		onClick={this.changemodel}
		type="primary" icon="close">删除</Button>
	</ButtonGroup>
	</div>

	rendermodal = _ => <div>
		<FinancePaperForm 
		onCancel={_ => this.cancelform('modalconf')}
		done={_ => this.done()}
		companys={this.props.companys}
		type = {this.props.type}
		config={this.state.modalconf} />
		<PaperWall onCancel={_ => this.cancelform('picmodelConf')}
		id={this.state.id}
		type={this.state.type}
		path={this.state.path}
		thumb={this.state.thumb}
		fileList={this.state.fileList}
		config={this.state.picmodelConf} />
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

export default FinancePaper