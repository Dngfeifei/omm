/***
 *  系统管理--公告编辑页面
 * @auth yyp
 */
import React, { Component } from 'react'
import { Form, Button, message, Select, Input, Modal, DatePicker, Upload, Icon } from 'antd'
const { Option } = Select;

// 引入日期格式化
import moment from 'moment'


// 引入 弹窗组件组件
import ModalParant from "@/components/modal/index.jsx"

// 引入 富文本编辑器组件
import Editor from "@/components/editor/index2.jsx"

// 引入 API接口
import { GetDictionary, AddDictionary, EditDictionary, DelDictionary, GetDictItems, AddDictItem, EditDictItem, DelDictItem } from '/api/dictionary.js'



class Notice extends Component {
    // 设置默认props
    static defaultProps = {
        type: "add",
        ID: "",
        data: {
            // "dictId": "9",
            // "id": "27",
            // "name": "leftPortalet",
            // "code": "工作台左侧portalet",
            // "serialNumber": "",
            // "status": 1,
        },
        extendedField: [
            // {
            //     fieldEn: "strvalu1",
            //     fieldCn: "备注",
            //     field_type: "string",
            // }
        ],
    }
    componentWillMount() {
        // 初始化界面数据
        this.init()
    }
    componentDidMount() {
        let type = this.props.type;
        if (type == "edit") {
            let extendedKeys = {}
            let data = this.props.data;
            console.log(data, "data")
            this.props.extendedField.forEach(item => {
                extendedKeys[item.fieldEn] = data[item.fieldEn]
            })
            let params = Object.assign({},
                {
                    name: data.name,
                    code: data.code,
                    serialNumber: data.serialNumber,
                    status: data.status,
                }, extendedKeys)
            console.log(params, "params")
            this.props.form.setFieldsValue(params);
        }
    }

    state = {
        // 请求加锁
        actionLock: true,
        rules: [{
            label: '字典值',
            key: 'name',
            option: {
                rules: [{
                    required: true, message: '请输入!',
                }]
            },
            render: _ => {
                return <Input style={{}} placeholder="请输入" />
            }
        }, {
            label: '编码值',
            key: 'code',
            option: {
                rules: [{
                    required: true, message: '请输入!',
                }]
            },
            render: _ => {
                return <Input style={{}} placeholder="请输入" />
            }
        }, {
            label: '顺序',
            key: 'serialNumber',
            option: {
                rules: [{
                    required: true, message: '请输入!',
                }]
            },
            render: _ => {
                return <Input style={{}} placeholder="请输入" />
            }
        }, {
            label: '状态',
            key: 'status',
            option: {
                rules: [{
                    required: true, message: '请选择状态!',
                }],
            },
            render: () => {
                return <Select placeholder="请选择">
                    <Option value={1}>启用</Option>
                    <Option value={0}>停用</Option>
                </Select>
            }
        }],

        titleMap: {
            add: '新增',
            edit: '修改',
        },
        type: "add",
        // 当前字典类型拓展字段
        expandRules: [],
    }
    // 界面数据初始化
    init = _ => {
        let { type, data } = this.props;
        let newData = { type }
        if (type == "edit") {
            newData["notice"] = data
        }

        // {
        //     label: '字典值',
        //     key: 'itemValue',
        //     option: {
        //         rules: [{
        //             required: true, message: '请输入!',
        //         }]
        //     },
        //     render: _ => {
        //         return <Input style={{}} placeholder="请输入" />
        //     }
        // }
        let expandRules = []
        this.props.extendedField.forEach(item => {
            expandRules.push({
                label: item.fieldCn,
                key: item.fieldEn,
                // option: {
                //     rules: [{
                //         required: true, message: '请输入!',
                //     }]
                // },
                render: _ => {
                    return <Input style={{}} placeholder="请输入" />
                }
            })
        })
        this.setState({
            expandRules
        })
    }


    // 保存
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let param = this.props.form.getFieldsValue()
                if (!this.state.actionLock) {
                    return
                }
                this.state.actionLock = false

                if (this.props.type == "add") {
                    AddDictItem({ ...param, basedataTypeId: this.props.ID }).then(res => {
                        if (res.success != 1) {
                            message.destroy()
                            message.error(res.message)
                        } else {
                            this.props.onOk()
                        }
                        this.state.actionLock = true
                    })
                } else if (this.props.type == "edit") {
                    EditDictItem({ ...param, id: this.props.ID }).then(res => {
                        if (res.success != 1) {
                            message.destroy()
                            message.error(res.message)
                        } else {
                            this.props.onOk()
                        }
                        this.state.actionLock = true
                    })
                }
            }
        });
    }


    render = _ => {
        const { getFieldDecorator } = this.props.form;

        return <ModalParant
            title={this.state.titleMap[this.props.type]}
            destroyOnClose={true}
            visible={true}
            onOk={this.onSubmit}//若无选中数据 执行关闭方法
            onCancel={this.props.onCancel}
            width={1000}
            bodyStyle={{ padding: "0" }}
            footer={[
                <Button key="back" onClick={this.props.onCancel}>
                    取消
                </Button>,
                <Button key="submit" type="primary" onClick={this.onSubmit}>
                    保存
                </Button>,
            ]}
        >
            <Form layout='inline' className="form-error" style={{ padding: '10px 10px 0' }}>
                {this.state.rules.concat(this.state.expandRules).map((val, index) =>
                    <Form.Item
                        label={val.label}
                        labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                        key={index}
                        style={{ marginRight: '0', width: "50%", marginBottom: "20px" }}>
                        {getFieldDecorator(val.key, val.option)(val.render())}
                    </Form.Item>)}
            </Form>
        </ModalParant >

    }
}

const Notices = Form.create()(Notice)
export default Notices

