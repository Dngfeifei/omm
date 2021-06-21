import React, { Component } from 'react'
import { Modal, Input, InputNumber, DatePicker, Form, Row, Col, Button, message, Tabs, Icon, Select } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input;
import { AddButton,EditButton,DelButton } from '/api/button'
import moment from 'moment'

class ButtonItem extends Component {

    async componentWillReceiveProps(nextprops) {
        if (nextprops.config != this.props.config && nextprops.config.visible) {
            if (nextprops.config.type != 'edit') {
                this.props.form.resetFields()
            } else {
                let mes = nextprops.config.item
                this.props.form.setFields({
                    name: { value: mes.name },
                    code: { value: mes.code },
                    sort: { value: mes.sort },
                })
            }
        }
    }
    state = {
        treeData: [],
        rules: [
            {
                label: '名称',
                key: 'name',
                option: {
                    rules: [
                        { required: true, message: "请输入名称" },
                    ]
                },
                render: _ => <Input style={{ width: 500 }} />
            },
            {
                label: '编码',
                key: 'code',
                option: {
                    rules: [
                        { required: true, message: "请输入表达式" },
                    ]
                },
                render: _ => <Input style={{ width: 500 }} />
            },
            {
                label: '排序',
                key: 'sort',
                option: { rules: [] },
                render: _ => <Input style={{ width: 500 }} />
            }
        ],
        loading: false,
        lock: false,
    }


    handleOk = async _ => {
        if (!this.state.lock) {
            await this.setState({ lock: true })
            this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
                if (!err || !Object.getOwnPropertyNames(err).length) {//校验完成执行的逻辑 发起后台请求
                    let params = Object.assign({}, val)
                    if (this.props.config.type == 'add') {
                        AddButton(params)
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
                        EditButton(editparams)
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
                        (val, index) =>

                        <Col key={index} span={24} style={{ display: 'block' }}>
                            <FormItem
                                label={val.label} labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
                                {getFieldDecorator(val.key, val.option)(val.render())}
                            </FormItem>
                        </Col>
                    )}
                </Row>
            </Form>

        </Modal>
    }
}

const ButtonFrom = Form.create()(ButtonItem)
export default ButtonFrom

