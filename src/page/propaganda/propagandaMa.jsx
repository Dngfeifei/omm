import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Icon, Modal, Upload, message } from 'antd'
import { getDictDataList, deleteDictData } from '/api/dict'
import Common from '/page/common.jsx'
import { getPaperList } from '/api/global'
const ButtonGroup = Button.Group
import PaperWall from '/components/PaperWall.jsx'
import { handleTreeData, assignKey } from '/api/tools'


class PropagandaCls extends Common{
	async componentWillMount () {
		this.search()
	}

	state = {
		dictid: 66,
		dictcode: 'aptitude',
		dictname: '资质证书类型',
		istree: 1,
		columns: [{
			title: '名称',
			dataIndex: 'name',
			render: (t, r) => r.children && r.children.length>0 ? <span style={{fontWeight: 'bold', color: '#131212'}}>{t}</span> : t
		},{
			title: '编码',
			dataIndex: 'code'
		}, {
			title: '备注',
			dataIndex: 'tips'
		}, {
			title: '操作',
			dataIndex: 'operator',
			render: (t, r) => r.children && r.children.length>0 ? null : <div><a style={{display: 'inline-block'}} onClick={async _ => {this.openPicModel(r)}}>编辑资料</a></div>
		}],
		selectedtable: false,
		selected: {},
		loading: true,
		tabledata: [],
		treeMenu:[],
		visible: false,
		type: 'dictdata',
		modalconf: {visible: false, item: {}},
		picmodelConf: {visible: false, item: {}},
		defaultExpandAllRows: true,
		search: {name: ''},
		pagination: false,
	}

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({dictid: this.state.dictid}, this.state.search)
		if (!search.condition) delete search.condition	
		return getDictDataList(search)
		.then(res => {
			let data = assignKey(res.data)
			this.setState({
				tabledata: data, 
				loading: false,
			})
		})
	}

	deleteback = _ => {
		this.search()
	}
	delete = _ => {
		this.handleOk(deleteDictData, 'id', '删除', 'deleteback')
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

	export = _ => {
		exportDict({dictid: this.state.dictid}).then(blob => {
			dealBlob(blob, this.state.dictname + '.xlsx')
		})
	}

	openupload = _ => {
		let token = localStorage.getItem('token') || ''
		this.setState({token, uploadconf: {visible: true}, fileList: []})
	}

	downloadTemplate = _ => {
		exportDict({dictid: 0}).then(blob => {
			dealBlob(blob, '数据字典导入模版.xlsx')
		})
	}

	handleChange = ({ file, fileList }) => { 
    if(file.status == 'done'){
  		if(file.response.data && file.response.data.length>0){
  			message.error(file.response.data.map((t, i) => <p key={i}>{t}</p>))
  			this.search()
  		}else{
  			message.success('导入成功')
  			this.search()
  		}
    }
    this.setState({fileList})
  }

  // 打开资料上传
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


	rendermodal = _ => <div>
	<PaperWall onCancel={_ => this.cancelform('picmodelConf')}
		id={this.state.id}
		type={this.state.type}
		path={this.state.path}
		thumb={this.state.thumb}
		fileList={this.state.fileList}
		mutitype={1}
		listType='text'
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
		</Modal>
		</div>

}

export default PropagandaCls