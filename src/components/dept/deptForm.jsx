import React, { Component } from 'react'
import { Modal, Input, Form, Button, TreeSelect, message, InputNumber } from 'antd'
const FormItem = Form.Item
import { connect } from 'react-redux'
import { addDept, editDept } from '/api/dept'
import { handleTreeTop } from '/api/tools'
import { GET_DEPT_TREE } from '/redux/action'

@connect(state => ({
	depttree: state.global.depttree
}), dispath => ({
	getTree(){dispath({type: GET_DEPT_TREE})},
}))
class Dept extends Component{
	async componentWillMount () {
		this.props.getTree()
	}

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					simplename: {value: mes.simplename},
					fullname: {value: mes.fullname},
					tips: {value: mes.tips},
					pid: {value: mes.pid !== undefined && mes.pid !== '' ? mes.pid.toString() : undefined},
					num: {value: mes.num}
				})
			}
		}
	}
	state = {
		rules: [{
			label: '部门名称',
			key: 'simplename',
			option: {
				rules: [{
		        	required: true, message: '请输入角色名称!',
			    }]
			},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '部门全称',
			key: 'fullname',
			option: {
				rules: [{
			        required: true, message: '别名不能为空!',
			    }]
			},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '上级部门',
			key: 'pid',
		    option: {
				rules: [{
			        required: true, message: '请选择上级!',
			    }]
		    },
		    render: _ => <TreeSelect
		        style={{ width: 200 }}
		        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
		        treeData={handleTreeTop(this.props.depttree)}
		        placeholder="请选择上级"
		        treeDefaultExpandAll/>
		},{
			label: '排序',
			key: 'num',
			option: { rules: [] },
		    render: _ => <InputNumber style={{width: 200}}/>
		},{
			label: '备注',
			key: 'tips',
			option: { rules: [] },
		    render: _ => <Input style={{width: 200}}/>
		}],
		loading: false,
		lock: false
	}

	handleFetch = params => {
		if (this.props.config.type == 'edit') {
			params.id = this.props.config.item.id
			return editDept(params)
		}
		return addDept(params)
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val)
					if (!params.tips) delete params.tips
					if (!params.num) delete params.num

					this.handleFetch(params)
					.then(res => {
						if (res.code == 200 || res === true) {
							message.success('操作成功')
							this.props.getTree()
							this.props.done()
						}
						this.setState({lock: false})
					})
				} else {
					this.setState({lock: false})
				}
			})
		}
	}

	render = _ => {
		const { getFieldDecorator } = this.props.form
		const formItemLayout = {
	      	labelCol: {
	        	xs: { span: 24 },
	        	sm: { span: 4 },
	      	},
	      	wrapperCol: {
		        xs: { span: 24 },
		        sm: { span: 20 },
	      	},
	    }

		return <Modal title={this.props.config.title}
		onOk={this.handleOk}
		visible={this.props.config.visible}
		confirmLoading={this.state.loading}
		onCancel={this.props.onCancel}
		style={{top: 50, marginBottom: 100}}
		okText="提交"
		cancelText="取消">
			<Form>
		        {this.state.rules.map((val, index) => <FormItem 
		        {...formItemLayout} 
		        key={index}
		        label={val.label}>
		          	{getFieldDecorator(val.key, val.option)(val.render())}
		        </FormItem>)}
	      	</Form>
		</Modal>
	}
}

const DeptForm = Form.create()(Dept)
export default DeptForm