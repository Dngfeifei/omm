import React, { Component } from 'react'
import { Modal, Input, Form, Button, message, DatePicker, Row, Col, Table, Popconfirm } from 'antd'
const FormItem = Form.Item
const { MonthPicker } = DatePicker
import { addsocialdetail, getsocialdetail, deletesocialdetail } from '/api/social'
import { getDictSelectMuti } from '/api/dict'

class SocialDetailItem extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			this.setState({socialId: nextprops.config.item.id})
			this.props.form.resetFields()
			this.getdetaillist(nextprops.config.item.id)
		}
	}
	state = {
		socialId: null,
		columns: [{
			title: '部门',
			dataIndex: 'depart'
		},{
			title: '岗位',
			dataIndex: 'orgpost'
		},{
			title: '姓名',
			dataIndex: 'name'
		},{
			title: ' 操作 ',
			dataIndex: 'operate',
			render: (t, r) => <Popconfirm title="确定删除吗?" onConfirm={_ => this.deleteDetail(r.id)} okText="确定" cancelText="取消">
											    <a style={{display: 'inline-block', width: 60}}>删除</a>
											  </Popconfirm>
		}],
		tabledata: [],
		rules: [{
			label: '部门',
			key: 'depart',
			option: {
				rules: [{
		        	required: true, message: '部门不能为空',
			    }]
			},
		    render: _ => <Input style={{width: 200}} />
		},{
			label: '岗位',
			key: 'orgpost',
			option: { rules: [{
		        	required: true, message: '岗位不能为空',
			    }] },
		    render: _ => <Input style={{width: 200}} />
		},{
			label: '姓名',
			key: 'name',
			option: { rules: [{
		        	required: true, message: '姓名不能为空',
			    }] },
		    render: _ => <Input style={{width: 200}} />
		}],
		loading: false,
		lock: false
	}

	deleteDetail = id => {
		deletesocialdetail({id}).then(res => {
			this.getdetaillist(this.state.socialId)
		})
	}

	getdetaillist = id => {
		let param = {socialId: id}
		getsocialdetail(param).then(res => {
				let data = res.data.map(val => {
					let baseItem = Object.assign({}, val, { key: val.id })
					return baseItem
				})
				this.setState({
					tabledata: data, 
					loading: false
				})
		})
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign(val, {socialId: this.state.socialId})
					//console.log(params)
					addsocialdetail(params)
					.then(res => {
						if (res.code == 200 || res === true) {
							message.success('操作成功')
							this.getdetaillist(this.state.socialId)
							this.props.form.resetFields()
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
		return <Modal title='社保缴纳明细'
		footer= {null}
		visible={this.props.config.visible}
		confirmLoading={this.state.loading}
		onCancel={this.props.onCancel}
		width={1000}
		style={{top: 50, marginBottom: 50}}>
			<Form>
			<Row gutter={24}>
	        {this.state.rules.map((val, index) => <Col key={index} span={12} style={{ display: 'block'}}><FormItem  
	        label={val.label} labelCol={{span: 6}}>
	          	{getFieldDecorator(val.key, val.option)(val.render())}
	        </FormItem></Col>)}
	        <Col><Button type="primary" onClick={this.handleOk}>保存</Button></Col>
      </Row>
      	</Form>

      <Table dataSource={this.state.tabledata} 
      size='small'
      pagination={false}
      columns={this.state.columns} 
      loading={this.state.loading} />	
		</Modal>
	}
}

const SocialDetailForm = Form.create()(SocialDetailItem)
export default SocialDetailForm