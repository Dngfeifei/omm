import React, { Component } from 'react'
import { Modal, Tree, message } from 'antd'
const TreeNode = Tree.TreeNode
import { getRoleTree, setRole } from '/api/mgr'

class MGRole extends Component{
	componentDidMount () {
		this.fetch()
	}
	componentWillReceiveProps (nextprops) {
		if (nextprops.config.item && this.props.config.item.roleid != nextprops.config.item.roleid && nextprops.config.visible) {
			this.fetch()
			let checkedKeys = []
			if (nextprops.config.item.roleid) {
				checkedKeys = nextprops.config.item.roleid.split(',')
			}
			this.setState({checkedKeys})
		}
	}
	state = {
		treeData: [],
		loading: false,
		checkedKeys: [],
		lock: false
	}

	fetch = _ => getRoleTree()
	.then(res => {
		this.setState({treeData: res.data})
	})

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			setRole({
				userId: this.props.config.item.id,
				roleIds: this.state.checkedKeys.join(',')
			})
			.then(res => {
				if (res.code == 200) {
					message.success('角色分配成功')
					this.props.done()
				}
				this.setState({lock: false})
			})
		}
	}

	onCheck = item => {
		this.setState({checkedKeys: item.checked})
	}

	onCancel = _ => {
		this.setState({checkedKeys: []})
		this.props.onCancel()
	}

	render = _ => <Modal title={this.props.config.title}
	onOk={this.handleOk}
	visible={this.props.config.visible}
	confirmLoading={this.state.loading}
	onCancel={this.onCancel}
	style={{top: 50, marginBottom: 100}}
	okText="保存"
	cancelText="取消">
		<Tree
		checkable
		checkStrictly
		onCheck={this.onCheck}
		checkedKeys={this.state.checkedKeys}
		defaultExpandAll >
			{(f => f(f))(f => list => list.map(val => val.childList && val.childList.length ? (
				<TreeNode title={val.name} key={val.id} >
					{f(f)(val.childList)}
				</TreeNode>
			) : (
				<TreeNode title={val.name} key={val.id} />
			) ))(this.state.treeData)}
		</Tree>
	</Modal>
}

export default MGRole