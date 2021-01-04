import React, { Component } from 'react'
import { Modal, Input, Form, Row, Col, Button, message, Spin, List, Checkbox, Upload, Icon } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
import { viewForm, applyPass, applyUnPass, saveTaskProps } from '/api/process'
import { uploadProcessPaper, deleteProcessPaper, downloadAttr } from '/api/global'
import { dealBlob, divideMsg } from '/api/tools'
import { connect } from 'react-redux'
import { GET_TODOCOUNT } from '/redux/action'

@connect(state => ({
    todoCount: state.global.todoCount,
}),dispath => ({
    getTodoCount(){dispath({type: GET_TODOCOUNT})},
}))

class ApplyStoreForm extends Component{

    async componentWillReceiveProps (nextprops) {
        if (nextprops.config != this.props.config && nextprops.config.visible && nextprops.config.item && nextprops.config.item.id) {
            let id = nextprops.config.item.id
            this.setState({spinloading: true})
            viewForm({id}).then(res => {
                this.setState({baseData: res.data.baseData || [],
                    formData: res.data.formData || [],
                    attrData: res.data.attrData || [],
                    detailData: res.data.detailData || [],
                    messages: res.data.messages})
                this.setState({spinloading: false, content: ''})
            });
            if(nextprops.config.item.taskId){
                this.setState({taskId: nextprops.config.item.taskId})

                let fileList = []
                if(nextprops.config.item.contApply.pfiles){
                    fileList = nextprops.config.item.contApply.pfiles.split(',').map((e,i) => {
                        let arr = e.split("/");
                        return {key: i, uid: i, name: arr[arr.length - 1], status: 'done', url: e, response:{data: e}}
                    })
                }
                console.log(fileList);
                this.setState({applySpecialCheck: nextprops.config.item.contApply.ispecial,
                    kareas: nextprops.config.item.contApply.kareas, fileList})
            }
        }
    }
    state = {
        taskId: '',
        baseData: [],// 基础数据
        formData: [],// 表单数据
        attrData: [],// 附件
        detailData: [],// 申请数据
        messages: [],
        loading1: false,
        loading2: false,
        lock: false,
        content: '',
        spinloading: true,
        fileList: [], // 项目专员上传附件
        applySpecialCheck: 0, // 是否特殊需求
        kareas: 0, // 是否跨区域
    }

    // 检查保存信息（项目管理员）
    handleSave = _ => {
        if(this.state.applySpecialCheck === 0 && this.state.fileList.length == 0){
            message.error('不是系统提供现存量清单，则必须上传附件')
            return
        }
        // 保存流程中信息
        let arr = this.state.fileList.map(t => {
            return t.response.data
        })
        let files = arr.join(',')
        saveTaskProps({taskId: this.state.taskId, kareas: this.state.kareas,
            applySpecialCheck: this.state.applySpecialCheck, files: files}).then(res => {
            if(res.code === 200){
                this.handleOk1()
            }
        })
    }

    handleOk1 = _ => {
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
    //通过
    handleOk = _ => {
        if(this.props.config.item.canedit){ // 备件库管理员
            this.handleSave()// 备件库管理员
        }else{
            this.handleOk1()
        }
    }

    handleCancel = _ => {
        this.setState({loading2: true})
        applyUnPass({taskId: this.state.taskId, content: this.state.content}).then(res => {
            this.setState({loading2: false})
            if(res.code == 200){
                message.error('审核拒绝')
                this.props.getTodoCount()
                this.props.done()
                this.props.onCancel()
            }
        })
    }

    downloadAttr = item => {
        downloadAttr({path: item.path}).then(blob => {
            dealBlob(blob, item.name)
        })
    }
    downloadData = item => {
        downloadAttr({path: item.url}).then(blob => {
            dealBlob(blob, item.name)
        })
    }

    //特殊需求
    checkChange = e => {
        this.setState({applySpecialCheck: e ? 1 : 0})
    }
    //是否跨区域
    checkKareasChange = e => {
        this.setState({kareas: e ? 1 : 0})
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
            <Button key="back" loading={this.state.loading2} onClick={this.handleCancel}>拒绝</Button>
            <Button key="submit" type="primary" loading={this.state.loading1} onClick={this.handleOk}>
                通过
            </Button></div>
        return <Modal title={this.props.config.title}
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
                        {/** 备件审核人可以选择：是否特殊需求 **/}
                        {this.props.config.item.canedit ? <Col span={12} style={{ display: 'block'}}><FormItem
                            label='是否跨区域' labelCol={{span: 8}}>
                            <Checkbox checked={this.state.kareas === 1} onChange={e => this.checkKareasChange(e.target.checked)}></Checkbox>
                        </FormItem></Col> : null}
                        {this.props.config.item.canedit ? <Col span={12} style={{ display: 'block'}}><FormItem
                            label='是否系统提供现存量清单' labelCol={{span: 8}}>
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
                    {!this.props.config.item.canedit && !this.props.config.item.ismine ? <List
                        style={{marginTop: '8px'}}
                        header={<h2>已上传资料</h2>}
                        size="small"
                        dataSource={this.state.fileList}
                        renderItem={item => (<List.Item actions={[<a onClick={_ => this.downloadData(item)}>下载</a>]}>{item.name}</List.Item>)}
                    /> : null}
                    {this.state.attrData.length > 0 ? <List
                        style={{marginTop: '20px'}}
                        header={<h2>附件</h2>}
                        size="small"
                        dataSource={this.state.attrData}
                        renderItem={item => (<List.Item actions={[<a onClick={_ => this.downloadAttr(item)}>下载</a>]}>{item.name}</List.Item>)}
                    /> : null}
                    {this.state.detailData.length > 0 ? <List
                        style={{marginTop: '20px'}}
                        header={<h2>申请资料</h2>}
                        size="small"
                        dataSource={this.state.detailData}
                        renderItem={item => (<List.Item>{item}</List.Item>)}
                    /> : null}
                </Form>
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
            {this.props.auth ? <TextArea rows={2} value={this.state.content} onChange={e => this.setState({content: e.target.value})} style={{marginTop: '20px'}} placeholder="请输入审批意见..." /> : null}
        </Modal>
    }
}

export default ApplyStoreForm