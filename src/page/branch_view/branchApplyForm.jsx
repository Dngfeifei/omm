import React, { Component } from 'react'
import { Select, Form, Button, message, Icon, List, Modal, DatePicker, Input, Row, Col, Upload } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
import { selectProjItems } from '/api/project'
import { submitBranchApply } from '/api/contapply'
import BranchApplySelect from '/page/branch_view/branchApplySelect.jsx'
import ZzApplySelect from '/page/branch_view/zzApplySelect.jsx'
import { uploadAttr, getParam } from '/api/global'
import moment from 'moment'

class BranchApplyItem extends Component{

	async componentWillMount () {
		this.getprojitems()
		getParam({code: 'cert_max_days'}).then(res => {
			this.setState({cert_max_days: Number(res.data) })
		})
	}

	state = {
		cert_max_days: 5,
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
		    filterOption={(input, option) => option.props.children.join().indexOf(input) >= 0}>
		    {this.state.projects.map(t => <Option value={t.pkProjitem} key={t.pkProjitem}>{t.vprojname}({t.vbillno})</Option>)}
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
			label: '借用日期',
			key: 'borrowDate',
			option: {
				rules: [{
		        	required: true, message: '请选择借用日期'
			    },{
			    	validator: (r, val, callback) => {
			    		let days = moment(val).diff(new Date, 'days')
			    		if(days > this.state.cert_max_days) callback(`借用日期只能在${this.state.cert_max_days}天之内`)
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
			    		let borrow = this.props.form.getFieldValue('borrowDate')
			    		let days = moment(val).diff(borrow, 'days')
			    		if(days > this.state.cert_max_days) callback(`借用时间不可超过${this.state.cert_max_days}天`)
			    		callback()
			    	}
			    }]
			},
		    render: _ => <DatePicker placeholder="归还日期" />
		},{
			label: '取证方式',
			key: 'getType',
			option: {
				rules: [{
		        	required: true, message: '请选择取证方式!',
			    }]
			},
		    render: _ => <Select
				    style={{ width: 200 }}
				    placeholder="选择取证方式"
				    onChange={val => this.setGetType(val)}
				  >
				    <Option value='自取'>自取</Option>
				    <Option value='代取'>代取</Option>
				    <Option value='邮寄'>邮寄</Option>
				  </Select>
		},{
			label: '收件人',
			hidden: true,
			key: 'username',
			option: {rules: [{
		        	required: true, message: '请输入联系人'
			    }]},
	    render: _ => <Input style={{width: 200}} length={20} />
		},{
			label: '电话',
			hidden: true,
			key: 'phone',
			option: {rules: [{
		        	required: true, message: '请输入电话'
			    }]},
	    render: _ => <Input style={{width: 200}} length={20}/>
		},{
			label: '地址',
			hidden: true,
			key: 'address',
			option: {rules: [{
		        	required: true, message: '请输入地址'
			    }]},
	    render: _ => <Input style={{width: 200}} length={200}/>
		},{
			label: '备注',
			key: 'remark',
	    render: _ => <TextArea rows={3} style={{width: 300}} />
		}],
		type: 'branchpaper',//纸质证书
		projects: [],
		loading: false,
		lock: false,
		visible: false,
		evisible: false,
		zvisible: false,
		zzselecteditems: [],
		zzselectedkeys: [],
		zfselecteditems: [],
		zfselectedkeys: [],
		fileList: []
	}

	//选择取证方式
	setGetType = val => {
		if(val == '代取'){
			this.state.rules.forEach(item => {
				if(item.key == 'username'){
					item.hidden = false
					item.label = '代取人'
				}
				if(item.key == 'phone'){
					item.hidden = false
				}
				if(item.key == 'address'){
					item.hidden = true
				}
			})
		}else if(val == '邮寄'){
			this.state.rules.forEach(item => {
				if(item.key == 'username' || item.key == 'phone' || item.key == 'address'){
					item.hidden = false
					if(item.key == 'username') item.label = '收件人'
				}
			})
		}else{
			this.state.rules.forEach(item => {
				if(item.key == 'username' || item.key == 'phone' || item.key == 'address'){
					item.hidden = true
				}
			})
		}
	}

	getprojitems = async _ => {
		await selectProjItems({}).then(res => {
			this.setState({projects: res.data})
		})
	}
	//选择租房合同
	addmodel = _ => {
		this.setState({evisible: true})
	}
	//选择营业执照
	addzzmodel = _ => {
		this.setState({zvisible: true})
	}
	//关闭页签
	closepane = _ => {
		if (parent.add) {
			parent.remove('certapplyForm')
		} else {
			this.props.remove('certapplyForm')
		}
	}

	zfselectdone = items => {
		items.forEach(item => {
			if(this.state.zfselectedkeys.indexOf(item.key) < 0){
				this.state.zfselecteditems.push(item)
				this.state.zfselectedkeys.push(item.key)
			}
		})
	}

	zzselectdone = items => {
		items.forEach(item => {
			if(this.state.zzselectedkeys.indexOf(item.key) < 0){
				this.state.zzselecteditems.push(item)
				this.state.zzselectedkeys.push(item.key)
			}
		})
	}

	removedone = (key, name) => {
		if(name == '营业执照'){
			this.removedonezz(key)
		}else{
			this.removedonezf(key)
		}
	}
	//删除租房合同
	removedonezf = key => {
		let zfselecteditems = this.state.zfselecteditems.filter(function(item) {
      return item.key != key
    })
    let zfselectedkeys = this.state.zfselectedkeys.filter(function(item) {
      return item != key
    })
    this.setState({zfselecteditems, zfselectedkeys})
	}
	//删除营业执照
	removedonezz = key => {
		let zzselecteditems = this.state.zzselecteditems.filter(function(item) {
      return item.key != key
    })
    let zzselectedkeys = this.state.zzselectedkeys.filter(function(item) {
      return item != key
    })
    this.setState({zzselecteditems, zzselectedkeys})
	}

	rendermodal = _ => 
		<div>
		<Modal title="选择租房合同"
			footer={null}
		  visible={this.state.evisible}
		  onCancel={_ => this.setState({evisible: false})}
		  mask={true}
		  width={1200}
		>
			<BranchApplySelect selectedkey={this.state.zfselectedkeys} selectdone={this.zfselectdone} onCancel={_ => this.setState({evisible: false})}  />
		</Modal> 
		<Modal title="选择营业执照"
			footer={null}
		  visible={this.state.zvisible}
		  onCancel={_ => this.setState({zvisible: false})}
		  mask={true}
		  width={1200}
		>
			<ZzApplySelect selectedkey={this.state.zzselectedkeys} selectdone={this.zzselectdone} onCancel={_ => this.setState({zvisible: false})}  />
		</Modal>
		</div>

	submit = async _ => {
		const selecteditems = [...this.state.zfselecteditems, ...this.state.zzselecteditems]
		if (!selecteditems || selecteditems.length==0) {
			message.error('请先选择资料，再提交申请')
			return
		}
		if (!this.state.lock) {
			await this.setState({lock: true, loading: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({type: this.state.type}, val)
					if (params.openDate) params.openDate = params.openDate.format('YYYY-MM-DD')
					//附件
					let arr = this.state.fileList.map(t => {
						return t.response.data
					})
					params.paths = arr.join(',')
					params.contDetailList = selecteditems.map(t => {
							return {
								docId: t.id,
								docCode: t.code,
								docName: `${t.branchName}-${t.code}` 
							}
						})
					submitBranchApply(params)
					.then(res => {
						if (res.code == 200 || res === true) {
							message.success('提交成功，请在工作台-我的申请中查看')
							this.closepane()
						}
						this.setState({lock: false, loading: false})
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
      </Form>
      <List
      header={<span><Button icon="select" onClick={this.addmodel}>选择租房合同</Button>
      <Button icon="select" style={{marginLeft: 20}} onClick={this.addzzmodel}>选择营业执照</Button>
      </span>}
      bordered
      locale={{emptyText: '暂无数据'}}
      dataSource={[...this.state.zfselecteditems, ...this.state.zzselecteditems]}
      renderItem={item => (<List.Item actions={[<a title="删除"><Icon type="delete" onClick={_ => this.removedone(item.key, item.code)} /></a>]}>{item.branchName}-{item.code}</List.Item>)}
    	/>
    	<Button type="primary" style={{marginTop: '20px'}}
    	onClick={this.submit} loading={this.state.loading}>提交申请</Button>
    	 {this.rendermodal()}
      </div>
	}

}

const BranchApplyForm = Form.create()(BranchApplyItem)
export default BranchApplyForm