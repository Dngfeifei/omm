import React, { Component } from 'react'
import {Modal, Input, Form, message, TreeSelect, Select, DatePicker} from 'antd'
const { MonthPicker } = DatePicker;
const FormItem = Form.Item
import { addInsuranceDetail } from '/api/insurance'

class InsuranceDetailItem extends Component{

    async componentWillReceiveProps (nextprops) {
        if (nextprops.config != this.props.config && nextprops.config.visible) {
            if (nextprops.config.type != 'edit') {
                this.props.form.resetFields()
            } else {
                let mes = nextprops.config.item
                this.props.form.setFields({
                    pkCorp: {value: mes.pkCorp},
                    city: {value: mes.city},
                    month: {value: moment(mes.month)},
                    name: {value: name},
                    idnum: {value: mes.idnum},
                    insuranceno: {value: mes.insuranceno},
                    remark: {value: mes.remark},
                })
            }
        }
    }
    state = {
        rules: [{
            label: '公司',
            key: 'pkCorp',
            option: {initialValue: '1002',
                rules: [{required: true, message: '请选择公司!'}]
            },
            render: _ => <TreeSelect size='small'
                                     style={{ width: 260 }}
                                     dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                     treeData={this.props.dict.companys}
                                     placeholder="请选择公司"
                                     treeDefaultExpandAll/>
        },{
            label: '缴纳地',
            key: 'city',
            option: { rules: [{required: true, message: '请选择缴纳地!'}] },
            render: _ => <Select size='small' style={{width: 200}}
                                 showSearch
                                 optionFilterProp="children"
                                 filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                {this.props.dict.socialcities.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
            </Select>
        },{
            label: '缴纳月份',
            key: 'month',
            option: { rules: [{required: true, message: '请选择缴纳月!'}] },
            render: _ => <MonthPicker placeholder="选择月份" />
        },{
            label: '人员名称',
            key: 'name',
            option: { rules: [{required: true, message: '请录入人员名称!'}] },
            render: _ => <Input style={{width: 200}} maxLength={32}/>
        },{
            label: '身份证号',
            key: 'idnum',
            option: { rules: [{required: true, message: '请录入身份证号!'}] },
            render: _ => <Input style={{width: 200}} maxLength={32}/>
        },{
            label: '个人编号',
            key: 'insuranceno',
            option: { rules: [] },
            render: _ => <Input style={{width: 200}} maxLength={32}/>
        },{
            label: '备注',
            key: 'remark',
            option: {rules: []},
            render: _ => <Input style={{width: 200}} maxLength={200}/>
        }],
        loading: false,
        lock: false
    }

    //保存
    handleOk = async _ => {
        if (!this.state.lock) {
            await this.setState({lock: true})
            this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
                if (!err || !Object.getOwnPropertyNames(err).length) {
                    let params = Object.assign({}, val)
                    if(params.month) params.month = params.month.format('YYYY-MM')
                    if (this.props.config.type === 'edit') {
                        params.id = this.props.config.item.id
                    }
                    addInsuranceDetail(params)
                        .then(res => {
                            if (res.code == 200 || res === true) {
                                message.success('操作成功')
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
                      width={500}
                      style={{top: 50, marginBottom: 100}}
                      okText="提交"
                      cancelText="取消">
            <Form>
                {this.state.rules.map((val, index) => <FormItem
                    label={val.label} labelCol={{span: 6}}>
                    {getFieldDecorator(val.key, val.option)(val.render())}
                </FormItem>)}
            </Form>
        </Modal>
    }
}

const InsuranceDetailForm = Form.create()(InsuranceDetailItem)
export default InsuranceDetailForm