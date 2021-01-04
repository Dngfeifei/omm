import React, { Component } from 'react'
import { Tabs, Divider } from 'antd'
import ProjectForm from '/page/project/projectForm.jsx'
import ProjectUser from '/page/project/projectUser.jsx'
import ProjectMachine from '/page/project/projectMachine.jsx'
import { getprojitemdetail } from '/api/project'

class ProjectIndex extends Component{

	componentDidMount = _ => {
		let id = this.props.params.id
		this.setState({id})
		this.search()
	}

	state = {
		active: 1,
		id: '',
		loading: false,
		item: {},
		eqs: [],
		mems: []
	}


	search = async _ => {
		await this.setState({loading: true})
		return getprojitemdetail({id: this.state.id})
		.then(res => {
			this.setState({
				loading: false,
				item: res.data.item,
				eqs: res.data.eqs,
				mems: res.data.mems
			})
		})
	}


	render = _ => <div style={{padding: '0 15px', height: '100%'}}>
		<div key="1">
			<Divider orientation="left"><span style={{fontWeight: 'bold'}}>基本信息</span></Divider>
				<ProjectForm item={this.state.item} />
		</div>
		<div key="2">
			<Divider orientation="left"><span style={{fontWeight: 'bold'}}>项目组成员</span></Divider>
				<ProjectUser mems={this.state.mems} />
		</div>
		<div key="3">
			<Divider orientation="left"><span style={{fontWeight: 'bold'}}>设备清单</span></Divider>
				<ProjectMachine eqs={this.state.eqs} />
		</div>
	</div>
}

export default ProjectIndex