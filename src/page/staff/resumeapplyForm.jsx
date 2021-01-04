import React, { Component } from 'react'
import { Select, Form, Button, message, Icon, List, Modal, DatePicker, Input, Row, Col, Upload } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
import { selectProjItems } from '/api/project'
import { submitApply } from '/api/contapply'
import Staffselect from '/page/staff/staffselect.jsx'
import { uploadAttr } from '/api/global'
import { selectResumes} from '/api/resume'

class ResumeapplyItem extends Component{

	async componentWillMount () {
		this.getprojitems()
		this.getresumes()
	}

	state = {
		resumes: [],
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
			label: '备注',
			key: 'remark',
	    render: _ => <TextArea rows={3} style={{width: 300}} />
		},{
			label: '简历模版',
			key: 'resumeId',
			option: {
				rules: [{
		        	required: true, message: '请选择简历模版',
			    }]
			},
	    render: _ => <Select 
	    			showSearch
				    style={{ width: 300 }}
				    placeholder="选择简历模版"
				    optionFilterProp="children"
				    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
				  >
				    {this.state.resumes.map(t => <Option value={t.id} key={t.id}>{t.name}</Option>)}
				  </Select>
		}],
		projects: [],
		loading: false,
		lock: false,
		visible: false,
		selecteditems: [],
		selectedkeys: [],
		fileList: []
	}

	getprojitems = async _ => {
		await selectProjItems({}).then(res => {
			this.setState({projects: res.data})
		})
	}
	getresumes = async _ => {
		await selectResumes({}).then(res => {
			this.setState({resumes: res.data})
		})
	}

	closepane = _ => {
		if (parent.add) {
			parent.remove('resumeapplyForm')
		} else {
			this.props.remove('resumeapplyForm')
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
			message.error('请先选择人员，再提交申请')
			return
		}
		if (!this.state.lock) {
			await this.setState({lock: true, loading: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({type: 'resume'}, val)
					if (params.openDate) params.openDate = params.openDate.format('YYYY-MM-DD')
					//附件
					let arr = this.state.fileList.map(t => {
						return t.response.data
					})
					params.paths = arr.join(',')
					params.contDetailList = this.state.selecteditems.map(t => {
						return {
							docId: t.id,
							docCode: t.id,
							docName: t.name
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
		<Modal title="选择人员"
			footer={null}
		  visible={this.state.visible}
		  onCancel={_ => this.setState({visible: false})}
		  mask={true}
		  width={1200}
		>
			<Staffselect selectedkey={this.state.selectedkeys} selectdone={this.selectdone} onCancel={_ => this.setState({visible: false})}  />
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
      renderItem={item => (<List.Item actions={[<a title="删除" ><Icon type="delete" onClick={_ => this.removedone(item.key)} /></a>]}>{item.name}</List.Item>)}
    	/>
    	<Button type="primary" style={{marginTop: '20px'}} loading={this.state.loading}
    	onClick={this.submit} loading={this.state.loading}>提交申请</Button>
    	 {this.rendermodal()}
      </div>
	}

}

const ResumeapplyForm = Form.create()(ResumeapplyItem)
export default ResumeapplyForm