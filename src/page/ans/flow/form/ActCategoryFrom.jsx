import React, { Component } from 'react'
import {
    Modal,
    Input,
    InputNumber,
    DatePicker,
    Form,
    Row,
    Col,
    Button,
    message,
    Tabs,
    Icon,
    Select,
    TreeSelect
} from 'antd'

const { SHOW_PARENT } = TreeSelect;
const FormItem = Form.Item
const { TextArea } = Input;
import { AddActCategory,EditActCategory,GetActCategoryList } from '/api/ActCategory'
import moment from 'moment'

class ActCategoryItem extends Component {
    

    async componentWillReceiveProps(nextprops) {
        if (nextprops.config != this.props.config && nextprops.config.visible) {
            if (nextprops.config.type != 'edit') {
                this.props.form.resetFields()
            } else {
                let mes = nextprops.config.item
                this.props.form.setFields({
                    parentId: { value: mes.parentId },
                    name: { value: mes.name },
                    sort: { value: mes.sort },
                    remarks: { value: mes.remarks },
                })
            }
            this.categorySearch()
        }

    }


    state = {
        treeData: [],
        treeSelectVal: [],
        rules: [
            {
                label: '上级流程分类',
                key: 'parentId',
                option: {
                    rules: [
                    ]
                },
                render: _ => {
                    const tProps = {
                        treeData: this.state.treeData,
                        style: {
                            width: '450px',
                        }
                    };
                    return <TreeSelect allowClear  {...tProps} />
                }
            },
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
                label: '排序',
                key: 'sort',
                option: {
                    rules: [
                        { required: true, message: "请输入排序" },
                        {
                            message: "请输入数字",
                            pattern: /^[0-9]{0,}$/,
                            trigger: "blur"
                        }
                    ]
                },
                render: _ => <Input style={{ width: 500 }} />
            },
            {
                label: '备注',
                key: 'remarks',
                option: { rules: [] },
                render: _ => <TextArea rows={3} />
            }
        ],
        loading: false,
        lock: false,
    }

    //全量流程分类查询
    categorySearch = async () => {

        let param = this.props.form.getFieldValue('parentId');
        if(param === undefined){
            param = '0'
        }
        GetActCategoryList(param)
            .then(res => {
                if (res.success == 0) {
                    message.error("流程分类查询");
                } else {
                    
                    const loop = data =>
                        data.map(item => {
                            item.key = item.id
                            item.title = item.name
                            item.value = item.id
                            // if(item.parentId === '0'){
                            //     console.info("++++++++++++++++++")
                            //     item.parentId = ""
                            // }
                            if (item.children && item.children.length) {
                                return loop(item.children)
                            }
                            return item;
                        });
                    
                     loop(res.treeData)
                    
                     this.setState({ treeData: res.treeData })
                }
            })
    }

    handleOk = async _ => {
        if (!this.state.lock) {
            await this.setState({ lock: true })
            this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
                if (!err || !Object.getOwnPropertyNames(err).length) {//校验完成执行的逻辑 发起后台请求
                  
                    let params = Object.assign({}, val)
                    if (params.parentId != '') {
                        let newObj = { 'parent.id': params.parentId };
                        params = Object.assign({},params,newObj)
                    }
                    if (this.props.config.type == 'add') {
                        AddActCategory(params)
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
                        EditActCategory(editparams)
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
                        (val, index) => val.key != 'remarks' && val.key != 'parentId'  ?

                        <Col key={index} span={24} style={{ display: 'block' }}>
                            <FormItem
                                label={val.label} labelCol={{ span: 3 }} wrapperCol={{ span: 14 }}>
                                {getFieldDecorator(val.key, val.option)(val.render())}
                            </FormItem>
                        </Col> :
                        val.key === 'remarks'?
                            <Col key={index} span={24} style={{ display: 'block' }}>
                                <FormItem
                                    label={val.label} labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
                                    {getFieldDecorator(val.key, val.option)(val.render())}
                                </FormItem>
                            </Col>:
                        <Col key={index} span={24} style={{ display: 'block' }}>
                            <FormItem
                                label={val.label} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
                                {getFieldDecorator(val.key, val.option)(val.render())}
                            </FormItem>
                        </Col>
                    )}
                </Row>
            </Form>

        </Modal>
    }
}

const ActCategoryFrom = Form.create()(ActCategoryItem)
export default ActCategoryFrom

