import React, { Component } from 'react'
import {Modal, Input, InputNumber, DatePicker, Form, Row, Col, Button, message, Tabs, Icon, Select, Radio} from 'antd'
const FormItem = Form.Item
const { TextArea } = Input;
import { AddListener,EditListener,DelListener } from '/api/listener'
import moment from 'moment'

class ListenerItem extends Component {

    async componentWillReceiveProps(nextprops) {
        if (nextprops.config != this.props.config && nextprops.config.visible) {
            if (nextprops.config.type != 'edit') {
                this.props.form.resetFields()
            } else {
                let mes = nextprops.config.item
                this.props.form.setFields({
                    name: { value: mes.name },
                    listenerType: { value: mes.listenerType },
                    event: { value: mes.event },
                    valueType: { value: mes.valueType },
                    value: { value: mes.value },
                })
            }
            
            this.settingListenerAttr(this.props.form.getFieldValue('listenerType'))
        }
    }


    state = {
        eventArr:[{label: 'start', value: 'start'}, {label: 'take', value: 'take'}, {label: 'end', value: 'end'}],
        changeValue: '',
        rules: [
            {
                label: '名称',
                key: 'name',
                option: {
                    rules: [
                        { required: true, message: "请填写名称" },
                    ]
                },
                render: _ => <Input style={{ width: 500 }} />
            },
            {
                label: '监听器类型',
                key: 'listenerType',
                option: {
                    rules: [
                        { required: true, message: "监听器类型不能为空" },
                    ],
                    initialValue:'1',
                },
                render: _ =>  <Radio.Group onChange={this.loadEvent}>
                                <Radio value='1'>执行监听器</Radio>
                                <Radio value='2'>任务监听器</Radio>
                            </Radio.Group>
            },
            {
                label: '事件',
                key: 'event',
                option: {
                    rules: [
                        { required: true, message: "事件不能为空" },
                    ]
                },
                initialValue:'start',
                render: _ =>  <Select  style={{ width: 120 }} >
                                {
                                    this.state.eventArr.map((items, index) => {
                                        return (<Select.Option key={items.value} value={items.value}>{items.label}</Select.Option>)
                                    })
                                }
                            </Select>
            },
            {
                label: '值类型',
                key: 'valueType',
                option: {
                    rules: [
                        { required: true, message: "值类型不能为空" },
                    ],
                    initialValue:'1',
                },
                render: _ =>  <Radio.Group>
                                <Radio value='1'>类</Radio>
                                <Radio value='2'>表达式</Radio>
                                <Radio value='3'>委托表达式</Radio>
                            </Radio.Group>
            },
            {
                label: '',
                key: 'value',
                option: {
                    rules: [
                        { required: true, message: "值不能为空" },
                    ]
                },
                render: _ => <Input style={{ width: 500 }} />
            }
        ],
        loading: false,
        lock: false,
    }


    loadEvent = (value) => {
        this.props.form.setFields({ event: { value: "" }});
        this.settingListenerAttr(value.target.value)
    };
    
    settingListenerAttr = (value) =>{
       
        if(value === '1'){
            this.setState({ eventArr: [{label: 'start', value: 'start'}, {label: 'take', value: 'take'}, {label: 'end', value: 'end'}] })
        } if(value === '2'){
            this.setState({ eventArr: [{label: 'start', value: 'start'}, {label: 'assignment', value: 'assignment'}, {label: 'complete', value: 'complete'}, {label: 'delete', value: 'delete'}] })
        }
    }

    handleOk = async _ => {
        if (!this.state.lock) {
            await this.setState({ lock: true })
            this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
                if (!err || !Object.getOwnPropertyNames(err).length) {//校验完成执行的逻辑 发起后台请求
                    let params = Object.assign({}, val)
                    if (this.props.config.type == 'add') {
                        AddListener(params)
                            .then(res => {
                                if (res.success == 1) {
                                    this.props.done()
                                    message.success('操作成功')
                                }else{
                                    message.destroy()
                                    message.error(res.msg)
                                }
                                this.setState({ lock: false })
                            })
                    } else {
                        let editparams = Object.assign({}, params, { id: this.props.config.item.id })
                        EditListener(editparams)
                            .then(res => {
                                if (res.success == 1) {
                                    message.success('操作成功')
                                    this.props.done()
                                }else{
                                    message.destroy()
                                    message.error(res.msg)
                                }
                                this.setState({ lock: false })
                            })
                    }
                } else {
                    this.setState({ lock: false })
                }
            })
        }
    }

    render = _ => {
        const { getFieldDecorator } = this.props.form
        return <Modal title={this.props.config.title}
                      visible={this.props.config.visible}
                      confirmLoading={this.state.loading}
                      width={650}
                      style={{ top: 50, marginBottom: 50 }}
                      onOk={this.handleOk}
                      onCancel={this.props.onCancel}
        >
            <Form className="form-error">
                <Row>
                    {this.state.rules.map(
                        (val, index) => val.key != 'value' ?
                            <Col key={index} span={24} style={{ display: 'block' }}>
                                <FormItem
                                    label={val.label} labelCol={{ span: 4}} wrapperCol={{ span: 19 }}>
                                    {getFieldDecorator(val.key, val.option)(val.render())}
                                </FormItem>
                            </Col>
                         :
                            <Col key={index} span={24} style={{ display: 'block' }}>
                                <FormItem
                                    label={this.props.form.getFieldValue('valueType')  == '1' ? '类' :
                                           this.props.form.getFieldValue('valueType') == '2' ? '表达式' :
                                           this.props.form.getFieldValue('valueType')== '3' ? '委托表达式':''} labelCol={{ span: 4}} wrapperCol={{ span: 19 }}>
                                    {getFieldDecorator(val.key, val.option)(val.render())}
                                </FormItem>
                            </Col>
                    )}
                </Row>
            </Form>

        </Modal>
    }
}

const ListenerFrom = Form.create()(ListenerItem)
export default ListenerFrom

