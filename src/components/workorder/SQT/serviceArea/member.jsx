/**
 * 服务计划表--副表-服务区域（项目组成员）
 * @author yyp
*/


import React, { Component } from 'react'
import { Input, Select, Table, Button, Radio, message, Row } from 'antd'
const { Option } = Select;
import { UserOutlined } from '@ant-design/icons';

// 引入工程师选择器组件
import Selector from '/components/selector/engineerSelector.jsx'

// 引入页面CSS
import '@/assets/less/pages/servies.less'

let rowCount = 0;

class Member extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            columns: [
                {
                    title: '服务区域',
                    dataIndex: 'area',
                    key: 'area',
                    width: "15%",
                    align: 'center',
                    render: (value, row, index) => {
                        let content = <div dangerouslySetInnerHTML={{ __html: props.title }} ></div>
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
                    title: '序号',
                    width: "7%",
                    align: 'center',
                    render: (value, row, index) => {
                        return index + 1
                    },
                },
                {
                    title: '项目角色',
                    dataIndex: 'type',
                    key: 'type',
                    width: "15%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <Select width="100%" style={{ width: "100%" }} value={value} onSelect={this.onSelectContactRole}>
                            <Option key={index} value={1}>项目组长</Option>
                            <Option key={index} value={2}>项目组成员</Option>
                        </Select>;
                    },
                },
                {
                    title: '姓名',
                    dataIndex: 'realName',
                    key: 'realName',
                    width: "15%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <div onClick={_ => { this.getUserInfo(index) }}><Input disabled placeholder="" value={value} addonAfter={<UserOutlined />} /></div>
                    },
                },
                {
                    title: '联系电话 ',
                    dataIndex: 'mobilePhone',
                    width: "15%",
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
            // 列表当前选中项
            current: null,
            // 选择器所在索引行
            rowKey: null,
            // 工程师选择器配置
            selector: {
                visible: false,
            }
        }
    }
    // 数据即将挂载
    componentWillMount() {
        let { dataSource } = this.props
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
    // 获取客户技术联系人选中项
    onChangeRadio = ({ target }) => {
        this.setState({
            current: target.value
        }, () => {
            this.updateToparent()
        })
    }
    // 获取项目角色
    onSelectContactRole = (val, { key }) => {
        let dataSource = this.state.dataSource;
        dataSource[key].type = val;
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 获取姓名及其他信息
    getUserInfo = (index) => {
        this.setState({
            rowKey: index,
            selector: {
                visible: true,
            }
        })
    }
    // 获取电话
    onChangeTel = ({ target }) => {
        let key = target.name
        let val = target.value
        let dataSource = this.state.dataSource;
        dataSource[key].mobilePhone = val;
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
            realName: '',
            mobilePhone: '',
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
        let count = 0;
        data.forEach((el) => {
            Object.keys(el).forEach(item => {
                if (item == "type") {
                    if (el[item] == "1") {
                        count++
                    }
                }
                if (item == "email") {
                    let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
                    let val = el[item];
                    let state = reg.test(val)
                    if (!state) {
                        result = { state: state, message: "项目组成员邮箱为必填项，请务必按正确格式填写！" }
                    }
                }
                if (item == "mobilePhone") {
                    let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
                    let val = el[item];
                    let state = reg.test(val)
                    if (!state) {
                        result = { state: state, message: "项目组成员联系电话为必填项，请务必按正确格式填写！" }
                    }
                }
                if (el[item] == "") {
                    result = { state: false, message: "请将项目组成员信息填写完整再进行其它操作" }
                }
            })
        })
        if (result.state && !type) {
            if (!count) {
                result = { state: false, message: "项目组成员，必须存在一个项目组长角色" }
            }
        }
        return result
    }

    // 工程师选择器确定方法
    onSelectorOK = (selectedKeys, selectedInfo) => {
        let { id, email, mobilePhone, realName } = selectedInfo[0];
        let { dataSource, rowKey } = this.state;
        dataSource[rowKey].biUserId = id;
        dataSource[rowKey].email = email;
        dataSource[rowKey].mobilePhone = mobilePhone;
        dataSource[rowKey].realName = realName;
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }

    // 工程师选择器取消方法
    onSelectorCancel = _ => {
        this.setState({
            selector: {
                visible: false,
            }
        })
    }
    render = _ => {
        let { dataSource, columns, current } = this.state
        return (
            <div className="commTop">
                <div className="navTitle">项目组成员</div>
                <Row gutter={24} style={{ textAlign: "right" }}>
                    <Button style={{ marginRight: "10px" }} type="primary" onClick={this.addRow}>新增一行</Button>
                    <Button style={{ marginRight: "10px" }} type="primary" onClick={this.delRow}>删除</Button>
                </Row>
                <Radio.Group onChange={this.onChangeRadio} value={current} style={{ width: "100%" }}>
                    <Table bordered dataSource={dataSource} columns={columns} pagination={false} rowKey={(record, i) => i} />
                </Radio.Group>
                {
                    this.state.selector.visible ? <Selector
                        onOk={this.onSelectorOK}
                        onCancel={this.onSelectorCancel} /> : ""
                }
            </div>
        )
    }
}
export default Member