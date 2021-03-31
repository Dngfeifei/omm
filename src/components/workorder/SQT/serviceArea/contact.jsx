/**
 * 服务计划表--副表-服务区域（客户技术联系人）
 * @author yyp
*/


import React, { Component } from 'react'
import { Input, Select, Table, Button, Radio, message, Row } from 'antd'
const { Option } = Select;


// 引入页面CSS
import '@/assets/less/pages/servies.less'

let rowCount = 0;

class Contact extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // 表格数据
            dataSource: [],
            // 表格配置项
            columns: [
                {
                    title: '服务区域',
                    dataIndex: 'area',
                    key: 'area',
                    width: "15%",
                    align: 'center',
                    render: (value, row, index) => {
                        let content=<div dangerouslySetInnerHTML = {{__html:props.title}} ></div>
                        const obj = {
                            children: content,
                            props: {},
                        };
                        if (index === 0) {
                            obj.props.rowSpan = rowCount;
                        }
                        if (index > 0) {
                            obj.props.rowSpan = 0;
                        }
                        return obj;
                    },
                },
                {
                    title: '',
                    width: "7%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <Radio value={index}></Radio>
                    },
                },

                {
                    title: '联系人类型',
                    dataIndex: 'type',
                    key: 'type',
                    width: "16%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <Select  style={{ width: "100%" }} value={value} onSelect={this.onSelectContactType}>
                            <Option key={index} value={1}>职级主管</Option>
                            <Option key={index} value={2}>技术联系人</Option>
                        </Select>;
                    },
                },
                {
                    title: '姓名',
                    dataIndex: 'name',
                    key: 'name',
                    width: "16%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <Input name={index} value={value} onChange={this.onChangeName} onBlur={this.onBlurName}></Input>;
                    },
                },
                {
                    title: '联系电话 ',
                    dataIndex: 'mobile',
                    key: 'mobile',
                    width: "20%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <Input name={index} value={value} onChange={this.onChangeTel} onBlur={this.onBlurTel}></Input>;
                    },
                },
                {
                    title: '邮箱',
                    dataIndex: 'email',
                    key: 'email',
                    width: "26%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <Input name={index} value={value} onChange={this.onChangeEmail} onBlur={this.onBlurEmail}></Input>;
                    },
                },
            ],
            // 表格当前选中项
            current: null,
        }
    }
    // 数据即将挂载
    componentWillMount() {
        let dataSource = Array.from(this.props.dataSource)
        rowCount = dataSource.length;
        this.setState({
            dataSource
        })
    }


    // 更新数据到父级
    updateToparent = () => {
        let checkResult = this.onCheck()
        this.props.onChange({ dataSource: this.state.dataSource, error: checkResult })
    }
    // 获取列表选中项
    onChangeRadio = ({ target }) => {
        this.setState({
            current: target.value
        }, () => {
            this.updateToparent()
        })
    }
    // 获取联系人类型
    onSelectContactType = (val, { key }) => {
        let dataSource = this.state.dataSource;
        dataSource[key].type = val;
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 获取姓名
    onChangeName = ({ target }) => {
        let key = target.name
        let val = target.value
        let dataSource = this.state.dataSource;
        dataSource[key].name = val;
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 获取电话
    onChangeTel = ({ target }) => {
        let key = target.name
        let val = target.value
        let dataSource = this.state.dataSource;
        dataSource[key].mobile = val;
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 获取邮箱
    onChangeEmail = ({ target }) => {
        let key = target.name
        let val = target.value
        let dataSource = this.state.dataSource;
        dataSource[key].email = val;
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 新增一行
    addRow = () => {
        if (this.state.dataSource.length) {
            let checkResult = this.onCheck("add")
            if (!checkResult.state) {
                message.destroy()
                message.warning(checkResult.message)
                return
            }
        }
        let newRow = {
            area: '福建/厦门【主责区域】',
            type: "",
            name: '',
            mobile: '',
            email: '',
        }
        let dataSource = this.state.dataSource
        dataSource.push(newRow)
        rowCount = dataSource.length
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 删除行
    delRow = () => {
        let { current, dataSource } = this.state;
        if (current == null) {
            message.destroy()
            message.warning("请选中后再进行删除操作！")
            return
        }
        dataSource.splice(current, 1)
        this.setState({
            dataSource,
            current: null
        }, () => {
            this.updateToparent()
        })
    }
    // 数据校验 字段为空返回false
    onCheck = (type = null) => {
        let result = { state: true, message: "" }
        let data = this.state.dataSource;
        // 职级主管和技术联系人数量最少为1 
        let count1 = 0;
        let count2 = 0;
        data.forEach((el) => {
            Object.keys(el).forEach(item => {
                if (item == "type") {
                    if (el[item] == 1) {
                        count1++
                    } else if (el[item] == 2) {
                        count2++
                    }
                }
                if (item == "email") {
                    let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
                    let val = el[item];
                    let state = reg.test(val)
                    if (!state) {
                        result = { state: state, message: "客户技术联系人邮箱为必填项，请务必按正确格式填写！" }
                    }
                }
                if (item == "mobile") {
                    let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
                    let val = el[item];
                    let state = reg.test(val)
                    if (!state) {
                        result = { state: state, message: "客户技术联系人联系电话为必填项，请务必按正确格式填写！" }
                    }
                }
                if (el[item] == "") {
                    result = { state: false, message: "请将客户技术联系人信息填写完整再进行其它操作" }
                }
            })
        })
        if (result.state && !type) {
            if (!count1 || !count2) {
                result = { state: false, message: "客户技术联系人,职级主管和技术联系人均至少填写一个" }
            }
        }
        return result
    }
    // 姓名框失去焦点
    onBlurName = ({ target }) => {
        let val = target.value;
        if (val == "" || val.length == 0) {
            message.destroy()
            message.warning("姓名为必填项，请务必填写！")
        }
    }
    // 电话框失去焦点
    onBlurTel = ({ target }) => {
        let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
        let val = target.value;
        let result = reg.test(val)
        if (!result) {
            message.destroy()
            message.warning("联系电话为必填项，请务必按正确格式填写！")
        }
    }
    // 邮件框失去焦点
    onBlurEmail = ({ target }) => {
        let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        let val = target.value;
        let result = reg.test(val)
        if (!result) {
            message.destroy()
            message.warning("邮箱为必填项，请务必按正确格式填写！")
        }
    }
    render = _ => {
        let { dataSource, columns, current } = this.state
        return (
            <div className="commTop">
                <div className="navTitle">客户技术联系人</div>
                <Row gutter={24} style={{ textAlign: "right" }}>
                    <Button style={{ marginRight: "10px" }} type="primary" onClick={this.addRow}>新增一行</Button>
                    <Button style={{ marginRight: "10px" }} type="primary" onClick={this.delRow}>删除</Button>
                </Row>
                <Radio.Group onChange={this.onChangeRadio} value={current} style={{ width: "100%" }}>
                    <Table bordered dataSource={dataSource} columns={columns} pagination={false} rowKey={(record, i) => i} />
                </Radio.Group>

            </div>
        )
    }
}
export default Contact