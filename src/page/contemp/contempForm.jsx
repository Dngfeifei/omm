import React, { Component } from 'react'
import { Select, Form, Button, message, Icon, Checkbox, Modal, DatePicker, Input, Row, Col, Table } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
import { selectAllItems } from '/api/project'
import { saveApply, getdetails } from '/api/contapply'
import Contselect from '/page/contract/contselect.jsx'
import moment from 'moment'

class ContapplyItem extends Component{

	componentWillMount () {
		this.getprojitems()
		let item = this.props.params.item
		if(item){
			this.setState({id: item.id})
			this.getDetails(item.id)
		}
	}
	componentDidMount (){
		let item = this.props.params.item
		console.log(item)
		if(item){
			this.props.form.setFields({
					pkProjitem: {value: item.pkProjitem},
					openDate: {value: moment(item.openDate)},
					username: {value: item.username},
					phone: {value: item.phone},
					remark: {value: item.remark}
				})
		}
	}

	state = {
		id: null,
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
			label: '申请人',
			key: 'username',
			option: {rules: [{
		        	required: false, message: '请输入申请人'
			    }]},
	    render: _ => <Input style={{width: 200}} />
		},{
			label: '电话',
			key: 'phone',
			option: {rules: [{}]},
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
		  title: '操作',
		  dataIndex: 'operator',
		  render: (t, r) => <a title="删除" ><Icon type="delete" onClick={_ => this.removedone(r.key)} /></a>
		}]
	}
	

	getprojitems = async _ => {
		await selectAllItems({}).then(res => {
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

	//获得申请资料明细
	getDetails = id => {
		getdetails({pid: id}).then(res => {
			this.setState({selecteditems: res.data.map(e => {
				return {pkContsale: e.docId, pkProjectCode: e.docCode, vcontname: e.docName}
			}), selectedkeys: res.data.map(e => e.docId)})
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
			parent.remove('contempForm')
		} else {
			this.props.remove('contempForm')
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
			message.error('请先选择资料，再保存')
			return
		}
		if (!this.state.lock) {
			await this.setState({lock: true, loading: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({type: 'contsale'}, val)
					if (params.openDate) params.openDate = params.openDate.format('YYYY-MM-DD')
					params.contDetailList = this.state.selecteditems.map(t => {
						return {
							docId: t.pkContsale,
							docCode: t.pkProjectCode,
							docName: t.vcontname
						}
					})
					if(this.state.id) params.id = this.state.id
					saveApply(params)
					.then(res => {
						this.setState({lock: false, loading: false})
						if (res.code == 200 || res === true) {
							message.success('提交成功，点击搜索刷新页面')
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
      </Form>

      <Button icon="select" onClick={this.addmodel}>选择资料</Button>
      <Table columns={this.state.columns} dataSource={this.state.selecteditems} locale={{emptyText: '暂无数据'}} pagination={false} />

  
    	<Button type="primary" style={{marginTop: '20px'}}
    	onClick={this.submit} loading={this.state.loading}>保存</Button>
    	 {this.rendermodal()}
      </div>
	}

}

const ContapplyForm = Form.create()(ContapplyItem)
export default ContapplyForm