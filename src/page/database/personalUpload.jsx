/***
 *  资料库--介质库管理--个人文件管理 
 * 类型树的增删改 
 * 文件上传功能  
 * 个人上传文件列表
 * 个人下载文件列表
 * @auth yyp
*/


import React, { Component } from 'react'
import { Form, Modal, Icon, message, Button, Row, Col, Input, Table, Tabs, Spin, Progress } from 'antd'
const { confirm } = Modal;
const { TabPane } = Tabs;
// 引入 Tree树形组件
import TreeParant from "@/components/tree/index.jsx"

import { GetCOSFile } from '/api/cloudUpload.js'
import { GetFileCategories, AddTreeNode, EditTreeNode, DelTreeNode, GetFileLibrary, GetFileDownloadPower, DeleteFile, BatchDeleteFile, GetFileApply } from '/api/mediaLibrary.js'
import { GetDictInfo } from '/api/dictionary'  //数据字典api

import Details from "./details"
import Pagination from '/components/pagination'
import DataUpload from './fileUpload'

const assignment = (data) => {
    data.forEach((list, i) => {
        list.key = list.id;
        list.value = list.id;
        if (list.hasOwnProperty("name")) {
            list.title = list.name;
        }
        if (list.hasOwnProperty("children")) {
            if (list.children.length > 0) {
                assignment(list.children)
            }
        } else {
            return
        }
    });
}
// 标签字典数据
let fileLabelData = {}
// 下载队列集合
let downObj = {}
class Personal extends Component {
    SortTable = () => {
        setTimeout(() => {
            if (this.tableDom) {
                let h = this.tableDom.clientHeight - 170 < 0 ? 170 : this.tableDom.clientHeight - 180;
                this.setState({
                    h: {
                        y: (h)
                    },
                });
            }
        }, 0)
    }
    componentDidMount() {
        this.SortTable();
        this.props.onRef(this);
    }
    async componentWillMount() {
        // 查询左侧树
        this.getFileTree()
        // 获取标签字典数据
        this.getDictInfo()
    }
    state = {
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
        //左侧树相关数据
        treeData: [],
        // 树选中项
        treeSelectInfo: null,
        treeSelectId: "",
        //右侧个人上传able表格配置
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
                render: (t, r) => {
                    if (r.type == 1) {
                        // 文件
                        return <div>
                            <div><a onClick={_ => { this.showDetails(r) }}>{t}</a></div>
                            {
                                r.uploadStatus == 1 ? <div style={{ color: "#bfb8b8" }}>
                                    <Icon type="like" theme="outlined" style={{ margin: "0 3px 0 0" }} />{r.likeNum ? r.likeNum : 0}
                                    <Icon type="heart" theme="outlined" style={{ margin: "0 3px 0 5px" }} />{r.collectNum ? r.collectNum : 0}
                                    <span style={{ color: "#bfb8b8", marginLeft: "10px" }}>{r.downloadNum ? r.downloadNum : 0}次下载</span>
                                </div> : ""
                            }

                        </div>
                    } else if (r.type == 2) {
                        // 目录
                        return <div onClick={_ => this.getTableData2(r.categoriesId)}><a>{t}</a></div>

                    }

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
                width: 12,
                dataIndex: 'fileVersion',
                align: 'center',
            },
            {
                title: '文件大小',
                width: 12,
                dataIndex: 'fileSize',
                align: 'center',
            },
            {
                title: '币值',
                width: 9,
                dataIndex: 'points',
                align: 'center',
            },
            {
                title: '上传审核状态',
                dataIndex: 'uploadStatus',
                width: 14,
                align: 'center',
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
                width: 15,
                align: 'center',
                render: (t, r) => {
                    let status = r.uploadStatus
                    if (status == "0" || status == "1") {
                        return downObj[r.id] ? <Progress type="circle" percent={downObj[r.id].percent} width={40} /> : <a onClick={(e) => this.downloadFile(r, e)} style={{ margin: "0 3px" }}>下载</a>
                    } else if (status == "2") {
                        return <a onClick={(e) => this.deleteFile(r.id)} style={{ margin: "0 3px" }}>删除</a>
                    }
                }
            },

        ],

        //tree编辑弹窗配置
        editTreeWindow: {
            visible: false, //弹窗是否显示可见
            modalType: 0, //0新增  1修改
            modalTitle: "新增三级目录",//弹窗title
        },
        //tree编辑弹窗字段-资料类型 
        dataType: "",

        //文件上传弹窗配置
        uploadWindow: {
            visible: false, //弹窗是否显示可见
        },
        //右侧table表格数据
        tableData: [],
        //右侧查询关键字
        searchKey: null,
        //表格选中项
        tableSelecteds: [],
        tableSelectedInfo: [],
        parentDir: [],
        parentDirCode: [],
        // 下载队列集合
        downObj: {},
        // 当前要展示的详情数据
        details: {},
        detailsModalvisible: false
    }
    // 获取数据字典-产品类别数据
    getDictInfo = async () => {
        GetDictInfo({ dictCode: "fileLabel" }).then(res => {
            if (res.success != 1) {
                message.error(res.message)
            } else {
                res.data.forEach(item => {
                    fileLabelData[item.itemCode] = item.itemValue
                })
                this.getTableData()
            }
        })
    }
    //组树数据查询
    getFileTree = async () => {
        //请求组数据 右侧表格渲染第一列数据
        GetFileCategories()
            .then(res => {
                if (res.success != 1) {
                    message.error(res.message)
                } else {
                    assignment(res.data)
                    this.setState({
                        treeData: res.data
                    })
                }
            })
    }
    //新增组
    addTreeNode = () => {
        let select = this.state.treeSelectInfo;
        //1 判断组tree是否有选中 如无选中提示无选中数据无法修改
        if (select == null) {
            message.destroy()
            message.warning('没有选中数据,无法进行修改!');
            return
        }
        if (select.intValue1 == 1) {
            message.destroy()
            message.error("当前目录下不可新增，请选择其他目录！")
            return
        }
        this.setState({
            dataType: "",
            editTreeWindow: {
                visible: true,
                modalType: 0,
                modalTitle: "新增目录"
            },
        })
    }
    //编辑组
    editTreeNode = () => {
        let select = this.state.treeSelectInfo;
        //1 判断组tree是否有选中 如无选中提示无选中数据无法修改
        if (select == null) {
            message.destroy()
            message.warning('没有选中数据,无法进行修改!');
            return
        }
        // 通过选中项的编辑权限判断是否可编辑 若不可编辑直接返回
        if (select.intValue1 == 1 || select.intValue1 == 2) {
            message.destroy()
            message.error("当前目录不可编辑，请选择其他目录！")
            return
        }
        //2 编辑弹窗展示 
        this.setState({
            dataType: select.name,
            editTreeWindow: {
                visible: true,
                modalType: 1,
                modalTitle: "修改目录"
            },
        })
    }
    //删除组
    delTreeNode = () => {
        //1 判断组tree是否有选中 如无选中提示无选中数据无法删除
        let select = this.state.treeSelectInfo;
        if (select == null) {
            message.destroy()
            message.warning('没有选中数据,无法进行删除!');
            return
        }
        // 通过选中项的编辑权限判断是否可删除 若不可删除 直接返回
        if (select.intValue1 == 1 || select.intValue1 == 2) {
            message.destroy()
            message.error("当前目录不可删除，请选择其他目录！")
            return
        }
        // 
        if (this.state.tableData.length) {
            message.destroy()
            message.error("当前目录存在子级，不可删除！")
            return
        }
        let _this = this
        confirm({
            title: '删除',
            content: '确定要删除当前选中的目录吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                DelTreeNode(select.id).then(res => {
                    if (res.success != 1) {
                        message.error(res.message)
                    } else {
                        // 重新查询渲染数据
                        _this.getFileTree()
                        // 选中项已删除,存储的选中项数据置为空
                        _this.setState({
                            treeSelectInfo: null,
                        })
                    }
                })
            }
        })

    }
    // 树选中后
    onTreeSelect = async (selectedKeys, info) => {
        if (!info.selected) {
            this.setState({
                treeSelectInfo: null
            })
            return
        }
        let data = info.selectedNodes[0].props.dataRef
        let parentDir = this.getParentDir(this.state.treeData, data.id)
        let parentDirCode = this.getParentDirCode(this.state.treeData, data.id)
        parentDir.unshift(data.title)
        parentDir.reverse()
        parentDirCode.unshift(data.id)
        parentDirCode.reverse()
   
        this.setState({
            treeSelectInfo: data,
            treeSelectId: data.id,
            parentDir,
            parentDirCode,
            tableSelecteds: [],
            tableSelectedInfo: [],
        }, () => {
            this.getTableData(0)
        })
    };

    //获取弹窗内资源类型字段数据
    getDataType = (e) => {
        this.setState({
            dataType: e.target.value
        })
    }
    //保存新增或修改后的资源类型字段数据
    saveDataType = _ => {
        //1 获取input数据
        let val = this.state.dataType

        //2 校验数据 不能为空 空：提示名称为空不能保存
        if (val == "" || val == null) {
            message.destroy()
            message.warning('资料类型不能为空，请输入后再进行保存操作!');
            return
        }
        if (this.state.lock) {
            return
        } else {
            this.setState({ lock: true })
        }
        //3 判断保存类型是新增还是修改
        if (this.state.editTreeWindow.modalType == 0) {
            //新增 请求新增方法
            let params = {
                parentId: this.state.treeSelectInfo.id,
                categorieName: this.state.dataType,
                dirLevel: this.state.treeSelectInfo.intValue1 + 1,
            };
            AddTreeNode(params).then(res => {
                if (res.success != 1) {
                    message.error(res.message)
                    this.setState({ lock: false })
                } else {
                    // 4 请求完成后关闭弹窗并将输入框赋值为空
                    this.setState({
                        editTreeWindow: {
                            visible: false,
                        },
                        dataType: null,
                        lock: false
                    }, _ => {
                        this.getFileTree()
                    })
                }
            })

        } else if (this.state.editTreeWindow.modalType == 1) {
            //修改 请求修改方法
            let params = {
                id: this.state.treeSelectInfo.id,
                categorieName: this.state.dataType
            };
            EditTreeNode(params).then(res => {
                if (res.success != 1) {
                    message.error(res.message)
                    this.setState({ lock: false })
                } else {
                    let { treeSelectInfo } = this.state
                    treeSelectInfo.name = this.state.dataType
                    treeSelectInfo.title = this.state.dataType
                    // 4 请求完成后关闭弹窗并将输入框赋值为空
                    this.setState({
                        editTreeWindow: {
                            visible: false,
                        },
                        dataType: null,
                        lock: false,
                        treeSelectInfo
                    }, _ => {
                        this.getFileTree()
                    })
                }
            })
        }

    }
    // 上传文件 窗口打开
    openUploadModal = _ => {
        //1 判断组tree是否有选中 如无选中提示无选中数据无法删除
        let select = this.state.treeSelectInfo;
        if (select == null) {
            message.destroy()
            message.warning('没有选中资料类型,无法上传!');
            return
        }
        if (select.intValue1 == 1) {
            message.destroy()
            message.warning('当前目录下不可上传，请选择其他目录');
            return
        }
        this.setState({ uploadWindow: { visible: true } })
    }
    // 获取上传文件列表数据
    getTableData = (obj = 1) => {
        let id = this.state.treeSelectId ? this.state.treeSelectId : ""
        let key = this.state.searchKey
        // 选中后请求文件数据
        let params = Object.assign({}, {
            categoriesId: id,
            fileName: key,
            queryType: "upload"
        })
        GetFileLibrary(this.state.pagination.pageSize, obj ? (this.state.pagination.current - 1) * this.state.pagination.pageSize : 0, params).then(res => {
            if (res.success == 1) {
                let pagination = Object.assign({}, this.state.pagination, {
                    pageSize: res.data.size,
                    current: res.data.current,
                    total: res.data.total
                })
                this.setState({ tableData: res.data.records, pagination: pagination })
            } else {
                message.error(res.message)
            }
        })
    }
    // 点击列表内目录获取列表数据
    getTableData2 = (id) => {
        // 选中后请求文件数据
        let params = Object.assign({}, {
            categoriesId: id,
            queryType: "upload"
        })
        this.setState({
            treeSelectId: id,
            tableSelecteds: [],
            tableSelectedInfo: []
        })
        GetFileLibrary(this.state.pagination.pageSize, 0, params).then(res => {
            if (res.success == 1) {
                let pagination = Object.assign({}, this.state.pagination, {
                    pageSize: res.data.size,
                    current: res.data.current,
                    total: res.data.total
                })
                this.setState({ tableData: res.data.records, pagination: pagination })
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
    // 分页页码变化
    pageIndexChange = (current, pageSize) => {
        let pagination = Object.assign({}, this.state.pagination, { current });
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
        let pagination = Object.assign({}, this.state.pagination, { pageSize });
        this.setState({
            pagination,
            tableSelecteds: [],
            tableSelectedInfo: []
        }, _ => {
            this.getTableData()
        })
    }
    // 表格选中后
    onTableSelect = (selectedRowKeys, info) => {
        //获取table选中项
        this.setState({
            tableSelecteds: selectedRowKeys,
            tableSelectedInfo: info
        })
    };
    // 获取树结构父级节点路径
    getParentDir = (data, val) => {
        for (var i = 0; i < data.length; i++) {
            if (data[i] && data[i].id == val) {
                return [];
            }
            if (data[i] && data[i].children) {
                var far = this.getParentDir(data[i].children, val);
                if (far) {
                    return far.concat(data[i].title);
                }
            }
        }
    }
    // 获取树结构父级节点路径code
    getParentDirCode = (data, val) => {
        for (var i = 0; i < data.length; i++) {
            if (data[i] && data[i].id == val) {
                return [];
            }
            if (data[i] && data[i].children) {
                var far = this.getParentDirCode(data[i].children, val);
                if (far) {
                    return far.concat(data[i].id);
                }
            }
        }
    }
    // 上传文件发布成功
    uploadOk = _ => {
        // 请求多个列表数据
        this.setState({ uploadWindow: { visible: false } })
        this.getTableData()
    }
    // 文件下载
    downloadFile = (row, e) => {
        e.stopPropagation()
        let name = row.fileName
        let key = row.id
        // downObj[key] = {
        //     percent: 0,//上传进度
        //     speed: 0,//上传速率
        // }
        // this.setState({ downObj })
        GetCOSFile(name, key, this.getProgress)
    }
    // 文件前校验下载
    downloadFile2 = (row, e) => {
        let key = row.id
        GetFileDownloadPower({ fileId: key, downloadType: "download" }).then(res => {
            if (!res.success) {
                message.destroy()
                message.error(res.message)
            } else {
                this.starDownloadFile(row, e)
            }
        })
    }
    // 文件下载
    starDownloadFile = (row, e) => {
        e.stopPropagation()
        let name = row.fileName
        let key = row.id
        // downObj2[key] = {
        //     percent: 0,//上传进度
        //     speed: 0,//上传速率
        // }
        // this.setState({ downObj2 })
        GetCOSFile(name, key, this.getProgress2)
    }
    // 获取文件下载进度-个人上传
    getProgress = (key, progressData) => {
        downObj[key] = {
            percent: Number((progressData.percent * 100).toFixed(0)),//上传进度
            speed: Number((progressData.speed / 1024).toFixed(0)),//上传速率
        }
        this.setState({
            downObj
        })
    }

    // 文件删除
    deleteFile = (key) => {
        let _this = this
        confirm({
            title: '删除',
            content: '您确定要删除该文件吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                let params = {
                    id: key
                }
                DeleteFile(params).then(res => {
                    if (res.success != 1) {
                        message.error(res.message)
                    } else {
                        _this.setState({
                            tableSelecteds: [],
                            tableSelectedInfo: [],
                        })
                        _this.getTableData()
                    }
                })
            }
        })
    }
    // 文件批量删除
    batchDeleteFile = () => {
        let params = []
        this.state.tableSelectedInfo.forEach(el => {
            if (el.id) {
                params.push(el.id)
            }
        });
        if (!params.length) {
            message.destroy()
            message.warning("您未选中文件,请选中文件后再进行删除操作！")
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

                BatchDeleteFile({ ids: params.join() }).then(res => {
                    if (res.success != 1) {
                        message.destroy()
                        message.error(res.message)
                    } else {
                        _this.setState({
                            tableSelecteds: [],
                            tableSelectedInfo: [],
                        })
                        _this.getTableData()
                    }
                })
            }
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
    render = _ => {
        const { h, h2 } = this.state;
        return <div style={{ height: '100%' }} >
            <Row gutter={24} className="main_height">
                <Col span={5} className="gutter-row" style={{ backgroundColor: 'white', paddingTop: '16px', height: '99.7%', borderRight: '5px solid #f0f2f5' }}>
                    <TreeParant style={{ display: this.state.tabKey == 2 ? "none" : "" }} treeData={this.state.treeData} selectedKeys={[this.state.treeSelectInfo ? this.state.treeSelectInfo.id : null]}
                        addTree={_ => this.addTreeNode()} editTree={_ => this.editTreeNode()} deletetTree={_ => this.delTreeNode()}
                        onSelect={this.onTreeSelect} search={false} //点击树节点触发事件
                    ></TreeParant>
                </Col>
                <Col span={19} className="gutter-row main_height" style={{ padding: '0px 10px 0', backgroundColor: 'white', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}>
                    <Form style={{ width: '100%', paddingTop: "20px" }}>
                        <Row>
                            <Col span={24}>
                                <Input allowClear placeholder="请输入关键字" value={this.state.searchKey} onChange={this.getSearchKey} style={{ width: '200px', marginRight: "10px" }} />
                                <Button type="primary" onClick={_ => this.getTableData(0)}>查询</Button>
                                <Button type="primary" style={{ margin: '0 8px' }} onClick={this.openUploadModal}>上传</Button>
                                <Button type="primary" onClick={this.batchDeleteFile}>删除</Button>
                            </Col>
                        </Row>
                    </Form>
                    <div className="tableParson" style={{ flex: 'auto', height: 10, paddingTop: "20px" }} ref={(el) => this.tableDom = el}>
                        <Table bordered rowSelection={{ onChange: this.onTableSelect, selectedRowKeys: this.state.tableSelecteds, type: "checkbox", columnWidth: '8px' }} dataSource={this.state.tableData} columns={this.state.columns} rowKey={(record, index) => `${record.fileName}${index}`} pagination={false} scroll={h} size="small" />
                        <Pagination current={this.state.pagination.current} pageSize={this.state.pagination.pageSize} total={this.state.pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} size="small" />
                    </div>
                </Col>
            </Row>
            {/* 树节点 资源类型新增弹窗 */}
            <Modal
                title={this.state.editTreeWindow.modalTitle}
                visible={this.state.editTreeWindow.visible}
                onCancel={_ => this.setState({ editTreeWindow: { visible: false } })}
                onOk={this.saveDataType}
                cancelText="取消"
                okText="保存"
            >
                <div className="ant-form-item-required"> <Input addonBefore="资料类型" value={this.state.dataType} onChange={this.getDataType} style={{ width: '90%' }} />
                </div>
            </Modal>
            {/* 文件上传弹窗 */}
            {
                this.state.uploadWindow.visible ?
                    <DataUpload
                        visible={this.state.uploadWindow.visible}
                        onCancel={_ => this.setState({ uploadWindow: { visible: false } })}
                        onOk={this.uploadOk}
                        data={{ type: this.state.treeSelectInfo, parentDir: this.state.parentDir, parentDirCode: this.state.parentDirCode }}
                    >
                    </DataUpload> : ""
            }
            {/* 详情 */}
            {this.state.detailsModalvisible ? <Details onCancel={this.closeDetails} data={this.state.details}></Details> : ""}

        </div >
    }

}
const Personals = Form.create()(Personal)
export default Personals













