import React, { Component } from 'react'
import { Select, Button, message, Icon, List, Modal, Input, Tabs, Form, Row, Col } from 'antd'
const TabPane = Tabs.TabPane
import { addStaff, getDetail } from '/api/staff'
import moment from 'moment'
import Branchcontlist from '/page/branch_view/branchcontlist.jsx'
import Branchpaper from '/page/branch_view/branchpaper.jsx'

class BranchIndex extends Component{

	async componentDidMount () {
		this.setState({branch: this.props.params})
	}

	state = {
		readonly: false,
		branch: {},
		loading: false,
		lock: false,
		visible: false
	}


	render = _ => {
		return <div style={{margin: '8px 4px'}}>
		<Form className="flex-form">
			<Row gutter={24}>
        <Col span={8} style={{ display: 'block'}}>
        	分公司名称: {this.state.branch.branchName}
        	</Col>
      	<Col span={8} style={{ display: 'block'}}>
        	法人名称: {this.state.branch.legalName}
        	</Col>
        </Row>
      </Form>
      <Tabs 
		className={'goodTabs'}
		defaultActiveKey="1">
			<TabPane tab="租房合同" key="1">
				<div style={{paddingBottom: 50}}>
					<Branchcontlist branchId = {this.props.params.id} />
				</div>
			</TabPane>
			<TabPane tab="影像资料" key="2">
				<div style={{paddingBottom: 50}}>
					<Branchpaper branchId = {this.props.params.id} />
				</div>
			</TabPane>
		</Tabs>
      </div>
	}

}

export default BranchIndex