import React from 'react'
import { Button, Modal, Input, Icon } from 'antd'
const ButtonGroup = Button.Group
import Common from '/page/common.jsx'
import MachineForm from '/page/contract/machineForm.jsx'
import { deleteMachine } from '/api/contsale'

class ContractMachine extends Common{

	async componentWillMount () {
		this.search()
	}

	async componentWillReceiveProps (nextprops) {
		if (nextprops.eqs != this.props.eqs) {
			this.search(nextprops.eqs)
		}
	}

	state = Object.assign({}, this.state, {
		columns: [{
			title: '设备pn号',
			dataIndex: 'invname'
		},{
			title: '设备分类',
			dataIndex: 'invclassname'
		},{
			title: '设备描述 ',
			dataIndex: 'invspec'
		},{
			title: '数量',
			dataIndex: 'nquantity'
		},{
			title: '备注',
			dataIndex: 'vmemo'
		}],
		visible: false,
		selectedtable: !this.props.readonly,
		pagination: false,
		modalconf: {visible: false, item: {}}
	})

	search = cs => {
		const eqs = cs || this.props.eqs
		let data = eqs.map(val => Object.assign({}, val, {key: val.pkContsaleEq}))
		this.setState({
			tabledata: data,
			loading: false
		})
	}

	deleteback = async _ => {
		await this.props.refresh()
		this.search()
	}
	delete = _ => {
		this.handleOk(deleteMachine, 'pkContsaleEq', '删除', 'deleteback')
	}

	done = async _ => {
		let type = this.state.modalconf.type
		let config = {}
		config.modalconf = {visible: false, item: {}}
		this.setState(config)
		await this.props.refresh()
		this.search()
	}

	renderBtn = _ => !this.props.readonly ? <div>
	<ButtonGroup>
		<Button 
		onClick={_ => this.addmodal('modalconf', '添加设备')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('modalconf', '修改设备')}
		type="primary" icon="edit">修改</Button>
		<Button 
		onClick={this.changemodel}
		type="primary" icon="close">删除</Button>
	</ButtonGroup>
	</div> : null

	rendermodal = _ => <div>
	<MachineForm 
		contsaleId = {this.props.contsaleId}
		onCancel={_ => this.cancelform('modalconf')}
		done={_ => this.done()}
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

export default ContractMachine