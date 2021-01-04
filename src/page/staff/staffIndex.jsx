import React, { Component } from 'react'
import { Tabs, Spin } from 'antd'
const TabPane = Tabs.TabPane
import Stafftech from '/page/staff/stafftech.jsx'
import Staffcert from '/page/staff/staffcert.jsx'
import Staffcertspe from '/page/staff/staffcertspe.jsx'
import Staffproj from '/page/staff/staffproj.jsx'
import Staffwork from '/page/staff/staffwork.jsx'
import Staffedu from '/page/staff/staffedu.jsx'
import Stafftrain from '/page/staff/stafftrain.jsx'
import StaffpicCont from '/page/staff/staffpicCont.jsx'
import Staffpic from '/page/staff/staffpic.jsx'

class StaffIndex extends Component{

	componentWillMount = _ => {

	}
	state = {
		active: 1,
		loading: false
	}

	render = _ => <div style={{padding: '0 15px', height: '100%', marginBottom: 10}}>
	<Spin spinning={this.state.loading}>
		<Tabs 
		className={'goodTabs'}
		defaultActiveKey="1">
			<TabPane tab="工作技能" key="1">
				<div style={{paddingBottom: 50}}>
					<Stafftech staffId = {this.props.staffId} readonly={this.props.readonly}/>
				</div>
			</TabPane>
			<TabPane tab="证书信息" key="2">
				<div style={{paddingBottom: 50}}>
					<Staffcert staffId = {this.props.staffId} readonly={this.props.readonly}/>
				</div>
			</TabPane>
			<TabPane tab="特殊证书" key="3">
				<div style={{paddingBottom: 50}}>
					<Staffcertspe staffId = {this.props.staffId} readonly={this.props.readonly}/>
				</div>
			</TabPane>
			<TabPane tab="项目经验" key="4">
				<div style={{paddingBottom: 50}}>
					<Staffproj staffId = {this.props.staffId} readonly={this.props.readonly}/>
				</div>
			</TabPane>
			<TabPane tab="工作简历" key="5">
				<div style={{paddingBottom: 50}}>
					<Staffwork staffId = {this.props.staffId} readonly={this.props.readonly}/>
				</div>
			</TabPane>
			<TabPane tab="教育经历" key="6">
				<div style={{paddingBottom: 50}}>
					<Staffedu staffId = {this.props.staffId} readonly={this.props.readonly}/>
				</div>
			</TabPane>
			<TabPane tab="培训经历" key="7">
				<div style={{paddingBottom: 50}}>
					<Stafftrain staffId = {this.props.staffId} readonly={this.props.readonly}/>
				</div>
			</TabPane>
			<TabPane tab="劳动合同" key="8">
				<div style={{paddingBottom: 50}}>
					<StaffpicCont staffId = {this.props.staffId} readonly={this.props.readonly}/>
				</div>
			</TabPane>
			<TabPane tab="影像资料" key="9">
				<div style={{paddingBottom: 50}}>
					<Staffpic staffId = {this.props.staffId} readonly={this.props.readonly}/>
				</div>
			</TabPane>
		</Tabs>
	</Spin>	
	</div>
}

export default StaffIndex