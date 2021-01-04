import React, { Component } from 'react'
import { Select, Form, Button, message, Icon, Checkbox, Modal, DatePicker, Input, Row, Col, Upload, Table, Divider, Alert } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
import { selectProjItems } from '/api/project'
import { submitApply, getApplies } from '/api/contapply'
import { uploadAttr, getParam } from '/api/global'
import moment from 'moment'
import ContsaleRequire from '/page/contract/contsaleRequire.jsx'

class ContsaleApply extends Component{

	async componentWillMount () {
		this.getprojitems()
		getParam({code: 'cont_max_days'}).then(res => {
			this.setState({cont_max_days: Number(res.data) })
		})
	}

	state = {
		cont_max_days: 5,
		rules: [{
			label: '用途',
			key: 'descrip',
			option: {
				rules: [{
		        	required: true, message: '请选择一个用途!',
			    }]
			},
		  render: _ => <Select style={{ width: 200 }} placeholder="选择用途">
				    <Option value='售前阶段'>售前阶段</Option>
				    <Option value='投标阶段'>投标阶段</Option>
				  </Select>
		},{
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
			label: '预估金额',
			key: 'nbudgcontmny',
			option: {
				rules: []
			},
		    render: _ => <Input style={{width: 200}} disabled={true} />
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
				initialValue: '案例电子资料',
				rules: [{
					required: true, message: '请选择需求类别',
				}]
			},
			render: _ => <Select style={{ width: 200 }} placeholder="选择需求类别" >
				<Option value='案例电子资料'>案例电子资料</Option>
				<Option value='案例列表'>案例列表</Option>
			</Select>
		},{
			label: '是否加急',
			key: 'urgent',
			option: {
				rules: [{
		        	required: true, message: '请选择是否加急!',
			    }]
			},
		  render: _ => <Select style={{ width: 200 }} placeholder="是否加急">
				    <Option value={0}>不加急</Option>
				    <Option value={1}>加急</Option>
				  </Select>
		},{
			label: '希望反馈时间',
			key: 'backDate',
			option: {
				rules: [{
		        	required: true, message: '请选择希望反馈的时间',
			    }]
			},
		    render: _ => <DatePicker placeholder="希望反馈时间" />
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
			label: '备注',
			key: 'remark',
	    render: _ => <TextArea rows={3} style={{width: 300}} />
		}],
		projects: [],
		loading: false,
		lock: false,
		visible: false,
		fileList: [],
		columns: [
		{
		  title: '需求名',
		  dataIndex: 'name'
		}, {
		  title: '需求描述',
		  dataIndex: 'descrip',
		  width: '30%'
		}, {
		  title: '需求在招标文件页码',
		  dataIndex: 'pagenum'
		}, {
		  title: '案例列表数量',
		  dataIndex: 'listnum'
		}, {
		  title: '扫描件数量',
		  dataIndex: 'picnum'
		}, {
		  title: '原件数量',
		  dataIndex: 'papernum'
		}, {
		  title: '发票扫描件数量',
		  dataIndex: 'invoicenum'
		}, {
		  title: '发票原件数量',
		  dataIndex: 'invoicepapernum'
		}, {
		  title: <Button onClick={_ => this.openRequire()} type="primary" size="small" icon="plus">添加需求</Button>,
		  dataIndex: 'operator',
		  render: (t, r) => <div><a style={{display: 'inline-block'}} onClick={_ => this.editRequire(r)}>修改</a>
		  <Divider type="vertical" />
		  <a style={{display: 'inline-block'}} onClick={_ => this.deleteRequire(r)}>删除</a></div>
		}],
		reconf: {type: 'add', visible: false},
		requireList: [],
		hasapplies: []
	}

	//选择项目后带出项目号、客户
	setProjInfo = e => {
		const project = this.state.projects.filter(t => t.pkProjitem == e)[0]
		this.props.form.setFields({projCode: {value: project.vbillno}
			, cusName: {value: project.pkCumanname}, nbudgcontmny: {value: project.nbudgcontmny}})
		getApplies({pkProjitem: project.pkProjitem, paperType: 'contsale'}).then(res => {
			if(res.code == 200)
			this.setState({hasapplies: res.data})
		})
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

	//打开需求明细
	openRequire = _ => {
		this.setState({reconf: {type: 'add', visible: true}})
	}
	//修改需求
	editRequire = r => {
		this.setState({reconf: {item: r, type: 'edit', visible: true}})	
	}
	//删除需求
	deleteRequire = r => {
		let nl = this.state.requireList.filter(val => val.key!=r.key)
		this.setState({requireList: nl})
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
			parent.remove('226')//该页面对应的key（案例申请菜单ID）
		} else {
			this.props.remove('226')
		}
	}

	submit = async _ => {
		console.log(this.state.fileList)
		if (!this.state.requireList || this.state.requireList.length==0) {
			message.error('请先添加需求，再提交申请')
			return
		}
		if (!this.state.lock) {
			await this.setState({lock: true, loading: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({type: 'contsale'}, val)
					if (params.openDate) params.openDate = params.openDate.format('YYYY-MM-DD')
					if (params.backDate) params.backDate = params.backDate.format('YYYY-MM-DD')
						console.log(params)
					//附件
					let arr = this.state.fileList.map(t => {
						return t.response.data
					})
					params.paths = arr.join(',')
					params.contsaleRequireList = this.state.requireList
					submitApply(params)
					.then(res => {
						this.setState({lock: false, loading: false})
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
        <div style={{color: 'black', weight: 'bold'}}>
					{this.state.hasapplies.map(e => <p>该项目已申请案例，申请人：{e.applyname}；反馈日期：{e.backDate}</p>) }
				</div>	
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

    	<Table columns={this.state.columns} dataSource={this.state.requireList} locale={{emptyText: '暂无数据'}} pagination={false} />

    	<Button type="primary" style={{marginTop: '20px'}}
    	onClick={this.submit} loading={this.state.loading}>提交申请</Button>

    	<ContsaleRequire 
			onCancel={_ => this.setState({reconf: {type: 'add', visible: false}})}
			config={this.state.reconf} 
			requireList={this.state.requireList}
			/>
      </div>
	}

}

const ContsaleApplyForm = Form.create()(ContsaleApply)
export default ContsaleApplyForm