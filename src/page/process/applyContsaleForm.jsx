import React, { Component } from 'react'
import {Modal, Input, Form, Row, Col, Button, message, Upload, Icon, Spin, List, Checkbox} from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
import { viewForm, applyPass, applyUnPass, assignTask, assignOwner, saveTaskProps } from '/api/process'
import { getContsaleRequires } from '/api/contsale'
import ApplyContsaleList from '/page/process/applyContsaleList.jsx'
import { uploadProcessPaper, deleteProcessPaper, downloadAttr } from '/api/global'
import { dealBlob, divideMsg } from '/api/tools'
import { connect } from 'react-redux'
import { GET_TODOCOUNT } from '/redux/action'

@connect(state => ({
	todoCount: state.global.todoCount,
}),dispath => ({
	getTodoCount(){dispath({type: GET_TODOCOUNT})},
}))

class ApplyContsaleForm extends Component{

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
				//获得案例需求明细
				getContsaleRequires({contId: nextprops.config.item.contApply.id}).then(res => {
					this.setState({contsaleRequires: res.data.map(e => {
						e.ds = `${e.descrip}（在招标书第${e.pagenum}页；案例列表数：${e.listnum}；案例扫描件：${e.picnum}；案例原件：${e.papernum}）`
						return e
					})})
				})
				if(nextprops.config.item.taskId){
					this.setState({taskId: nextprops.config.item.taskId})
					let fileList = []
					if(nextprops.config.item.contApply.pfiles){
						fileList = nextprops.config.item.contApply.pfiles.split(',').map((e,i) => {
							let arr = e.split("/");
							return {key: i, uid: i, name: arr[arr.length - 1], status: 'done', url: e, response:{data: e}}
						})
					}
					this.setState({applySpecialCheck: nextprops.config.item.contApply.ispecial, fileList})
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
		listconf: {visiable: false, title: '', item: {}},
		fileList: [], // 项目专员上传附件
		applySpecialCheck: 0 // 是否特殊需求
	}

	// 检查保存信息（项目管理员）
	handleSave = _ => {
		if(this.state.applySpecialCheck && this.state.fileList.length == 0){
			message.error('特殊需求，必须上传附件')
			return
		}
		// 保存流程中信息
		let arr = this.state.fileList.map(t => {
			return t.response.data
		})
		let files = arr.join(',')
		saveTaskProps({taskId: this.state.taskId,
			applySpecialCheck: this.state.applySpecialCheck, files: files}).then(res => {
			if(res.code === 200){
				this.handleOk1()
			}
		})
	}
	// 项目管理员交给申请人查看（项目管理员）
	handleOk1 = _ => {
		this.setState({loading1: true})
		assignTask({taskId: this.state.taskId, content: this.state.content, userId: this.state.userId}).then(res => {
			this.setState({loading1: false})
			if(res.code == 200){
				message.success('审核通过')
				this.props.getTodoCount()
				this.props.done()
				this.props.onCancel()
			}
		})
	}
	// 审核通过（走正常流程）
	handleOkOther = _ => {
		this.setState({loading1: true})
		applyPass({taskId: this.state.taskId, content: this.state.content}).then(res => {
			this.setState({loading1: false})
			if(res.code == 200){
				message.success('审核通过')
				this.props.getTodoCount()
				this.props.done()
				this.props.onCancel()
			}
		})
	}
	// 审核拒绝
	handleCancel1 = _ => {
		this.setState({loading2: true})
		applyUnPass({taskId: this.state.taskId, content: this.state.content}).then(res => {
			this.setState({loading2: false})
			if(res.code == 200){
				message.success('审核拒绝')
				this.props.getTodoCount()
				this.props.done()
				this.props.onCancel()
			}
		})
	}
	// 满足需求-通过（申请人）
	handleOk2 = _ => {
		this.setState({loading1: true})
		assignOwner({taskId: this.state.taskId, content: this.state.content, type: 1}).then(res => {
			this.setState({loading1: false})
			if(res.code == 200){
				message.success('审核通过')
				this.props.getTodoCount()
				this.props.done()
				this.props.onCancel()
			}
		})
	}
	// 不满足需求-退回（申请人）
	handleCancel2 = _ => {
		this.setState({loading2: true})
		assignOwner({taskId: this.state.taskId, content: this.state.content, type: 0}).then(res => {
			this.setState({loading2: false})
			if(res.code == 200){
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
			if(this.props.config.item.canedit){ // 项目管理员
				this.handleSave()//项目管理员
			}else{
				this.handleOkOther()//
			}
		}else{
			this.handleOk2()//申请人
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
	openContsaleDetail = r => {
		r.canedit = this.props.config.item.canedit
		r.paperEdit = this.props.config.item.paperEdit
		this.setState({listconf: {visiable: true, title: r.name, item: r}})
	}
	//关闭明细表
	closeContsaleDetail = r => {
		let obj = Object.assign({}, this.state.listconf, {visiable: false})
		this.setState({listconf: obj})
	}
	//特殊需求
	checkChange = e => {
		this.setState({applySpecialCheck: e ? 1 : 0})
	}
	//上传附件
	handleChange = ({ file, fileList }) => {
		this.setState({ fileList })
	}
	//删除附件
	handleRemove = (file) => {
		deleteProcessPaper({path: file.url}).then(res => {
			if(res.code === 200){
				message.success('删除成功')
				// 保存流程中信息
				let arr = this.state.fileList.map(t => {
					return t.response.data
				})
				let files = arr.join(',')
				saveTaskProps({taskId: this.state.taskId,
					applySpecialCheck: this.state.applySpecialCheck, files: files})
			}
		})
		return true
	}

	render = _ => {
		const ButtonGroups = <div>
            <Button key="back" loading={this.state.loading2} 
            onClick={this.handleCancel}>{this.props.config.item.ismine ? '不满足需求' : '拒绝'}</Button>
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
					 {/** 项目专员可以选择：是否特殊需求 **/}
					 {this.props.config.item.canedit ? <Col span={12} style={{ display: 'block'}}><FormItem
						 label='是否特殊需求' labelCol={{span: 7}}>
						 <Checkbox checked={this.state.applySpecialCheck === 1} onChange={e => this.checkChange(e.target.checked)}></Checkbox>
					 </FormItem></Col> : null}
					 {this.props.config.item.canedit ? <Col span={12} style={{ display: 'block'}}><FormItem
						 label='上传附件资料' labelCol={{span: 7}}>
						 <Upload
							 action={`${uploadProcessPaper}`}
							 data={{code: this.props.config.item.contApply.code}}
							 headers={{Authorization: `Bearer ${localStorage.getItem('token')}`}}
							 onChange = {this.handleChange}
							 onRemove={this.handleRemove}
							 showUploadList={{showPreviewIcon: false, showRemoveIcon: true}}
							 fileList={this.state.fileList}>
							 <Button style={{marginTop: 0}}> <Icon type="upload" /> 上传附件 </Button>
						 </Upload>
					 </FormItem></Col> : null }
			  </Row>
			  {this.state.attrData.length > 0 ? <List
			  style={{marginTop: '20px'}}
			  header={<h2>附件</h2>}	
	      size="small"
	      dataSource={this.state.attrData}
	      renderItem={item => (<List.Item actions={[<a onClick={_ => this.downloadAttr(item)}>下载</a>]}>{item.name}</List.Item>)}
    	/> : null} 
			  {this.state.contsaleRequires.length > 0 ? <List
			  style={{marginTop: '20px', paddingRight: '60px'}}
			  header={<h2>申请资料</h2>}		
	      size="small"
	      dataSource={this.state.contsaleRequires}
	      renderItem={item => (<List.Item actions={[<Button key="show" type="primary" size="small" onClick={_ => this.openContsaleDetail(item)}>查看案例列表</Button>]}>{item.ds}</List.Item>)}
    	/> : null}      
	    </Form> 
	    {this.state.messages.length > 0 ? <List size="small"
	      dataSource={this.state.messages}
		  renderItem={item => (<List.Item>
			  <span style={{width: 120}}>{divideMsg(item, 0)}</span>
			  <span style={{color: '#f81d22'}}>{divideMsg(item, 1)}</span>
			  <span style={{fontSize: '12px', height: '12px',color: '#5e5e5fa1'}}>{divideMsg(item, 2)}</span>
		  </List.Item>)}
    	/> : null}
    </Spin>
	    {this.props.auth ? <TextArea rows={2} ref='textArea' value={this.state.content} onChange={e => this.setState({content: e.target.value})} style={{marginTop: '20px'}} placeholder={this.props.config.item.ismine ? '请输入修改建议...' : '请输入审批意见...'}/> : null}
		</Modal>
		<Modal title={this.state.listconf.title}
		visible={this.state.listconf.visiable}
		onCancel={_ => this.closeContsaleDetail()}
		footer={null}
		width='90%'	
		style={{top: 50, marginBottom: 100}}>
			<ApplyContsaleList close={this.closeContsaleDetail} item={this.state.listconf.item}  />
		</Modal>
		</div>
	}
}

export default ApplyContsaleForm