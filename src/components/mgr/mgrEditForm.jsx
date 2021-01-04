import React, { Component } from 'react'
import { Modal, Input, Form, Button, Select, DatePicker, TreeSelect, message } from 'antd'
const Option = Select.Option
const FormItem = Form.Item
import { connect } from 'react-redux'
import { momentFormat } from '/api/tools'
import { addUser, editUser } from '/api/mgr'
import moment from 'moment'
import { GET_DEPT_TREE } from '/redux/action'

const baserule = props => [{
	label: '账户',
	key: 'account',
	option: {
		rules: [{
        	required: true, message: '请输入账户!',
	    }]
	},
    render: _ => <Input style={{width: 200}}/>
},{
	label: '姓名',
	key: 'name',
	option: {
		rules: [{
	        required: true, message: '请输入姓名!',
	    }]
	},
    render: _ => <Input style={{width: 200}}/>
},{
	label: '性别',
	key: 'sex',
    option: {
    	initialValue: 1,
		rules: [{
	        required: true, message: '请选择性别!',
	    }]
    },
    render: _ => <Select style={{width: 120}}>
      	<Option value={1}>男</Option>
      	<Option value={2}>女</Option>
    </Select>
},{
	label: '出生日期',
	key: 'birthday',
	option: {
		rules: [{
        	required: true, message: '请选择出生日期!',
	    }]
	},
    render: _ => <DatePicker placeholder='请选择出生日期'/>
},{
	label: '部门',
	key: 'deptid',
	option: {
		rules: [{
	        required: true, message: '请选择部门!',
	    }]
	},
    render: _ => <TreeSelect
        style={{ width: 200 }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={props.depttree}
        placeholder="请选择部门"
        treeDefaultExpandAll/>
},{
	label: '邮箱',
	key: 'email',
	option: {
		rules: [{
	        type: 'email', message: '请输入有效的邮件地址!',
	    }]
	},
    render: _ => <Input style={{width: 200}}/>
},{
	label: '电话',
	key: 'phone',
	option: {
		rules: [{
	        required: true, message: '请填写电话!',
	    }, {
	        pattern: /^1[34578]\d{9}$/, message: '请输入正确手机号'
	    }]
	},
    render: _ => <Input style={{width: 200}}/>
}]
const editrule = props => [{
	label: '密码',
	key: 'password',
	option: {
		rules: [{
	        required: true, message: '请输入密码!',
	    }]
	},
    render: _ => <Input type='password' style={{width: 200}}/>
},{
	label: '确认密码',
	key: 'rePassword',
	option: {
		rules: [{
	        required: true, message: '请确认密码!',
	    },{
        	validator: (rule, value, callback) => value && value !== props.form.getFieldValue('password') ? callback('两次输入不一致') : callback()
    	}]
	},
	render: _ => <Input type='password' style={{width: 200}}/>
}]
@connect(state => ({
	depttree: state.global.depttree
}), dispath => ({
	getTree(){dispath({type: GET_DEPT_TREE})},
}))
class MGR extends Component{
	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			this.props.getTree()
			if (nextprops.config.type != 'edit') {
				await this.setState({rules: baserule(nextprops).concat(editrule(this.props))})
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				await this.setState({rules: baserule(nextprops)})
				this.props.form.setFields({
					account: {value: mes.account},
					name: {value: mes.name},
					sex: {value: mes.sex},
					birthday: {value: moment(mes.birthday)},
					email: {value: mes.email},
					phone: {value: mes.phone},
					deptid: {value: mes.deptid.toString()}
				})
			}
		}

		if (this.props.depttree != nextprops.depttree) {
			await this.setState({rules: baserule(nextprops)})
		}
	}
	state = {
		loading: false,
		rules: [],
		lock: false
	}

	handleFetch = params => {
		if (this.props.config.type == 'edit') {
			params.id = this.props.config.item.id
			return editUser(params)
		}
		return addUser(params)
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val, {
						birthday: momentFormat(val.birthday)
					})
					if (!params.phone) delete params.phone
					if (!params.email) delete params.email

					this.handleFetch(params)
					.then(res => {
						if (res.code == 200) {
							message.success('操作成功')
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
		style={{top: 50, marginBottom: 100}}
		onCancel={this.props.onCancel}
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

const MgrForm = Form.create()(MGR)
export default MgrForm