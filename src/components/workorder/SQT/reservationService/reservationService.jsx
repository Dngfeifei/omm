/**
 * 服务计划表--副表-服务区域（项目组成员）
 * @author yyp
*/


import React, { Component } from 'react'
import { Input, Select, Table, Icon, message, Row, Modal, Button, DatePicker } from 'antd'
const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;
import { UserOutlined } from '@ant-design/icons';

import moment from 'moment';

// 引入工程师选择器组件
import Selector from '/components/selector/engineerSelector.jsx'

// 引入页面CSS
// import '@/assets/less/pages/servies.less'

class ReservationService extends Component {
    // 设置默认props
    static defaultProps = {
        // edit: true,  // 状态 是否可编辑
        // area:"",
        // startDate:"",
        // dataSource: [],  //项目组诚成员数据
        // onChange: () => { } //数据变化后 外部接受最新数据的方法
    }
    constructor(props) {
        super(props)
        this.state = {
            defaultTime: "2010-12-24",
            dataSource: [],
            // 表格配置项
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
                    title: '预约上门服务时间',
                    dataIndex: 'serviceTime',
                    key: 'serviceTime',
                    align: 'center',
                    render: (value, row, index) => {
                        return this.props.edit ? <DatePicker value={value ? moment(value, 'YYYY-MM-DD HH:mm:ss') : null} showTime onChange={(value, dateString) => this.onChangeTime(dateString, "serviceTime", index)} onOk={this.onChangeTimeOk} /> : value;
                    },
                },
                {
                    title: '上门服务工程师',
                    dataIndex: 'userName',
                    key: 'userName',
                    align: 'center',
                    render: (value, row, index) => {
                        return this.props.edit ? <div onClick={_ => { props.edit ? this.getUserInfo(index) : "" }}><Input disabled placeholder="" value={value} addonAfter={props.edit ? <UserOutlined /> : ""} /></div> : value;
                    },
                },
                {
                    title: '联系电话 ',
                    dataIndex: 'mobilePhone',
                    align: 'center',
                    render: (value, row, index) => {
                        return this.props.edit ? <Input disabled={!props.edit} name={index} value={value} onChange={(e) => this.onChange(e, "mobilePhone", index)} onBlur={this.onBlurTel}></Input> : value;
                    },
                },
                {
                    title: '备注',
                    dataIndex: 'description',
                    key: 'description',
                    align: 'center',
                    render: (value, row, index) => {
                        return this.props.edit ? <Input disabled={!props.edit} name={index} value={value} onChange={(e) => this.onChange(e, "description", index)}></Input> : value;
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
        let { edit, startDate } = this.props
        if (!dataSource.length) {
            dataSource.push({
                serviceTime: startDate,
                userId: "",
                userName: "",
                mobilePhone: "",
                description: ""
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
    // 获取预约上门服务时间
    onChangeTime = (value, name, i) => {
        let dataSource = this.state.dataSource;
        dataSource[i][name] = value;
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    onChangeTimeOk = (value) => {
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
    // 获取电话和备注
    onChange = ({ target }, name, i) => {
        let val = target.value
        let dataSource = this.state.dataSource;
        dataSource[i][name] = val;
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
    // 新增一行
    addRow = (index) => {
        let checkResult = this.onCheck()
        if (!checkResult.state) {
            message.destroy()
            message.warning(checkResult.message)
            return
        }
        let { dataSource } = this.state
        let newRow = {
            serviceTime: "2010-12-24",
            userId: "",
            userName: "",
            mobilePhone: "",
            description: ""
        }
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
        data.forEach((el) => {
            Object.keys(el).forEach(item => {
                if (item == "mobilePhone") {
                    let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
                    let val = el[item];
                    let state = reg.test(val)
                    if (!state) {
                        result = { state: state, message: "表单预约服务-" + this.props.area + "的联系电话为必填项，请务必按正确格式填写！" }
                    }
                }
                if (item == "description") {
                    return
                }
                if (el[item] == "") {
                    if (item == "serviceTime" || item == "userName") {
                        result = { state: false, message: "请将表单预约服务-" + this.props.area + "的信息填写完整再进行其它操作" }
                    }
                }
            })
        })
        return result
    }

    // 工程师选择器确定方法
    onSelectorOK = (selectedKeys, selectedInfo) => {
        let { id, mobilePhone, realName } = selectedInfo[0];
        let { dataSource, rowKey } = this.state;
        dataSource[rowKey].userId = id;
        dataSource[rowKey].mobilePhone = mobilePhone;
        dataSource[rowKey].userName = realName;
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
                <Table bordered
                    dataSource={dataSource} columns={columns} pagination={false} rowKey={(record, i) => i} />
                {
                    this.state.selector.visible ? <Selector
                        onOk={this.onSelectorOK}
                        onCancel={this.onSelectorCancel} /> : ""
                }
            </div>
        )
    }
}
export default ReservationService