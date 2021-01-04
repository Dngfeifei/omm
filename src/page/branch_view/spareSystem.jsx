import React from 'react'
import { Input, Button, Icon, Modal, message, Divider } from 'antd'
import { getPaperList } from '/api/global'
import { liststorepaper, deletestorepaper } from '/api/branch'
import { getCompanys } from '/api/dict'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import PreviewWall from '/components/previewWall.jsx'

class SpareSystem extends Common{
	async componentWillMount () {
		this.search()
		getCompanys({}).then(res => {
			this.setState({companys: res.data})
		})
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({condition: ''}, this.state.pageconf),
		companys: [],
		columns: [{
			title: '公司',
			dataIndex: 'pkCorp',
			render: t => {
				if(this.state.companys.length > 0){
					return this.state.companys.filter(e => e.code === t)[0].name
				}else{
					return t
				}
			}
		},{
			title: '年份',
			dataIndex: 'year'
		},{
			title: '季度',
			dataIndex: 'quarter',
			render: t => `第${t}季度`
		},{
			title: '资料名称',
			dataIndex: 'name'
		},{
			title: '资料类别',
			dataIndex: 'papercls'
		},{
			title: '备注',
			dataIndex: 'remark'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			render: (t, r) => <div><a style={{display: 'inline-block'}} onClick={async _ => {this.openPicModel(r)}}>查看资料</a>
			</div>
		}],
		selected: {},
		loading: true,
		id: undefined,
		type: 'store-paper',
		path: '',
		thumb: '',
		fileList: [],
		modalconf: {visible: false, item: {}},
		picmodelConf: {visible: false, item: {}}
	})


	search = async _ => {
		await this.setState({loading: true})
		let search = {type: 'BS'}
		return liststorepaper(search)
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

export default SpareSystem