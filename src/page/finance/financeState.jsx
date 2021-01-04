import React from 'react'
import { Input, Button, Icon, Modal, message, Divider } from 'antd'
import { listpaper, deletepaper } from '/api/finance'
import { getCompanys } from '/api/dict'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import FinancePaperForm from '/page/finance/financePaperForm.jsx'
import FinanceStateForm from '/page/finance/financeStateForm.jsx'

class FinancePaper extends Common{
	async componentWillMount () {
		getCompanys({}).then(res => {
			this.setState({companys: res.data})
		})
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({condition: ''}, this.state.pageconf),
		companys: [],
		columns: [{
			title: '公司',
			dataIndex: 'pkcorpname'
		},{
			title: '年份',
			dataIndex: 'year'
		},{
			title: '资料名称',
			dataIndex: 'name'
		},{
			title: '备注',
			dataIndex: 'remark'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			render: (t, r) => <div><a style={{display: 'inline-block'}} onClick={async _ => this.setState({stateconf: {visible: true, item: r}})}>明细查看</a>
			</div>
		}],
		selected: {},
		type: 'CW',
		loading: true,
		id: undefined,
		modalconf: {visible: false, item: {}},
		stateconf: {visible: false, item: {}}
	})


	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({type: this.state.type}, this.state.search)
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


	deleteback = _ => {
		this.search()
	}
	delete = _ => {
		this.handleOk(deletepaper, 'id', '删除', 'deleteback')
	}

	done = async _ => {
		this.search()
		this.cancelform('stateconf')
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
		companys={this.state.companys}
		type = {this.state.type}
		config={this.state.modalconf} />
		<FinanceStateForm 
		onCancel={_ => this.cancelform('stateconf')}
		done={_ => this.done()}
		config={this.state.stateconf} />
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