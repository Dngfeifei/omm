import React from 'react'
import { Input, Button, Icon, Modal, Select } from 'antd'
const InputGroup = Input.Group
import { getStaffList, deleteStaff } from '/api/staff'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import moment from 'moment'

class Staff extends Common{
	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({condition: ''}, this.state.pageconf),
		columns: [{
			title: '名称',
			dataIndex: 'name'
		},{
			title: '部门',
			dataIndex: 'deptName'
		},{
			title: '工作省份',
			dataIndex: 'province'
		},{
			title: '地市',
			dataIndex: 'city'
		},{
			title: '社保缴纳地',
			dataIndex: 'socialinsure'
		},{
			title: '工作年限',
			dataIndex: 'bussiyear',
			render: (t, r) =>  r.startdDate ? moment(new Date).diff(moment(r.startdDate), 'year') : ''
		},{
			title: '文化程度',
			dataIndex: 'educational'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			align: 'center',	
			render: (t, r) => <a style={{display: 'inline-block', width: 60}} onClick={_ => this.addpanel(r.id)}>查看</a>
		}],
		selectedtable: false,
		selected: {},
		loading: true,
		tabledata: [],
		modalconf: {visible: false, item: {}}
	})

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		// if (!search.mpstatus) search.mpstatus = '在职'
		return getStaffList(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.id })
				return baseItem
			}))(res.data.records)
			this.setState({
				tabledata: data, 
				loading: false,
				pagination: Object.assign({}, this.state.pagination, {
					total: Number(res.data.total),
					current: Number(res.data.current)
				})
			})
		})
	}

	deleteback = _ => {
		this.search()
	}
	delete = _ => {
		this.handleOk(deleteStaff, 'id', '删除', 'deleteback')
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

	addpanel = async id => {
		await window.remove('staffForm')
		let pane = {
			title: '查看人员信息',
			key: 'staffForm',
			url: 'staffForm',
			params: {
				id,
				readonly: 'Y'
			}
		}
		window.add(pane)
	}
	/***
	certApply = _ => {
		let pane = {
				title: '人员电子证书申请',
				key: 'staffapplyForm',
				url: 'staffapplyForm'
			}
		if (parent.add) {
			parent.add(pane)
		} else {
			this.props.add(pane)
		}
	}

	resumeApply = _ => {
		let pane = {
				title: '简历申请',
				key: 'resumeapplyForm',
				url: 'resumeapplyForm'
			}
		if (parent.add) {
			parent.add(pane)
		} else {
			this.props.add(pane)
		}
	}

	picApply = _ => {
		let pane = {
				title: '影像资料申请',
				key: 'staffpicapplyForm',
				url: 'staffpicapplyForm'
			}
		if (parent.add) {
			parent.add(pane)
		} else {
			this.props.add(pane)
		}
	}
  ***/
	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<Input
			style={{width: 200}}
			value={this.state.search.name}
			allowClear
			onChange={e => this.changeSearch({name: e.target.value})}
			addonBefore="名称" placeholder="输入名称" />
			<Input
			style={{width: 200}}
			value={this.state.search.city}
			onChange={e => this.changeSearch({city: e.target.value})}
			addonBefore="工作地市" placeholder="" />
			<Input
			style={{width: 200}}
			value={this.state.search.dept}
			onChange={e => this.changeSearch({dept: e.target.value})}
			addonBefore="部门" placeholder="" />
			<Input
			style={{width: 200}}
			value={this.state.search.socialinsure}
			onChange={e => this.changeSearch({socialinsure: e.target.value})}
			addonBefore="社保缴纳地" placeholder="" />
			<InputGroup compact style={{width: 300, display: 'inline-block'}}>
        <Input value={this.state.search.minyear} type='number'
        	onChange={e => this.changeSearch({minyear: e.target.value})}
        style={{ width: 100, textAlign: 'center' }} placeholder="工作年限" />
        <Input
          style={{
            width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff',
          }}
          placeholder="~"
          disabled
        />
        <Input value={this.state.search.maxyear} type='number'
        	onChange={e => this.changeSearch({maxyear: e.target.value})}
        style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="工作年限" />
      </InputGroup>
			<Input
			style={{width: 300}}
			value={this.state.search.certname}
			allowClear
			onChange={e => this.changeSearch({certname: e.target.value})}
			addonBefore="证书" placeholder="输入名称" />
			<Select size='small' 
			value={this.state.search.mpstatus}
			allowClear
			placeholder="选择在职状态"
			onChange={e => this.changeSearch({mpstatus: e})}
			style={{width: 160}}>
				    <Option value='在职'>在职</Option>
				    <Option value='离职'>离职</Option>
			</Select>
			<Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
			{/**
			<Button 
			onClick={this.certApply}
			type="primary" icon="profile">证书申请</Button>
			<Button 
			onClick={this.resumeApply}
			type="primary" icon="profile">简历申请</Button>
			<Button 
			onClick={this.picApply}
			type="primary" icon="profile">影像资料申请</Button> **/}
		</div>
	</div>

	rendermodal = _ => <div>
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

export default Staff