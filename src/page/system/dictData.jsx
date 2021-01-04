import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Icon, Modal, Upload, message } from 'antd'
import { getDictDataList, deleteDictData, exportDict, importURL } from '/api/dict'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import DictDataForm from '/components/dict/dictDataForm.jsx'
import { handleTreeData, assignKey, dealBlob } from '/api/tools'


class DictData extends Common{
	async componentWillMount () {
		let dictid = this.props.params.dictid
		let dictname = this.props.params.dictname
		let istree = this.props.params.istree
		this.setState({dictid, istree, dictname})
		this.search()
	}

	state = {
		dictid: undefined,
		dictname: '数据字典',
		istree: 1,
		columns: [{
			title: '名称',
			dataIndex: 'name'
		},{
			title: '编码',
			dataIndex: 'code'
		}, {
			title: 'ID',
			dataIndex: 'id'
		}, {
			title: '排序',
			dataIndex: 'num'
		}, {
			title: '备注',
			dataIndex: 'tips'
		}, {
			title: '备用字段1',
			dataIndex: 'field1'
		}, {
			title: '备用字段2',
			dataIndex: 'field2'
		}, {
			title: '备用字段3',
			dataIndex: 'field3'
		}],
		selectedtable: true,
		selected: {},
		loading: true,
		uploadconf: {visible: false},
		tabledata: [],
		modalconf: {visible: false, item: {}},
		search: {name: ''},
		fileList: [],
		pagination: false,
		treeMenu: [],
		token: ''
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
				treeMenu: handleTreeData(data, 'name', 'id', 'children')
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

	renderBtn = _ => <div>
	<ButtonGroup>
		<Button 
		onClick={_ => this.addmodal('modalconf', '添加数据')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('modalconf', '编辑数据')}
		type="primary" icon="edit">修改</Button>
		<Button 
		onClick={this.changemodel}
		type="primary" icon="close">删除</Button>
		<Button 
		onClick={this.export}
		type="primary" icon="download">导出</Button>
		<Button 
		onClick={this.openupload}
		type="primary" icon="upload">导入</Button>
	</ButtonGroup>
	</div>

	rendermodal = _ => <div><DictDataForm 
		onCancel={_ => this.cancelform('modalconf')}
		done={_ => this.done()}
		dictid={this.state.dictid}
		istree={this.state.istree}
		getTree={_ => this.search()}
		treeData={this.state.treeMenu}
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
		</Modal>
		<Modal title="导入"
		  visible={this.state.uploadconf.visible}
		  footer={null}
		  mask={true}
		  width={500}
		  onCancel={_ => this.setState({uploadconf: {visible: false}})}
		>
		<p>数据字典导入，<a onClick={this.downloadTemplate}>模版下载</a></p>
			<Upload className='attr-upload'
					action={`${importURL}`}
					data={{dictid: this.state.dictid}}
					headers={{Authorization: `Bearer ${this.state.token}`}}
					onChange = {this.handleChange}
					fileList = {this.state.fileList}
					multiple={false} >
						<Button>
							<Icon type="upload" /> 导入数据
						</Button>
			</Upload>
		</Modal>
		</div>

}

export default DictData