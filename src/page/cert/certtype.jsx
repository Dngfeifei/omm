import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Icon, Modal, Upload, message } from 'antd'
import { getDictDataList, deleteDictData } from '/api/dict'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import DictDataForm from '/components/dict/dictDataForm.jsx'
import DeptAuthority from '/components/dept/deptauthority.jsx'
import { handleTreeData, assignKey } from '/api/tools'


class CertType extends Common{
	async componentWillMount () {
		this.search()
	}

	state = {
		dictid: 56,
		dictcode: 'aptitude',
		dictname: '资质证书类型',
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
		}],
		selectedtable: true,
		selected: {},
		loading: true,
		tabledata: [],
		modalconf: {visible: false, item: {}},
		search: {name: ''},
		pagination: false,
		treeMenu: [],
		deptModal: {visible: false, item: {}}
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

  //权限设置，只有叶子结点才可以设置权限
  setAuth = _ => {
  	if (this.state.selected.selectedKeys && this.state.selected.selectedKeys.length){
  		let item = this.state.selected.selectedItems[0]
  		if(item.isparentnode && item.isparentnode == 1){
  			message.error('请先择最小分类进行权限设置')
  			return
  		}
  	}
  	this.editmodal('deptModal', '权限配置')
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
		onClick={_ => this.setAuth()}
		type="primary" icon="close">权限设置</Button>
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
		<DeptAuthority
		onCancel={_ => this.cancelform('deptModal')}
		done={_ => this.done('deptModal')}
		config={this.state.deptModal} />
		</div>

}

export default CertType