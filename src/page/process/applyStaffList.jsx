import React, { Component } from 'react'
import {Button, message, Icon, Checkbox, Modal, Table, Select} from 'antd'
import { geSelectedStaff } from '/api/staff'
import { getResumeTemplateList } from '/api/resume'
import { saveResumneId, getAndSaveDetailRemote, deleteDetailRemote, changePaperState } from '/api/contapply'
import Staffselect from '/page/staff/staffselect.jsx'

class ApplyContsaleList extends Component{

	async componentWillMount () {
		this.geSelectedStaff(this.props.item)
		this.setState({resumeId: this.props.item.resumeId})
		// 获得简历模版
		getResumeTemplateList({limit: 999, offset: 0}).then(res => {
			this.setState({templates: res.data.records.map(e => {
				return {value: e.id, name: e.name}
				})})
		})
	}

	async componentWillReceiveProps (nextprops) {
		if (nextprops.item != this.props.item) {
			console.log(this.props.item.resumeId)
			this.setState({selecteditems: [], selectedkeys: []})
			//获得已选择
			this.geSelectedStaff(nextprops.item)
			//console.log('item', this.props.item)
		}
	}

	state = {
		canedit: false,
		tableLoading: false,
		templates: [],
		defaultChecked: false,//借用原件是否默认选中
		disableChecked: true,//借用原件是否默认不可用
		projects: [],
		loading: false,
		btnloading: false,
		lock: false,
		visible: false,
		selecteditems: [],
		selectedkeys: [],
		details: [],
		resumeId: null,
		connecting: false,
		columns: [
		{
		  title: '人员',
		  dataIndex: 'name'
		}, {
		  title: '人员编号',
		  dataIndex: 'psncode',
		  width: '30%'
		}, {
		  title: '部门',
		  dataIndex: 'deptName',
		}, {
		  title: '操作',
		  dataIndex: 'operator',
		  render: (t, r) => this.props.item.canedit ? <a title="删除" ><Icon type="delete" onClick={_ => this.removedone(r.key)} /></a> : ''
		}],
		childColumns: [{
		  title: '资料',
		  dataIndex: 'zlname',
		  align: 'right'
		}, {
		  title: '选择原件',
		  dataIndex: 'borrow',
		  render: (t, r) => ((r.paperNum > r.lockNum || r.checked) && this.props.item.canedit ) ? <Checkbox onChange={e => this.changeCheckBox(r, e.target.checked)} 
		  checked={r.checked} >原件</Checkbox> : <Checkbox onChange={e => this.changeCheckBox(r, e.target.checked)} 
		  checked={r.checked} disabled={true}>原件</Checkbox>
		}]
	}
	//获得已选择列表
	geSelectedStaff = r => {
		this.setState({tableLoading: true})
		geSelectedStaff({id: r.id}).then(res => {
			this.setState({selecteditems: res.data.staffs.map(val => Object.assign({}, val, { key: val.id })), 
				selectedkeys: res.data.staffs.map(e => e.id), details: res.data.details, tableLoading: false})
		})
	}
	//全选 -- 暂时不用
	changeCheckAll = b => {
		this.state.selecteditems.forEach(t => {
				if(t.ncontnum - t.lockNum > 0)
				t.checked = b
			})
		this.setState({selecteditems: this.state.selecteditems})
	}
	//修改-借用原件
	changeCheckBox = (r, v) =>{
		const details = this.state.details
		details[r.pid].forEach(e => {
			if(r.key == e.key){
    		e.checked = v
    	}
		})
		this.setState({connecting: true})
		changePaperState({id: this.props.item.id, docCode: r.type, docId: r.id, state: v ? 1 : 0}).then(res => {
			this.setState({connecting: false})
		})
    	this.setState({details})
	}

	addmodel = _ => {
		this.setState({visible: true})
	}

	selectdone = items => {
		const ids = []
		items.forEach(item => {

			if(this.state.selectedkeys.indexOf(item.key) < 0){
				console.log('0000')
				item.checked = this.state.defaultChecked
				this.state.selecteditems.push(item)
				this.state.selectedkeys.push(item.key)
				ids.push(item.id)
			}
		})
		this.setState({connecting: true})
		//保存人员明细，并获得证件明细
		getAndSaveDetailRemote({id: this.props.item.id, ids: ids}).then(res=> {
			const details = {...this.state.details, ...res.data}
			this.setState({details, connecting: false})
		})
	}

	//删除已选择人员
	removedone = key => {
		this.setState({connecting: true})
		deleteDetailRemote({id: this.props.item.id, staffId: key}).then(res => {
			this.setState({connecting: false})
		})
		let selecteditems = this.state.selecteditems.filter(function(item) {
			return item.key !== key
		})
		let selectedkeys = this.state.selectedkeys.filter(function(item) {
		  return item !== key
		})
		const details = this.state.details
		delete details[key]
		this.setState({selecteditems, selectedkeys, details})
	}

	rendermodal = _ => 
		<Modal title="选择资料"
			footer={null}
		  visible={this.state.visible}
		  onCancel={_ => this.setState({visible: false})}
		  mask={true}
		  width='90%'
		>
			<Staffselect isOriginal = {this.state.defaultChecked} 
			selectedkey={this.state.selectedkeys}
			visible={this.state.visible}
			selectdone={this.selectdone} 
			onCancel={_ => this.setState({visible: false})}  />
		</Modal> 

	getDetail = t => {
		return <Table size='small' columns={this.state.childColumns} dataSource={this.state.details[t.id] || []} pagination={false} />
	}
	//修改表单内容(简历模版\)
	changeApplyForm = param => {
		this.setState({...param, connecting: true})
		param.id = this.props.item.id
		saveResumneId(param).then(res => {
			//修改简历模版成功
			this.setState({connecting: false})
		})
	}
	//关闭窗口
	closeModal = _ => {
		if(!this.state.connecting) {
			this.props.onCancel()
		}else{
			message.error('数据正在提交，请稍后再试!')
		}
	}


	render = _ => {
			return <Modal title='查看人员信息'
						  visible={this.props.visible}
						  onCancel={_ => this.closeModal()}
						  footer={null}
						  width='90%'
						  style={{top: 50, marginBottom: 100}}>
		<div style={{width: '96%', margin: '10px 20px'}}>
			<p>需求描述：{this.props.item.remark}</p>
		<div>
      {this.props.item.canedit ? <Button icon="select" onClick={this.addmodel}>选择资料</Button> : null}
	{this.props.item.canedit ? <Select
			value={this.state.resumeId}
			showSearch
			style={{ width: 200 }}
			placeholder="选择简历模版"
			optionFilterProp="children"
			onChange={e => this.changeApplyForm({resumeId: e})}
			filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
			{this.state.templates.map(t => <Option value={t.value} key={t.value}>{t.name}</Option>)}
		</Select> : null}
			<p style={{width: 170, float: 'right'}}>【已选择数量：{this.state.selectedkeys.length}】</p>
		</div>
      <Table columns={this.state.columns} dataSource={this.state.selecteditems}
			 loading={this.state.tableLoading} size='small'
      expandedRowRender={this.getDetail}
      locale={{emptyText: '暂无数据'}} pagination={false} />
    	 {this.rendermodal()}
    	<div style={{height: 50}}></div>
      </div>
	</Modal>
	}

}

export default ApplyContsaleList