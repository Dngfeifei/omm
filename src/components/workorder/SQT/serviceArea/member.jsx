/**
 * 服务计划表--副表-服务区域（项目组成员）
 * @author yyp
*/


import React, { Component } from 'react'
import { Input, Select, Table, Icon, message, Row, Modal } from 'antd'
const { Option } = Select;
const { confirm } = Modal;
import { UserOutlined } from '@ant-design/icons';

// 引入工程师选择器组件
import Selector from '/components/selector/engineerSelector.jsx'

// 引入页面CSS
// import '@/assets/less/pages/servies.less'

import { GetDictInfo } from '/api/dictionary'  //数据字典api
let projectMemberRoles = []

class Member extends Component {
    // 设置默认props
    static defaultProps = {
        edit: true,  // 状态 是否可编辑
        dataSource: [],  //项目组诚成员数据
        onChange: () => { } //数据变化后 外部接受最新数据的方法
    }
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            projectMemberRoles: [],
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
                    title: props.edit ? <div className="ant-form-item-required">项目角色</div> : '项目角色',
                    dataIndex: 'type',
                    key: 'type',
                    width: "15%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <Select disabled={!props.edit} width="100%" style={{ width: "100%" }} value={value} onSelect={this.onSelectContactRole}>
                            {
                                projectMemberRoles.map((item) => {
                                    return <Option key={item.itemCode} index={index} value={item.itemCode}>{item.itemValue}</Option>
                                })
                            }
                        </Select>;
                    },
                },
                {
                    title: props.edit ? <div className="ant-form-item-required">姓名</div> : '姓名',
                    dataIndex: 'realName',
                    key: 'realName',
                    width: "15%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <div onClick={_ => { props.edit ? this.getUserInfo(index) : "" }}><Input disabled placeholder="" value={value} addonAfter={props.edit ? <UserOutlined /> : ""} /></div>
                    },
                },
                {
                    title: props.edit ? <div className="ant-form-item-required">联系电话</div> : '联系电话 ',
                    dataIndex: 'mobilePhone',
                    width: "15%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <Input disabled={!props.edit} name={index} value={value} onChange={this.onChangeTel} onBlur={this.onBlurTel}></Input>;
                    },
                },
                {
                    title: props.edit ? <div className="ant-form-item-required">邮箱</div> : '邮箱',
                    dataIndex: 'email',
                    key: 'email',
                    width: "26%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <Input disabled={!props.edit} name={index} value={value} onChange={this.onChangeEmail} onBlur={this.onBlurEmail}></Input>;
                    },
                },
            ],
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
        let dataSource = Array.from(this.props.dataSource)
        let { edit } = this.props
        if (!dataSource.length) {
            dataSource.push({
                type: "",
                realName: '',
                mobilePhone: '',
                email: '',
            })
        }
        this.getDictInfo()
        this.setState({
            dataSource, edit
        }, () => {
            this.updateToparent()
        })
    }
    // 获取项目角色下拉框数据
    getDictInfo = () => {
        GetDictInfo({ dictCode: "projectMemberRole" }).then(res => {
            if (res.success != 1) {
                message.error(res.message)
            } else {
                projectMemberRoles = res.data;
                this.setState({
                    projectMemberRoles
                })
            }
        })
    }
    // 更新数据到父级
    updateToparent = () => {
        let checkResult = this.onCheck()
        this.props.onChange({ dataSource: this.state.dataSource, error: checkResult })
    }
    // 获取项目角色
    onSelectContactRole = (val, { props }) => {
        let dataSource = this.state.dataSource;
        dataSource[props.index].type = val;
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
            realName: '',
            mobilePhone: '',
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
            content: '您确定要删除选中的数据吗？',
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
        // 项目组长数量最少为1 
        let count = 0;
        data.forEach((el) => {
            Object.keys(el).forEach(item => {
                if (item == "type") {
                    if (el[item] == "leader") {
                        count++
                    }
                }
                if (item == "email") {
                    let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
                    let val = el[item];
                    let state = reg.test(val)
                    if (!state) {
                        result = { state: state, message: "表单服务区域-" + this.props.area + "的项目组成员邮箱为必填项，请务必按正确格式填写！" }
                    }
                }
                if (item == "mobilePhone") {
                    let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}|177$/
                    let val = el[item];
                    let state = reg.test(val)
                    if (!state) {
                        result = { state: state, message: "表单服务区域-" + this.props.area + "的项目组成员联系电话为必填项，请务必按正确格式填写！" }
                    }
                }
                if (el[item] == "") {
                    result = { state: false, message: "请将表单服务区域-" + this.props.area + "的项目组成员信息填写完整再进行其它操作" }
                }
            })
        })
        if (result.state && !type) {
            if (!count) {
                result = { state: false, message: "表单服务区域-" + this.props.area + "的项目组成员，必须存在一个项目组长角色" }
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
        let { dataSource, columns } = this.state
        return (
            <div className="commTop">
                <div style={{ display: "flex", alignItems: "stretch" }}>
                    <div style={{ flex: 1, border: "1px solid #e8e8e8", borderRight: "0", textAlign: "center", marginRight: "-1px", position: "relative" }}>
                        <span style={{ fontSize: "15px", position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>项目组成员</span>
                    </div>
                    <Table bordered style={{ flex: 7 }} dataSource={dataSource} columns={columns} pagination={false} rowKey={(record, i) => i} />
                </div>
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