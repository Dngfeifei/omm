import React, { Component } from 'react'
import { Modal, Input, Form, Row, Col, Button, message, Spin, List } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
import { viewForm, applyPass, applyUnPass, assignTask, assignOwner } from '/api/process'
import ApplyStaffList from '/page/process/applyStaffList.jsx'
import { downloadAttr } from '/api/global'
import { dealBlob, divideMsg } from '/api/tools'
import { connect } from 'react-redux'
import { GET_TODOCOUNT } from '/redux/action'

@connect(state => ({
	todoCount: state.global.todoCount,
}),dispath => ({
	getTodoCount(){dispath({type: GET_TODOCOUNT})},
}))

class ApplyStaffForm extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible && nextprops.config.item && nextprops.config.item.id) {
				let id = nextprops.config.item.id
				this.setState({spinloading: true})
				viewForm({id}).then(res => {
						this.setState({userId: res.data.userId,
							baseData: res.data.baseData || [], 
							formData: res.data.formData || [], 
							attrData: res.data.attrData || [], 
							detailData: res.data.detailData || [], 
							messages: res.data.messages})
						this.setState({spinloading: false, content: ''})
				});
				if(nextprops.config.item.taskId){
					this.setState({taskId: nextprops.config.item.taskId})
				}
		}
	}
	state = {
		taskId: '',
		userId: 0,
		baseData: [],// 基础数据
		formData: [],// 表单数据
		attrData: [],// 附件
		detailData: [],// 申请数据
		contsaleRequires: [],//需求
		messages: [],
		loading1: false,
		loading2: false,
		lock: false,
		content: '',
		spinloading: true,
		visiable: false,
	}
	// 人事管理员审核通过 --- 需要申请人确认
	handleOk1 = _ => {
		this.setState({loading1: true})
		assignTask({taskId: this.state.taskId, content: this.state.content, userId: this.state.userId}).then(res => {
			this.setState({loading1: false})
			if(res.code === 200){
				message.success('审核通过')
				this.props.getTodoCount()
				this.props.done()
				this.props.onCancel()
			}
		})
	}
	// 其他人审核通过
	handleOkOther = _ => {
		this.setState({loading1: true})
		applyPass({taskId: this.state.taskId, content: this.state.content, userId: this.state.userId}).then(res => {
			this.setState({loading1: false})
			if(res.code === 200){
				message.success('审核通过')
				this.props.getTodoCount()
				this.props.done()
				this.props.onCancel()
			}
		})
	}
	// 审核流程驳回
	handleCancel1 = _ => {
		this.setState({loading2: true})
		applyUnPass({taskId: this.state.taskId, content: this.state.content}).then(res => {
			this.setState({loading2: false})
			if(res.code === 200){
				message.success('审核拒绝')
				this.props.getTodoCount()
				this.props.done()
				this.props.onCancel()
			}
		})
	}
	// 申请人 --- 点击"满足需求"
	handleOk2 = _ => {
		this.setState({loading1: true})
		assignOwner({taskId: this.state.taskId, content: this.state.content, type: 1}).then(res => {
			this.setState({loading1: false})
			if(res.code === 200){
				message.success('审核通过')
				this.props.getTodoCount()
				this.props.done()
				this.props.onCancel()
			}
		})
	}
	// 审核人  --- 点击"不满足需求"
	handleCancel2 = _ => {
		this.setState({loading2: true})
		assignOwner({taskId: this.state.taskId, content: this.state.content, type: 0}).then(res => {
			this.setState({loading2: false})
			if(res.code === 200){
				message.success('退回修改')
				this.props.getTodoCount()
				this.props.done()
				this.props.onCancel()
			}
		})
	}
	//通过
	handleOk = _ => {
		if(!this.props.config.item.ismine){
			if(this.props.config.item.canedit && !this.props.config.item.paperEdit){ // 人事管理员
					this.handleOk1()
			}else{
				this.handleOkOther()// 其他人审核通过
			}
		}else{
			this.handleOk2()// 满足需求
		}
	}
	//拒绝
	handleCancel = _ => {
		if(!this.props.config.item.ismine){
			this.handleCancel1()
		}else{
			if(!this.state.content){
				message.error('请录入修改建议')
				this.refs.textArea.focus()
			}else{
				this.handleCancel2()
			}
		}
	}



	downloadAttr = item => {
		downloadAttr({path: item.path}).then(blob => {
      dealBlob(blob, item.name)
    })
	}

	//打开明细表
	openStaffDetail = _ => {
		this.setState({visiable: true})
	}
	//关闭明细表
	closeStaffDetail = _ => {
		this.setState({visiable: false})
	}

	render = _ => {
		const ButtonGroups = <div>
            <Button key="back" loading={this.state.loading2} 
            onClick={this.handleCancel}>{this.props.config.item.ismine ?  '不满足需求' : '拒绝'}</Button>
            <Button key="submit" type="primary" loading={this.state.loading1} onClick={this.handleOk}>
               {this.props.config.item.ismine ? '满足需求' : '通过'}
            </Button></div> 
		return <div><Modal title={this.props.config.title}
		footer={this.props.auth ? ButtonGroups : null}
		visible={this.props.config.visible}
		onCancel={this.props.onCancel}
		width={1000}	
		style={{top: 50, marginBottom: 100}}>
		<Spin spinning={this.state.spinloading}>
			<Form>
				<Row gutter={24}>
			        {this.state.baseData.map((val, index) => <Col span={8} key={index} style={{ display: 'block'}}><FormItem  
			        label={val.label} labelCol={{span: 7}}>
			          	{val.value}
			        </FormItem></Col>)}
			  </Row>      
		  </Form>
			<Form className="flex-view">
				 <Row gutter={24}>
			        {this.state.formData.map((val, index) => <Col span={12} key={index} style={{ display: 'block'}}><FormItem  
			        label={val.label} labelCol={{span: 7}}>
			          	{val.value}
			        </FormItem></Col>)}
			  </Row>
			  {this.state.attrData.length > 0 ? <List
			  style={{marginTop: '20px'}}
			  header={<h2>附件</h2>}	
	      size="small"
	      dataSource={this.state.attrData}
	      renderItem={item => (<List.Item actions={[<a onClick={_ => this.downloadAttr(item)}>下载</a>]}>{item.name}</List.Item>)}
    	/> : null}     
	    </Form> 
	    <Button onClick={this.openStaffDetail} type="primary" icon="file">查看资料列表</Button> 
	    {this.state.messages.length > 0 ? <List
	      size="small"
	      dataSource={this.state.messages}
	      renderItem={item => (<List.Item>
			  <span style={{width: 120}}>{divideMsg(item, 0)}</span>
			  <span style={{color: '#f81d22'}}>{divideMsg(item, 1)}</span>
			  <span style={{fontSize: '12px', height: '12px',color: '#5e5e5fa1'}}>{divideMsg(item, 2)}</span>
		  </List.Item>)}
    	/> : null}
    </Spin>
	    {this.props.auth ? <TextArea rows={2}  ref='textArea' value={this.state.content} onChange={e => this.setState({content: e.target.value})} style={{marginTop: '20px'}} placeholder="请输入审批意见..." /> : null}
		</Modal>
			<ApplyStaffList visible={this.state.visiable} onCancel={this.closeStaffDetail}
				close={this.closeStaffDetail} item={this.props.config.item.contApply || {}} />
		</div>
	}
}

export default ApplyStaffForm