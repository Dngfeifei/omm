import React, { Component } from 'react'
import { Select, Form, Button, message, Icon, List, Modal, DatePicker, Input, Row, Col, Upload } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
import { selectProjItems } from '/api/project'
import { submitStorageApply } from '/api/contapply'
import StoreSelect from '/page/branch_view/storeSelect.jsx'
import { uploadAttr, getParam } from '/api/global'
import moment from 'moment'

class StorageApplyItem extends Component{

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
		}],
		type: 'storageexcel',//纸质证书
		projects: [],
		loading: false,
		lock: false,
		visible: false,
		evisible: false,
		selecteditems: [],
		selectedkeys: [],
		fileList: []
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
		this.setState({evisible: true})
	}
	//关闭页签
	closepane = _ => {
		if (parent.add) {
			parent.remove('storage_apply')
		} else {
			this.props.remove('storage_apply')
		}
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

	rendermodal = _ => 
		<div>
		<Modal title="选择资料"
			footer={null}
		  visible={this.state.evisible}
		  onCancel={_ => this.setState({evisible: false})}
		  mask={true}
		  width={1200}
		>
			<StoreSelect selectedkey={this.state.selectedkeys} selectdone={this.selectdone} onCancel={_ => this.setState({evisible: false})}  />
		</Modal> 
		</div>

	submit = async _ => {
		if (!this.state.selecteditems || this.state.selecteditems.length==0) {
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
					params.contDetailList = this.state.selecteditems.map(t => {
							return {
								docId: t.storid,
								docCode: t.storid,
								docName: `${t.storname}` 
							}
						})
					submitStorageApply(params)
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
      header={<Button icon="select" onClick={this.addmodel}>选择仓库</Button>}
      bordered
      locale={{emptyText: '暂无数据'}}
      dataSource={this.state.selecteditems}
      renderItem={item => (<List.Item actions={[<a title="删除"><Icon type="delete" onClick={_ => this.removedone(item.key)} /></a>]}>{item.storname}</List.Item>)}
    	/>
    	<Button type="primary" style={{marginTop: '20px'}}
    	onClick={this.submit} loading={this.state.loading}>提交申请</Button>
    	 {this.rendermodal()}
      </div>
	}

}

const StorageApplyForm = Form.create()(StorageApplyItem)
export default StorageApplyForm