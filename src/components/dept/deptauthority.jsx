import React, { Component } from 'react'
import { Modal, Tree, message } from 'antd'
const TreeNode = Tree.TreeNode
import { listCertDept, setDeptAuthority } from '/api/cert'

class DeptAuthority extends Component{
	componentWillReceiveProps = async nextprops => {
		if (nextprops.config.item.id && this.props.config.item.id != nextprops.config.item.id) {
			listCertDept({certTypeId: nextprops.config.item.id})
			.then(res => {
				let checkedKeys = [];
				(f => f(f))(f => list => list.map(val => {
					if (val.checked) {
						checkedKeys.push(val.id)
					}
					if (val.childrenDepts && val.childrenDepts.length) {
						return f(f)(val.childrenDepts)
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
			console.log(this.state.checkedKeys)
			await this.setState({lock: true})
			setDeptAuthority({
				certTypeId: this.props.config.item.id,
				ids: this.state.checkedKeys.join(',')
			})
			.then(res => {
				if (res.code == 200) {
					message.success('修改资质证书权限成功')
					this.props.onCancel()
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
		checkedKeys={this.state.checkedKeys} >
			{(f => f(f))(f => list => list.map(val => val.childrenDepts && val.childrenDepts.length ? (
				<TreeNode title={val.name} key={val.id} >
					{f(f)(val.childrenDepts)}
				</TreeNode>
			) : (
				<TreeNode title={val.name} key={val.id} />
			) ))(this.state.treeData)}
		</Tree>
	</Modal>
}

export default DeptAuthority