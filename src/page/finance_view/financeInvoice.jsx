import React from 'react'
import { Input, Button, Icon, Modal, message, Divider } from 'antd'
import { listfinanceinvoice, deletefinanceinvoice, exportInvoice } from '/api/finance'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import { dealBlob } from '/api/tools'

/** 发票信息 **/
class FinanceBank extends Common{
	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: {},
		columns: [{
			title: '公司名称',
			dataIndex: 'pkcorpname'
		},{
			title: '纳税识别号',
			dataIndex: 'taxno'
		},{
			title: '地址',
			dataIndex: 'address',
		},{
			title: '电话',
			dataIndex: 'phone'
		},{
			title: '开户行',
			dataIndex: 'bank'
		},{
			title: '账号',
			dataIndex: 'account'
		}],
		selectedtable: false,
		btnLoading: false,
		loading: true,
		id: undefined,
		pagination: false,
		modalconf: {visible: false, item: {}},
	})


	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		return listfinanceinvoice(search)
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

	//导出
	exportExcel = _ => {
		this.setState({btnLoading: true})
		exportInvoice({}).then(blob => {
			dealBlob(blob, '公司收款账号.xlsx')
			this.setState({btnLoading: false})
		})
	}


	renderBtn = _ => <div>
		<Button 
		onClick={this.exportExcel}
		type="primary" icon="download" loading={this.state.btnLoading}>导出</Button>
	</div>

	rendermodal = _ => <div></div>

}

export default FinanceBank