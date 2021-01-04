import React from 'react'
import { Input, Button, Icon, Modal, message, Divider } from 'antd'
import { listfinancebank, deletefinancebank } from '/api/finance'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import FinanceBankForm from '/page/finance/financeBankForm.jsx'

class FinanceBank extends Common{
	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: {},
		columns: [{
			title: '收款单位',
			dataIndex: 'pkcorpname'
		},{
			title: '开户行',
			dataIndex: 'bank'
		},{
			title: '账号',
			dataIndex: 'account',
		},{
			title: '行号',
			dataIndex: 'bankno'
		},{
			title: '银行地址',
			dataIndex: 'address'
		}],
		selected: {},
		loading: true,
		id: undefined,
		pagination: false,
		modalconf: {visible: false, item: {}},
	})


	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		return listfinancebank(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.id })
				return baseItem
			}))(res.data)
			this.setState({
				tabledata: data, 
				loading: false
			})
		})
	}

	deleteback = _ => {
		this.search()
	}
	delete = _ => {
		this.handleOk(deletefinancebank, 'id', '删除', 'deleteback')
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
		<FinanceBankForm 
		onCancel={_ => this.cancelform('modalconf')}
		done={_ => this.done()}
		companys={this.props.companys}
		type = {this.props.type}
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

export default FinanceBank