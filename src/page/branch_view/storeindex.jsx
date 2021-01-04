import React, { Component } from 'react'
import { Select, Button, message, Icon, List, Modal, Input, Tabs, Form, Row, Col } from 'antd'
const TabPane = Tabs.TabPane
import { addStaff, getDetail } from '/api/staff'
import moment from 'moment'
import Branchcontlist from '/page/branch_view/branchcontlist.jsx'
import Storepaper from '/page/branch_view/storepaper.jsx'
import SpareSystem from '/page/branch_view/spareSystem.jsx'
import Storebjlist from '/page/branch_view/storebjlist.jsx'
import Storezjlist from '/page/branch_view/storezjlist.jsx'

class BranchIndex extends Component{

	async componentDidMount () {
		this.setState({branch: this.props.params})
	}

	state = {
		readonly: false,
		branch: {},
		id: null,
		loading: false,
		lock: false,
		visible: false
	}


	render = _ => {
		return <div style={{margin: '8px 4px'}}>
		<Form className="flex-form">
			<Row gutter={24}>
        <Col span={8} style={{ display: 'block'}}>
        	区域: {this.state.branch.area}
        	</Col>
      	<Col span={8} style={{ display: 'block'}}>
        	仓库名称: {this.state.branch.storname}
        	</Col>
        <Col span={8} style={{ display: 'block'}}>
        	联系人: {this.state.branch.linkName}
        	</Col>
      	<Col span={8} style={{ display: 'block'}}>
        	联系电话: {this.state.branch.phone}
        	</Col>
      	<Col span={8} style={{ display: 'block'}}>
        	座机号码: {this.state.branch.zphone}
        	</Col>
      	<Col span={8} style={{ display: 'block'}}>
        	邮编: {this.state.branch.zcode}
        	</Col>
      	<Col span={8} style={{ display: 'block'}}>
        	到货地址: {this.state.branch.address}
        	</Col>	
        </Row>
      </Form>
      <Tabs 
		className={'goodTabs'}
		defaultActiveKey="1">
			<TabPane tab="租房合同" key="1">
				<div style={{paddingBottom: 50}}>
					<Branchcontlist branchId = {this.props.params.branchId} readonly = {true} />
				</div>
			</TabPane>
			<TabPane tab="备件库照片" key="2">
				<div style={{paddingBottom: 50}}>
					<Storepaper storeId = {this.props.params.id} />
				</div>
			</TabPane>
			<TabPane tab="NC系统截图" key="3">
				<div style={{paddingBottom: 50}}>
					<SpareSystem />
				</div>
			</TabPane>
			{/** <TabPane tab="备件库清单" key="4">
				<div style={{paddingBottom: 50}}>
					<Storebjlist storeId = {this.props.params.storid} />
				</div>
			</TabPane>
			<TabPane tab="整机库清单" key="5">
				<div style={{paddingBottom: 50}}>
					<Storezjlist storeId = {this.props.params.storid} areaName={this.props.params.area} />
				</div>
			</TabPane> **/}
		</Tabs>
      </div>
	}

}

export default BranchIndex