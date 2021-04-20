/**
 * 服务计划表--副表-服务区域（客户技术联系人）
 * @author yyp
*/


import React, { Component } from 'react'
import { Input, Select, Table, Icon, message, Modal } from 'antd'
const { Option } = Select;
const { confirm } = Modal;

// 引入页面CSS
// import '@/assets/less/pages/servies.less'


class Contact extends Component {
    // 设置默认props
    static defaultProps = {
        edit: true,  // 状态 是否可编辑
        dataSource: [],  //客户联系人数据
        onChange: () => { } //数据变化后 外部接受最新数据的方法
    }
    constructor(props) {
        super(props)
        this.state = {
            // 表格数据
            dataSource: [],
            // 表格配置项-可编辑
            columns: [
                {
                    title: '序号',
                    width: "7%",
                    key: "id",
                    align: 'center',
                    render: (value, row, index) => {
                        if (this.props.edit) {
                            return <div style={{ position: "relative" }}>
                                <div style={{ position: "absolute", left: "-36px", top: "-12px", display: "flex", flexDirection: "column" }}>
                                    <div><Icon type="plus-square" theme="twoTone" onClick={() => this.addRow(index)} /></div>
                                    <div><Icon type="minus-circle" theme="twoTone" onClick={() => this.delRow(index)} /></div>
                                </div>
                                <div>{index + 1}</div>
                            </div>
                        } else {
                            return index + 1
                        }
                    },
                },
                {
                    title: '联系人类型',
                    dataIndex: 'type',
                    key: 'type',
                    width: "16%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <Select disabled={!props.edit} bordered={props.edit} style={{ width: "100%" }} value={value} onSelect={this.onSelectContactType}>
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
                        return <Input disabled={!props.edit} name={index} value={value} onChange={this.onChangeName} onBlur={this.onBlurName}></Input>;
                    },
                },
                {
                    title: '联系电话 ',
                    dataIndex: 'mobile',
                    key: 'mobile',
                    width: "20%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <Input disabled={!props.edit} name={index} value={value} onChange={this.onChangeTel} onBlur={this.onBlurTel}></Input>;
                    },
                },
                {
                    title: '邮箱',
                    dataIndex: 'email',
                    key: 'email',
                    width: "26%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <Input disabled={!props.edit} name={index} value={value} onChange={this.onChangeEmail} onBlur={this.onBlurEmail}></Input>;
                    },
                },
            ],
            // 表单状态 是否可编辑
            edit: true
        }
    }
    // 数据即将挂载
    componentWillMount() {
        let dataSource = Array.from(this.props.dataSource)
        let { edit } = this.props
        if (!dataSource.length) {
            dataSource.push({
                type: "",
                name: '',
                mobile: '',
                email: '',
            })
        }
        this.setState({
            dataSource, edit
        }, () => {
            this.updateToparent()
        })
    }


    // 更新数据到父级
    updateToparent = () => {
        let checkResult = this.onCheck()
        this.props.onChange({ dataSource: this.state.dataSource, error: checkResult })
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
    addRow = (index) => {
        if (this.state.dataSource.length) {
            let checkResult = this.onCheck("add")
            if (!checkResult.state) {
                message.destroy()
                message.warning(checkResult.message)
                return
            }
        }
        let newRow = {
            type: "",
            name: '',
            mobile: '',
            email: '',
        }
        let dataSource = this.state.dataSource
        dataSource.splice(index + 1, 0, newRow)
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 删除行
    delRow = (index) => {
        let { dataSource } = this.state;
        if (dataSource.length == 1) {
            message.destroy()
            message.warning("请最少填写一条数据！")
            return
        }
        let _this = this
        confirm({
            title: '删除',
            content: '您确定要删除此条数据吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                dataSource.splice(index, 1)
                _this.setState({
                    dataSource,
                }, () => {
                    _this.updateToparent()
                })
            },
        });
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
                        // 表单宏观风险汇总的研发人员/研发程度不能为空
                        result = { state: state, message: "表单服务区域-" + this.props.area + "的客户技术联系人邮箱为必填项，请务必按正确格式填写！" }
                    }
                }
                if (item == "mobile") {
                    let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
                    let val = el[item];
                    let state = reg.test(val)
                    if (!state) {
                        result = { state: state, message: "表单服务区域-" + this.props.area + "的客户技术联系人联系电话为必填项，请务必按正确格式填写！" }
                    }
                }
                if (el[item] == "") {
                    result = { state: false, message: "请将表单服务区域-" + this.props.area + "的客户技术联系人信息填写完整再进行其它操作" }
                }
            })
        })
        if (result.state && !type) {
            if (!count1 || !count2) {
                result = { state: false, message: "表单服务区域-" + this.props.area + "的客户技术联系人,职级主管和技术联系人均至少填写一个" }
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
        let { dataSource, columns } = this.state
        return (
            <div className="commTop">
                <div style={{ display: "flex", alignItems: "stretch" }}>
                    <div style={{ flex: 1, border: "1px solid #e8e8e8", borderRight: "0", textAlign: "center", marginRight: "-1px", position: "relative" }}>
                        <span style={{ fontSize: "15px", position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>客户技术联系人</span>
                    </div>
                    <Table bordered style={{ flex: 7 }} dataSource={dataSource} columns={columns} pagination={false} rowKey={(record, index) => index} />
                </div>
            </div>
        )
    }
}
export default Contact