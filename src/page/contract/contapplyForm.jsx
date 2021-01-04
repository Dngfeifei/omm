import React, { Component } from 'react'
import { Select, Form, Button, message, Icon, Checkbox, Modal, DatePicker, Input, Row, Col, Upload, Table, Alert } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
import { selectProjItems } from '/api/project'
import { submitApply } from '/api/contapply'
import Contselect from '/page/contract/contselect.jsx'
import { uploadAttr, getParam } from '/api/global'
import moment from 'moment'

class ContapplyItem extends Component{

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
				    <Option value='导出列表'>导出列表</Option>
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
			label: '备注',
			key: 'remark',
	    render: _ => <TextArea rows={3} style={{width: 300}} maxLength={500} />
		}],
		defaultChecked: false,//借用原件是否默认选中
		disableChecked: false,//借用原件是否默认不可用
		projects: [],
		loading: false,
		lock: false,
		visible: false,
		selecteditems: [],
		selectedkeys: [],
		fileList: [],
		columns: [
		{
		  title: '项目号',
		  dataIndex: 'pkProjectCode'
		}, {
		  title: '合同名称',
		  dataIndex: 'vcontname'
		}, {
		  title: '合同份数',
		  dataIndex: 'ncontnum',
		  render: (t, r) => `${t}(${t-r.lockNum})`
		}, {
		  title: <Checkbox onChange={e => this.changeCheckAll(e.target.checked)}>借用原件</Checkbox>,
		  dataIndex: 'borrow',
		  render: (t, r) => (r.ncontnum - r.lockNum) > 0 ? <Checkbox onChange={e => this.changeCheckBox(r, e.target.checked)} 
		  checked={r.checked} 
		  disabled={this.state.disableChecked}>原件</Checkbox> : <Checkbox onChange={e => this.changeCheckBox(r, e.target.checked)} 
		  checked={false} disabled={true}>原件</Checkbox>
		}, {
		  title: '操作',
		  dataIndex: 'operator',
		  render: (t, r) => <a title="删除" ><Icon type="delete" onClick={_ => this.removedone(r.key)} /></a>
		}]
	}
	//全选
	changeCheckAll = b => {
		this.state.selecteditems.forEach(t => {
				t.checked = b
			})
		this.setState({selecteditems: this.state.selecteditems})
	}
  //根据需求类型判断‘原件借用’是否可用
	setChecked = val => {
		this.setState({
			defaultChecked: val == '原件',
			disableChecked: val != '扫描件及原件'
		})
		let borrowPaper = true
		if(val == '原件'){
			this.state.selecteditems.forEach(t => {
				t.checked = true
			})
			this.setState({selecteditems: this.state.selecteditems})
		}else if(val == '扫描件' || val == '导出列表'){
			borrowPaper = false
			this.state.selecteditems.forEach(t => {
				t.checked = false
			})
			this.setState({selecteditems: this.state.selecteditems})
		}
		//借用纸质合同，联系人联系电话必填，借用日期，归还日期显示
		if(borrowPaper){
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
		//this.setState({rules: this.state.rules})
	}
	//修改-借用原件
	changeCheckBox = (r, v) =>{
    let selecteditems = this.state.selecteditems.map(item => {
    	if(r.key == item.key){
    		item.checked = v
    	}
    	return item
    })
    this.setState({selecteditems})
	}

	getprojitems = async _ => {
		await selectProjItems({}).then(res => {
			this.setState({projects: res.data})
		})
	}

	addmodel = _ => {
		this.setState({visible: true})
	}

	selectdone = items => {
		items.forEach(item => {
			if(this.state.selectedkeys.indexOf(item.key) < 0){
				item.checked = this.state.defaultChecked
				this.state.selecteditems.push(item)
				this.state.selectedkeys.push(item.key)
			}
		})
	}

	removedone = key => {
		let selecteditems = this.state.selecteditems.filter(function(item) {
      return item.key != key
    })
    let selectedkeys = this.state.selectedkeys.filter(function(item) {
      return item != key
    })
    this.setState({selecteditems, selectedkeys})
	}

  //关闭页签
	closepane = _ => {
		if (parent.add) {
			parent.remove('226')
		} else {
			this.props.remove('226')
		}
	}
	rendermodal = _ => 
		<Modal title="选择资料"
			footer={null}
		  visible={this.state.visible}
		  onCancel={_ => this.setState({visible: false})}
		  mask={true}
		  width='90%'
		>
			<Contselect isOriginal = {this.state.defaultChecked} 
			selectedkey={this.state.selectedkeys}
			visible={this.state.visible}
			selectdone={this.selectdone} 
			onCancel={_ => this.setState({visible: false})}  />
		</Modal> 

	submit = async _ => {
		//console.log(this.props.form)
		if (!this.state.selecteditems || this.state.selecteditems.length==0) {
			message.error('请先选择资料，再提交申请')
			return
		}
		if (!this.state.lock) {
			await this.setState({lock: true, loading: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({type: 'contsale'}, val)
					if (params.openDate) params.openDate = params.openDate.format('YYYY-MM-DD')
					//附件
					let arr = this.state.fileList.map(t => {
						return t.response.data
					})
					params.paths = arr.join(',')
					params.contDetailList = this.state.selecteditems.map(t => {
						return {
							docId: t.pkContsale,
							docCode: t.pkProjectCode,
							docName: t.vcontname,
							paperNum: t.checked ? 1 : 0
						}
					})
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
 
					<Upload 
					className="attr-upload"
					action={`${uploadAttr}`}
					headers={{Authorization: `Bearer ${localStorage.getItem('token')}`}}
					onChange = {this.handleChange}
					multiple={true}
					fileList={this.state.fileList}>
						<Button style={{marginTop: 0}}>
							<Icon type="upload" /> 上传附件 <Alert message="招标文件、招标公告（网站链接或邀请邮件）" type="success" />
						</Button>
					</Upload>
      </Form>

      <Button icon="select" onClick={this.addmodel}>选择资料</Button>
      <Table columns={this.state.columns} dataSource={this.state.selecteditems} locale={{emptyText: '暂无数据'}} pagination={false} />

  
    	<Button type="primary" style={{marginTop: '20px'}}
    	onClick={this.submit} loading={this.state.loading}>提交申请</Button>
    	 {this.rendermodal()}
      </div>
	}

}

const ContapplyForm = Form.create()(ContapplyItem)
export default ContapplyForm