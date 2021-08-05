/***
 *  资料库--介质库管理--上传文件审核
 * @auth yyp
*/


import React, { Component } from 'react'
const { Provider, Consumer } = React.createContext()//组件之间传值

// 引入日期格式化
import moment from 'moment'

import { Form, message, Button, Row, Col, Input, Table, Select, DatePicker, Spin, Progress, Modal } from 'antd'
const { Option } = Select
const { Item } = Form
const { TextArea } = Input

import { GetCOSFile } from '/api/cloudUpload.js'
import { GetFileLibrary } from '/api/mediaLibrary.js'
import { GetDictInfo } from '/api/dictionary'  //数据字典api
import { FileUpdateExamine, GetFileLevels } from '/api/mediaLibrary'  //介质库api

import Details from "./details"
import Pagination from '/components/pagination'

// 标签字典对象集合
let fileLabelData = {}
let fileLevelsArr = []
let fileLevels = {}
// 可编辑字段标识
let editingKey = ''
// 下载队列集合
let downObj = {}

// 禁选日期方法
function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
}
// 表格可编辑行渲染
class EditableCell extends React.Component {
    renderCell = ({ getFieldDecorator }) => {
        const {
            editing, dataIndex, title, Inputs, DatePickers, record, index, children, form,
            ...restProps
        } = this.props;
        return (
            <td {...restProps} className='my-cell-td'>
                {editing && dataIndex == 'fileLevelId' ?
                    < Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            rules: [{
                                required: true,
                                message: `请选择资料级别!`
                            }],
                            initialValue: record[dataIndex],
                        })(
                            <Select style={{ minWidth: "75px", maxWidth: "120px" }} >
                                {
                                    fileLevelsArr.map((item) => {
                                        return <Option key={item.id} value={item.id}>{item.levelName}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </Item> : ""
                }
                {editing && dataIndex == 'points' ?
                    < Item style={{ margin: 0 }}>
                        {form.getFieldValue("fileLevelId") ? fileLevels[form.getFieldValue("fileLevelId")].points : ""}
                    </Item> : ""
                }
                {editing && dataIndex == 'clearTime' ?
                    < Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            rules: [{ required: true, message: `请选择下架日期!` }],
                            // initialValue: record[dataIndex] ? moment(record[dataIndex], 'YYYY-MM-DD') : record[dataIndex]
                            initialValue: record[dataIndex] ? moment(record[dataIndex], 'YYYY-MM-DD') : record[dataIndex]
                        })(
                            <DatePickers disabledDate={disabledDate} style={{ minWidth: "99px", maxWidth: "120px" }} />
                            // <Inputs />
                        )}
                    </Item> : ""
                }
                {!editing ? children : ""}
            </td>
        );
    };
    render() {
        return <Consumer>{this.renderCell}</Consumer>;
    }
}


class DownloadAudit extends Component {
    SortTable = () => {
        setTimeout(() => {
            let h = this.tableDom.clientHeight - 100;
            this.setState({
                h: {
                    y: (h)
                }
            });
        }, 0)
    }
    componentDidMount() {
        this.SortTable();
        //窗口变动的时候调用
        window.onresize = () => {
            this.SortTable();
        }
    }
    componentWillMount() {
        this.getBaseData()
    }
    state = {
        // 可编辑字段标识
        editingKey: '',
        // 表格默认滚动高度
        h: { y: 240 },
        // 分页配置
        pagination: {
            pageSize: 10,
            current: 1,
            total: 0,
        },
        // 请求加锁 防止多次请求
        lock: false,
        //右侧table表格配置
        columns: [
            {
                title: '类型',
                dataIndex: 'type',
                width: 8,
                align: 'center',
                render: (t) => {
                    return t == 1 ? "文件" : "目录"
                }
            },
            {
                title: '文件名',
                dataIndex: 'fileName',
                width: 32,
                align: 'center',
                editable: false,
                render: (t, r) => {
                    return <a onClick={_ => { this.showDetails(r) }}>{t}</a>
                }
            },
            {
                title: '品牌',
                dataIndex: 'brand',
                width: 13,
                align: 'center',
                render: (t) => {
                    return <div style={{ textAlign: "left" }}>{t}</div>
                }
            },
            {
                title: '产品线',
                dataIndex: 'productLine',
                width: 15,
                align: 'center',
                render: (t) => {
                    return <div style={{ textAlign: "left" }}>{t}</div>
                }
            },
            {

                title: '标签',
                dataIndex: 'fileLabel',
                width: 12,
                align: 'center',
                render: (t) => {
                    return fileLabelData[t]
                }
            },
            {
                title: '版本',
                dataIndex: 'fileVersion',
                width: 20,
                align: 'center',
                editable: false,
            },
            {
                title: '文件大小',
                dataIndex: 'fileSize',
                width: 14,
                align: 'center',
                editable: false,
            },
            {
                title: '上传用户',
                dataIndex: 'uploadUserName',
                width: 14,
                align: 'center',
                editable: false,
            },
            {
                title: <div className="ant-form-item-required">资料级别</div>,
                dataIndex: 'fileLevelId',
                align: 'center',
                width: 15,
                editable: true,
                render: (t, r) => {
                    if (r.uploadStatus == 0) {
                        return <Select style={{ minWidth: "75px", maxWidth: "120px" }} value={t} onChange={(val, opt) => this.getRowInput(val, 'fileLevelId', r.id)}>
                            {
                                fileLevelsArr.map((item) => {
                                    return <Option key={item.id} value={item.id}>{item.levelName}</Option>
                                })
                            }
                        </Select>
                    } else {
                        return t ? fileLevels[t].levelName : ""
                    }
                }
            },
            {
                title: <div className="ant-form-item-required">币值</div>,
                dataIndex: 'points',
                width: 10,
                align: 'center',
                editable: true,
                render: (t, r) => {
                    if (r.uploadStatus == 0) {
                        return r.fileLevelId ? fileLevels[r.fileLevelId].points : ""
                    } else {
                        return t
                    }

                }
            },
            {
                title: <div className="ant-form-item-required">下架日期</div>,
                dataIndex: 'clearTime',
                align: 'center',
                width: 20,
                editable: true,
                render: (t, r) => {
                    if (r.uploadStatus == 0) {
                        return <DatePicker disabledDate={disabledDate} style={{ minWidth: "99px", maxWidth: "120px" }} onChange={(date, dateStr) => this.getRowInput(dateStr, 'clearTime', r.id)} />
                    } else {
                        return t
                    }
                }
            },
            // {
            //     title: '描述',
            //     dataIndex: 'description',
            //     align: 'center',
            //     editable: false,
            // },
            {
                title: '审核状态',
                dataIndex: 'uploadStatus',
                width: 14,
                align: 'center',
                editable: false,
                render: (t, r) => {
                    t.toString()
                    if (t == "0") {
                        return "审核中"
                    } else if (t == "1") {
                        return "审核通过"
                    } else if (t == "2") {
                        return "已驳回"
                    }
                }
            },
            {
                title: '操作',
                align: 'center',
                width: 15,
                editable: false,
                render: (t, r) => {
                    let status = r.uploadStatus
                    let idEdit = (editingKey != r.id) //是否可编辑 若编辑项id与行id不同 则显示编辑按钮 若相同则显示取消编辑按钮
                    let isEditDisplay = (editingKey != "" && editingKey != r.id) //编辑按钮是否可操作  若编辑项id不为空且与行id不同 则编辑按钮显示但不可操作

                    let isSave = (editingKey != "" && editingKey == r.id)    //在编辑状态 且编辑项id与行id相同时 同意按钮正常显示
                    if (status == "0") {
                        return <div>
                            {downObj[r.id] ? <Progress style={{ marginRight: "10px" }} type="circle" percent={downObj[r.id].percent} width={40} /> : <a onClick={_ => this.downloadFile(r)} style={{ margin: "0 3px" }}>下载</a>}
                            <a onClick={_ => this.saveItem(r.id, 1)} style={{ margin: "0 3px" }}>同意</a>
                            <a onClick={_ => this.showReason(r.id)} style={{ margin: "0 3px" }}>驳回</a>
                        </div>
                    } else if (status == "1") {
                        return <div>
                            {downObj[r.id] ? <Progress style={{ marginRight: "10px" }} type="circle" percent={downObj[r.id].percent} width={40} /> : <a onClick={_ => this.downloadFile(r)} style={{ margin: "0 3px" }}>下载</a>}
                            {idEdit ? <a disabled={isEditDisplay} onClick={_ => this.editItem(r.id)} style={{ margin: "0 3px" }}>编辑</a> : ""}
                            {!idEdit ? <a disabled={!isSave} onClick={_ => this.saveItem(r.id, 3)} style={{ margin: "0 3px" }}>保存</a> : ""}
                            {!idEdit ? <a onClick={_ => this.editCancel(r.id)} style={{ margin: "0 3px" }}>取消</a> : ""}
                        </div>

                    } else if (status == "2") {
                        return ""
                    }
                }
            },

        ],
        //右侧table表格数据
        tableData: [],
        //右侧查询关键字
        searchKey: null,
        // 下载队列集合
        downObj: {},
        // 当前要展示的详情数据
        details: {},
        detailsModalvisible: false,
        // 驳回弹窗相关数据
        reasonModal: false,//驳回弹窗显示与否
        reason: "",//驳回原因
        rowId: ""//驳回时行id
    }
    // 获取基础数据
    getBaseData = async () => {
        // 获取标签字典数据
        await GetDictInfo({ dictCode: "fileLabel" }).then(res => {
            if (res.success != 1) {
                message.error(res.message)
            } else {
                res.data.forEach(item => {
                    fileLabelData[item.itemCode] = item.itemValue
                })
                return true
            }
        })
        // 获取介质级别
        await GetFileLevels().then(res => {
            if (res.success != 1) {
                message.error(res.message)
            } else {
                fileLevelsArr = res.data
                res.data.forEach(item => {
                    fileLevels[item.id] = { levelName: item.levelName, points: item.points }
                })
                return true
            }
        })
        this.getTableData()
    }

    // 获取上传审核列表数据
    getTableData = (obj = 1) => {
        // obj  是否是列表上部查询按钮  0 是   1 否  若是则查询参数页码为首页
        let key = this.state.searchKey
        // 2 发起查询请求 查询后结构给table赋值
        // 选中后请求文件数据
        let params = Object.assign({}, {
            fileName: key,
            queryType: "uploadReview"
        })
        GetFileLibrary(this.state.pagination.pageSize, obj ? (this.state.pagination.current - 1) * this.state.pagination.pageSize : 0, params).then(res => {
            if (res.success == 1) {
                let pagination = Object.assign({}, this.state.pagination, {
                    total: res.data.total
                })
                this.setState({ tableData: res.data.records, pagination })
            } else {
                message.error(res.message)
            }
        })
    }

    //获取查询关键字选项
    getSearchKey = (e) => {
        this.setState({
            searchKey: e.target.value
        })
    }
    getRowInput = (val, name, id) => {
        let tableData = this.state.tableData;
        tableData.forEach((item) => {
            item.id == id ? item[name] = val : ""
        })
        this.setState({ tableData })
    }
    // 分页页码变化
    pageIndexChange = (current, pageSize) => {
        let pagination = Object.assign({}, this.state.pagination, { current: current });
        this.setState({
            pagination,
            tableSelecteds: [],
            tableSelectedInfo: []
        }, _ => {
            this.getTableData()
        })
    }

    // 分页条数变化
    pageSizeChange = (current, pageSize) => {
        let pagination = Object.assign({}, this.state.pagination, { pageSize: pageSize });
        this.setState({
            pagination,
            tableSelecteds: [],
            tableSelectedInfo: []
        }, _ => {
            this.getTableData()
        })
    }

    //判断是否可编辑
    isEditing = record => record.id == this.state.editingKey
    //编辑行数据
    editItem = (key) => {
        editingKey = key
        this.setState({
            editingKey: key,
            editType: 1
        })
    }
    //保存行数据
    saveItem = (key, status, reason) => {
        //  status  1 审核通过  2 驳回  3编辑保存
        if (status == 1) {
            let tableData = this.state.tableData;
            let params = { uploadStatus: 1, id: key }
            tableData.forEach((item) => {
                if (item.id == key) {
                    params.fileLevelId = item.fileLevelId
                    params.clearTime = item.clearTime
                }
            })
            if (params.fileLevelId == "" || params.clearTime == "") {
                message.destroy()
                message.warning("请将资料级别和下架日期日期填写后再审核！")
                return
            }
            FileUpdateExamine(params).then(res => {
                if (res.success != 1) {
                    message.error(res.message)
                } else {
                    editingKey = ""
                    this.setState({ editingKey: '' }, _ => {
                        this.getTableData()
                    });
                }
            })
        } else if (status == 3) {
            this.props.form.validateFields((error, row) => {
                if (error) { return }
                var params = JSON.parse(JSON.stringify(row));
                params.clearTime = params.clearTime ? moment(params.clearTime).format("YYYY-MM-DD") : params.clearTime
                params = Object.assign({}, params, { id: key })
                FileUpdateExamine(params).then(res => {
                    if (res.success != 1) {
                        message.error(res.message)
                    } else {
                        editingKey = ""
                        this.setState({ editingKey: '' }, _ => {
                            this.getTableData()
                        });
                    }
                })
            })
        } else if (status == 2) {
            FileUpdateExamine({ id: key, uploadStatus: 2, reason }).then(res => {
                if (res.success != 1) {
                    message.error(res.message)
                } else {
                    editingKey = ""
                    this.setState({ editingKey: '' }, _ => {
                        this.getTableData()
                        this.closeReason()
                    });
                }
            })
        }


    }
    // 驳回申请
    saveItem2 = () => {
        let { rowId, reason } = this.state
        if (reason == "") {
            message.destroy()
            message.warning("请填写驳回原因后再执行驳回操作！")
            return
        }
        // 驳回申请
        this.saveItem(rowId, 2, reason)
    }
    //取消编辑
    editCancel = () => {
        editingKey = ""
        this.setState({
            editingKey: "",
        });
    }
    // 文件下载
    downloadFile = (row) => {
        let name = row.fileName
        let key = row.id
        // downObj[key] = {
        //     percent: 0,//上传进度
        //     speed: 0,//上传速率
        // }
        // this.setState({ downObj })
        GetCOSFile(name, key, this.getProgress)
    }
    // 获取文件下载进度
    getProgress = (key, progressData) => {
        downObj[key] = {
            percent: Number((progressData.percent * 100).toFixed(0)),//上传进度
            speed: Number((progressData.speed / 1024).toFixed(0)),//上传速率
        }
        this.setState({
            downObj
        })
    }
    // 展示详情
    showDetails = (r) => {
        this.setState({
            details: r,
            detailsModalvisible: true
        })
    }
    // 关闭详情
    closeDetails = () => {
        this.setState({
            details: {},
            detailsModalvisible: false
        })
    }
    // 获取驳回原因
    getReason = ({ target }) => {
        this.setState({
            reason: target.value
        })
    }
    // 显示驳回弹窗
    showReason = (id) => {
        this.setState({
            reasonModal: true,
            reason: "",
            rowId: id
        })
    }
    // 关闭驳回弹窗
    closeReason = () => {
        this.setState({
            reasonModal: false,
            reason: "",
            rowId: ""
        })
    }
    render = _ => {
        const { h } = this.state;

        const components = {
            body: {
                cell: EditableCell,
            },
        };
        // 表格列配置
        const columns = this.state.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    DatePickers: DatePicker,
                    Inputs: Input,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    form: this.props.form,
                    editing: this.isEditing(record),
                }),
            };
        });
        const { getFieldDecorator } = this.props.form
        return <div style={{ height: "100%", padding: '20px 10px', }}>
            <div className="main_height" style={{ boxSizing: "border-box", backgroundColor: 'white', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}>
                <Form style={{ width: '100%' }}>
                    <Row>
                        <Col span={12}>
                            <Input allowClear placeholder="请输入关键字" value={this.state.searchKey} onChange={this.getSearchKey} style={{ width: '200px', marginRight: "10px" }} />
                            <Button type="primary" onClick={_ => this.getTableData(0)}>查询</Button>
                        </Col>
                    </Row>
                </Form>
                <div className="tableParson" style={{ flex: 'auto' }} ref={(el) => this.tableDom = el}>
                    <Provider value={this.props.form}>
                        <Table bordered dataSource={this.state.tableData} columns={columns} style={{ marginTop: '20px' }} rowKey={"id"} pagination={false} scroll={h} size="small" components={components} />
                    </Provider>
                    <Pagination current={this.state.pagination.current} pageSize={this.state.pagination.pageSize} total={this.state.pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} size="small" />
                </div>
            </div>
            {/* 详情 */}
            {this.state.detailsModalvisible ? <Details onCancel={this.closeDetails} data={this.state.details} info={[{ name: "上传用户", value: this.state.details.uploadUserName }]}></Details> : ""}
            {/* 驳回弹窗 */}
            <Modal
                title="驳回 "
                visible={this.state.reasonModal}
                onCancel={this.closeReason}
                onOk={this.saveItem2}
                footer={[
                    <Button key="submit" type="primary" onClick={this.saveItem2}>
                        确定
                    </Button>
                ]}
            >
                <div style={{ display: "flex" }}>
                    <span className="ant-form-item-required" style={{ marginRight: "10px" }}>驳回原因</span>
                    <TextArea value={this.state.reason} onChange={this.getReason} style={{ width: '80%' }} />
                </div>
            </Modal>
        </div>
    }

}

const area = Form.create()(DownloadAudit)
export default area













