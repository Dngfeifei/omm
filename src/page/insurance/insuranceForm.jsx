import React, { Component } from 'react'
import {Modal, Input, Form, message, TreeSelect, Select, DatePicker} from 'antd'
const { MonthPicker } = DatePicker;
const FormItem = Form.Item
import { addInsurance } from '/api/insurance'

class InsuranceItem extends Component{

    async componentWillReceiveProps (nextprops) {
        if (nextprops.config != this.props.config && nextprops.config.visible) {
            if (nextprops.config.type != 'edit') {
                this.props.form.resetFields()
            } else {
                let mes = nextprops.config.item
                this.props.form.setFields({
                    pkCorp: {value: mes.pkCorp},
                    city: {value: mes.city},
                    speriod: {value: moment(mes.speriod)},
                    operiod: {value: moment(mes.operiod)},
                    isagent: {value: mes.isagent},
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
            label: '缴纳月份(起)',
            key: 'speriod',
            option: { rules: [{required: true, message: '请选择缴纳起始月!'}] },
            render: _ => <MonthPicker placeholder="选择月份" />
        },{
            label: '缴纳月份(止)',
            key: 'operiod',
            option: { rules: [{required: true, message: '请选择缴纳截止月!'}] },
            render: _ => <MonthPicker placeholder="选择月份" />
        },{
            label: '是否代理',
            key: 'isagent',
            option: { initialValue: 0, rules: [{required: true, message: '请选择是否代理!'}] },
            render: _ => <Select style={{ width: 200 }}>
                <Select.Option value={0}>否</Select.Option>
                <Select.Option value={1}>是</Select.Option>
            </Select>
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
                    if(params.speriod) params.speriod = params.speriod.format('YYYY-MM')
                    if(params.operiod) params.operiod = params.operiod.format('YYYY-MM')
                    if (this.props.config.type === 'edit') {
                        params.id = this.props.config.item.id
                    }
                    addInsurance(params)
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

const InsuranceForm = Form.create()(InsuranceItem)
export default InsuranceForm