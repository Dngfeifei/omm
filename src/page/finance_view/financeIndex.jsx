import React, { Component } from 'react'
import { Select, Button, message, Icon, List, Modal, Input, Tabs, Form, Row, Col } from 'antd'
const TabPane = Tabs.TabPane
import { getCompanys } from '/api/dict'
import moment from 'moment'
import FinancePaper from '/page/finance_view/financePaper.jsx'
import FinanceStateView from '/page/finance_view/financeStateView.jsx'
import FinanceBank from '/page/finance_view/financeBank.jsx'
import FinanceInvoice from '/page/finance_view/financeInvoice.jsx'

/** 财务查看主页面 **/
class FinanceIndex extends Component{

	async componentDidMount () {
		getCompanys({}).then(res => {
			this.setState({companys: res.data})
		})
	}

	state = {
		companys: [],
		readonly: false,
		id: null,
		loading: false,
	}


	render = _ => {
		return <div style={{margin: '8px 4px'}}>
      <Tabs 
		className={'goodTabs'}
		defaultActiveKey="1">
			<TabPane tab="审计报告（投标版）" key="1">
				<div style={{paddingBottom: 50}}>
					<FinancePaper type='SJTB' companys={this.state.companys} readonly = {false} />
				</div>
			</TabPane>
			<TabPane tab="审计报告（完整版）" key="2">
				<div style={{paddingBottom: 50}}>
					<FinancePaper type='SJWZ' companys={this.state.companys} readonly = {false} />
				</div>
			</TabPane>
			<TabPane tab="公司纳税凭证" key="3">
				<div style={{paddingBottom: 50}}>
					<FinancePaper type='NS' companys={this.state.companys} readonly = {false} />
				</div>
			</TabPane>
			<TabPane tab="公司财务信息" key="4">
				<div style={{paddingBottom: 50}}>
					<FinanceStateView type='CW' companys={this.state.companys} readonly = {false} />
				</div>
			</TabPane>
			<TabPane tab="收款银行账户信息" key="5">
				<div style={{paddingBottom: 50}}>
					<FinanceBank companys={this.state.companys} readonly = {false} />
				</div>
			</TabPane>
			<TabPane tab="增值税发票开票信息" key="6">
				<div style={{paddingBottom: 50}}>
					<FinanceInvoice companys={this.state.companys} readonly = {false} />
				</div>
			</TabPane>
		</Tabs>
      </div>
	}

}

export default FinanceIndex