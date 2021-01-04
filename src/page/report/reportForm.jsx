import React, { Component } from 'react'
import { Modal, Input, Form, Row, Col, message, Select } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input;
import { addReport, getReportSearch, getDataSources, getReportHref } from '/api/report'
import EditableFormTable from '/page/report/reportCell.jsx'
import ReportGoto from '/page/report/reportGoto.jsx'

class ProfileItem extends Component{

	componentWillMount () {
		this.getMutiDataSource()
	}

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			if (nextprops.config.type != 'edit') {
				this.props.form.resetFields()
			} else {
				let mes = nextprops.config.item
				this.props.form.setFields({
					name: {value: mes.name},
					datasource: {value: mes.datasource},
					hideColumns: {value: mes.hideColumns},
					highColumns: {value: mes.highColumns},
					isPage: {value: mes.isPage + ''},
					isMenu: {value: mes.isMenu + ''},
					type: {value: mes.type + ''},
					remark: {value: mes.remark},
					content: {value: mes.content}
				})
				this.getCellDate(mes.id);
				this.getHrefDate(mes.id);
			}
		}
	}
	state = {
		dataSources: [],
		cellData: [],
		hrefData: [],
		rules: [{
			label: '名称',
			key: 'name',
			option: {
				rules: [{
		        	required: true, message: '请输入报表名称!',
			    }]
			},
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '类型',
			key: 'type',
			option: { rules: [{required: true, message: '请选择类型!'}] },
		    render: _ => <Select style={{ width: 200 }} placeholder="选择报表类型">
				    <Option value='1'>表格</Option>
				    <Option value='2'>柱状图</Option>
				    <Option value='3'>饼图</Option>
				    <Option value='4'>堆叠柱状图</Option>
				    <Option value='5'>表单</Option>
				    <Option value='11'>组合报表</Option>
				  </Select>
		},{
			label: '数据源',
			key: 'datasource',
			option: { rules: [{required: true, message: '请选择数据源!'}] },
		    render: _ => <Select style={{ width: 200 }} placeholder="选择数据源">
				    {this.state.dataSources.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '菜单',
			key: 'isMenu',
			option: { rules: [{required: true, message: '请选择是否创建菜单!'}]},
		    render: _ => <Select style={{ width: 200 }} placeholder="是否创建菜单">
				    <Option value='1'>是</Option>
				    <Option value='0'>否</Option>
				  </Select>
		},{
			label: '是否分页',
			key: 'isPage',
			option: { rules: [{required: true, message: '请选择是否是否分页!'}]},
		    render: _ => <Select style={{ width: 200 }} placeholder="是否是否分页">
				    <Option value='1'>是</Option>
				    <Option value='0'>否</Option>
				  </Select>
		},{
			label: '说明',
			key: 'remark',
			option: { rules: [] },
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '隐藏字段',
			key: 'hideColumns',
			option: { rules: [] },
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: '高亮字段',
			key: 'highColumns',
			option: { rules: [] },
		    render: _ => <Input style={{width: 200}}/>
		},{
			label: 'sql语句',
			key: 'content',
			option: { rules: [] },
		    render: _ => <TextArea rows={5} style={{width: 400}}/>
		}],
		loading: false,
		lock: false,
	}

	//获得多数据源
	getMutiDataSource = _ => {
		getDataSources().then(res => {
			if(res.code == 200)
				this.setState({dataSources: res.data})
		})
	}
	//获得报表搜索条件
	getCellDate = id => {
		getReportSearch({id}).then(res => {
			this.setState({cellData: res.data.map( t => Object.assign({}, t, { key: t.id }))})
		})
	}
	//获得报表跳转条件
	getHrefDate = id => {
		getReportHref({id}).then(res => {
			this.setState({hrefData: res.data.map( t => Object.assign({}, t, { key: t.id }))})
		})
	}

	handleOk = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({}, val)
					if (this.props.config.type == 'edit') {
						params.id = this.props.config.item.id
					}
					if (this.state.cellData.length > 0) {
						params.reportSearchList = this.state.cellData
					}
					if (this.state.hrefData.length > 0) {
						params.reportHrefList = this.state.hrefData	
					}
					addReport(params)
					.then(res => {
						if (res.code == 200 || res === true) {
							message.success('操作成功')
							this.props.getTree()
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
		return <Modal title={this.props.config.title}
		onOk={this.handleOk}
		visible={this.props.config.visible}
		confirmLoading={this.state.loading}
		onCancel={this.props.onCancel}
		width={1000}
		style={{top: 50, marginBottom: 100}}
		okText="提交"
		cancelText="取消">
			<Form>
				<Row gutter={24}>
	        {this.state.rules.map((val, index) => <Col key={index} span={12} style={{ display: 'block'}}><FormItem  
	        label={val.label} labelCol={{span: 4}}>
	          	{getFieldDecorator(val.key, val.option)(val.render())}
	        </FormItem></Col>)}
	      </Row>  
    	</Form>
      	<EditableFormTable data={this.state.cellData} />
      	<ReportGoto data={this.state.hrefData} />
		</Modal>
	}
}

const ProfileForm = Form.create()(ProfileItem)
export default ProfileForm