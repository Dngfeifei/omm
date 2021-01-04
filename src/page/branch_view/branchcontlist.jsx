import React from 'react'
import { Input, Button, Icon, Modal, message, Divider } from 'antd'
import { getPaperList } from '/api/global'
import Common from '/page/common.jsx'
import { listbranchcont, deletebranchcont } from '/api/branch'
const ButtonGroup = Button.Group
import PreviewWall from '/components/previewWall.jsx'

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


	renderBtn = _ => <div>
	</div>

	rendermodal = _ => <div>
		<PreviewWall onCancel={_ => this.cancelform('picmodelConf')}
		id={this.state.id}
		type={this.state.type}
		path={this.state.path}
		thumb={this.state.thumb}
		fileList={this.state.fileList}
		config={this.state.picmodelConf} />
		</div>

}

export default BranchContList