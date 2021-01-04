import React, { Component } from 'react'
import { Modal, Tree, message } from 'antd'
const TreeNode = Tree.TreeNode
import { getAuthTree, setAuthority } from '/api/role'

class RoleAuthority extends Component{
	componentWillReceiveProps = async nextprops => {
		if (nextprops.config.item.id && this.props.config.item.id != nextprops.config.item.id) {
			getAuthTree({roleId: nextprops.config.item.id})
			.then(res => {
				let checkedKeys = [];
				(f => f(f))(f => list => list.map(val => {
					if (val.checked) {
						checkedKeys.push(val.id)
					}
					if (val.childList && val.childList.length) {
						return f(f)(val.childList)
					}
					return
				}))(res.data)
				this.setState({treeData: res.data, checkedKeys: {checked: checkedKeys}, expandKeys: []})
			})
		}
	}
	state = {
		treeData: [],
		loading: false,
		checkedKeys: {checked: []},
		lock: false,
		expandKeys: []
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			setAuthority({
				roleId: this.props.config.item.id,
				ids: this.state.checkedKeys.checked.join(',')
			})
			.then(res => {
				if (res.code == 200) {
					message.success('修改权限成功')
					this.props.done()
				}
				this.setState({lock: false})
			})
		}
	}

	onCheck = checkedKeys => {
		this.setState({checkedKeys})
	}

	onCancel = _ => {
		this.setState({checkedKeys: {checked: []}})
		this.props.onCancel()
	}

	expand = (expandKeys, e) => {
		// let key = expandKeys[expandKeys.length - 1]
		// let keys = []
		// if (key) {
		// 	keys = [key]
		// }
		this.setState({expandKeys})
	}

	render = _ => <Modal title={this.props.config.title}
	style={{top: 50, marginBottom: 100}}
	onOk={this.handleOk}
	visible={this.props.config.visible}
	confirmLoading={this.state.loading}
	onCancel={this.onCancel}
	okText="保存"
	cancelText="取消">
		<div className='authTitle'>{this.props.config.item.name}</div>
		<Tree
		checkable
		expandedKeys={this.state.expandKeys}
		onExpand={this.expand}
		onCheck={this.onCheck}
		checkStrictly
		checkedKeys={this.state.checkedKeys} >
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

export default RoleAuthority