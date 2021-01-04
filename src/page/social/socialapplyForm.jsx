import React, { Component } from 'react'
import { Select, Form, Button, message, Icon, List, Modal, DatePicker, Input, Row, Col, Upload } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
import { selectProjItems } from '/api/project'
import { submitApply } from '/api/contapply'
import Socialselect from '/page/social/socialselect.jsx'
import { uploadAttr } from '/api/global'

class SocialapplyItem extends Component{

	async componentWillMount () {
		this.getprojitems()
	}

	state = {
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
		    filterOption={(input, option) => option.props.children.join().indexOf(input) >= 0}
		  >
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
		        	required: true, message: '请选择一个项目!',
			    }]
			},
		    render: _ => <Select
				    style={{ width: 200 }}
				    placeholder="选择需求类别"
				  >
				    <Option value='社保明细'>社保明细</Option>
				    <Option value='社保凭证'>社保凭证</Option>
				  </Select>
		},{
			label: '备注',
			key: 'remark',
	    render: _ => <TextArea rows={3} style={{width: 300}} />
		}],
		projects: [],
		loading: false,
		lock: false,
		visible: false,
		selecteditems: [],
		selectedkeys: [],
		fileList: []
	}
	//选择项目后带出项目号、客户
	setProjInfo = e => {
		console.log(e)
	}

	getprojitems = async _ => {
		await selectProjItems({}).then(res => {
			this.setState({projects: res.data})
		})
	}

	closepane = _ => {
		if (parent.add) {
			parent.remove('socialapplyForm')
		} else {
			this.props.remove('socialapplyForm')
		}
	}

	addmodel = _ => {
		this.setState({visible: true})
	}

	selectdone = items => {
		items.forEach(item => {
			if(this.state.selectedkeys.indexOf(item.key) < 0){
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


	submit = async _ => {
		if (!this.state.selecteditems || this.state.selecteditems.length==0) {
			message.error('请先选择资料，再提交申请')
			return
		}
		if (!this.state.lock) {
			await this.setState({lock: true, loading: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({type: 'social'}, val)
					if (params.openDate) params.openDate = params.openDate.format('YYYY-MM-DD')
					//附件
					let arr = this.state.fileList.map(t => {
						return t.response.data
					})
					params.paths = arr.join(',')
					params.contDetailList = this.state.selecteditems.map(t => {
						return {
							docId: t.id,
							docCode: t.month,
							docName: t.city
						}
					})
					submitApply(params)
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

  rendermodal = _ => 
		<Modal title="选择资料"
			footer={null}
		  visible={this.state.visible}
		  onCancel={_ => this.setState({visible: false})}
		  mask={true}
		  width={1200}
		>
			<Socialselect selectedkey={this.state.selectedkeys} selectdone={this.selectdone} onCancel={_ => this.setState({visible: false})}  />
		</Modal> 

	render = _ => {
			const { getFieldDecorator } = this.props.form
			return <div style={{width: '96%', margin: '30px 20px'}}>
			<Form className="flex-form">
			<Row gutter={24}>
        {this.state.rules.map((val, index) => <Col key={index} span={12} style={{ display: 'block'}}><FormItem 
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
      header={<Button icon="select" onClick={this.addmodel}>选择资料</Button>}
      bordered
      locale={{emptyText: '暂无数据'}}
      dataSource={this.state.selecteditems}
      renderItem={item => (<List.Item actions={[<a title="删除" ><Icon type="delete" onClick={_ => this.removedone(item.key)} /></a>]}>{item.city}-{item.month}</List.Item>)}
    	/>
    	<Button type="primary" style={{marginTop: '20px'}}
    	onClick={this.submit} loading={this.state.loading}>提交申请</Button>
    	 {this.rendermodal()}
      </div>
	}

}

const SocialapplyForm = Form.create()(SocialapplyItem)
export default SocialapplyForm