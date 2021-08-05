/***
 *  资料库--介质库管理--全部文件
 * @auth yyp
*/

import React, { Component } from 'react'
import { Modal, Tree, message, Button, Row, Col, Form, Input, Table, Icon, Progress } from 'antd'

// 引入 Tree树形组件
import TreeParant from "@/components/tree/index.jsx"

import { GetCOSFile } from '/api/cloudUpload.js'
import { GetFileCategories, GetFileLibrary, GetFileDownloadPower, GetFileApply, GetFileLike, GetFileCollect } from '/api/mediaLibrary.js'
import { GetDictInfo } from '/api/dictionary'  //数据字典api

import Details from "./details"
import Pagination from '/components/pagination'
const { confirm } = Modal;
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
// 标签集合
let fileLabelData = {}
// 下载队列集合
let downObj = {}
class All extends Component {
    SortTable = () => {
        setTimeout(() => {
            if (this.tableDom3) {
                let h3 = this.tableDom3.clientHeight - 170 < 0 ? 170 : this.tableDom3.clientHeight - 170;
                this.setState({
                    h3: {
                        y: (h3)
                    }
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
        this.GetFileTree()
        // 获取标签字典数据
        this.getDictInfo()
    }
    state = {
        // 表格默认滚动高度
        h3: { y: 240 },
        // 分页配置
        pagination: {
            pageSize: 10,
            current: 1,
            total: 0,
        },
        // 排序字段
        sortValue: "download_num",
        // 请求加锁 防止多次请求
        lock: false,
        //左侧角色树相关数据
        treeData: [],
        // 角色树选中项
        treeSelectInfo: null,
        treeSelectId: "",
        //右侧table表格配置
        columns: [
            {
                title: '类型',
                dataIndex: 'type',
                width: 10,
                align: 'center',
                render: (t) => {
                    return t == 1 ? "文件" : "目录"
                }
            },
            {
                title: '文件名',
                dataIndex: 'fileName',
                align: 'center',
                width: 44,
                render: (t, r) => {
                    if (r.type == 1) {
                        // 文件
                        let style1 = r.isLike ? { margin: "0 3px 0 0", cursor: "pointer", color: "#7777f7" } : { margin: "0 3px 0 0", cursor: "pointer" }
                        let style2 = r.isCollect ? { margin: "0 3px 0 5px", cursor: "pointer", color: "#f56464" } : { margin: "0 3px 0 5px", cursor: "pointer" }
                        return <div>
                            <div><a onClick={_ => { this.showDetails(r) }}>{t}</a></div>
                            <div style={{ color: "#bfb8b8" }}>
                                <Icon type="like" onClick={_ => this.addFileLike(r.id)} theme={r.isLike ? "filled" : "outlined"} style={style1} />{r.likeNum ? r.likeNum : 0}
                                <Icon type="heart" onClick={_ => this.addFileCollect(r.id)} theme={r.isCollect ? "filled" : "outlined"} style={style2} />{r.collectNum ? r.collectNum : 0}
                                <span style={{ color: "#bfb8b8", marginLeft: "10px" }}>{r.downloadNum ? r.downloadNum : 0}次下载</span>
                            </div>
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
                width: 14,
                align: 'center',
                render: (t) => {
                    return <div style={{ textAlign: "left" }}>{t}</div>
                }
            },
            {
                title: '产品线',
                dataIndex: 'productLine',
                width: 16,
                align: 'center',
                render: (t) => {
                    return <div style={{ textAlign: "left" }}>{t}</div>
                }
            },
            {
                title: '标签',
                dataIndex: 'fileLabel',
                width: 13,
                align: 'center',
                render: (t) => {
                    return fileLabelData[t]
                }
            },
            {
                title: '版本',
                width: 15,
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
                title: '资料级别',
                width: 12,
                dataIndex: 'levelName',
                align: 'center',
            },
            {
                title: '操作',
                width: 12,
                dataIndex: 'isDownload',
                align: 'center',
                render: (t, r) => {
                    t.toString()
                    if (t == "1") {
                        return downObj[r.id] ? <Progress type="circle" percent={downObj[r.id].percent} width={40} /> : <a onClick={_ => this.downloadFile(r)} style={{ margin: "0 3px" }}>下载</a>
                    } else if (t == "0") {
                        return <a onClick={_ => this.applyFileDownload(r.id)} style={{ margin: "0 3px" }}>申请下载</a>
                    }
                }

            },

        ],
        //右侧table表格数据
        tableData: [],
        //右侧查询关键字
        searchKey: null,
        //表格选中项
        tableSelecteds: [],
        tableSelectedInfo: [],
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
    GetFileTree = async () => {
        //请求组数据 右侧表格渲染第一列数据
        GetFileCategories()
            .then(res => {
                if (res.success != 1) {
                    message.error(res.message)
                    return
                } else {
                    assignment(res.data)
                    this.setState({
                        treeData: res.data
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
        this.setState({
            treeSelectInfo: data,
            treeSelectId: data.id,
            tableSelecteds: [],
            tableSelectedInfo: [],
        }, () => {
            this.getTableData(0)
        })
    };


    // 获取全部文件列表数据
    getTableData = (obj = 1) => {
        let id = this.state.treeSelectId ? this.state.treeSelectId : ""
        let key = this.state.searchKey
        let order = this.state.sortValue == "file_name" ? {} : { order: "desc" }
        // 选中后请求文件数据
        let params = Object.assign({}, {
            categoriesId: id,
            fileName: key,
            queryType: "all",
            sort: this.state.sortValue,
            ...order
        })
        GetFileLibrary(this.state.pagination.pageSize, obj ? (this.state.pagination.current - 1) * this.state.pagination.pageSize : 0, params).then(res => {
            if (res.success == 1) {
                let pagination = Object.assign({}, this.state.pagination, {
                    pageSize: res.data.size,
                    current: res.data.current,
                    total: res.data.total,
                })
                this.setState({ tableData: res.data.records, pagination: pagination })
            } else {
                message.error(res.message)
            }
        })
    }
    // 点击列表内目录获取列表数据
    getTableData2 = (id) => {
        let order = this.state.sortValue == "file_name" ? {} : { order: "desc" }
        this.setState({
            categoriesId: id
        })
        // 选中后请求文件数据
        let params = Object.assign({}, {
            categoriesId: id,
            queryType: "all",
            sort: this.state.sortValue,
            ...order
        })
        GetFileLibrary(this.state.pagination.pageSize, 0, params).then(res => {
            if (res.success == 1) {
                let pagination = Object.assign({}, this.state.pagination, {
                    pageSize: res.data.size,
                    current: res.data.current,
                    total: res.data.total,
                })
                this.setState({ tableData: res.data.records, pagination: pagination })
            } else {
                message.error(res.message)
            }
        })
    }
    // 列表排序
    getListBySort = (sortValue) => {
        this.setState({
            sortValue
        }, _ => {
            this.getTableData(0)
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


    // 文件下载校验
    downloadFile = (row) => {
        let key = row.id
        GetFileDownloadPower({ fileId: key, downloadType: "all" }).then(res => {
            if (!res.success) {
                message.destroy()
                message.error(res.message)
            } else {
                this.starDownloadFile(row)
            }
        })
    }
    // 文件下载
    starDownloadFile = (row) => {
        let name = row.fileName
        let key = row.id
        // downObj[key] = {
        //     percent: 0,//上传进度
        //     speed: 0,//上传速率
        // }
        // this.setState({ downObj })
        GetCOSFile(name, key, this.getProgress)
    }
    // 申请文件下载
    applyFileDownload = (key) => {
        let params = {
            fileId: key
        }
        GetFileApply(params).then(res => {
            if (res.success != 1) {
                message.destroy()
                message.warning(res.message)
            } else {
                message.success("该文件的下载申请已提交。")
                this.getTableData()
            }
        })
    }
    // 点赞
    addFileLike = (key) => {
        let params = {
            fileId: key
        }
        GetFileLike(params).then(res => {
            if (res.success != 1) {
                message.error(res.message)
            } else {
                this.getTableData()
                this.subpageChange()
            }
        })
    }
    // 收藏
    addFileCollect = (key) => {
        let params = {
            fileId: key
        }
        GetFileCollect(params).then(res => {
            if (res.success != 1) {
                message.error(res.message)
                return
            } else {
                this.getTableData()
                this.subpageChange()
            }
        })
    }
    // 子模块数据发生变化 通知子页面列表数据更新
    subpageChange = _ => {
        this.props.listUpdate()
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
    render = _ => {
        const { h3 } = this.state;
        return <div style={{ height: '100%' }} >
            <Row gutter={24} className="main_height">
                <Col span={5} className="gutter-row" style={{ backgroundColor: 'white', paddingTop: '16px', height: '99.7%', borderRight: '5px solid #f0f2f5' }}>
                    <TreeParant treeData={this.state.treeData} selectedKeys={[this.state.treeSelectInfo ? this.state.treeSelectInfo.id : null]}
                        search={false} edit={false}
                        onSelect={this.onTreeSelect}  //点击树节点触发事件
                    ></TreeParant>
                </Col>
                <Col span={19} className="gutter-row main_height" style={{ padding: '0px 10px 0', backgroundColor: 'white', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}>
                    <Form style={{ width: '100%' }}>
                        <Row>
                            <Col span={12}>
                                <Input allowClear placeholder="请输入关键字" value={this.state.searchKey} onChange={this.getSearchKey} style={{ width: '200px', marginRight: "10px" }} />
                                <Button type="primary" onClick={_ => this.getTableData(0)}>查询</Button>
                            </Col>
                        </Row>
                        <Row style={{ paddingTop: "20px", textAlign: "right", paddingRight: "2px" }}>
                            <div className="icons-list">
                                <span style={{ marginLeft: "20px", cursor: "pointer", color: this.state.sortValue == "download_num" ? "red" : "" }} onClick={_ => this.getListBySort("download_num")}><Icon type="fire" theme="filled" />最热</span>
                                <span style={{ marginLeft: "20px", cursor: "pointer", color: this.state.sortValue == "like_num" ? "red" : "" }} onClick={_ => this.getListBySort("like_num")}><Icon type="like" theme="filled" />点赞</span>
                                <span style={{ marginLeft: "20px", cursor: "pointer", color: this.state.sortValue == "collect_num" ? "red" : "" }} onClick={_ => this.getListBySort("collect_num")}><Icon type="heart" theme="filled" />收藏</span>
                                <span style={{ marginLeft: "20px", cursor: "pointer", color: this.state.sortValue == "file_name" ? "red" : "" }} onClick={_ => this.getListBySort("file_name")}><Icon type="font-colors" />首字母</span>
                                <span style={{ marginLeft: "20px", cursor: "pointer", color: this.state.sortValue == "publish_time" ? "red" : "" }} onClick={_ => this.getListBySort("publish_time")}><Icon type="clock-circle" />更新时间</span>
                            </div>
                        </Row>
                    </Form>
                    <div className="tableParson" style={{ flex: 'auto', height: 10 }} ref={(el) => this.tableDom3 = el}>
                        <Table bordered dataSource={this.state.tableData} columns={this.state.columns} style={{ marginTop: '20px' }} rowKey={(record, index) => `${record.fileName}${index}`} pagination={false} scroll={h3} size="small" />
                        <Pagination current={this.state.pagination.current} pageSize={this.state.pagination.pageSize} total={this.state.pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} size="small" />
                    </div>


                </Col>
            </Row>
            {/* 详情 */}
            {this.state.detailsModalvisible ? <Details onCancel={this.closeDetails} data={this.state.details}></Details> : ""}
        </div>
    }

}
const Alls = Form.create()(All)
export default Alls













