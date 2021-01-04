import React, { Component } from 'react'
import { Select, Form, Button, message, Icon, Checkbox, Modal, DatePicker, Input, Row, Col, Upload, Table, Divider, Alert } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
import { selectProjItems } from '/api/project'
import { submitStaffApply } from '/api/contapply'
import { uploadAttr, getParam } from '/api/global'
import moment from 'moment'

class StaffAllApplyItem extends Component{

	async componentWillMount () {
		this.getprojitems()
		getParam({code: 'cont_max_days'}).then(res => {
			this.setState({cont_max_days: Number(res.data) })
		})
	}

	state = {
		cont_max_days: 5,
		rules: [{
			label: '申请项目',
			key: 'pkProjitem',
			option: {
				rules: [{
		        	required: true, message: '请选择一个项目!',
			    }]
			},
		  render: _ => <Select
		    showSearch
		    style={{ width: 390 }}
		    placeholder="选择一个项目"
		    optionFilterProp="children"
		    onChange={this.setProjInfo}
		    filterOption={(input, option) => option.props.children.join().indexOf(input) >= 0}>
		    {this.state.projects.map(t => <Option value={t.pkProjitem} key={t.pkProjitem}>{t.vprojname}({t.vbillno})</Option>)}
		  </Select>
		},{
			label: '项目号',
			key: 'projCode',
			option: {
				rules: []
			},
		    render: _ => <Input style={{width: 200}} disabled={true} />
		},{
			label: '客户名称',
			key: 'cusName',
			option: {
				rules: []
			},
		    render: _ => <Input style={{width: 390}} disabled={true} />
		},{
			label: '用途',
			key: 'descrip',
			option: {
				rules: [{
		        	required: true, message: '请选择一个用途!',
			    }]
			},
		  render: _ => <Select style={{ width: 200 }} placeholder="选择用途">
				    <Option value='拜访客户'>拜访客户</Option>
				    <Option value='资格预审'>资格预审</Option>
				    <Option value='投标'>投标</Option>
				  </Select>
		},{
			label: '开标日期',
			key: 'openDate',
			option: {
				rules: [{
		        	required: true, message: '请选择开标日期',
			    }]
			},
		    render: _ => <DatePicker placeholder="开标日期" />
		},{
			label: '需求类别',
			key: 'descripType',
			option: {
				rules: [{
		        	required: true, message: '请选择需求类别',
			    }]
			},
		    render: _ => <Select style={{ width: 200 }} placeholder="选择需求类别"
				    onChange={val => this.setChecked(val)}
				  >
				    <Option value='扫描件'>扫描件</Option>
				    <Option value='原件'>原件</Option>
				    <Option value='扫描件及原件'>扫描件及原件</Option>
				  </Select>
		},{
			label: '借用日期',
			key: 'borrowDate',
			option: {
				rules: [{
		        	required: true, message: '请选择借用日期'
			    },{
			    	validator: (r, val, callback) => {
			    		let days = moment(val).diff(new Date, 'days')
			    		if(days > 3) callback('借用日期只能在3天之内')
			    		callback()
			    	}
			    }]
			},
		    render: _ => <DatePicker placeholder="借用日期" />
		},{
			label: '归还日期',
			key: 'returnDate',
			option: {
				rules: [{
		        	required: true, message: '请选择归还日期',
			    },{
			    	validator: (r, val, callback) => {
			    		let openDate = this.props.form.getFieldValue('openDate')
			    		let days = moment(val).diff(openDate, 'days')
			    		if(days > this.state.cont_max_days) callback(`归还日期只能在开标日期之后${this.state.cont_max_days}天之内`)
			    		callback()
			    	}
			    }]
			},
		    render: _ => <DatePicker placeholder="归还日期" />
		},{
			label: '联系人',
			key: 'username',
			option: {rules: [{
		        	required: false, message: '请输入联系人'
			    }]},
	    render: _ => <Input style={{width: 200}} />
		},{
			label: '电话',
			key: 'phone',
			option: {rules: [{
		        	required: false, message: '请输入联系人'
			    }]},
	    render: _ => <Input style={{width: 200}} />
		},{
			label: '需求描述',
			key: 'remark',
			option: {rules: [{
		        	required: true, message: '请输入需求描述'
			    }]},
	    render: _ => <TextArea rows={3} style={{width: 300}} maxLength={500} />
		}],
		projects: [],
		loading: false,
		lock: false,
		visible: false,
		fileList: [],
		reconf: {type: 'add', visible: false},
		requireList: []
	}

	//根据需求类型判断‘原件借用’是否可用
	setChecked = val => {
		//借用纸质合同，联系人联系电话必填，借用日期，归还日期显示
		if(val == '扫描件及原件' || val == '原件'){
			this.state.rules.forEach(item => {
				if(item.key == 'username' || item.key == 'phone'){
					item.option.rules[0].required = true
				}
				if(item.key == 'borrowDate' || item.key == 'returnDate'){
					item.hidden = false
				}
			})
		}else{
			this.state.rules.forEach(item => {
				if(item.key == 'username' || item.key == 'phone'){
					item.option.rules[0].required = false
				}
				if(item.key == 'borrowDate' || item.key == 'returnDate'){
					item.hidden = true
				}
			})
		}
	}
	//选择项目后带出项目号、客户
	setProjInfo = e => {
		const project = this.state.projects.filter(t => t.pkProjitem == e)[0]
		this.props.form.setFields({projCode: {value: project.vbillno}, cusName: {value: project.pkCumanname}})
	}
	
	getprojitems = async _ => {
		await selectProjItems({}).then(res => {
			this.setState({projects: res.data})
		})
	}

	addmodel = _ => {
		this.setState({visible: true})
	}

  //关闭页签
	closepane = _ => {
		if (parent.add) {
			parent.remove('333')//该页面对应的key（案例申请菜单ID）
		} else {
			this.props.remove('333')
		}
	}

	submit = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true, loading: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({type: 'allstaff'}, val)
					if (params.openDate) params.openDate = params.openDate.format('YYYY-MM-DD')
					//附件
					let arr = this.state.fileList.map(t => {
						return t.response.data
					})
					params.paths = arr.join(',')
					submitStaffApply(params)
					.then(res => {
						// this.setState({lock: false, loading: false})
						if (res.code == 200 || res === true) {
							message.success('提交成功，请在工作台-我的申请中查看')
							this.closepane()
						}
					})
				} else {
					this.setState({lock: false,  loading: false})
				}
			})
		}
	}	

	handleChange = ({ file, fileList }) => { 
    this.setState({ fileList })
  }

	render = _ => {
			const { getFieldDecorator } = this.props.form
			return <div style={{width: '96%', margin: '30px 20px'}}>
			<Form className="flex-form">
			<Row gutter={24}>
        {this.state.rules.map((val, index) => val.hidden ? null : <Col key={index} span={12} style={{ display: 'block'}}><FormItem 
        label={val.label} labelCol={{span: 5}}>
          	{getFieldDecorator(val.key, val.option)(val.render())}
        </FormItem></Col>)}
        </Row>
 				<div>
 					<Alert message="招标文件、招标公告（网站链接或邀请邮件）" style={{width: 340}} type="success" />
					<Upload 
					className="attr-upload"
					action={`${uploadAttr}`}
					headers={{Authorization: `Bearer ${localStorage.getItem('token')}`}}
					onChange = {this.handleChange}
					multiple={true}
					fileList={this.state.fileList}>
						<Button style={{marginTop: 0}}>
							<Icon type="upload" /> 上传附件 
						</Button>
					</Upload>
				</div>	
      </Form>
    	<Button type="primary" style={{marginTop: '20px'}}
    	onClick={this.submit} loading={this.state.loading}>提交申请</Button>

      </div>
	}

}

const StaffAllApplyForm = Form.create()(StaffAllApplyItem)
export default StaffAllApplyForm